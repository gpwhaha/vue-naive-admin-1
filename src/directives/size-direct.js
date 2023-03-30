/**
 * * 使用方法 v-size-change="function"
 * * function return {with,height}
 * * v-size-change:content-box='function'
 * * binding.arg 则为传递的参数 content-box
 */

const map = new WeakMap() //不影响内存回收
const ob = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const handler = map.get(entry.target)
    if (handler) {
      const box = entry.borderBoxSize[0]
      handler({
        with: box.inlineSize,
        height: box.blockSize,
      })
    }
  }
})

export default {
  mounted(el, binding) {
    //监听尺寸变化
    ob.observe(el)
    map.set(el, binding.value)
  },
  unmounted(el) {
    //取消监听
    ob.unobserve(el)
  },
}
