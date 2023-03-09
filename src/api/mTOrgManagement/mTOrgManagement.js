import request from "@/utils/request";
import axios from "axios";
import { getToken } from "@/utils/auth";

//添加医药机构管理
export function addOreManage(data) {
  return request({
    url: "/hipp/hipp/pharmacy/add",
    method: "post",
    data: data
  });
}

//删除医药机构管理
export function deleteOreManage(data) {
  return request({
    url: "/hipp/hipp/pharmacy/delete",
    method: "get",
    params: data
  });
}

//获取医药机构管理详情
export function getOreManageDetail(data) {
  return request({
    url: "/hipp/hipp/pharmacy/detail",
    method: "get",
    params: data
  });
}

//获取医药机构管理列表
export function getOreManageList(data) {
  return request({
    url: "/hipp/hipp/pharmacy/list",
    method: "get",
    params: data
  });
}

//更新医药机构信息
export function updateOreManageDetail(data) {
  return request({
    url: "/hipp/hipp/pharmacy/update",
    method: "post",
    data: data
  });
}

//导出excel文件
export function exportExcelFile(data) {
  return axios.get(`${import.meta.env.VITE_APP_BASE_API}/hipp/hipp/pharmacy/excel`, {
    params: data,
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json-patch+json"
    },
    responseType: "arraybuffer"
  });

}