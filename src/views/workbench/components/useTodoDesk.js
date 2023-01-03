import { getMyApproval, getMyPerform } from '../api'
import { h } from 'vue'
import { NButton } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { renderIcon } from '@/utils'

export const useTodoDesk = () => {
  //ref数据
  const collapseValue = ref(false)
  const size = ref('small')
  const toCheckCount = ref(0)
  const toHonrkCount = ref(0)
  const totalCount = ref(0)
  const page = ref(1)
  const activeName = ref('1')
  const rowData = ref({})
  const showPlan = ref(false)
  const loading = ref(false)
  const columns = ref([])
  const tableData = ref([])
  const myApprovalData = ref([])
  const myPerformData = ref([])
  const search = ref({
    pageNo: 1,
    pageSize: 5,
  })

  //计算属性
  const pageCount = computed(() => {
    let count = {
      1: Math.ceil(toCheckCount.value / search.value.pageSize) || 1,
      2: Math.ceil(toHonrkCount.value / search.value.pageSize) || 1,
    }
    return count[activeName.value]
  })

  //方法
  function isOpen(val) {
    collapseValue.value = val.expanded
  }

  function handleUpdateValue(val) {
    activeName.value = val
    initColumns()
    changeTableData()
  }

  async function initTableData() {
    loading.value = true
    const data = await getTableData('1')
    myApprovalData.value = data.item
    toCheckCount.value = data.total
    const res = await getTableData('2')
    myPerformData.value = res.item
    toHonrkCount.value = res.total
    totalCount.value = toCheckCount.value + toHonrkCount.value
    let arr = {
      1: myApprovalData.value,
      2: myPerformData.value,
    }
    tableData.value = arr[activeName.value]
    loading.value = false
  }

  async function changeTableData() {
    let arr = {
      1: myApprovalData.value,
      2: myPerformData.value,
    }
    tableData.value = arr[activeName.value]
  }

  //去处理
  function handelTodo(row) {
    rowData.value = row
    if (activeName.value === '1') {
      // toAudit(row.applyId)
      console.log('审批')
    } else if (activeName.value === '2') {
      showPlan.value = true
    } else {
      console.log('协商')
    }
  }

  async function handelPageChange(page) {
    search.value.pageNo = page
    const data = await getTableData(activeName.value)
    tableData.value = data.item
  }

  async function getTableData(type) {
    try {
      let param = {
        page: search.value.pageNo,
        pageSize: search.value.pageSize,
      }
      let func = {
        1: getMyApproval,
        2: getMyPerform,
      }
      const { code, data, msg } = await func[type](param)
      if (code === 0) {
        return Promise.resolve(data)
      } else {
        $message.error(msg)
      }
      return []
    } catch (error) {
      console.error(error)
      return []
    }
  }

  function initColumns() {
    if (activeName.value === '1') {
      columns.value = [
        {
          title: '合同信息',
          key: 'billNo',
          render(row) {
            return h('div', [
              h('div', { class: 'font-700' }, row.contractTitle),
              h('div', { style: 'color: #4b5563' }, row.billNo),
            ])
          },
        },
        { title: '用户', key: 'userName', ellipsis: { tooltip: true } },
        {
          title: '履约开始时间',
          key: 'author',
          render(row) {
            return h('span', formatDateTime(row['date']))
          },
        },
        {
          title: '创建时间',
          key: 'createDate',
          render(row) {
            return h('span', formatDateTime(row['createDate']))
          },
        },
        {
          title: '操作',
          key: 'actions',
          width: 140,
          align: 'center',
          fixed: 'right',
          render(row) {
            return [
              h(
                NButton,
                {
                  size: 'small',
                  type: 'text',
                  style: 'margin-left: 15px;',
                  onClick: () => handelTodo(row),
                },
                { default: () => '立即处理', icon: renderIcon('ep:checked', { size: 14 }) }
              ),
            ]
          },
        },
      ]
    } else {
      columns.value = [
        {
          title: '合同信息',
          key: 'billNo',
          render(row) {
            return h('div', [
              h('div', { class: 'font-700' }, row.contractTitle),
              h('div', { style: 'color: #4b5563' }, row.billNo),
            ])
          },
        },
        { title: '用户', key: 'userName', ellipsis: { tooltip: true } },
        {
          title: '类型',
          key: 'description',
          render(row) {
            return h('span', row.planType === 0 ? '收款计划' : '付款计划')
          },
        },
        {
          title: '履约开始时间',
          key: 'author',
          render(row) {
            return h('span', formatDateTime(row['date']))
          },
        },
        {
          title: '创建时间',
          key: 'createDate',
          render(row) {
            return h('span', formatDateTime(row['createDate']))
          },
        },
        {
          title: '操作',
          key: 'actions',
          width: 140,
          align: 'center',
          fixed: 'right',
          render(row) {
            return [
              h(
                NButton,
                {
                  size: 'small',
                  type: 'text',
                  style: 'margin-left: 15px;',
                  onClick: () => handelTodo(row),
                },
                { default: () => '立即处理', icon: renderIcon('ep:checked', { size: 14 }) }
              ),
            ]
          },
        },
      ]
    }
  }

  return {
    collapseValue,
    size,
    toCheckCount,
    toHonrkCount,
    totalCount,
    page,
    columns,
    tableData,
    pageCount,
    search,
    isOpen,
    handleUpdateValue,
    initTableData,
    initColumns,
    handelPageChange,
  }
}
