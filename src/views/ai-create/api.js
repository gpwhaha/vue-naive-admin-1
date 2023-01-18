import { request } from '@/utils'

export const getSingleReviewList = (data) => request.post('/contract/getSingleReviewList', data, { noNeedTip: true })

export const getRecentContractList = () => request.get('/contract/getRecentContractList')

export const createContractByClone = (contractId, version) =>
  request.get(`contract/createContractByClone?contractId=${contractId}&version=${version}`)

export const queryContractBase = (contractId) => request.get(`contract/queryContractBase/${contractId}`) //查询合同基本信息
