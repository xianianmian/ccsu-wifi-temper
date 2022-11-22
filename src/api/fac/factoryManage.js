import request from '@/utils/request'

// 查询工厂管理列表
export function listFactoryManage(query) {
  return request({
    url: '/fac/factoryManage/list',
    method: 'get',
    params: query
  })
}

// 查询工厂管理详细
export function getFactoryManage(factoryId) {
  return request({
    url: '/fac/factoryManage/' + factoryId,
    method: 'get'
  })
}

// 新增工厂管理
export function addFactoryManage(data) {
  return request({
    url: '/fac/factoryManage',
    method: 'post',
    data: data
  })
}

// 修改工厂管理
export function updateFactoryManage(data) {
  return request({
    url: '/fac/factoryManage',
    method: 'put',
    data: data
  })
}

// 删除工厂管理
export function delFactoryManage(factoryId) {
  return request({
    url: '/fac/factoryManage/' + factoryId,
    method: 'delete'
  })
}
