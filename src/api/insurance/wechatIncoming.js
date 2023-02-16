import request from "@/utils/request";

// 身份证识别
export function idCardOcr(data) {
  return request({
    url: "/pay/ocr/idCardOcr",
    method: "get",
    params: data,
  });
}

//营业执照识别
export function bizLicenseOcr(data) {
  return request({
    url: "/pay/ocr/bizLicenseOcr",
    method: "get",
    params: data,
  });
}

///企业证照识别
export function enterpriseLicenseOCR(data) {
  return request({
    url: "/pay/ocr/enterpriseLicenseOCR",
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

// 区域选择
// 省
export function listProvince() {
  return request({
    url: "system/region/listProvinceByPid",
    method: "get",
  });
}

// 市
export function listCity(data) {
  return request({
    url: "system/region/listCityByPid",
    method: "get",
    params: data,
  });
}

// 获得区列表
export function listArea(data) {
  return request({
    url: "system/region/listAreaByPid",
    method: "get",
    params: data,
  });
}

// 银行对照表
export function bankType(dictType) {
  return request({
    url: "system/dict/data/type/" + dictType,
    method: "get",
  });
}

// 查询银行信息
export function bankInfo(data) {
  return request({
    url: "pay/bankInfo/query",
    method: "get",
    params: data,
  });
}

// 获取关系对照列表
export function listSettlement() {
  return request({
    url: "pay/settlement/rule/list",
    method: "get",
  });
}

// 获取优惠活动
export function listActivity() {
  return request({
    url: "pay/settlement/rule/activity",
    method: "get",
  });
}

// 保存申请信息
export function addWxpayApplyment_api(data) {
  return request({
    url: "/pay/wxpay_applyment/save",
    method: "post",
    data: data,
  });
}

// 获取微信商户签约链接
export function getSignUrl(data) {
  return request({
    url: `/pay/wxpay_applyment/getSignUrl?applyMentId=${data}`,
    method: "get",
  });
}
