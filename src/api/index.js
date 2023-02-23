import { request, yozoRequest } from '@/utils'

export default {
  getUser: () => request.get('/user'),

  refreshToken: () => request.post('/auth/refreshToken', null, { noNeedTip: true }),

  loginIn: (data) => request.post('/web/loginSystemForWeb', data, { noNeedToken: true }),

  getPublicKey: () => request.post('/web/loadPublicKey', null, { noNeedToken: true }),

  getUserInfo: () => request.post('/web/queryCurrentUser'),
  getOfficeUrl: (data) =>
    yozoRequest({
      url: '/api.do',
      method: 'post',
      params: data,
    }) /** 合同管理-导入批量合同 */,

  getLoginCode: (vcodeKey) =>
    request({
      url: '/web/getLoginCode',
      headers: {
        VerifyCodeKey: vcodeKey,
      },
      responseType: 'blob',
      method: 'POST',
      noNeedToken: true,
      noNeedTip: true,
    }),

  getFileImg: (templateId) =>
    request({
      url: `contract/template/img/${templateId}`,
      responseType: 'blob',
      method: 'get',
    }),

  createContract: (data) => request.post(`/contract/draft/create`, data) /** 智能起草-创建 */,

  queryDraftDetail: (contractId) =>
    request.post(`/contract/draft/queryDraftDetail/${contractId}`) /** 智能起草-查询合同信息 */,

  delPerformFile: (data) => request.post(`contract/perform/delPerformFile`, data) /** 删除文件（服务器） */,

  uploadStockContract: (data) => request.post(`contract/uploadStockContract`, data) /** 合同管理-导入批量合同 */,

  searchTemplate: (data) => request.post(`contract/template/searchTemplate`, data) /** 搜索合同模板 */,

  modifyContractUsedCondition: (templateId) => request.get(`/contract/modifyContractUsedCondition/${templateId}`), //更新最近使用模板时间

  getDictonaryValues: (code) => request.get(`contract/queryDictionaryValueList?code=${code}`), //获取字典值

  queryRelativeList: (data) => request.post(`contract/queryRelativeList`, data), //查询相对方
}
