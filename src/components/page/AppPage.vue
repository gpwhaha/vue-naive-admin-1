<template>
  <transition name="fade-slide" mode="out-in" appear>
    <section class="cus-scroll-y wh-full p-4 flex-col bg-[#f5f6fb]">
      <slot />
      <n-back-top :bottom="20" />
      <AppFooter v-if="showFooter" mt-2 />
    </section>
  </transition>
</template>

<script setup>
defineProps({
  showFooter: {
    type: Boolean,
    default: false,
  },
})
</script>
