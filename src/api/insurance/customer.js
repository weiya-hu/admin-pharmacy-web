import request from '@/utils/request'

// 推荐人注册
export function returnUrl(data) {
    return request({
        url: '/wecom/refereeRegister/returnUrl',
        method: 'get',
        params: data
    })
}