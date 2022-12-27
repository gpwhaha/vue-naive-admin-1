<template>
  <div class="box" grid mb-2 w-full>
    <n-card v-for="(item, index) in imageList" :key="index" class="card" rounded-2 content-style="padding: 0;">
      <div
        h-45
        rounded-2
        bg-no-repeat
        bg-cover
        box-border
        pt-2
        pl-8
        :style="{ backgroundImage: `url(${item.src})` }"
        class="content"
      >
        <div class="money" font-700 text-14 color-teal-300 :style="{ color: item.color }">
          <n-number-animation :from="0" :to="item.money" />
        </div>
        <div class="name" font-700 text-7>{{ item.name }}</div>
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
  grid-gap: 1rem;
  .card {
    &:hover .money {
      font-size: 3.8rem !important;
    }
    &:hover .name {
      font-size: 2rem !important;
    }
  }

  .content {
    background-position: 0 -2rem;
  }
}
</style>
