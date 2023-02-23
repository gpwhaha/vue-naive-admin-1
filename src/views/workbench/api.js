import { request } from '@/utils'

export const getMyPlanStatistics = (data) => request.get('/contract/perform/myPlanStatistics', data)

export const getMyApproval = (data) => request.post(`/contract/todo/myApproval`, data)

export const getMyPerform = (data) => request.get(`contract/todo/myPerform?page=${data.page}&pageSize=${data.pageSize}`)

export const templateTopUse = (data) => request.post(`contract/template/topUse`, data)

export const contractTodaySign = (data) => request.get(`contract/statistics/contractTodaySign`, data)

export const contractWeekSign = (data) => request.get(`contract/statistics/contractWeekSign`, data)

export const contractMonthSign = (data) => request.get(`contract/statistics/contractMonthSign`, data)

export const contractYearSign = (data) => request.get(`contract/statistics/contractYearSign`, data)

export const contractDateRangeSign = (data) => request.post(`contract/statistics/contractDateRangeSign`, data)
