import request from '@/utils/request'

const BASE_URL = '/web/user/'
export function login(data) {
  return request({
    url: BASE_URL + 'login',
    method: 'post',
    data
  })
}

export function getInfo(params) {
  return request({
    url: BASE_URL + 'info',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: BASE_URL + 'logout',
    method: 'post'
  })
}

