import request from '@/utils/request'

// 查询温度数据测试列表
export function listTempertest(query) {
  return request({
    url: '/data/tempertest/list',
    method: 'get',
    params: query
  })
}

// 查询温度数据测试详细
export function getTempertest(id) {
  return request({
    url: '/data/tempertest/' + id,
    method: 'get'
  })
}

// 新增温度数据测试
export function addTempertest(data) {
  return request({
    url: '/data/tempertest',
    method: 'post',
    data: data
  })
}

// 修改温度数据测试
export function updateTempertest(data) {
  return request({
    url: '/data/tempertest',
    method: 'put',
    data: data
  })
}

// 删除温度数据测试
export function delTempertest(id) {
  return request({
    url: '/data/tempertest/' + id,
    method: 'delete'
  })
}
