import request from '@/utils/request'

// 查询版本列表
export function versionList_api( params ) {
    return request({
        url: '/system/version/info/get',
        method: 'get',
        params
    })
}

// 新增版本信息
export function versionAdd_api( data ) {
    return request({
        url: '/system/version/info/create',
        method: 'post',
        data
    })
}

// 删除版本信息
export function versionDelete_api( params ) {
    return request({
        url: '/system/version/info/delete',
        method: 'delete',
        params
    })
}

// 更新版本信息
export function versionUpdate_api( data ) {
    return request({
        url: '/system/version/info/update',
        method: 'put',
        data
    })
}
