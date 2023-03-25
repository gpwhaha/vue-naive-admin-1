<template>
  <QueryBar v-if="$slots.queryBar" mb-5 @search="handleSearch" @reset="handleReset">
    <slot name="queryBar" />
  </QueryBar>

  <n-data-table
    :remote="remote"
    :loading="loading"
    :scroll-x="scrollX"
    :columns="columns"
    :data="tableData"
    :row-key="(row) => row[rowKey]"
    :pagination="isPagination ? pagination : false"
    :style="style"
    :max-height="maxHeight"
    flex-heigh
    @update:checked-row-keys="onChecked"
    @update:page="onPageChange"
  />
</template>

<script setup>
const props = defineProps({
  /**
   * @remote true: 后端分页  false： 前端分页
   */
  remote: {
    type: Boolean,
    default: true,
  },
  /**
   * @remote 是否分页
   */
  isPagination: {
    type: Boolean,
    default: true,
  },
  scrollX: {
    type: Number,
    default: 1200,
  },
  maxHeight: {
    type: Number,
    default: 500,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  style: {
    type: Object,
    default() {
      return {}
    },
  },
  columns: {
    type: Array,
    required: true,
  },
  /** queryBar中的参数 */
  queryItems: {
    type: Object,
    default() {
      return {}
    },
  },
  /** 补充参数（可选） */
  extraParams: {
    type: Object,
    default() {
      return {}
    },
  },
  getData: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['update:queryItems', 'onChecked', 'reset', 'setPageCount', 'setPage'])
const loading = ref(false)
const initQuery = { ...props.queryItems }
const tableData = ref([])
const pagination = reactive({ page: 1, pageSize: 10 })

async function handleQuery() {
  try {
    loading.value = true
    let paginationParams = {}
    // 如果非分页模式或者使用前端分页,则无需传分页参数
    if (props.isPagination && props.remote) {
      paginationParams = { begin: pagination.page, pageSize: pagination.pageSize }
    }
    const { data } = await props.getData({ ...props.queryItems, ...props.extraParams, ...paginationParams })
    emit('setPageCount', data?.total)
    tableData.value = data?.data ? data.data : data.item ? data.item : data
    pagination.itemCount = data.total ?? data.length
  } catch (error) {
    tableData.value = []
    pagination.itemCount = 0
  } finally {
    loading.value = false
  }
}
function handleSearch() {
  emit('setPage')
  pagination.page = 1
  handleQuery()
}
async function handleReset() {
  const queryItems = { ...props.queryItems }
  for (const key in queryItems) {
    queryItems[key] = ''
  }
  emit('update:queryItems', { ...queryItems, ...initQuery })
  emit('reset')
  await nextTick()
  pagination.page = 1
  handleQuery()
}
function onPageChange(currentPage) {
  pagination.page = currentPage
  if (props.remote) {
    handleQuery()
  }
}
function onChecked(rowKeys) {
  if (props.columns.some((item) => item.type === 'selection')) {
    emit('onChecked', rowKeys)
  }
}

defineExpose({
  handleSearch,
  handleReset,
  handleQuery,
})
</script>
