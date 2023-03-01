import request from "@/utils/request";

//获取医院列表
export function getHospitalList(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/list",
    method: "get",
    params: data,
  });
}

//修改医院公众号管理状态
export function banHospital(data) {
  return request({
    url: "/hipp/hipp/admin/hospital/update",
    method: "put",
    data,
  });
}
