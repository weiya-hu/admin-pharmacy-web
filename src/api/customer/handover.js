import request from '@/utils/request'
import qs from "qs";

// 获取有客户的销售人员列表
export function existsCustomerSalesUserList(query) {
    return request({
        url: '/hipp/hipp/rel/existsCustomerSalesUserList',
        method: 'get',
        params: query
    })
}

// 获取交替成员列表
export function getHippServiceAllAddCode(query) {
    return request({
        url: '/wecom/corpQrAddCode/getHippServiceAllAddCode',
        method: 'get',
        params: query
    })
}

// 获取销售和对应客户列表
export function getSaleAndCustomerInfo(query) {
    return request({
        url: '/hipp/hipp/rel/getSaleAndCustomerInfo',
        method: 'get',
        params: query
    })
}

// 移交客户保存
export function saveOrgRel(data) {
    return request({
        url: '/hipp/hipp/rel/saveOrgRel',
        method: 'post',
        data: data
    })
}
