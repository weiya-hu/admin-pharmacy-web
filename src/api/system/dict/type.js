import request from '@/utils/request'

// 查询字典类型列表
export function listType(query) {
    return request({
        url: '/system/sp-modules-system/dictionary/list',
        method: 'get',
        params: query
    })
}

// 查询字典类型详细
export function getType(dictId) {
    return request({
        url: '/system/sp-modules-system/dictionary/' + dictId,
        method: 'get'
    })
}

// 新增字典类型
export function addType(data) {
    return request({
        url: '/system/sp-modules-system/dictionary',
        method: 'post',
        data: data
    })
}

// 修改字典类型
export function updateType(data) {
    return request({
        url: '/system/sp-modules-system/dictionary',
        method: 'put',
        data: data
    })
}

// 删除字典类型
export function delType(dictId) {
    return request({
        url: '/system/sp-modules-system/dictionary/' + dictId,
        method: 'delete'
    })
}

// 刷新字典缓存
export function refreshCache() {
    return request({
        url: '/system/dict/type/refreshCache',
        method: 'delete'
    })
}

// 获取字典选择框列表
export function optionselect() {
    return request({
        url: '/system/dict/type/optionselect',
        method: 'get'
    })
}