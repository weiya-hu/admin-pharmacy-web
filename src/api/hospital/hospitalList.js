import request from "@/utils/request";
//获取医院列表
export function getHospitalList(data) {
  return request({
    url: "/hipp/hipp/hospital/list",
    method: "get",
    params: data
  });
}