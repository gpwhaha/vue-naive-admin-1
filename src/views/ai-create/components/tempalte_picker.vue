<template>
  <crud-modal v-model:visible="show" :title="title" :width="width" show-header :show-footer="showFooter" @open="open">
    <template #header>
      <div text-7>{{ title }}</div>
      <div ml-4>
        <n-input v-model:value="search.templateName" w-120 placeholder="搜索" clearable @input="load">
          <template #prefix>
            <TheIcon icon="ep:search"></TheIcon>
          </template>
        </n-input>
      </div>
    </template>
    <div wh-full flex>
      <div class="left wh-full">
        <div class="menu_btn" :class="{ choose_menu: currentType === 1 }" @click="handleChoose(1)">我的模板</div>
        <div class="menu_btn" :class="{ choose_menu: currentType === 2 }" @click="handleChoose(2)">我的收藏</div>
        <div class="menu_btn" :class="{ choose_menu: currentType === 3 }" @click="handleChoose(3)">最近使用</div>
        <n-divider class="divider" />
        <n-tree
          block-line
          :data="treeData"
          key-field="typeId"
          label-field="typeName"
          children-field="child"
          selectable
          h-200
          class="cus-scroll-y"
          :selected-keys="selectedKeys"
          @update:selected-keys="handelTreeSelect"
        />
      </div>
      <div class="right wh-full">
        <n-spin :show="loading">
          <div v-if="Array.isArray(tableData) && tableData.length > 0" class="list">
            <div v-for="(item, index) in tableData.slice(0, 10)" :key="index" class="item-box">
              <div class="item">
                <div class="ribbon" :style="tagStyle(item)">
                  <span>{{ tagName(item) }}</span>
                </div>
                <div class="img">
                  <img v-if="item.url" w-full h-full :src="item.url" />
                  <img v-else w-full :src="fileLoadFail" />
                </div>
                <div class="monolayer">
                  <div></div>
                  <div class="preview-box" @click="handleDetail(item)">
                    <i class="el-icon-search"></i>
                    <span>预览</span>
                  </div>
                  <div class="bottom-text" @click="handleSuccessTemplate(item)">立即使用</div>
                </div>
              </div>
              <div flex items-center my-2>
                <n-rate
                  v-model:value="item.rate"
                  :count="1"
                  size="small"
                  clearable
                  @update:value="(val) => handleStart(val, item)"
                />
                <n-ellipsis ml-2 style="width: 12rem"> {{ item.templateName }}</n-ellipsis>
              </div>
              <div v-if="item.lastUseDate" flex items-center my-2>
                <div rounded h-2 w-2 bg-gray-500 mx-2></div>
                <n-ellipsis ml-2 style="max-width: 14rem">
                  {{ `${getDateDiff(item.lastUseDate)}有人使用过` }}</n-ellipsis
                >
              </div>
            </div>
          </div>
          <emptyData v-else h-240></emptyData>
          <div flex justify-center>
            <n-pagination
              v-model:page="search.pageNo"
              v-model:page-size="search.pageSize"
              :page-count="pageCount"
              :page-sizes="[10]"
              :on-update:page="handlePageNoChange"
            >
              <template #prev> <TheIcon icon="ep:arrow-left-bold" class="mr-5" :size="18" /> </template>
              <template #next> <TheIcon icon="ep:arrow-right-bold" class="mr-5" :size="18" /> </template>
            </n-pagination>
          </div>
        </n-spin>
      </div>
    </div>
  </crud-modal>
</template>

<script setup>
import {
  getContractType,
  searchMyConvert,
  searchMyCollection,
  queryCategory,
  searchTemplate,
  addCollection,
  removeCollection,
  queryRecentUsedContractSorted,
} from '@/views/template-manage/api'
import api from '@/api/index'
import { getDateDiff } from '@/utils'
const props = defineProps({
  width: {
    type: String,
    default: '120rem',
  },
  title: {
    type: String,
    default: '选择在线模板',
  },
  showFooter: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    required: true,
  },
})
const router = useRouter()
const loading = ref(false)
const chooseTypeId = ref(null)
const currentType = ref(null)
const treeData = ref([])
const tableData = ref([])
const totalCount = ref(0)
const selectedKeys = ref([])
const search = reactive({
  templateName: '',
  templateType: '',
  categoryId: null,
  year: '',
  publishDate: null,
  pageNo: 1,
  pageSize: 10,
})
const emit = defineEmits(['update:visible', 'onSave'])
const show = computed({
  get() {
    return props.visible
  },
  set(v) {
    emit('update:visible', v)
  },
})
const pageCount = computed(() => {
  return Math.ceil(totalCount.value / search.pageSize) || 1
})
function open() {}

function handleChoose(type) {
  search.pageNo = 1
  chooseTypeId.value = null
  currentType.value = type
  selectedKeys.value = []
  if (currentType.value === 1) {
    loadMyTemplates()
  } else if (currentType.value === 2) {
    loadMyCollections()
  } else if (currentType.value === 3) {
    recentUse()
  }
}

function handelTreeSelect(val) {
  search.pageNo = 1
  chooseTypeId.value = val[0]
  selectedKeys.value = val
  currentType.value = null
  load()
}

function handleDetail(row) {
  router.push({
    name: 'previewFile',
    query: {
      contractId: row.contractId,
      fileTitle: row.templateName,
      fileId: row.fileId,
      officeFilePath: row.officeFilePath,
      edit: 1,
    },
  })
}

//使用模板创建
async function handleSuccessTemplate(file) {
  let param = {
    typeId: file.category,
    draftType: 1,
    fileId: file.fileId,
  }
  const { data } = await api.createContract(param)
  const {
    data: { contractInfo, contractDocumentView },
  } = await queryDraftDetail(data.contractId)
  await modifyContractUsedTime(file.templateId)
  router.push({
    name: 'editContract',
    query: {
      fromType: 2,
      contractId: contractInfo.contractId,
      version: data.version,
      officeFileId: contractDocumentView.fileId,
      officeFilePath: contractDocumentView.filePath,
    },
  })
}
/**智能起草*/
async function createContract(param) {
  const { data, code, msg } = await api.createContract(param)
  if (code === 0) {
    return Promise.resolve({ data, code, msg })
  } else {
    $message.error(msg)
    return Promise.reject({ data, code, msg })
  }
}

/**获取合同基本信息*/
async function queryDraftDetail(contractId) {
  const { data, code, msg } = await api.queryDraftDetail(contractId)

  if (code === 0) {
    return Promise.resolve({ data, code, msg })
  } else {
    $message.error(msg)
    return Promise.reject({ data, code, msg })
  }
}

/**更新模板创建时间*/
async function modifyContractUsedTime(templateId) {
  const { data, code, msg } = await api.modifyContractUsedCondition(templateId)
  if (code === 0) {
    return Promise.resolve({ data, code, msg })
  } else {
    $message.error(msg)
    return Promise.reject({ data, code, msg })
  }
}

async function handleStart(val, item) {
  if (val === 1) {
    await addCollect(item.templateId)
  } else {
    await cancelCollect(item.templateId)
  }

  //展示合同
  if (currentType.value === 1) {
    loadMyTemplates()
  } else if (currentType === 2) {
    loadMyCollections()
  } else if (currentType.value === 3) {
    recentUse()
  } else {
    load()
  }
}
async function addCollect(templateId) {
  const { code, msg } = await addCollection({ templateId })
  if (code !== 0) {
    $message.error(msg)
  }
}

async function cancelCollect(templateId) {
  const { code, msg } = await removeCollection({ templateId })
  if (code !== 0) {
    $message.error(msg)
  }
}

//查询模板分类
async function queryTemplateCategory(parentId = '') {
  let arr = []
  const { data, code, msg } = await queryCategory(parentId)
  if (code === 0) {
    arr = data
      .map((i) => {
        return {
          label: i.categoryName,
          value: i.categoryId,
          sort: i.sort,
        }
      })
      .sort((a, b) => {
        return a.sort - b.sort
      })
    childTypeOptions.value = arr
  } else {
    $message.error(msg)
  }
  return Promise.resolve(arr)
}

//查询合同类型 所有
async function getContractTypeNew() {
  const { code, msg, data } = await getContractType()
  if (code === 0) {
    if (Array.isArray(data) && data.length > 0) {
      data
        .sort((a, b) => a.sort - b.sort)
        .forEach((i) => {
          i.child.sort((a, b) => a.sort - b.sort)
        })
      treeData.value = data
    }
  } else {
    $message.error(msg)
  }
}
/**
 * 页码变化
 */
function handlePageNoChange(pageNo) {
  search.pageNo = pageNo
  if (currentType.value === 1) {
    loadMyTemplates()
  } else if (currentType.value === 2) {
    loadMyCollections()
  } else if (currentType.value === 3) {
    recentUse()
  } else {
    load()
  }
}

async function load() {
  try {
    loading.value = true
    let params = {
      page: search.pageNo,
      pageSize: search.pageSize,
      templateName: search.templateName,
      categoryId: search.categoryId || chooseTypeId.value,
      tag: search.tag,
      publishDate: search.publishDate,
    }
    const { code, msg, data } = await searchTemplate(params)
    if (code === 0) {
      for (const i of data.item) {
        i.url = await getFileImg(i.templateId)
        if (i.collection) {
          i.rate = 1
        }
      }
      tableData.value = data.item
      totalCount.value = data.total
    } else {
      $message.error(msg)
    }
  } finally {
    loading.value = false
  }
}

//我的模板
async function loadMyTemplates() {
  try {
    loading.value = true
    let params = {
      page: search.pageNo,
      pageSize: search.pageSize,
      templateName: search.templateName,
      categoryId: search.categoryId || chooseTypeId.value,
      tag: search.tag,
      publishDate: search.publishDate,
    }
    const { code, msg, data } = await searchMyConvert(params)
    if (code === 0) {
      for (const i of data.item) {
        i.url = await getFileImg(i.templateId)
        if (i.collection) {
          i.rate = 1
        }
      }
      tableData.value = data.item
      totalCount.value = data.total
    } else {
      $message.error(msg)
    }
  } finally {
    loading.value = false
  }
}

//我收藏的
async function loadMyCollections() {
  try {
    loading.value = true
    let params = {
      page: search.pageNo,
      pageSize: search.pageSize,
      templateName: search.templateName,
      categoryId: search.categoryId || chooseTypeId.value,
      tag: search.tag,
      publishDate: search.publishDate,
    }
    const { code, msg, data } = await searchMyCollection(params)
    if (code === 0) {
      for (const i of data.item) {
        i.url = await getFileImg(i.templateId)
        if (i.collection) {
          i.rate = 1
        }
      }
      tableData.value = data.item
      totalCount.value = data.total
    } else {
      $message.error(msg)
    }
  } finally {
    loading.value = false
  }
}

async function recentUse() {
  try {
    loading.value = true
    let params = {
      begin: (search.pageNo - 1) * search.pageSize,
      pageSize: search.pageSize,
      templateName: search.templateName,
      categoryId: search.categoryId || chooseTypeId.value,
      tag: search.tag,
      publishDate: search.publishDate,
    }
    const { code, msg, data, count } = await queryRecentUsedContractSorted(params)
    if (code === 0) {
      for (const i of data) {
        i.url = await getFileImg(i.templateId)
        if (i.collection) {
          i.rate = 1
        }
      }
      tableData.value = data
      totalCount.value = count
    } else {
      $message.error(msg)
    }
  } finally {
    loading.value = false
  }
}

async function getFileImg(id) {
  if (!id) return null
  let binaryData = []
  const data = await api.getFileImg(id)
  if (data?.size > 0) {
    binaryData.push(data)
    let url = window.URL.createObjectURL(new Blob(binaryData))
    return Promise.resolve(url)
  }
  return Promise.resolve(null)
}
function tagStyle(item) {
  let color = {
    0: ['#f4d177', '#dbb255', '精选'],
    1: ['#3b8bea', '#0a79fa', '官方'],
    2: ['#4dc34d', '#0d990d', '内部'],
  }
  return {
    backgroundImage: `linear-gradient( ${color[item.tag][0]},  ${color[item.tag][1]})`,
  }
}

function tagName(item) {
  let name = ['精选', '官方', '内部']
  return name[item.tag]
}
onMounted(() => {
  load()
  getContractTypeNew()
})
</script>

<style lang="scss" scoped>
:deep(.divider) {
  margin: 1rem;
}
:deep(.n-tree .n-tree-node) {
  height: 3.2rem;
  align-items: center;
}
.left {
  flex: 1;
  border-right: #efeff5 1px solid;
  padding-right: 1rem;
  margin-right: 1rem;
  .choose_menu {
    background-color: #f0f7ff;
    color: var(--primary-color);
  }

  .menu_btn {
    width: 100%;
    height: 3.2rem;
    line-height: 3.2rem;
    padding-left: 2rem;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      background-color: #f5f7fa;
    }
  }
}
.right {
  flex: 4;
  .list {
    width: 100%;
    height: 60rem;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-column-gap: 2rem;

    .item-box {
      .item {
        width: 100%;
        height: 24rem;
        border: #cacaca 1px solid;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;

        .monolayer {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: -1;
        }

        &:hover {
          .monolayer {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.6);
            z-index: 99;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            .preview-box {
              color: #0a79fa;
              font-size: 1.6rem;
              & span {
                margin-left: 1rem;
              }
            }
            .bottom-text {
              width: 100%;
              height: 5rem;
              line-height: 5rem;
              color: #0a79fa;
              font-size: 1.6rem;
              text-align: center;
              background-color: rgba(40, 120, 255, 0.2);
            }
          }
        }
        .add-icon {
          font-size: 5rem;
          color: #cacaca;
        }
        .ribbon {
          /* 右上角飘带 */
          background-color: #dbb255; /* 左上角飘带的背景颜色 */
          background-image: linear-gradient(#f4d177, #dbb255);
          overflow: hidden;
          white-space: nowrap; /* 文字不换行*/
          position: absolute; /* 绝对定位 */
          right: -40px;
          top: 10px;
          transform: rotate(45deg); /* 旋转45°*/
          z-index: 999;
        }

        .ribbon span {
          //border: 1px solid #54cbff;
          color: #fff;
          display: block;
          font: bold 100% 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 1.5rem;
          margin: 1px 0;
          padding: 2px 50px;
          text-align: center;
          text-shadow: 0 0 5px #aba4a4;
        }

        .img {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .file-name {
        width: 18rem;
        text-align: center;
        margin: 1rem 0;
        font-size: 1.4rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
