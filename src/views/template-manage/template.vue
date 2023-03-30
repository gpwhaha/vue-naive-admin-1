<template>
  <CommonPage title="合同模板"
    ><template #action>
      <div flex w-200>
        <n-input-group>
          <n-input v-model:value="search.templateName" clearable placeholder="检索合同名称" />
          <n-button type="primary" @click="handleSearch"> 搜索 </n-button>
        </n-input-group>
        <n-button type="primary" ghost ml-4 @click="handleReset"> 重置 </n-button>
      </div>
      <n-button type="primary" @click="uploadTemplate">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 上传模板
      </n-button>
    </template>
    <div flex>
      <div class="my_btn" :class="{ my_btn_active: currentType === 1 }" @click="handleChoose(1)">我的模板</div>
      <div class="my_btn" :class="{ my_btn_active: currentType === 2 }" @click="handleChoose(2)">我的收藏</div>
    </div>
    <n-divider class="divider" />
    <div flex>
      <div text-6 font-700 w-40>合同类型：</div>
      <n-collapse arrow-placement="right">
        <n-collapse-item title="青铜" name="1">
          <template #header>
            <div class="cus-scroll-x" w-full flex items-center mr-30 @click.stop>
              <div
                v-for="type in templateTypeList.slice(0, 10)"
                :key="type.typeId"
                class="menu_item"
                :class="{ active: chooseTypeId === type.typeId }"
                type="primary"
                @click="chooseType(type)"
              >
                {{ type.typeName }}
              </div>
            </div>
          </template>
          <div w-full flex>
            <div
              v-for="type in templateTypeList.slice(10)"
              :key="type.typeId"
              class="menu_item"
              :class="{ active: chooseTypeId === type.typeId }"
              type="primary"
              @click="chooseType(type)"
            >
              {{ type.typeName }}
            </div>
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>
    <n-divider class="divider" />
    <div flex>
      <n-select
        v-model:value="search.categoryId"
        w-80
        clearable
        placeholder="合同子类"
        :options="childTypeOptions"
        @update:value="searchChild"
      />
      <n-select
        v-model:value="search.tag"
        w-80
        ml-4
        clearable
        placeholder="合同标签"
        :options="templateTypeOptions"
        @update:value="load"
      />
      <n-date-picker
        v-model:formatted-value="search.publishDate"
        w-80
        ml-4
        clearable
        value-format="yyyy-MM-dd"
        type="date"
        @update:formatted-value="chooseDateRange"
      />
    </div>
    <n-spin :show="loading">
      <div v-if="tableData.length > 0" class="list">
        <div v-for="(item, index) in tableData" :key="index" class="item-box">
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
              <div>
                <div class="preview-box" @click="handleDetail(item)">
                  <i class="el-icon-search"></i>
                  <span>预览</span>
                </div>
                <div v-if="hasPermission(item) || currentType === 1" class="preview-box my-2" @click="handleEdit(item)">
                  <i class="el-icon-edit"></i>
                  <span>编辑</span>
                </div>
                <div
                  v-if="hasPermission(item) || currentType === 1"
                  class="preview-box"
                  style="color: red"
                  @click="handleDelete(item)"
                >
                  <i class="el-icon-delete"></i>
                  <span>删除</span>
                </div>
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
            <n-ellipsis ml-2 style="width: 16rem"> {{ item.templateName }}</n-ellipsis>
          </div>
          <div v-if="item.lastUseDate" flex items-center my-2>
            <div rounded h-2 w-2 bg-gray-500 mx-2></div>
            <n-ellipsis ml-2 style="max-width: 18rem"> {{ `${getDateDiff(item.lastUseDate)}有人使用过` }}</n-ellipsis>
          </div>
        </div>
      </div>
      <emptyData v-else></emptyData>
      <pagination
        :page-no="search.pageNo"
        :page-size="search.pageSize"
        :page-count="pageCount"
        :page-sizes="[12, 24, 36, 48]"
        @page-change="handlePageNoChange"
        @size-change="handleSizeChange"
      >
      </pagination>
    </n-spin>
  </CommonPage>
  <uploadDrawer
    v-model:show="showUpload"
    :template-type-options="templateTypeOptions"
    :template-type-list="templateTypeList"
    :template-detail="templateDetail"
    @success-save="load"
  ></uploadDrawer>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user'
import fileLoadFail from '@/assets/images/seal-load-fail.png'
import { getDateDiff } from '@/utils'
import api from '@/api/index'
import {
  searchMyConvert,
  queryCategory,
  addCollection,
  removeCollection,
  searchTemplate,
  searchMyCollection,
  getContractType,
  deleteTpl,
} from './api'
import uploadDrawer from './components/upload-file-drawer.vue'
const router = useRouter()
const search = reactive({
  templateName: '',
  templateType: '',
  categoryId: null,
  year: '',
  publishDate: null,
  pageNo: 1,
  pageSize: 12,
})
const templateTypeOptions = ref([
  {
    label: '精选',
    value: 0,
  },
  {
    label: '官方',
    value: 1,
  },
  {
    label: '企业内部模板',
    value: 2,
  },
])
const userStore = useUserStore()
const loading = ref(false)
const showUpload = ref(false)
const chooseTypeId = ref(null)
const currentType = ref(null)
const childTypeOptions = ref([])
const cacheChildTypeOptions = ref([])
const templateTypeList = ref([])
const templateOption = ref([])
const tableData = ref([])
const totalCount = ref(0)
let templateDetail = ref({})
const pageCount = computed(() => {
  return Math.ceil(totalCount.value / search.pageSize) || 1
})

function uploadTemplate() {
  templateDetail.value = {}
  showUpload.value = true
}

function handleChoose(type) {
  chooseTypeId.value = null
  currentType.value = type
  if (currentType.value === 1) {
    loadMyTemplates()
  } else if (currentType.value === 2) {
    loadMyCollections()
  }
}

function chooseType(type) {
  currentType.value = ''
  chooseTypeId.value = type.typeId
  search.categoryId = null
  search.pageNo = 1
  queryTemplateCategory(type.typeId)
  load()
}

function chooseDateRange(date) {
  search.publishDate = date
  load()
}

function searchChild() {
  search.pageNo = 1
  load()
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

// 编辑模板
function handleEdit(row) {
  const fileArr = row.officeFilePath && row.officeFilePath.split('/')
  const fileType = fileArr[fileArr.length - 1].split('.').pop()
  const fileName = `${row.templateName}.${fileType}`
  templateDetail.value = {
    templateCate: row.category,
    contractTag: row.tag,
    year: row.year.toString(),
    file: row.fileId,
    templateId: row.templateId,
    fileName,
  }
  showUpload.value = true
}
// 删除合同模板
function handleDelete(row) {
  $dialog.confirm({
    content: '确定删除此合同模板吗？',
    async confirm() {
      try {
        const { code, msg } = await deleteTpl({ templateId: row.templateId })
        if (code === 0) {
          $message.success('删除成功')
        } else {
          $message.error(msg)
        }
        load()
      } catch (e) {
        console.error(e)
      }
    },
    cancel() {
      $message.warning('已取消')
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
      return Promise.resolve(data)
    }
  } else {
    $message.error(msg)
    return Promise.reject(msg)
  }
  return Promise.resolve([])
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

//重置
function handleReset() {
  search.templateName = null
  search.templateType = null
  search.categoryId = null
  search.year = null
  search.tag = null
  search.publishDate = null
  search.pageNo = 1
  search.pageSize = 12
  currentType.value = ''
  chooseTypeId.value = ''
  childTypeOptions.value = cacheChildTypeOptions.value
  load()
}
/**
 * 搜索
 */
function handleSearch() {
  search.pageNo = 1
  load()
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
  } else {
    load()
  }
}

function handleSizeChange(val) {
  search.pageNo = 1
  search.pageSize = val
  if (currentType.value === 1) {
    loadMyTemplates()
  } else if (currentType.value === 2) {
    loadMyCollections()
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

function hasPermission(i) {
  const { userId, userName } = userStore
  if (userName === 'admin' || userId === i.creator) {
    return true
  }
  return false
}

onMounted(async () => {
  try {
    loading.value = true
    load()
    const options = await getContractTypeNew()
    let allChildType = []
    for (const i of options) {
      if (Array.isArray(i.child) && i.child.length > 0) {
        let child = i.child
          .map((j) => {
            return {
              label: j.typeName,
              value: j.typeId,
              sort: j.sort,
            }
          })
          .sort((a, b) => {
            return a.sort - b.sort
          })
        allChildType.push(...child)
      }
    }
    templateTypeList.value = options.sort((a, b) => {
      return a.sort - b.sort
    })
    templateOption.value = options
    childTypeOptions.value = allChildType
    cacheChildTypeOptions.value = allChildType
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.my_btn {
  height: 3rem;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  margin-right: 1.5rem;
  color: #999999;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2rem;
  cursor: pointer;
  &:hover {
    background-color: var(--primary-color);
    color: #fff;
  }
}
.my_btn_active {
  background-color: var(--primary-color);
  color: #fff;
}
:deep(.divider) {
  margin: 1rem;
}

:deep(.n-collapse .n-collapse-item .n-collapse-item__content-wrapper .n-collapse-item__content-inner) {
  padding: 0;
}

.menu_item {
  flex-shrink: 0;
  height: 3rem;
  padding: 0 2rem;
  font-size: 1.5rem;
  margin-right: 1.5rem;
  margin-bottom: 0.5rem;
  color: #999999;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2rem;
  cursor: pointer;
  &:hover {
    background-color: var(--primary-color);
    color: #fff;
  }
}
.active {
  background-color: var(--primary-color);
  color: #fff;
}

.list {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: 8rem;
  padding: 2rem 0;

  .item-box {
    .item {
      width: 100%;
      height: 28rem;
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
</style>
