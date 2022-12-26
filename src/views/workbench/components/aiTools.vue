<template>
  <div w-auto mb-10 p-10 rounded-6 bg-white>
    <div font-700 text-16>智能工具</div>
    <div text-12 my-5 color-gray-500>多种智能工具提高流程效率，节约时间成本</div>
    <div bg-no-repeat bg-cover h-90 w-auto rounded-12 my-8 :style="{ backgroundImage: `url(${AiCheck})` }">
      <div h-90 flex w-auto items-center justify-between px-26>
        <div>
          <div text-16 font-700 color-white>智能审查</div>
          <div text-12 mt-5 color-white>AI算法辅助风险审查，提供专业建议</div>
        </div>
        <n-button color="#fff"><div color-black>点击审查</div> </n-button>
      </div>
    </div>
    <div bg-no-repeat bg-cover h-90 w-auto rounded-12 my-8 :style="{ backgroundImage: `url(${AiCompare})` }">
      <div h-90 flex w-auto items-center justify-between px-26>
        <div>
          <div text-16 font-700 color-white>文本比对</div>
          <div text-12 mt-5 color-white>原始文档与改动文档可跨格式比对</div>
        </div>
        <n-button color="#fff"><div color-black>点击比对</div> </n-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import AiCheck from '@/assets/images/aiCheck.png'
import AiCompare from '@/assets/images/aiCompare.png'
</script>
<style lang="scss"></style>
