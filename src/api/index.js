import request from '@/utils/http'

export default {
  getUser: () => request.get('/user'),
  refreshToken: () => request.post('/auth/refreshToken'),
  loginIn: (data) => request.post('/web/loginSystemForWeb', data),
  getPublicKey: () => request.post('/web/loadPublicKey'),
  getUserInfo: () => request.post('/web/queryCurrentUser'),
  getLoginCode: (vcodeKey) =>
    request({
      url: '/web/getLoginCode',
      headers: {
        VerifyCodeKey: vcodeKey,
      },
      responseType: 'blob',
      method: 'POST',
    }),
}
