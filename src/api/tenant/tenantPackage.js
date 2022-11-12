import request from '@/utils/request'
// 查询租户套餐列表
export function listPackage(query) {
    return request({
        url: '/system/tenant/package/page',
        method: 'get',
        params: query
    })
}

// 查询租户套餐详细
export function getPackage(tenantPackageId) {
    return request({
        url: `/system/tenant/package/get/?id=${tenantPackageId}`,
        method: 'get',

    })
}

// 新增租户套餐
export function addPackage(data) {
    return request({
        url: '/system/tenant/package/create',
        method: 'post',
        data: data
    })
}

// 修改租户套餐
export function updatePackage(data) {
    return request({
        url: '/system/tenant/package/update',
        method: 'put',
        data: data
    })
}

// 删除租户套餐
export function delPackage(tenantPackageId) {
    return request({
        url: `/system/tenant/package/delete/?id=${tenantPackageId}`,
        method: 'delete'
    })
}

// 只包含被开启的租户套餐，主要用于前端的下拉选项
export function getSimpleList() {
    return request({
        url: '/system/tenant/package/get-simple-list',
        method: 'get'
    })
}
