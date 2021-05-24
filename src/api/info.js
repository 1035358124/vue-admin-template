import request from '@/utils/request'

const BASE_URL = '/info/'

export function getInfo(params) {
  return request({
    url: BASE_URL + 'get',
    method: 'get',
    params
  })
}

export function updateInfo(data) {
  return request({
    url: BASE_URL + 'update',
    method: 'post',
    data
  })
}

