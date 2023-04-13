import request from '@/utils/request'

// 查询电解槽故障列表
export function listNetWorkDect(query) {
  return request({
    url: '/fac/NetWorkDect/',
    method: 'get',
    params: query
  })
}
// 查询电解槽故障详细
export function getNetWorkDect(id) {
  return request({
    url: '/fac/NetWorkDect/' + id,
    method: 'get'
  })
}

// 新增电解槽故障
export function addNetWorkDect(data) {
  return request({
    url: '/fac/NetWorkDectl',
    method: 'post',
    data: data
  })
}

// 修改电解槽故障
export function updateNetWorkDect(data) {
  return request({
    url: '/fac/NetWorkDect',
    method: 'put',
    data: data
  })
}

// 删除电解槽故障
export function delNetWorkDect(id) {
  return request({
    url: '/fac/NetWorkDect/' + id,
    method: 'delete'
  })
}
