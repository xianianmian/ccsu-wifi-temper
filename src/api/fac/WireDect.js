import request from '@/utils/request'

// 查询电解槽故障列表
export function listWireDect(query) {
  return request({
    url: '/fac/WireDect',
    method: 'get',
    params: query
  })
}
// 查询电解槽故障详细
export function getWireDect(id) {
  return request({
    url: '/fac/WireDect/' + id,
    method: 'get'
  })
}

// 新增电解槽故障
export function addWireDect(data) {
  return request({
    url: '/fac/WireDect',
    method: 'post',
    data: data
  })
}

// 修改电解槽故障
export function updateWireDect(data) {
  return request({
    url: '/fac/WireDect',
    method: 'put',
    data: data
  })
}

// 删除电解槽故障
export function delWireDect(id) {
  return request({
    url: '/fac/WireDect/' + id,
    method: 'delete'
  })
}
