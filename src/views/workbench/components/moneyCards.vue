<template>
  <div class="box" grid mb-5 w-full>
    <n-card v-for="(item, index) in imageList" :key="index" rounded-4 hoverable content-style="padding: 0;">
      <div h-38 rounded-4 bg-no-repeat bg-cover pl-10 :style="{ backgroundImage: `url(${item.src})` }" class="content">
        <div mt-10 font-700 text-12 color-teal-300 hover-text-14 :style="{ color: item.color }">{{ item.money }}</div>
        <div font-700 text-6>{{ item.name }}</div>
      </div>
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

import { getMyPlanStatistics } from '../api'
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

const getworkStatistics = async () => {
  try {
    const { data, code, msg } = await getMyPlanStatistics()
    if (code === 0) {
      const { todayReturned, todayPayed, monthReturned, monthPayed, yearReturned, yearPayed } = data
      imageList.value[0].money = todayReturned || 0
      imageList.value[1].money = todayPayed || 0
      imageList.value[2].money = monthReturned || 0
      imageList.value[3].money = monthPayed || 0
      imageList.value[4].money = yearReturned || 0
      imageList.value[5].money = yearPayed || 0
    } else {
      $message.error(msg)
    }
  } catch (e) {
    $message.error(e)
  }
}
getworkStatistics()
</script>

<style lang="scss" scoped>
.box {
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 2rem;

  .content {
    background-position: 0 -4rem;
  }
}
</style>
