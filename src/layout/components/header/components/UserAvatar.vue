<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div flex items-center cursor-pointer>
      <img :src="userAvatarUrl" mr6 w-16 h-16 rounded-full />
      <span text-6>{{ userStore.name }}</span>
    </div>
  </n-dropdown>
</template>

<script setup>
import { useUserStore } from '@/store'
import { renderIcon } from '@/utils'
import { hex_sha1 } from '@/utils/common/sha'
const userStore = useUserStore()
const userAvatarUrl = computed(() => {
  const { userId } = userStore
  const signatureKey = 'd2a4a4db-5df5-4966-qjyz-9941-2d0a4b7385c3' //文件上传固定串
  const avatorUrl = `${import.meta.env.VITE_BASE_API}web/showPhotoWithSig`
  let signature = [userId].sort()
  let key = hex_sha1(encodeURIComponent(`${signatureKey};${signature.join(';')}`))
  return `${avatorUrl}?id=${userId}&key=${key}`
})
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
