import { useUserStore } from '@/store/modules/user'

const WITHOUT_TOKEN_API = [
  { url: '/auth/login', method: 'POST' },
  { url: '/web/loadPublicKey', method: 'POST' },
  { url: '/web/loginSystemForWeb', method: 'POST' },
  { url: '/web/getLoginCode', method: 'POST' },
]

export function isWithoutToken({ url, method = '' }) {
  return WITHOUT_TOKEN_API.some((item) => item.url === url && item.method === method.toUpperCase())
}

export function addBaseParams(params) {
  if (!params.userId) {
    params.userId = useUserStore().userId
  }
}
