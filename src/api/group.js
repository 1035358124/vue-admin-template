import request from '@/utils/request'

const BASE_URL = '/web/group/'

export function addGroup(data) {
  return request({
    url: BASE_URL + 'add',
    method: 'post',
    data
  })
}

export function deleteGroup(data) {
  return request({
    url: BASE_URL + 'delete',
    method: 'post',
    data
  })
}

export function updateGroup(data) {
  return request({
    url: BASE_URL + 'update',
    method: 'post',
    data
  })
}

export function getGroup() {
  return request({
    url: BASE_URL + 'get',
    method: 'get'
  })
}

export function getGroupNotTab(params) {
  return request({
    url: BASE_URL + 'getTabByGroupId',
    method: 'get',
    params
  })
}

export function addGroupTab(data) {
  return request({
    url: BASE_URL + 'addGroupTab',
    method: 'post',
    data
  })
}

export function getGroupTab(params) {
  return request({
    url: BASE_URL + 'getGroupTab',
    method: 'get',
    params
  })
}

export function deleteGroupTab(data) {
  return request({
    url: BASE_URL + 'deleteGroupTab',
    method: 'post',
    data
  })
}

