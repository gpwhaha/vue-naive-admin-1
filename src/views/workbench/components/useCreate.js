import api from '@/api/index'
import { templateTopUse } from '../api'
import { router } from '@/router'

export const useCreate = () => {
  const loading = ref(false)
  const search = ref({
    templateName: '',
    templateType: '',
    categoryId: '',
    year: '',
    publishDate: '',
    pageNo: 1,
    pageSize: 10,
  })
  const fileList = ref([])

  async function load() {
    loading.value = true
    let params = {
      page: search.value.pageNo,
      pageSize: search.value.pageSize,
      templateName: search.value.templateName,
      categoryId: search.value.categoryId,
      tag: search.value.tag,
      publishDate: search.value.publishDate,
    }
    const { code, msg, data } = await templateTopUse(params)

    if (code === 0) {
      for (const i of data) {
        i.url = await getFileImg(i.templateId)
      }
      fileList.value = data
      loading.value = false
    } else {
      $message.error(msg)
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

  function handleDetail(row) {
    router.push({
      name: 'previewFile',
      query: {
        contractId: row.contractId,
        fileTitle: row.templateName,
        form: row,
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

  function toMore() {
    router.push({
      name: 'template',
    })
  }

  function toCreate() {
    router.push({
      name: 'create-onlie',
    })
  }

  function tagStyle(item) {
    let color = {
      0: ['#f4d177', '#dbb255', '精选'],
      1: ['#3b8bea', '#0a79fa', '官方'],
      2: ['#4dc34d', '#0d990d', '内部'],
    }
    return {
      backgroundImage: `linear-gradient( {color[item.tag][0]},  {color[item.tag][1]})`,
    }
  }

  function tagName(item) {
    let name = ['精选', '官方', '内部']
    return name[item.tag]
  }
  return {
    loading,
    fileList,
    load,
    getFileImg,
    tagStyle,
    tagName,
    toMore,
    toCreate,
    handleDetail,
    handleSuccessTemplate,
  }
}
