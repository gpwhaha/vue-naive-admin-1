<template>
  <n-tabs ref="tabsInstRef" v-model:value="menu" justify-content="space-evenly" size="large">
    <n-tab v-for="tab in menuOptions" :key="tab.name" :name="tab.name" @click="handleMenuSelect(tab)"
      >{{ tab.label }}
    </n-tab>
  </n-tabs>
</template>

<script setup>
import { usePermissionStore, useAppStore } from '@/store'
import { renderCustomIcon, renderIcon, isExternal } from '@/utils'

const router = useRouter()
const curRoute = useRoute()
const permissionStore = usePermissionStore()
const appStore = useAppStore()

const activeKey = computed(() => curRoute.meta?.activeMenu || curRoute.name)

const menuOptions = computed(() => {
  return permissionStore.menus.map((item) => getMenuItem(item)).sort((a, b) => a.order - b.order)
})

const menu = ref(null)
watch(
  curRoute,
  async () => {
    await nextTick()
    menu.value = curRoute.path.split('/')[1]
    let item = menuOptions.value.find((i) => i.name === menu.value)
    if (item) showSideMenu(item)
  },
  { immediate: true }
)

function resolvePath(basePath, path) {
  if (isExternal(path)) return path
  return (
    '/' +
    [basePath, path]
      .filter((path) => !!path && path !== '/')
      .map((path) => path.replace(/(^\/)|(\/$)/g, ''))
      .join('/')
  )
}

function getMenuItem(route, basePath = '') {
  let menuItem = {
    label: (route.meta && route.meta.title) || route.name,
    key: route.name,
    name: route.name,
    path: resolvePath(basePath, route.path),
    icon: getIcon(route.meta),
    order: route.meta?.order || 0,
    showSideBar: (route.meta && route.meta.showSideBar) || false,
  }
  const visibleChildren = route.children ? route.children.filter((item) => item.name && !item.isHidden) : []

  if (!visibleChildren.length) return menuItem

  if (visibleChildren.length === 1) {
    // 单个子路由处理
    const singleRoute = visibleChildren[0]
    menuItem = {
      ...menuItem,
      label: singleRoute.meta?.title || singleRoute.name,
      key: singleRoute.name,
      name: route.name,
      path: resolvePath(menuItem.path, singleRoute.path),
      icon: getIcon(singleRoute.meta),
    }
    const visibleItems = singleRoute.children ? singleRoute.children.filter((item) => item.name && !item.isHidden) : []

    if (visibleItems.length === 1) {
      menuItem = getMenuItem(visibleItems[0], menuItem.path)
    } else if (visibleItems.length > 1) {
      menuItem.children = visibleItems.map((item) => getMenuItem(item, menuItem.path)).sort((a, b) => a.order - b.order)
    }
  } else {
    menuItem.children = visibleChildren
      .map((item) => getMenuItem(item, menuItem.path))
      .sort((a, b) => a.order - b.order)
  }
  return menuItem
}

function getIcon(meta) {
  if (meta?.customIcon) return renderCustomIcon(meta.customIcon, { size: 18 })
  if (meta?.icon) return renderIcon(meta.icon, { size: 18 })
  return null
}

function handleMenuSelect(item) {
  if (isExternal(item.path)) {
    window.open(item.path)
  } else {
    if (item.path === curRoute.path) {
      appStore.reloadPage()
    } else {
      router.push(item.path)
    }
  }
  showSideMenu(item)
}

function showSideMenu(item) {
  permissionStore.setSideBarMenu([], false)
  if (item.showSideBar && item.children && item.children.length) permissionStore.setSideBarMenu(item.children, true)
}
</script>

<style lang="scss"></style>
