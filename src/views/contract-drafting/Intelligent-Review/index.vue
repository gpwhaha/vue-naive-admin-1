<template>
  <CommonPage title="智能审查">
    <template #action>
      <n-button type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 上传合同审查
      </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :extra-params="extraParams"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.getSingleReviewList"
    >
    </CrudTable
  ></CommonPage>
</template>

<script setup>
import { useCRUD } from '@/composables'
import api from '../api'
import { NButton } from 'naive-ui'
import { formatDate, formatDateTime, renderIcon } from '@/utils'

defineOptions({ name: 'CrudTable' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/** 补充参数（可选） */
const extraParams = ref({})

const search = ref({
  pageNo: 1,
  pageSize: 10,
})
const columns = [
  { title: '合同名称', key: 'title', width: 150, ellipsis: { tooltip: true } },
  { title: '上传人', key: 'creatorName', width: 80, ellipsis: { tooltip: true } },
  {
    title: '上传时间',
    key: 'createDate',
    width: 80,
    render(row) {
      return h('span', formatDate(row['createDate']))
    },
  },
  {
    title: '审查时间',
    key: 'performEndTime',
    width: 80,
    render(row) {
      return h('span', row['performEndTime'] ? formatDate(row['performEndTime']) : '-')
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
            onClick: () => handleEdit(row),
          },
          { default: () => '加入合同管理', icon: renderIcon('material-symbols:edit-outline', { size: 14 }) }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 15px;',
            secondary: true,
            onClick: () => handleView(row),
          },
          { default: () => '查看', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 15px;',
            onClick: () => handleDelete(row.id),
          },
          { default: () => '删除', icon: renderIcon('material-symbols:delete-outline', { size: 14 }) }
        ),
      ]
    },
  },
]

onMounted(() => {
  $table.value?.handleSearch()
})

const {
  modalVisible,
  modalAction,
  modalTitle,
  modalLoading,
  handleAdd,
  handleDelete,
  handleEdit,
  handleView,
  handleSave,
  modalForm,
  modalFormRef,
} = useCRUD({
  name: '文章',
  initForm: { author: '大脸怪' },
  doCreate: api.addPost,
  doDelete: api.deletePost,
  doUpdate: api.updatePost,
  refresh: () => $table.value?.handleSearch(),
})
</script>

<style scoped></style>
