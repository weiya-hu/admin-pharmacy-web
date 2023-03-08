import request from "@/utils/request";

//获取bannner图列表数据
export function getBannerList(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/banner/list",
    method: "get",
    params: data
  });
}

//新增banner图信息
export function addBannerInfo(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/banner/add",
    method: "post",
    data: data
  });
}

//删除banner图信息
export function deleteBannerInfo(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/banner/delete",
    method: "delete",
    params: data
  });
}

//获取banner图信息详细信息
export function getBannerInfoDetail(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/banner/detail",
    method: "get",
    params: data
  });
}

//修改banner图信息
export function updateBannerInfo(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/banner/update",
    method: "put",
    data: data
  });
}