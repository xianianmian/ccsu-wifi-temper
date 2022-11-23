import request from '@/utils/request'

// 查询生产车间列表
export function listWorkshop(query) {
  return request({
    url: '/fac/workshop/list',
    method: 'get',
    params: query
  })
}

// 查询生产车间详细
export function getWorkshop(workshopId) {
  return request({
    url: '/fac/workshop/' + workshopId,
    method: 'get'
  })
}

// 新增生产车间
export function addWorkshop(data) {
  return request({
    url: '/fac/workshop',
    method: 'post',
    data: data
  })
}

// 修改生产车间
export function updateWorkshop(data) {
  return request({
    url: '/fac/workshop',
    method: 'put',
    data: data
  })
}

// 删除生产车间
export function delWorkshop(workshopId) {
  return request({
    url: '/fac/workshop/' + workshopId,
    method: 'delete'
  })
}
