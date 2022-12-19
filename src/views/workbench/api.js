import request from '@/utils/http'

export const getMyPlanStatistics = (data) => request.get('/contract/perform/myPlanStatistics', data)

export const getMyApproval = (data) =>
  request.get(`/contract/todo/myApproval?page=${data.page}&pageSize=${data.pageSize}`)

export const getMyPerform = (data) => request.get(`contract/todo/myPerform?page=${data.page}&pageSize=${data.pageSize}`)
