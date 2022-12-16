import { lStorage } from '@/utils'
import api from '@/api'

const TOKEN_CODE = 'access_token'
const DURATION = 6 * 60 * 60

export function getToken() {
  return lStorage.get(TOKEN_CODE)
}

export function setToken(token) {
  lStorage.set(TOKEN_CODE, token, DURATION)
}

export function removeToken() {
  lStorage.remove(TOKEN_CODE)
}

export async function refreshAccessToken() {
  const tokenItem = lStorage.getItem(TOKEN_CODE)
  if (!tokenItem) {
    return
  }
  const { time } = tokenItem
  // token生成或者刷新后30分钟内不执行刷新
  if (new Date().getTime() - time <= 1000 * 60 * 30) return
  try {
    const res = await api.refreshToken()
    setToken(res.data.token)
  } catch (error) {}
}

/**
 * 生成uuid
 */
export const uuid = () => {
  let s = []
  let hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}
