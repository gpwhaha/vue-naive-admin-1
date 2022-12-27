<template>
  <AppPage :show-footer="true">
    <money-cards></money-cards>
    <div flex w-auto my-4>
      <div class="left" flex flex-col mr-6>
        <todoDesk></todoDesk>
        <AiCreate></AiCreate>
      </div>
      <div class="right" flex-1 flex flex-col>
        <AiTools></AiTools>
        <FileHonr></FileHonr>
      </div>
    </div>
    <NumEchart></NumEchart>
  </AppPage>
</template>

<script setup>
import moneyCards from './components/moneyCards.vue'
import todoDesk from './components/todoDesk.vue'
import AiCreate from './components/aiCreate.vue'
import AiTools from './components/aiTools.vue'
import FileHonr from './components/fileHonr.vue'
import NumEchart from './components/echart.vue'
</script>

<style lang="scss">
.left {
  flex: 2;
}
.right {
  flex: 1;
}
</style>
