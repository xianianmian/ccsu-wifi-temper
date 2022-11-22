import request from '@/utils/request'

// 查询车间管理列表
export function listWorkshop(query) {
  return request({
    url: '/fac/workshop/list',
    method: 'get',
    params: query
  })
}

// 查询车间管理详细
export function getWorkshop(workshopId) {
  return request({
    url: '/fac/workshop/' + workshopId,
    method: 'get'
  })
}

// 新增车间管理
export function addWorkshop(data) {
  return request({
    url: '/fac/workshop',
    method: 'post',
    data: data
  })
}

// 修改车间管理
export function updateWorkshop(data) {
  return request({
    url: '/fac/workshop',
    method: 'put',
    data: data
  })
}

// 删除车间管理
export function delWorkshop(workshopId) {
  return request({
    url: '/fac/workshop/' + workshopId,
    method: 'delete'
  })
}
