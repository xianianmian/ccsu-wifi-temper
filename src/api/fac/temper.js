import request from '@/utils/request'

// 查询温度管理列表
export function listTemper(query) {
  return request({
    url: '/fac/temper/list',
    method: 'get',
    params: query
  })
}

// 查询温度管理详细
export function getTemper(temperId) {
  return request({
    url: '/fac/temper/' + temperId,
    method: 'get'
  })
}

// 新增温度管理
export function addTemper(data) {
  return request({
    url: '/fac/temper',
    method: 'post',
    data: data
  })
}

// 修改温度管理
export function updateTemper(data) {
  return request({
    url: '/fac/temper',
    method: 'put',
    data: data
  })
}

// 删除温度管理
export function delTemper(temperId) {
  return request({
    url: '/fac/temper/' + temperId,
    method: 'delete'
  })
}
