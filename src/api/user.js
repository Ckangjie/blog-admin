import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/login',
    method: 'post',
    params
  })
}

export function getInfo(params) {
  return request({
    url: '/userInfo',
    method: 'post',
    params
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
