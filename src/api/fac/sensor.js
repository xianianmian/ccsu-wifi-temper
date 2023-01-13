import request from '@/utils/request'

// 查询传感器数据列表
export function listSensor(query) {
  return request({
    url: '/fac/sensor/list',
    method: 'get',
    params: query
  })
}

// 查询传感器数据详细
export function getSensor(sensorDataId) {
  return request({
    url: '/fac/sensor/' + sensorDataId,
    method: 'get'
  })
}

// 新增传感器数据
export function addSensor(data) {
  return request({
    url: '/fac/sensor',
    method: 'post',
    data: data
  })
}

// 修改传感器数据
export function updateSensor(data) {
  return request({
    url: '/fac/sensor',
    method: 'put',
    data: data
  })
}

// 删除传感器数据
export function delSensor(sensorDataId) {
  return request({
    url: '/fac/sensor/' + sensorDataId,
    method: 'delete'
  })
}
