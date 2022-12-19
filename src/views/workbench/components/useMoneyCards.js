import toDayGetMoney from '@/assets/images/todayGetMoney.png'
import monthGetMoney from '@/assets/images/monthGetMoney.png'
import monthListMoney from '@/assets/images/monthListMoney.png'
import yearListMoney from '@/assets/images/yearListMoney.png'
import yearGetMoney from '@/assets/images/yearGetMoney.png'
import yearPayMoney from '@/assets/images/yearPayMoney.png'

import { getMyPlanStatistics } from '../api'

export const useMoneyCards = () => {
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

  async function getworkStatistics() {
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

  onMounted(() => {
    getworkStatistics()
  })

  return {
    imageList,
  }
}
