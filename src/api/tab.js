import request from '@/utils/request'

const BASE_URL = '/web/tab/'

export function addTab(data) {
  return request({
    url: BASE_URL + 'add',
    method: 'post',
    data
  })
}

export function deleteTab(data) {
  return request({
    url: BASE_URL + 'delete',
    method: 'post',
    data
  })
}

export function updateTab(data) {
  return request({
    url: BASE_URL + 'update',
    method: 'post',
    data
  })
}

export function getTab(params) {
  return request({
    url: BASE_URL + 'get',
    method: 'get',
    params
  })
}

export function getWithoutPage(params) {
  return request({
    url: BASE_URL + 'getWithoutPage',
    method: 'get',
    params
  })
}

export function getTabImage(params) {
  return request({
    url: BASE_URL + 'getTabImage',
    method: 'get',
    params
  })
}

export function getImageByTabId(params) {
  return request({
    url: BASE_URL + 'getImageByTabId',
    method: 'get',
    params
  })
}

export function addTabImage(data) {
  return request({
    url: BASE_URL + 'addTabImage',
    method: 'post',
    data
  })
}

export function deleteTabImage(data) {
  return request({
    url: BASE_URL + 'deleteTabImage',
    method: 'post',
    data
  })
}

