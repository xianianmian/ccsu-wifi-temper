import request from '@/utils/request'

// 查询热电偶列表
export function listThermocouple(query) {
  return request({
    url: '/fac/thermocouple/list',
    method: 'get',
    params: query
  })
}

// 查询热电偶详细
export function getThermocouple(thermocoupleId) {
  return request({
    url: '/fac/thermocouple/' + thermocoupleId,
    method: 'get'
  })
}

// 新增热电偶
export function addThermocouple(data) {
  return request({
    url: '/fac/thermocouple',
    method: 'post',
    data: data
  })
}

// 修改热电偶
export function updateThermocouple(data) {
  return request({
    url: '/fac/thermocouple',
    method: 'put',
    data: data
  })
}

// 删除热电偶
export function delThermocouple(thermocoupleId) {
  return request({
    url: '/fac/thermocouple/' + thermocoupleId,
    method: 'delete'
  })
}
