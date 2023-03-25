import dayjs from 'dayjs'

/**
 * @desc  格式化时间
 * @param {(Object|string|number)} time
 * @param {string} format
 * @returns {string | null}
 */
export function formatDateTime(time = undefined, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(time).format(format)
}

export function formatDate(date = undefined, format = 'YYYY-MM-DD') {
  return formatDateTime(date, format)
}

/**
 * @desc  函数节流
 * @param {Function} fn
 * @param {Number} wait
 * @returns {Function}
 */
export function throttle(fn, wait) {
  let context, args
  let previous = 0

  return function () {
    let now = +new Date()
    context = this
    args = arguments
    if (now - previous > wait) {
      fn.apply(context, args)
      previous = now
    }
  }
}

/**
 * @desc  函数防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(method, wait, immediate) {
  let timeout
  return function (...args) {
    let context = this
    if (timeout) {
      clearTimeout(timeout)
    }
    // 立即执行需要两个条件，一是immediate为true，二是timeout未被赋值或被置为null
    if (immediate) {
      /**
       * 如果定时器不存在，则立即执行，并设置一个定时器，wait毫秒后将定时器置为null
       * 这样确保立即执行后wait毫秒内不会被再次触发
       */
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) {
        method.apply(context, args)
      }
    } else {
      // 如果immediate为false，则函数wait毫秒后执行
      timeout = setTimeout(() => {
        /**
         * args是一个类数组对象，所以使用fn.apply
         * 也可写作method.call(context, ...args)
         */
        method.apply(context, args)
      }, wait)
    }
  }
}

/**
 * @desc  时间戳转换为多少分钟之前
 * @param {Function} func
 * @param {timestamp} dateTimeStamp
 * @return {*}
 */
export const getDateDiff = (dateTimeStamp) => {
  // 时间字符串转时间戳
  let timestamp = new Date(dateTimeStamp).getTime()
  let minute = 1000 * 60
  let hour = minute * 60
  let day = hour * 24
  let month = day * 30
  let year = day * 365
  let now = new Date().getTime()
  let diffValue = now - timestamp
  let result
  if (diffValue < 0) {
    return
  }
  let yearC = diffValue / year
  let monthC = diffValue / month
  let weekC = diffValue / (7 * day)
  let dayC = diffValue / day
  let hourC = diffValue / hour
  let minC = diffValue / minute
  if (yearC >= 1) {
    result = `${parseInt(yearC)}年前`
  } else if (monthC >= 1) {
    result = `${parseInt(monthC)}月前`
  } else if (weekC >= 1) {
    result = `${parseInt(weekC)}周前`
  } else if (dayC >= 1) {
    result = `${parseInt(dayC)}天前`
  } else if (hourC >= 1) {
    result = `${parseInt(hourC)}小时前`
  } else if (minC >= 1) {
    result = `${parseInt(minC)}分钟前`
  } else result = '刚刚'
  return result
}

/**
 * @desc  文件大小转换
 * @param {Function} func
 * @param {number} size
 * @return {*}
 */
export const fileSizeTransform = (size) => {
  if (!size) return ''
  let num = 1024.0 //byte
  if (size < num) return `${size}B`
  if (size < Math.pow(num, 2)) return `${(size / num).toFixed(2)}KB` //kb
  if (size < Math.pow(num, 3)) return `${(size / Math.pow(num, 2)).toFixed(2)}MB` //M
  if (size < Math.pow(num, 4)) return `${(size / Math.pow(num, 3)).toFixed(2)}GB` //G
  return `${(size / Math.pow(num, 4)).toFixed(2)}TB` //T
}

/**
 * 金额小写转换成大写
 */

export const digitUppercase = (n) => {
  let fraction = ['角', '分']
  let digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  let unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ]
  let head = n < 0 ? '负' : ''
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  )
}

/**
 * 金额大写转换成小写
 */
export const convertChineseToNumber = (amount) => {
  const numMap = {
    零: 0,
    壹: 1,
    贰: 2,
    叁: 3,
    肆: 4,
    伍: 5,
    陆: 6,
    柒: 7,
    捌: 8,
    玖: 9
  };

  const unitMap = {
    拾: 10,
    佰: 100,
    仟: 1000,
    万: 10000,
    亿: 100000000
  };

  let result = 0;
  let temp = 0;
  let lastUnit = 1;

  for (let i = 0; i < amount.length; i++) {
    const char = amount.charAt(i);

    if (numMap[char] !== undefined) {
      temp = temp * 10 + numMap[char];
    } else if (unitMap[char] !== undefined) {
      lastUnit = unitMap[char];
      result += temp * lastUnit;
      temp = 0;
    }

    if (i === amount.length - 1) {
      result += temp * lastUnit;
    }
  }

  result = result.toFixed(2);

  return result;
}

/**
 * base64加密解密方法
 * @example
 * 使用静态方法
 * import Base64 from '/A/home/helper/base64';
 * Base64.encode('123');
 * Base64.decode('YWFh');
 */
 export class Base64 {
  static _keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  static encode(input) {
    let output = ''
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4
    let i = 0
    const _keyStr = this._keyStr
    input = this._utf8_encode(input)
    while (i < input.length) {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)
      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63
      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }
      output =
        output +
        _keyStr.charAt(enc1) +
        _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) +
        _keyStr.charAt(enc4)
    }
    return output
  }

  static decode(input) {
    let output = ''
    let chr1, chr2, chr3
    let enc1, enc2, enc3, enc4
    let i = 0
    const _keyStr = this._keyStr
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++))
      enc2 = _keyStr.indexOf(input.charAt(i++))
      enc3 = _keyStr.indexOf(input.charAt(i++))
      enc4 = _keyStr.indexOf(input.charAt(i++))
      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4
      output = output + String.fromCharCode(chr1)
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2)
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3)
      }
    }
    output = this._utf8_decode(output)
    return output
  }

  static _utf8_encode(string) {
    string = string.replace(/\r\n/g, '\n')
    let utftext = ''
    for (let n = 0; n < string.length; n++) {
      const c = string.charCodeAt(n)
      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }
    }
    return utftext
  }

  static _utf8_decode(utftext) {
    let string = ''
    let i = 0
    let c = 0,
      c2 = 0,
      c3 = 0
    while (i < utftext.length) {
      c = utftext.charCodeAt(i)
      if (c < 128) {
        string += String.fromCharCode(c)
        i++
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1)
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
        i += 2
      } else {
        c2 = utftext.charCodeAt(i + 1)
        c3 = utftext.charCodeAt(i + 2)
        string += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        )
        i += 3
      }
    }
    return string
  }
}

const getHandledValue = num => {
  return num < 10 ? `0${num}` : num
}
/**
 * 格式化日期格式
 * @param {*} timeStamp 时间戳
 * @param {*} startType 格式类型
 */
export const getDate = (timeStamp, startType) => {
  if (timeStamp == null) return timeStamp
  timeStamp = timeStamp * 1
  const d = new Date(timeStamp)
  const year = d.getFullYear()
  const month = getHandledValue(d.getMonth() + 1)
  const date = getHandledValue(d.getDate())
  const hours = getHandledValue(d.getHours())
  const minutes = getHandledValue(d.getMinutes())
  const second = getHandledValue(d.getSeconds())
  let resStr = ''
  if (!startType)
    resStr = `${year}-${month}-${date} ${hours}:${minutes}:${second}`
  else if (startType === 'yyyy-MM-dd HH:mm:ss')
    return `${year}-${month}-${date} ${hours}:${minutes}:${second}`
  else if (startType === 'yyyy-MM-dd') resStr = `${year}-${month}-${date}`
  else if (startType === 'yyyy年MM月dd日')
    resStr = `${year}年${month}月${date}日`
  else if (startType === 'yyyy-MM-dd HH:mm')
    resStr = `${year}-${month}-${date} ${hours}:${minutes}`
  else if (startType === 'MM-dd HH:mm')
    resStr = `${month}-${date} ${hours}:${minutes}`
  else if (startType === '年月日') resStr = dateToChStr(d)
  else if (startType === 'yyyy.MM.dd') resStr = `${year}.${month}.${date}`
  return resStr
}
