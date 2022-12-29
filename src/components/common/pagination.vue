<template>
  <div w-full flex justify-between>
    <div></div>
    <div mr-20>
      <n-pagination
        v-model:page="page"
        v-model:page-size="pageSizeNo"
        :page-count="pageCount"
        :page-sizes="pageSizes"
        show-quick-jumper
        show-size-picker
        @update:page="handlePageNoChange"
        @update:page-size="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pageNo: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  pageCount: {
    type: Number,
    default: 0,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 40],
  },
  search: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['update:pageNo', 'update:pageSize', 'pageChange', 'sizeChange'])
const page = computed({
  get() {
    return props.pageNo
  },
  set(v) {
    emit('update:pageNo', v)
  },
})
const pageSizeNo = computed({
  get() {
    return props.pageSize
  },
  set(v) {
    emit('update:pageSize', v)
  },
})
function handlePageNoChange(pageNo) {
  emit('pageChange', pageNo)
}
function handleSizeChange(pageSize) {
  emit('sizeChange', pageSize)
}
</script>
