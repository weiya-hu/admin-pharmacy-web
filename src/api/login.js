import request from "@/utils/request";

// 登录方法
export function login(data) {
  return request({
    url: "/auth/login",
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  });
}

// 注册方法
export function register(data) {
  return request({
    url: "/register",
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  });
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: "/auth/getInfo",
    method: "get",
  });
}

// 退出方法
export function logout() {
  return request({
    url: "/auth/logout",
    method: "DELETE",
  });
}

// 微信扫码登录
export function wechatLogin(data) {
  return request({
    url: "/auth/wechatLogin",
    method: "get",
    params: data,
  });
}

// 企微扫码
export function oauthLogin(data) {
  return request({
    url: "/auth/oauthLogin",
    method: "get",
    params: data,
  });
}
