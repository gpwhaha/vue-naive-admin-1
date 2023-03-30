<template>
  <n-avatar round :size="size" :src="imgUrl" :fallback-src="sealLoadFail" />
</template>

<script setup>
import sealLoadFail from '@/assets/images/seal-load-fail.png'
import Common from '@/constants/common'
import { hex_sha1 } from '@/utils/common/sha'
import ImageType from '@/constants/file'
const props = defineProps({
  userId: {
    type: String,
    required: true,
    default: '',
  },
  avatorId: {
    type: Number,
    default: 0,
  },
  loadFailImg: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 50,
  },
})

const imgUrl = ref(null)

watch(
  [() => props.userId, () => props.avatorId],
  (val) => {
    getUserId()
  },
  { immediate: true }
)

function getUserId() {
  const { userId, avatorId } = props
  let signature = []
  signature.push(props.userId)
  avatorId && signature.push(props.avatorId)
  signature.sort()
  let key = hex_sha1(encodeURIComponent(`${Common.signatureKey};${signature.join(';')}`))
  if (avatorId) {
    imgUrl.value = `${ImageType.avatorUrl}?id=${userId}&timestamp=${avatorId}&key=${key}`
  } else {
    imgUrl.value = `${ImageType.avatorUrl}?id=${userId}&key=${key}`
  }
}
</script>
