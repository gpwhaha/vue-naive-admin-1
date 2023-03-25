<template>
  <CommonPage title="我创建的">
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :extra-params="extraParams"
      :scroll-x="1200"
      :columns="columns"
      :get-data="getMyContractList"
      :is-pagination="false"
      :remote="false"
      @reset="reset"
      @setPageCount="setPageCount"
      @setPage="setPage"
    >
      <template #queryBar>
        <n-space :size="20">
          <QueryBarItem label="合同名称" :label-width="80">
            <n-input v-model:value="queryItems.title" type="text" placeholder="请输入合同名称" />
          </QueryBarItem>
          <QueryBarItem label="合同状态" :label-width="80">
            <n-select v-model:value="status" :options="contractSelectStatus" />
          </QueryBarItem>
        </n-space>
      </template>
    </CrudTable>
    <n-pagination
      v-model:page="queryItems.page"
      v-model:page-size="queryItems.pageSize"
      :on-update:page="search"
      :on-update:page-size="pageSizeChange"
      :page-count="pageCount"
      :page-sizes="[10, 20, 30, 40]"
      size="medium"
      show-quick-jumper
      show-size-picker
    />
  </CommonPage>
</template>

<script setup>
import { getMyContractList } from './api'
import { NButton, NTag } from 'naive-ui'
import { contractStatus, contractSelectStatus, CONTRACT_STATUS_DRAFT } from '@/enums/contract.status'

const router = useRouter()
const $table = ref(null)
const status = ref('')
const statusList = ref([])
const pageCount = ref(null)

/** QueryBar筛选参数（可选） */
const queryItems = ref({
  title: '',
  statusList,
  dataType: 0,
  page: 1,
  pageSize: 10,
})

watch(
  status,
  (val) => {
    if (val) {
      let res = val.length > 1 ? JSON.parse(val) : val !== '' ? [val] : []
      statusList.value = res
      queryItems.value.statusList = res
    }
  },
  {
    immediate: true,
  }
)

/** 补充参数（可选） */
const extraParams = ref({})

const columns = [
  { title: '合同编号', key: 'billNo', width: 150, ellipsis: { tooltip: true } },
  { title: '合同名称', key: 'contractTitle', width: 320, ellipsis: { tooltip: true } },
  { title: '合同类型', key: 'contractType', width: 100 },
  {
    title: '合同状态',
    key: 'status',
    width: 100,
    render(row) {
      // return h('span', { style: statusStyle(row['status']) }, statusFilter(row['status']))
      return h(NTag, { type: statusType(row['status']) }, statusFilter(row['status']))
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 240,
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            text: true,
            secondary: true,
            onClick: () => {
              if (row.status == CONTRACT_STATUS_DRAFT) {
                router.push({
                  name: 'editContract',
                  query: {
                    readonly: false,
                    contractId: row.contractId,
                    version: row.version,
                    listToEdit: 1,
                  },
                })
              }
            },
          },
          { default: () => '查看' }
        ),
      ]
    },
  },
]

function statusFilter(val) {
  return contractStatus[val + 1].label
}
function reset() {
  status.value = ''
}

function statusStyle(val) {
  return { color: contractStatus[val + 1].color }
}

function statusType(val) {
  return contractStatus[val + 1].type
}

function search(page) {
  queryItems.value.page = page
  $table.value?.handleQuery()
}
function pageSizeChange(pageSize) {
  queryItems.value.pageSize = pageSize
  $table.value?.handleQuery()
}
function setPageCount(num) {
  pageCount.value = Math.ceil(num / queryItems.value.pageSize) || 1
}
function setPage() {
  queryItems.value.page = 1
  queryItems.value.pageSize = 10
}

onMounted(() => {
  $table.value?.handleSearch()
})
</script>

<style scoped>
:deep(.n-pagination) {
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
