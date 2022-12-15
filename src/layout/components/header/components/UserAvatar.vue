<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div flex items-center cursor-pointer>
      <img :src="userStore.avatar" mr10 w-14 h-14 rounded-full />
      <span text-6>{{ userStore.name }}</span>
    </div>
  </n-dropdown>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user'
import { renderIcon } from '@/utils/icon'

const userStore = useUserStore()

const options = [
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon('mdi:exit-to-app', { size: '14px' }),
  },
]

function handleSelect(key) {
  if (key === 'logout') {
    $dialog.confirm({
      title: '提示',
      type: 'info',
      content: '确认退出？',
      confirm() {
        userStore.logout()
        $message.success('已退出登录')
      },
    })
  }
}
</script>
