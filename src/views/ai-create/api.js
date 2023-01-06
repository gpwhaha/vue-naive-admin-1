import { request } from '@/utils'

export const getSingleReviewList = (data) => request.post('/contract/getSingleReviewList', data, { noNeedTip: true })

export const getRecentContractList = () => request.get('/contract/getRecentContractList')

export const createContractByClone = (contractId, version) =>
  request.get(`contract/createContractByClone?contractId=${contractId}&version=${version}`)
