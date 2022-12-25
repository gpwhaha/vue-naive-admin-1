<template>
  <div class="box" grid mb-5 w-full>
    <n-card v-for="(item, index) in imageList" :key="index" rounded-10 hoverable content-style="padding: 0;">
      <div
        h-120
        rounded-10
        bg-no-repeat
        bg-cover
        box-border
        pt-10
        pl-18
        :style="{ backgroundImage: `url(${item.src})` }"
        class="content"
      >
        <div font-700 text-26 color-teal-300 hover-text-32 mt-10 :style="{ color: item.color }">{{ item.money }}</div>
        <div font-700 text-16>{{ item.name }}</div>
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
