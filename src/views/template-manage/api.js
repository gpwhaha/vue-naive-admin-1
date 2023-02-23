import { request } from '@/utils'

export const searchMyConvert = (data) => request.post(`/contract/template/searchMyConvert`, data) // 搜索我的合同模板

export const queryCategory = (parentId) => request.get(`contract/template/queryCategory?parentId=${parentId}`) //查询模板分类

export const addCollection = (data) => request.post(`/contract/template/addCollection`, data) // 模板收藏

export const removeCollection = (data) => request.post(`/contract/template/removeCollection`, data) // 模板收藏-取消收藏

export const searchTemplate = (data) => request.post(`/contract/template/searchTemplate`, data) //搜索合同模板

export const searchMyCollection = (data) => request.post(`/contract/template/searchMyCollection`, data) // 搜索我收藏的合同模板

export const getContractType = () => request.get(`contract/contractType`) //合同设置-查询合同类型

export const editTpl = (data) => request.post(`contract/template/updateTplDes`, data) //编辑合同模板

export const createTpl = (data) => request.post(`contract/template/createTpl`, data) //创建合同模板

export const downloadContractFile = (contractId) => {
  return request({
    url: `contract/downloadContractFile/${contractId}`,
    method: 'post',
    responseType: 'blob',
  })
} //下载合同

export const downloadFile = (fileId) => {
  return request({
    url: `contract/downloadFile/${fileId}`,
    method: 'post',
    responseType: 'blob',
  })
} //下载同模板

export const deleteTpl = (data) => request.post(`contract/template/deleteTemplate`, data) //创建合同模板

export const queryRecentUsedContractSorted = (data) =>
  request.get(`contract/queryRecentUsedContractSorted?pageSize=${data.pageSize}&begin=${data.begin}`) //查询最近使用合同
