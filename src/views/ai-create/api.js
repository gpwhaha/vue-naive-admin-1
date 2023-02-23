import { request } from '@/utils'

export const getSingleReviewList = (data) => request.post('/contract/getSingleReviewList', data, { noNeedTip: true })

export const getRecentContractList = () => request.get('/contract/getRecentContractList')

export const createContractByClone = (contractId, version) =>
  request.get(`contract/createContractByClone?contractId=${contractId}&version=${version}`)

export const queryContractBase = (contractId) => request.get(`contract/queryContractBase/${contractId}`) //查询合同基本信息

export const modifyContractBase = (data) => request.post(`contract/modifyContractBase`, data) //修改合同基本信息

export const addRelativeCompany = (data) => request.post(`contract/addRelative`, data) //添加相对方

export const getUser = (data) => request.post(`contract/invite/getUser`, data) //查询可邀请协商用户

export const queryInvite = (contractId) => request.get(`contract/invite/queryInvite?contractId=${contractId}`) //查询已邀请协商用户

export const getInvite = (data) => request.post(`contract/invite/getInviteCode`, data) //邀请协商用户

export const getUserPhoto = (photo) =>
  request({
    url: `contract/invite/getUserPhoto?photo=${photo}`,
    responseType: 'blob',
    method: 'post',
  }) //获取协商用户头像
