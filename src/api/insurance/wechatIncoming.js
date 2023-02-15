import request from "@/utils/request";

// 身份证识别
export function idCardOcr(data) {
  return request({
    url: "/pay/ocr/idCardOcr",
    method: "get",
    params: data,
  });
}

//  获取
export function getApplymentList(data) {
  return request({
    url: "/pay/wxpay_applyment/list",
    method: "get",
    params: data,
  });
}
