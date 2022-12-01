import request from "@/utils/request";

// 推荐人注册
export function returnUrl(data) {
  return request({
    url: "/wecom/refereeRegister/returnUrl",
    method: "get",
    params: data,
  });
}

//blob下载
export function downLoadFile(file) {
  let { attachId, attachUrl } = file;
  request({
    url: "/file/file/downloadFileByUrl",
    params: {
      url: btoa(attachUrl),
    },
    method: "get",
    responseType: "blob",
  }).then((res) => {
    if (res.code == 200) {
      const blobUrl = window.URL.createObjectURL(new Blob([res]));
      const a = document.createElement("a");
      const filename = `文件${attachId}`;
      a.href = blobUrl;
      a.download = filename;
      a.target = filename;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    }
  });
}

// 下载合同
export function downloadContract(hippId) {
  request({
    url: "/hipp/hipp/applyinfo/download",
    method: "get",
    params: {
      hippId,
    },
  }).then((res) => {
    if (res.code == 200) {
      console.log(res.data);
      request({
        url: "/file/file/downloadFileByUrl",
        params: {
          url: btoa(res.data),
        },
        method: "get",
        responseType: "blob",
      })
        .then((res) => {
          const blobUrl = window.URL.createObjectURL(new Blob([res]));
          const a = document.createElement("a");
          const filename = `电子签合同`;
          a.href = blobUrl;
          a.download = filename + ".pdf";
          a.target = filename;
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

//获取我的客户
export const getMyCustomer = (params) => {
  return request({
    url: "/hipp/hipp/rel/getMyCustomer",
    method: "get",
    params: params,
  });
};

//获取申请列表
export const getHippList = (params) => {
  return request({
    url: "/hipp/admin/hipp/applyinfo/list",
    method: "get",
    params: params,
  });
};

//获取申请明细列表
export const getHippDetailList = (params) => {
  return request({
    url: "/hipp/admin/hipp/detail/list",
    method: "get",
    params: params,
  });
};

//修改申请明细状态
export const changeDetailStatus = (detailId, status, errReason = null) => {
  return request({
    url: "/hipp/admin/hipp/detail/updateState",
    method: "get",
    params: {
      detailId,
      status,
      errReason,
    },
  });
};

//获取支付凭证审核列表
export const getAuditHippList = (params) => {
  return request({
    url: "/hipp/admin/payOrderList",
    method: "get",
    params,
  });
};

//审核支付凭证
export const auditPayment = (hippId, operation, errReason = null) => {
  return request({
    url: "/hipp/hipp/payinfo/paymentVoucherApproval",
    params: {
      hippId,
      operation,
      errReason,
    },
  });
};
