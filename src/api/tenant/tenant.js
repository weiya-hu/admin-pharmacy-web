import request from '@/utils/request'

// 租户信息
// 禁用租户
export function disableTenant(data) {
    return request({
        url: '/system/system/tenant/disable/' + data,
        method: 'post',
    })
}
// 启用租户
export function enableTenant(data) {
    return request({
        url: '/system/system/tenant/enable/' + data,
        method: 'post'
    })
}
// 租户列表
export function listTenant(data) {
    return request({
        url: '/system/system/tenant/list',
        method: 'get',
        params: data
    })
}
// 保存租户信息
export function saveTenant() {
    return request({
        url: '/system/system/tenant/save',
        method: 'post',
    })
}