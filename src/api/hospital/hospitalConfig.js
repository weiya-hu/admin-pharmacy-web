import request from "@/utils/request";

//获取医院功能菜单
export function getHospitalCategoryTree(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/category/tree",
    method: "get",
    params: data
  });
}

//创建菜单
export function addCategory(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/category/add",
    method: "post",
    data: data
  });
}

//查询富文本信息列表
export function getEditorList(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/post/list",
    method: "get",
    params: data
  });
}
//获取内容分类详细信息
export function getCategoryDetail(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/category/detail",
    method: "get",
    params: data
  });
}