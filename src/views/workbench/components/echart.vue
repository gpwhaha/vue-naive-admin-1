<template>
  <div flex-1 box-border w-full p-4 rounded-2 bg-white>
    <div flex w-full justify-between>
      <div font-700 text-7>合同签订数量</div>
      <div flex>
        <div>
          <n-tabs v-model:value="activeTab" type="bar" size="small" @update:value="handleChangeTab">
            <n-tab-pane name="first" tab="今日"> </n-tab-pane>
            <n-tab-pane name="second" tab="本周"> </n-tab-pane>
            <n-tab-pane name="third" tab="本月"> </n-tab-pane>
            <n-tab-pane name="fourth" tab="本年"> </n-tab-pane>
          </n-tabs>
        </div>

        <div ml-8>
          <n-date-picker
            v-model:formatted-value="timeRange"
            type="daterange"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
            @update:formatted-value="chooseDateRange"
          />
        </div>
      </div>
    </div>
    <div ref="mapRef" wi-full h-100></div>
  </div>
</template>

<script setup>
// import * as echarts from 'echarts'
import { contractTodaySign, contractWeekSign, contractMonthSign, contractYearSign, contractDateRangeSign } from '../api'
const activeTab = ref('fourth')
const timeRange = ref(null)
const useMap = ref(null)
const mapRef = ref(null)
const useMapData = ref([])
const func = reactive({
  first: contractTodaySign,
  second: contractWeekSign,
  third: contractMonthSign,
  fourth: contractYearSign,
})

const { proxy } = getCurrentInstance()
console.log(proxy.$echarts)

function handleChangeTab() {
  load()
}

async function chooseDateRange(date) {
  timeRange.value = date
  if (date) {
    let param = {
      beginDate: date[0],
      endDate: date[1],
    }
    const { data, msg, code } = await contractDateRangeSign(param)
    if (code === 0) {
      useMapData.value = data || []
      let option = {}
      if (!data || data.length === 0) {
        option = {
          title: {
            text: '暂无数据',
            textStyle: {
              color: '#999999',
              fontSize: 16,
            },
            left: '50%',
            top: '50%',
          },
          xAxis: [
            {
              data: [],
              show: false, //是否显示坐标轴中的x轴
            },
          ],
          series: [
            {
              data: [],
              show: false, //是否显示坐标轴中的x轴
            },
          ],
        }
      } else {
        option = {
          title: {
            text: '合同份数（份）',
            textStyle: {
              color: '#999999',
              fontSize: 14,
            },
            left: '1%',
            top: '1%',
          },
          xAxis: {
            data: data.map((i) => i.time),
            show: true,
          },
          series: [
            {
              show: true,
              data: data.map((i) => i.count),
              type: data.length === 1 ? 'bar' : 'line',
              barWidth: 20,
              emphasis:
                data.length !== 1
                  ? {
                      // 鼠标移上去的时候，拐点的颜色和样式
                      itemStyle: {
                        color: '#ffa60d', //颜色
                        borderColor: '#ffc664', //图形的描边颜色
                        borderWidth: 4, // 描边的线宽
                        shadowBlur: 50, // 图形的阴影大小
                        shadowColor: '#ffe6bb', // 图形的阴影颜色
                      },
                    }
                  : {},
            },
          ],
        }
      }
      useMap.value.setOption(option)
    } else {
      $message.error(msg)
    }
  } else {
    load()
  }
}

async function load() {
  const { code, msg, data } = await func[activeTab.value]()
  if (code === 0) {
    useMapData.value = data || []
    let suffix = {
      first: ': 00',
      second: '号',
      third: '号',
      fourth: '月',
    }
    let option = {}
    if (!data || data.length === 0) {
      option = {
        title: {
          text: '暂无数据',
          textStyle: {
            color: '#999999',
            fontSize: 16,
          },
          left: '50%',
          top: '50%',
        },
        xAxis: {
          data: [],
          show: false,
        },
        yAxis: {
          type: 'value',
          show: false,
          minInterval: 1, // 只显示整数
        },
        series: [
          {
            data: [],
          },
        ],
      }
    } else {
      option = {
        title: {
          text: '合同份数（份）',
          textStyle: {
            color: '#999999',
            fontSize: 14,
          },
          left: '1%',
          top: '1%',
        },
        xAxis: {
          data: data.map((i) => `${i.time} ${suffix[activeTab.value]}`),
          show: true,
        },
        yAxis: {
          type: 'value',
          minInterval: 1, // 只显示整数
          show: true,
        },
        series: [
          {
            data: data.map((i) => i.count),
            type: data.length === 1 ? 'bar' : 'line',
            barWidth: 20,
            emphasis:
              data.length !== 1
                ? {
                    // 鼠标移上去的时候，拐点的颜色和样式
                    itemStyle: {
                      color: '#ffa60d', //颜色
                      borderColor: '#ffc664', //图形的描边颜色
                      borderWidth: 4, // 描边的线宽
                      shadowBlur: 50, // 图形的阴影大小
                      shadowColor: '#ffe6bb', // 图形的阴影颜色
                    },
                  }
                : {},
          },
        ],
      }
    }
    useMap.value.setOption(option)
  } else {
    $message.error(msg)
  }
}

async function init() {
  useMap.value = markRaw(proxy.$echarts.init(mapRef.value))
  let option = {
    color: ['#7085d4'],
    title: {
      text: '合同份数（份）',
      textStyle: {
        color: '#999999',
        fontSize: 14,
      },
    },
    grid: {
      left: '1%',
      right: '0%',
      bottom: '1%',
      top: '12%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: '合同数量: {c0} 份',
      backgroundColor: 'rgba(0,0,0,0)', // 提示框浮层的背景颜色
      borderColor: '#FFC664',
      borderWidth: 1,
      padding: 15, // 提示框浮层内边距，单位px
      position: 'left',
      textStyle: {
        color: '#000', // 文字的颜色
        fontStyle: 'normal', // 文字字体的风格（'normal'，无样式；'italic'，斜体；'oblique'，倾斜字体）
        fontWeight: 'normal', // 文字字体的粗细（'normal'，无样式；'bold'，加粗；'bolder'，加粗的基础上再加粗；'lighter'，变细；数字定义粗细也可以，取值范围100至700）
      },
    },
    xAxis: {
      type: 'category',
      data: [],
      // 设置折线上圆点大小
      symbolSize: 10,
      // 设置拐点为实心圆
      symbol: 'circle',
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        data: [],
        type: 'line',
        emphasis: {
          // 鼠标移上去的时候，拐点的颜色和样式
          itemStyle: {
            color: '#fff', //颜色
            borderColor: '#0072FF', //图形的描边颜色
            borderWidth: 2, // 描边的线宽
            shadowBlur: 5, // 图形的阴影大小
            shadowColor: '#F70938', // 图形的阴影颜色
          },
        },
      },
    ],
  }
  option && useMap.value.setOption(option)
  useMap.value.resize()
  //图表自适应窗口大小
  window.onresize = useMap.value.resize
}
onMounted(() => {
  init()
  load()
})
onBeforeUnmount(() => {
  proxy.$echarts.dispose(useMap.value)
  window.onresize = null
})
</script>

<style lang="scss"></style>
