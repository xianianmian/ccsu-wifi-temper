import request from '@/utils/request'

// 查询电解槽管理列表
export function listCell(query) {
  return request({
    url: '/fac/cell/list',
    method: 'get',
    params: query
  })
}

// 查询电解槽管理详细
export function getCell(electrolyticcellId) {
  return request({
    url: '/fac/cell/' + electrolyticcellId,
    method: 'get'
  })
}

// 新增电解槽管理
export function addCell(data) {
  return request({
    url: '/fac/cell',
    method: 'post',
    data: data
  })
}

// 修改电解槽管理
export function updateCell(data) {
  return request({
    url: '/fac/cell',
    method: 'put',
    data: data
  })
}

// 删除电解槽管理
export function delCell(electrolyticcellId) {
  return request({
    url: '/fac/cell/' + electrolyticcellId,
    method: 'delete'
  })
}
