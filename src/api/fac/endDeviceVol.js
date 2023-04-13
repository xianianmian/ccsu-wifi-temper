import request from '@/utils/request'

//电压的
export function listEndDeviceVol(query) {
  return request({
    url: '/fac/endDeviceVol/list',
    method: 'get',
    params: query
  })
}

export function getEndDeviceVol(id) {
  return request({
    url: '/fac/endDeviceVol/' + id,
    method: 'get' 
  })
}


export function addEndDeviceVol(data) {
  return request({
    url: '/fac/endDeviceVol',
    method: 'post',
    data: data
  })
}


export function updateEndDeviceVol(data) {
  return request({
    url: '/fac/endDeviceVol',
    method: 'put',
    data: data
  })
}


export function delEndDeviceVol(id) {
  return request({
    url: '/fac/endDeviceVol/' + id,
    method: 'delete'
  })
}
