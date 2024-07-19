import Axios from 'axios'
import { message } from 'antd'
import { getCookie } from '@/utils/cookie'
const successCode = ['200', 200, 0, '0', 'ok', 'true']
if (process.env.REACT_APP_USE_MOCK === 'true') {
  // 加载 Mock 数据
  require('../mocks/index')
}

// 请求失败后的错误统一处理
const netErrorHandle = (status: number, errorCode:any, msg:any) => {
  switch (status) {
    case 401:
      if (msg) {
        message.error(msg)
        if (errorCode === 'redirect-login') {
          setTimeout(() => {
            window.location.href = `/login?redirect=${location.pathname + location.search}`
          }, 1000)
        } else if (errorCode === 'challenge-password') {
          setTimeout(() => {
            window.location.href = `/settings/challenge/password?redirect=${location.pathname + location.search}`
          }, 1000)
        }
      } else {
        message.error('登录状态已过期，请重新登录')
      }
      break
    default:
      if (msg) {
        message.error(msg)
      } else {
        message.error(`服务器异常: ${status}`)
      }
  }
}

// 创建axios实例
const instance = Axios.create({ baseURL: '', timeout: 3000 })

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */

instance.interceptors.request.use(
  (config) => {
    const _csrf = getCookie('_csrf')
    if (_csrf) {
      config.headers._csrf = _csrf
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response: any) => {
    if (successCode.indexOf(response.data.statusCode) > -1) {
      return Promise.resolve(response.data)
    } else {
      const data = response.data || {}
      message.error(data.message || '操作失败')
      return Promise.reject(response)
    }
  },
  (error) => {
    const { response, message: msg } = error
    if (response) {
      netErrorHandle(response.status, response.data.error, response.data.message)
      return Promise.reject(response)
    } else {
      if (msg && msg.indexOf('timeout') > -1) {
        message.error('请求超时，请稍后重试')
        return Promise.reject(error)
      } else if (!window.navigator.onLine) {
        // 通知断网
        message.error('网络异常')
        return Promise.reject(error)
      } else {
        return Promise.reject(error)
      }
    }
  }
)

export default instance
