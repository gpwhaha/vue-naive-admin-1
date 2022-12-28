import { request } from '@/utils'

export const searchMyConvert = (data) => request.post(`/contract/template/searchMyConvert`, data)

export const queryCategory = (parentId) => request.get(`contract/template/queryCategory?parentId=${parentId}`)

export const addCollection = (data) => request.post(`/contract/template/addCollection`, data)

export const removeCollection = (data) => request.post(`/contract/template/removeCollection`, data)

export const searchTemplate = (data) => request.post(`/contract/template/searchTemplate`, data)

export const searchMyCollection = (data) => request.post(`/contract/template/searchMyCollection`, data)

export const getContractType = () => request.get(`contract/contractType`)
