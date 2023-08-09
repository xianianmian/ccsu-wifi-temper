import service from '@/utils/request'

// 查询电解槽管理列表
export function klhtest(query) {
  return service({
    url: '/fac/klhtest/list',
    method: 'get',
    params: query
  })
}

