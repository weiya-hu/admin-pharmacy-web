import request from "@/utils/request";

//添加医院机构管理
export function addOreManage(data) {
  return request({
    url: "/hipp/hipp/medicalInstitutions/add",
    method: "post",
    data: data
  });
}

//删除医院机构管理
export function deleteOreManage(data) {
  return request({
    url: "/hipp/hipp/medicalInstitutions/delete",
    method: "get",
    params: data
  });
}

//获取医院机构管理详情
export function getOreManageDetail(data) {
  return request({
    url: "/hipp/hipp/medicalInstitutions/detail",
    method: "get",
    params: data
  });
}

//获取医院机构管理列表
export function getOreManageList(data) {
  return request({
    url: "/hipp/hipp/medicalInstitutions/list",
    method: "get",
    params: data
  });
}

//更新医院机构信息
export function updateOreManageDetail(data) {
  return request({
    url: "/hipp/hipp/medicalInstitutions/update",
    method: "普通、",
    data: data
  });
}
