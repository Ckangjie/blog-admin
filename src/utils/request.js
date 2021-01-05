import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? "http://it.ckjblog.com:3306" : '/dev-api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 2000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    // if the custom status is not 200, it is judged as an error.
    // 如果自定义状态码不是200，则判断为错误
    if (res.status !== 200) {
      Message({
        message: res.message || 'Error',
        type: res.type || 'error',
        duration: 2 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // 50008:非法令牌；50012:其他客户端登录；50014:令牌过期
      if (res.status === 403 || res.status === 50012 || res.status === 50014) {
        // to re-login
        setTimeout(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          }, 2000)
        })
      }
      // return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // if (res.message) {
      //   Message({
      //     message: res.message,
      //     type: res.type,
      //     duration: 2 * 1000,
      //     center: true
      //   })
      // }
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
