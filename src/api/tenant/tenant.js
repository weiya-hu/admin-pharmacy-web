import request from '@/utils/request'

// 租户列表
export function listTenant(data) {
    return request({
        url: '/system/tenant/info/page',
        method: 'get',
        params: data
    })
}
// 创建租户信息
export function saveTenant(data) {
    return request({
        url: '/system/tenant/info/create',
        method: 'post',
        data
    })
}
//修改租户
export function updateTenant(data) {
    return request({
        url: '/system/tenant/info/update',
        method: 'put',
        data
    })
}

// 删除租户信息
export function delTenant(id) {
    return request({
        url: `/system/tenant/info/delete?tenantId=${id}`,
        method: 'delete'
    })
}
// 查看租户详情
export function getTenantDetail(id) {
    return request({
        url: `/system/tenant/info/detail?tenantId=${id}`,
        method: 'get'
    })
}
// 获取租户
export function getTenantById(id) {
    return request({
        url: `/system/tenant/info/get?tenantId=${id}`,
        method: 'get'
    })
}
// 查看租户企业代开发应用授权信息
export function getTenantInfo(id) {
    return request({
        url: `/system/tenant/info/getTenantAgentInfo?tenantId=${id}`,
        method: 'get'
    })
}
