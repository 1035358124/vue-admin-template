import request from '@/utils/request'

const baseUrl = '/web/image/'
export function batchUpload(data) {
  return request({
    url: baseUrl + 'batchUpload',
    method: 'post',
    data
  })
}

export function getImage(params) {
  return request({
    url: baseUrl + 'get',
    method: 'get',
    params
  })
}

export function updateImage(data) {
  return request({
    url: baseUrl + 'update',
    method: 'post',
    data
  })
}

export function deleteImage(data) {
  return request({
    url: baseUrl + 'delete',
    method: 'post',
    data
  })
}

