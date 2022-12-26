import { useUserStore } from '@/store'
import { router } from '@/router'

export function addBaseParams(params) {
  if (!params.userId) {
    params.userId = useUserStore().userId
  }
}

export function resolveResError(code, message) {
  switch (code) {
    case 1:
      message = message || '网络较差'
      break
    case 400:
      message = message || '请求参数错误'
      break
    case 401:
      useUserStore().logout()
      message = message || '登录已过期'
      break
    case 20002:
      useUserStore().logout()
      message = message || '身份验证失败!'
      break
    case 20021:
      useUserStore().logout()
      message = message || '登录已过期'
      break
    case 20022:
      useUserStore().logout()
      message = message || '当前账号在其他终端登录，请注意安全'
      break
    case 403:
      message = message || '没有权限'
      break
    case 404:
      message = message || '资源或接口不存在'
      router.push({ name: 'ERROR-404' })
      break
    case 405:
      message = message || 'Method Not Allowed'
      router.push({ name: 'ERROR-404' })
      break
    case 500:
      message = message || '服务器异常'
      break
    default:
      message = message || `【${code}】: 未知异常!`
      break
  }
  return message
}
