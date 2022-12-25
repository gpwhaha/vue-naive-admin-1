import { request } from '@/utils'

export default {
  getUser: () => request.get('/user'),
  refreshToken: () => request.post('/auth/refreshToken', null, { noNeedTip: true }),
  loginIn: (data) => request.post('/web/loginSystemForWeb', data, { noNeedToken: true }),
  getPublicKey: () => request.post('/web/loadPublicKey', null, { noNeedToken: true }),
  getUserInfo: () => request.post('/web/queryCurrentUser'),
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
  createContract: (data) => request.post(`/contract/createContractBase`, data),
  queryDraftDetail: (contractId) => request.post(`/contract/draft/queryDraftDetail/${contractId}`),
}
