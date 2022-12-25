<template>
  <n-icon mr-20 size="18" style="cursor: pointer" @click="handleLinkClick">
    <icon-mdi:github />
  </n-icon>
</template>

<script setup>
function handleLinkClick() {
  window.open('https://github.com/gpwhaha/vue-naive-admin-1')
}
</script>
