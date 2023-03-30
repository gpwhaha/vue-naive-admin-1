<template>
  <div h-auto w-auto mb-4 rounded-2 bg-white box-border py-4 px-4>
    <n-collapse v-model="collapseValue" arrow-placement="right" :on-item-header-click="isOpen">
      <n-collapse-item>
        <template #header>
          <div w-full>
            <div v-if="!collapseValue" flex justify-between items-center h-12>
              <div font-700 text-7>我的待办</div>
              <div w-14>展开</div>
            </div>

            <div v-else flex justify-between items-center h-12>
              <div flex items-center @click.stop>
                <n-tabs type="line" :size="size" animated @update:value="handleUpdateValue">
                  <n-tab-pane name="1" :tab="`待审批合同（${toCheckCount}）`"> </n-tab-pane>
                  <n-tab-pane name="2" :tab="`待履约合同（${toHonrkCount}）`"></n-tab-pane>
                </n-tabs>

                <div ml-2 flex>
                  <div ml-2 w-26>共 {{ totalCount }}条</div>
                  <n-pagination
                    v-model:page="search.pageNo"
                    v-model:page-size="search.pageSize"
                    :page-count="pageCount"
                    :page-sizes="[5]"
                    :on-update:page="handelPageChange"
                  >
                    <template #prev> <TheIcon icon="ep:arrow-left-bold" class="mr-5" :size="18" /> </template>
                    <template #next> <TheIcon icon="ep:arrow-right-bold" class="mr-5" :size="18" /> </template>
                  </n-pagination>
                </div>
              </div>
              <div w-14>关闭</div>
            </div>
          </div>
        </template>
        <div>
          <n-data-table :style="{ height: `40rem` }" flex-height :columns="columns" :data="tableData" />
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>
<script setup>
import { useTodoDesk } from './use-todo-desk'
const {
  collapseValue,
  size,
  page,
  toCheckCount,
  toHonrkCount,
  totalCount,
  columns,
  tableData,
  pageCount,
  search,
  isOpen,
  handleUpdateValue,
  initColumns,
  initTableData,
  handelPageChange,
} = useTodoDesk()
onBeforeMount(() => {
  initColumns()
  initTableData()
})
</script>
<style lang="scss"></style>
