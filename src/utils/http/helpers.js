import { useUserStore } from '@/store'

export function addBaseParams(params) {
  if (!params.userId) {
    params.userId = useUserStore().userId
  }
}

export function resolveResError(code, message) {
  switch (code) {
    case 1:
      message = message ?? '网络较差'
      break
    case 400:
      message = message ?? '请求参数错误'
      break
    case 401:
      message = message ?? '登录已过期'
      useUserStore().logout()
      break
    case 20021:
      message = message ?? '登录已过期'
      useUserStore().logout()
      break
    case 20022:
      message = message ?? '当前账号在其他终端登录，请注意安全'
      useUserStore().logout()
      break
    case 403:
      message = message ?? '没有权限'
      break
    case 404:
      message = message ?? '资源或接口不存在'
      break
    case 500:
      message = message ?? '服务器异常'
      break
    default:
      message = message ?? `【${code}】: 未知异常!`
      break
  }
  return message
}
