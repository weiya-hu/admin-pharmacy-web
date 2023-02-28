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

//删除菜单
export function deleteCategoryItem(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/category/delete",
    method: "delete",
    params: data
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

//新增富文本信息
export function addEditorItem(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/post/add",
    method: "post",
    data: data
  });
}

//删除富文本信息
export function deleteEditorItem(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/post/delete",
    method: "delete",
    params: data
  });
}

//富文本文件上传
export function editorUploadFile(data) {
  return request({
    url: "/file/file/upload",
    method: "post",
    data: data
  });
}