<template>
  <CommonPage title="我的协商">
    <n-tabs mb-2 :default-value="defaultVal" @before-leave="handleBeforeLeave" @update:value="handleUpdateValue">
      <n-tab name="myInvite"> 我的邀请 </n-tab>
      <n-tab name="inviteMe"> 待我协商 </n-tab>
    </n-tabs>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :extra-params="extraParams"
      :scroll-x="1200"
      :columns="columns"
      :get-data="getData"
      :remote="false"
      :is-pagination="false"
      @setPageCount="setPageCount"
    >
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
  <reportDialog
    v-model:visible="reportDialogShow"
    :consult-data="consultData"
    @fetchData="queryConsultationReports"
  ></reportDialog>
</template>

<script setup>
import { NSwitch, NButton, NTag } from 'naive-ui'
import { myInvite, inviteMe, queryConsultationReport, changeShare } from './api'
import { getDate } from '@/utils'
import { contractStatus, CONTRACT_STATUS_DRAFT } from '@/enums/contract.status'
import reportDialog from './components/report-dialog.vue'

const router = useRouter()
const $table = ref(null)
const defaultVal = ref('myInvite')
const getData = ref(null)
const columns = ref([])
const pageCount = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({
  page: 1,
  pageSize: 10,
})
const contractId = ref(null)
const reportDialogShow = ref(false)
const consultData = ref(null)

function handleUpdateValue(value) {
  defaultVal.value = value
}

function statusStyle(val) {
  return { color: contractStatus[val + 1].color }
}

function statusType(val) {
  return contractStatus[val + 1].type
}

function statusFilter(val) {
  return contractStatus[val + 1].label
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

async function queryConsultationReports(page = { pageNo: 1, pageSize: 4 }) {
  let param = {
    begin: (page.pageNo - 1) * page.pageSize,
    pageSize: page.pageSize,
    contractId: contractId.value,
  }
  let { data, code, msg } = await queryConsultationReport(param)
  if (code === 0) {
    consultData.value = data
    return Promise.resolve(true)
  } else {
    $message.error(msg)
    return Promise.reject(false)
  }
}

watch(
  defaultVal,
  async (val) => {
    if (val == 'myInvite') {
      getData.value = myInvite
      columns.value = [
        {
          title: '合同名称',
          key: 'contractTitle',
          width: 100,
          ellipsis: { tooltip: true },
        },
        {
          title: '创建时间',
          key: 'createDate',
          width: 100,
          ellipsis: { tooltip: true },
          render(row) {
            return h('span', row.createDate ? getDate(row.createDate) : '-')
          },
        },
        {
          title: '甲方名称',
          key: 'selfSignatory',
          width: 100,
          ellipsis: { tooltip: true },
        },
        {
          title: '乙方名称',
          key: 'otherSignatory',
          width: 100,
          ellipsis: { tooltip: true },
        },
        {
          title: '合同状态',
          key: 'contractStatus',
          width: 100,
          render(row) {
            // return h('span', { style: statusStyle(row['contractStatus']) }, statusFilter(row['contractStatus']))
            return h(NTag, { type: statusType(row['contractStatus']) }, statusFilter(row['contractStatus']))
          },
        },
        {
          title: '协商状态',
          key: 'status',
          width: 100,
          render(row) {
            return h('span', `${row.visitedInvite}/${row.totalInvite}`)
          },
        },
        {
          title: '分享状态',
          key: 'shareStatus',
          width: 100,
          render(row) {
            return h(NSwitch, {
              uncheckedValue: 0,
              checkedValue: 1,
              value: row['shareStatus'],
              onUpdateValue: async (val) => {
                let param = {
                  contractId: row.contractId,
                  shareStatus: val,
                }
                const { data, code } = await changeShare(param)
                if (code === 0) {
                  $message.success('操作成功')
                  $table.value?.handleSearch()
                } else {
                  $message.error(msg)
                }
              },
            })
          },
        },
        {
          title: '操作',
          key: 'actions',
          width: 200,
          align: 'center',
          fixed: 'right',
          render(row) {
            return [
              h(
                NButton,
                {
                  size: 'small',
                  type: 'primary',
                  // secondary: true,
                  style: 'margin-right:5px',
                  text: true,
                  onClick: () => {
                    if (row.contractStatus == CONTRACT_STATUS_DRAFT) {
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

              row.contractStatus == CONTRACT_STATUS_DRAFT
                ? ''
                : h(
                    NButton,
                    {
                      size: 'small',
                      type: 'primary',
                      // secondary: true,
                      text: true,
                      onClick: async () => {
                        contractId.value = row.contractId
                        const show = await queryConsultationReports()
                        if (show) {
                          reportDialogShow.value = true
                        }
                      },
                    },
                    { default: () => '协商报告' }
                  ),
            ]
          },
        },
      ]
    } else {
      getData.value = inviteMe
      columns.value = [
        {
          title: '合同名称',
          key: 'contractTitle',
          width: 100,
          ellipsis: { tooltip: true },
        },
        {
          title: '创建时间',
          key: 'createDate',
          width: 100,
          ellipsis: { tooltip: true },
          render(row) {
            return h('span', row.createDate ? getDate(row.createDate) : '-')
          },
        },
        {
          title: '合同状态',
          key: 'contractStatus',
          width: 100,
          render(row) {
            // return h('span', { style: statusStyle(row['contractStatus']) }, statusFilter(row['contractStatus']))
            return h(NTag, { type: statusType(row['contractStatus']) }, statusFilter(row['contractStatus']))
          },
        },
        {
          title: '协商状态',
          key: 'status',
          width: 100,
          render(row) {
            return h('span', `${row.visitedInvite}/${row.totalInvite}`)
          },
        },
        {
          title: '操作',
          key: 'actions',
          width: 200,
          align: 'center',
          fixed: 'right',
          render(row) {
            return [
              h(
                NButton,
                {
                  size: 'small',
                  type: 'primary',
                  // secondary: true,
                  text: true,
                  onClick: () => {
                    if (row.contractStatus == CONTRACT_STATUS_DRAFT) {
                      router.push({
                        name: 'editContract',
                        query: {
                          fromType: 2,
                          contractId: row.contractId,
                          menusName: '协商',
                          menusComponentName: 'ConsultWith',
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
    }
    await nextTick()
    $table.value?.handleSearch()
  },
  {
    immediate: true,
  }
)
// onMounted(() => {
//   $table.value?.handleSearch()
// })
</script>

<style scoped>
:deep(.n-pagination) {
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
