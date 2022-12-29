<template>
  <div wh-full h-200 flex items-center justify-center>
    <div wh-full flex flex-col items-center justify-center>
      <n-image preview-disabled :src="emptyImg" />
      <div mt-4 text-5 color-gray-500>{{ text }}</div>
    </div>
  </div>
</template>

<script setup>
import emptyImg from '@/assets/images/noData.png'
defineProps({
  text: {
    type: String,
    default: '暂无数据',
  },
})
</script>
