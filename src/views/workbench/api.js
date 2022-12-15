import request from '@/utils/http'

export const getMyPlanStatistics = (data) => request.get('/contract/perform/myPlanStatistics', data)
