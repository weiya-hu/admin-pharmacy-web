import request from "@/utils/request";
import axios from "axios";
import { getToken } from "@/utils/auth";

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
    method: "post",
    data: data
  });
}

//导出excel文件
export function exportExcelFile(data) {
  return axios.get(`${import.meta.env.VITE_APP_BASE_API}/hipp/hipp/medicalInstitutions/excel`, {
    params: data,
    headers: {
      "Authorization": "Bearer " + getToken(),
      "Content-Type": "application/json-patch+json"
    },
    responseType: "arraybuffer"
  });

}