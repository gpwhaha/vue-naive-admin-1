import { getToken, uuid } from '@/utils'
import { hex_sha1 } from '@/utils/common/sha'
import { resolveResError } from './helpers'

function queryVal(val) {
  if (val.startsWith('/')) {
    return val
  } else return `/${val}`
}

export function reqResolve(config) {
  // 防止缓存，给get请求加上时间戳
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      t: new Date().getTime(),
    }
  }

  // 处理不需要token的请求
  if (config.noNeedToken) {
    return config
  }

  const token = getToken()
  if (!token) {
    return Promise.reject({ code: 401, message: '登录已过期，请重新登录！' })
  }

  /**
   * * 加上 token
   * ! 认证方案: JWT
   */

  let signature = []
  const requestId = uuid()
  signature.push(requestId)
  let path = config.url
  if (path.includes('?')) {
    let queryUrl = path.split('?')[1]
    let querys = queryUrl.split('&')
    for (let qs of querys) {
      if (qs.split('=')[1]) {
        signature.push(qs.split('=')[1])
      }
    }
  }
  signature.push(getToken())
  if (config.data) {
    signature.push(JSON.stringify(config.data))
  }
  if (config.url.includes('?')) {
    let queryWeb = config.url.split('?')[0]
    signature.push(queryVal(queryWeb))
  } else {
    signature.push(queryVal(config.url))
  }
  signature = signature.filter((item) => item !== '')
  signature.sort()
  config.headers.signature = hex_sha1(encodeURIComponent(signature.join(';')))
  config.headers.requestId = requestId
  config.headers.token = config.headers.token || token
  config.headers.timeStamp = new Date().getTime()
  config.headers['Content-Type'] = 'application/json'
  config.headers.loginType = 'W'
  config.headers.version = 202011

  return config
}

export function reqReject(error) {
  return Promise.reject(error)
}

export function repResolve(response) {
  // TODO: 处理不同的 response.headers
  const { data, status, config, statusText } = response
  if ((response.data?.code !== 0 || response.data?.code !== 200) && status !== 200) {
    const code = data?.code ?? status
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, data?.msg ?? statusText)

    /** 需要错误提醒 */
    !config.noNeedTip && $message.error(message)
    return Promise.reject({ code, message, error: response?.data })
  } else if (['1', 20021, 20022].includes(data?.code)) {
    const code = data?.code ?? status
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, data?.msg || data?.message || statusText)
    /** 需要错误提醒 */
    $message.error(message)
    return Promise.reject({ code, message, error: response?.data })
  }

  return Promise.resolve(data)
}

export function repReject(error) {
  if (!error || !error.response) {
    const code = error?.code
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, error.message)
    $message?.error(message)
    return Promise.reject({ code, message, error })
  }
  const { data, status, config } = error.response
  const code = data?.code ?? status
  const message = resolveResError(code, data?.message ?? error.message)
  /** 需要错误提醒 */
  !config?.noNeedTip && $message.error(message)
  return Promise.reject({ code, message, error: error.response?.data })
}
