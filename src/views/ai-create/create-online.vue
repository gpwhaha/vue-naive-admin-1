<template>
  <div class="cus-scroll-y wh-full p-4 box-border flex-col bg-[#f5f6fb]">
    <n-spin :show="loading" wh-full>
      <header px-2 mb-4 min-h-14 flex justify-between items-center>
        <h2 color="#333" text-7 font-700>在线起草</h2>
        <n-button type="primary" @click="createNewFile">
          <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新建空白文档
        </n-button>
      </header>
      <div wh-full flex flex-col>
        <div class="create">
          <div class="box-item bg-white" @click="openLocalUpload">
            <div class="head">
              <div class="name">本地上传合同</div>
            </div>
            <div class="bg-img">
              <n-image :src="LocalCreateImg" preview-disabled></n-image>
            </div>

            <div class="foot">
              <div class="description">支持格式为：doc、docx（上传单个文件大小不超过20M）</div>
            </div>
          </div>
          <div class="box-item bg-white" @click="openTemplatePick">
            <div class="head">
              <div class="name">按照标准模板新建</div>
              <!-- <div class="select">
                <n-select
                  w-150
                  :options="templateData"
                  label-field="templateName"
                  value-field="templateId"
                  :render-label="renderLabel"
                  :loading="loadingSelect"
                  clearable
                  @update:value="templateChoose"
                  @scroll="handleScroll"
                />
                <n-button type="primary" class="select-btn responsive-button" @click="openTemplatePick">
                  选择模板
                </n-button>
              </div> -->
            </div>
            <div class="bg-img">
              <n-image :src="TemplateCreateImg" preview-disabled></n-image>
            </div>
            <div class="foot">
              <div class="description">直接套用企业模板，填写参数，快速审批</div>
              <!-- <n-button type="primary" class="btn responsive-button" @click="useTemplateCreate"> 开始创建 </n-button> -->
            </div>
          </div>
          <div class="box-item bg-white" @click="showAIContractPicker">
            <div class="head">
              <div class="name">智能起草</div>
              <div class="steps">
                <n-steps status="process" ml-30>
                  <n-step>
                    <template #default>
                      <div text-6>回答一些简单的问题</div>
                      <div class="-ml-8 text-5 color-gray">（不回答的问题将在合同中留空）</div>
                    </template>
                  </n-step>
                  <n-step>
                    <template #default>
                      <div text-6>生成一份合同</div>
                    </template>
                  </n-step>
                  <n-step>
                    <template #default>
                      <div text-6 mt-12>仅需五分钟</div>
                    </template>
                  </n-step>
                </n-steps>
              </div>
            </div>
            <div class="bg-img">
              <n-image :src="AICreateImg" preview-disabled></n-image>
            </div>
            <div class="foot">
              <div class="description">选择公开模板，自由编写合同</div>
            </div>
          </div>
        </div>
        <div class="rencent-use my-4 bg-white p-4">
          <div text-6>
            最近完成合同
            <span text-5 color-gray> （你可以选择一个已经完成的合同来创建一个合同） </span>
          </div>
          <CrudTable
            ref="$table"
            :scroll-x="500"
            :is-pagination="isPagination"
            :columns="columns"
            :get-data="getRecentContractList"
          >
          </CrudTable>
        </div>
      </div>
    </n-spin>
    <localUpload v-model:visible="localUploadDialog" @on-save="loaclCreate"></localUpload>
    <TemplatePicker v-model:visible="showTemplatePicker"></TemplatePicker>
    <AiCreatePicker v-model:visible="aiContractDialog"></AiCreatePicker>
  </div>
</template>

<script setup>
import AICreateImg from '@/assets/images/AICreate.png'
import TemplateCreateImg from '@/assets/images/TemplateCreate.png'
import LocalCreateImg from '@/assets/images/LocalCreate.png'
import localUpload from './components/local_upload.vue'
import TemplatePicker from './components/tempalte_picker.vue'
import AiCreatePicker from './components/aiCreate_picker.vue'
import api from '@/api/index'
import { getRecentContractList, createContractByClone } from './api'
import { formatDateTime, renderIcon, isNullOrUndef } from '@/utils'
import { NButton } from 'naive-ui'

const router = useRouter()
const localUploadDialog = ref(false)
const loading = ref(false)
//模板起草
const showTemplatePicker = ref(false)
const templateData = ref([])
const templateFileId = ref(null)
const templateTypeId = ref(null)
const templateId = ref(null)
const paramsCount = ref(null)
const tag = ref(null)
const templatePage = ref(1)
const shouldLoadMore = ref(false)
const loadingSelect = ref(false)
//智能起草
const aiContractDialog = ref(false)
//最近使用
const $table = ref(null)
const tableData = ref([])
const isPagination = ref(false)
const columns = [
  {
    title: '合同编号',
    key: 'billNo',
    ellipsis: { tooltip: true },
  },
  { title: '合同名称', key: 'contractTitle', ellipsis: { tooltip: true } },
  { title: '合同类型', key: 'contractType', ellipsis: { tooltip: true } },
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
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            secondary: true,
            onClick: () => handleUseRecentFile(row),
          },
          { default: () => '创建', icon: renderIcon('mdi:file-document', { size: 14 }) }
        ),
      ]
    },
  },
]

/**打开本地上传弹窗*/
function openLocalUpload() {
  localUploadDialog.value = true
}
async function loaclCreate(form) {
  localUploadDialog.value = false
  loading.value = true
  try {
    let param = {
      typeId: form.typeId,
      draftType: 0,
      fileId: form.fileLists[0].file,
    }
    const { data } = await createContract(param)
    const {
      data: { contractInfo, contractDocumentView },
    } = await queryDraftDetail(data.contractId)
    router.push({
      name: 'editContract',
      query: {
        fromType: 0,
        contractId: contractInfo.contractId,
        version: data.version,
        officeFileId: contractDocumentView.fileId,
        officeFilePath: contractDocumentView.filePath,
      },
    })
  } finally {
    loading.value = false
  }
}

/**打开模板弹窗*/
function openTemplatePick() {
  showTemplatePicker.value = true
}

/**模板下拉选择*/
function templateChoose(tId) {
  if (tId) {
    let find = templateData.value.find((i) => i.templateId === tId)
    templateFileId.value = find.fileId
    tag.value = find.tag
    templateTypeId.value = find.category
    templateId.value = find.templateId
    paramsCount.value = find.paramsCount
  } else {
    templateFileId.value = null
    tag.value = null
    templateTypeId.value = null
    templateId.value = null
    paramsCount.value = null
  }
}

/**模板创建*/
async function useTemplateCreate() {
  try {
    loading.value = true
    if (!templateFileId.value) {
      return $message.error('请先选择模板')
    } else if (templateFileId.value && paramsCount.value > 0) {
      let param = {
        typeId: templateTypeId.value,
        draftType: 2,
        templateId: templateId.value,
      }
      const { data } = await createContract(param)
      router.push({
        name: 'fillTemplateParameters',
        query: {
          contractId: data.contractId,
        },
      })
    } else {
      let param = {
        typeId: templateTypeId.value,
        draftType: 1,
        fileId: templateFileId.value,
      }
      const { data } = await createContract(param)
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
  } finally {
    loading.value = false
  }
}

/**新建空白文档 */
async function createNewFile() {
  try {
    loading.value = true
    let param = {
      draftType: 4,
    }
    const { data } = await createContract(param)
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
  } finally {
    loading.value = false
  }
}

/** 智能起草弹窗*/
function showAIContractPicker() {
  aiContractDialog.value = true
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

//使用最近的合同创建
async function handleUseRecentFile(row) {
  try {
    loading.value = true
    const { code, data, msg } = await createContractByClone(row.contractId, row.version)
    if (code === 0) {
      router.push({
        name: 'editContract',
        query: {
          contractId: data.contractId,
          version: data.version,
          officeFileId: data.officeFileId,
          officeFilePath: data.officeFilePath,
        },
      })
    } else {
      $message.error(msg)
    }
  } finally {
    loading.value = false
  }
}

//查询模板数据
async function getTemplates() {
  let params = {
    page: templatePage.value,
    pageSize: 10,
    templateName: '',
    categoryId: '',
    publishDate: '',
  }
  try {
    loadingSelect.value = true
    const { code, msg, data } = await api.searchTemplate(params)
    if (code === 0) {
      if (Array.isArray(data.item) && data.item.length > 0) {
        shouldLoadMore.value = true
        templateData.value.push(...data.item)
      } else {
        shouldLoadMore.value = false
      }
    } else {
      $message.error(msg)
    }
    return Promise.resolve(data)
  } finally {
    loadingSelect.value = false
  }
}

//滚动加载更多模板
function handleScroll(e) {
  const { scrollTop, offsetHeight, scrollHeight } = e.currentTarget
  if (scrollTop + offsetHeight >= scrollHeight && shouldLoadMore.value) {
    templatePage.value++
    getTemplates()
  }
}

function renderLabel(option) {
  return [
    h(
      'span',
      {
        style: {
          float: 'left',
          fontSize: '1.4rem',
        },
      },
      option.templateName,
      [
        h('sup', { style: templateStyle(option) }, templateTag(option)),
        option.paramsCount > 0 ? h('sup', { style: templateParamStyle(option) }, '含参') : '',
      ]
    ),
  ]
}

function templateStyle(item) {
  let color = ['#ff9646', 'var(--primary-color)', '#14ddbb']
  return {
    backgroundColor: color[item.tag],
    color: '#fff',
    fontSize: '1.2rem',
    padding: '0.2rem',
    borderRadius: '0.5rem',
  }
}
function templateParamStyle() {
  return {
    backgroundColor: '#1C7FF1FF',
    color: '#fff',
    fontSize: '1.2rem',
    padding: '0.2rem',
    borderRadius: '0.5rem',
    marginLeft: '0.5rem',
  }
}
function templateTag(item) {
  let name = ['精选', '官方', '内部']
  return name[item.tag]
}

onMounted(() => {
  getTemplates()
  $table.value?.handleSearch()
})
</script>

<style lang="scss" scoped>
:deep(.n-spin-content) {
  height: 95%;
  width: 100%;
}
:deep(.n-steps .n-step-content .n-step-content__description) {
  position: relative;
  left: -42%;
  margin-top: 2rem;
  width: 140%;
}
.create {
  flex: 2;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;

  .box-item {
    border-radius: 0.5rem;
    display: grid;
    justify-items: center;
    grid-template-rows: 18rem 15rem 1fr;
    box-sizing: border-box;
    padding: 2rem;
    transition: 0.1s all;
    cursor: pointer;

    &:hover {
      transform: translateY(-0.4rem);
      border: 2px solid var(--primary-color);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .head {
      width: 100%;
      display: grid;
      justify-items: center;

      .select {
        width: 90%;
        display: flex;
        margin-top: -3rem;

        .select-btn {
          margin-left: 1rem;
        }
      }

      .name {
        font-size: 1.7rem;
        font-weight: bolder;
        margin-top: 1rem;
      }
    }

    .bg-img {
      text-align: center;
      height: 12rem;
      cursor: pointer;
      :deep(.n-image img) {
        width: 80%;
        transform: translateX(12%);
      }
    }

    .foot {
      display: grid;
      justify-items: center;
      .description {
        color: #999999;
        font-size: 1.5rem;
        margin-top: 4rem;
      }

      .btn {
        margin-top: 2rem;
      }
    }
  }
}
.rencent-use {
  flex: 1;
  margin-top: 1rem;
  border-radius: 0.5rem;
}
</style>
