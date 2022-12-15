<template>
  <div class="box" mb-5>
    <n-card v-for="(item, index) in imageList" :key="index" rounded-4 hoverable content-style="padding: 0;">
      <div class="content" :style="{ backgroundImage: `url(${item.src})` }">{{ item.name }}</div>
    </n-card>
  </div>
</template>

<script setup>
import toDayGetMoney from '@/assets/images/todayGetMoney.png'
import monthGetMoney from '@/assets/images/monthGetMoney.png'
import monthListMoney from '@/assets/images/monthListMoney.png'
import yearListMoney from '@/assets/images/yearListMoney.png'
import yearGetMoney from '@/assets/images/yearGetMoney.png'
import yearPayMoney from '@/assets/images/yearPayMoney.png'
const imageList = ref([
  {
    name: '今日回款',
    src: toDayGetMoney,
    money: 0,
    color: '#60D5CA',
  },
  {
    name: '今日付款',
    src: monthGetMoney,
    money: 0,
    color: '#7A7AF1',
  },
  {
    name: '本月回款',
    src: monthListMoney,
    money: 0,
    color: '#6599FF',
  },
  {
    name: '本月付款',
    src: yearListMoney,
    money: 0,
    color: '#F6B74A',
  },
  {
    name: '本年回款',
    src: yearGetMoney,
    money: 0,
    color: '#B591FF',
  },
  {
    name: '本年付款',
    src: yearPayMoney,
    money: 0,
    color: '#F28484',
  },
])
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 2rem;
  .content {
    width: 100%;
    height: 14rem;
    background-repeat: no-repeat;
    border-radius: 1rem;
  }
}
</style>
