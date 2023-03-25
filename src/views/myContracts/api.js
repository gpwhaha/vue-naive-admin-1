import { request } from '@/utils'
export const getMyContractList = (data) => request.post('/contract/getMyContractList', data, { noNeedTip: true })
export const myInvite = (data) => request.post(`/contract/invite/myInvite`, data)
export const inviteMe = (data) => request.post(`/contract/invite/inviteMe`, data)
export const queryConsultationReport = (data) =>
  request.get(`/contract/queryConsultationReport/${data.contractId}/${data.pageSize}/${data.begin}`)
export const changeShare = (data) => request.post(`/contract/invite/changeShare`, data)
