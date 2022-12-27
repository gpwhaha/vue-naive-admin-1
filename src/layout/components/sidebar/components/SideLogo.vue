<template>
  <router-link h-24 f-c-c to="/">
    <icon-custom-logo text-16 color-primary></icon-custom-logo>
    <h2 v-show="!appStore.collapsed" ml-6 color-primary text-7 font-bold max-w-140 flex-shrink-0>
      {{ title }}
    </h2>
  </router-link>
</template>

<script setup>
import { useAppStore } from '@/store'
const title = import.meta.env.VITE_TITLE

const appStore = useAppStore()
</script>
