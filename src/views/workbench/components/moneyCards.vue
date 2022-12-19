<template>
  <div class="box" grid mb-5 w-full>
    <n-card v-for="(item, index) in imageList" :key="index" rounded-4 hoverable content-style="padding: 0;">
      <div
        h-45
        rounded-4
        bg-no-repeat
        bg-cover
        box-border
        pt-6
        pl-8
        :style="{ backgroundImage: `url(${item.src})` }"
        class="content"
      >
        <div font-700 text-12 color-teal-300 hover-text-14 :style="{ color: item.color }">{{ item.money }}</div>
        <div font-700 text-7>{{ item.name }}</div>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { useMoneyCards } from './useMoneyCards'
const { imageList } = useMoneyCards()
</script>

<style lang="scss" scoped>
.box {
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 2rem;

  .content {
    background-position: 0 -2rem;
  }
}
</style>
