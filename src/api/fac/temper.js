import request from '@/utils/request'

// 查询温度采集列表
export function listTemper(query) {
  return request({
    url: '/fac/temper/list',
    method: 'get',
    params: query
  })
}

// 查询温度采集详细
export function getTemper(temperId) {
  return request({
    url: '/fac/temper/' + temperId,
    method: 'get'
  })
}

// 新增温度采集
export function addTemper(data) {
  return request({
    url: '/fac/temper',
    method: 'post',
    data: data
  })
}

// 修改温度采集
export function updateTemper(data) {
  return request({
    url: '/fac/temper',
    method: 'put',
    data: data
  })
}

// 删除温度采集
export function delTemper(temperId) {
  return request({
    url: '/fac/temper/' + temperId,
    method: 'delete'
  })
}
