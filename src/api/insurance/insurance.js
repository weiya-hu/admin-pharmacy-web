import request from "@/utils/request";
import { ElLoading } from "element-plus";
import { nextTick, ref } from "vue";

// 推荐人注册
export function returnUrl(data) {
  return request({
    url: "/wecom/refereeRegister/returnUrl",
    method: "get",
    params: data,
  });
}

//二进制文件流下载
export function downLoadFile(file, type = "合同照片") {
  let { attachId, attachUrl } = file;
  const loadingInstance1 = ElLoading.service({
    fullscreen: true,
    text: "下载中",
    lock: true,
    target: ".el-image-viewer__wrapper",
    background: "rgba(0,0,0,0.8)",
  });
  request({
    url: "/file/file/downloadFileByUrl",
    params: {
      url: btoa(attachUrl),
    },
    method: "get",
    responseType: "blob",
  })
    .then((res) => {
      const blobUrl = window.URL.createObjectURL(new Blob([res]));
      let a = document.createElement("a");
      const filename = `${type}${attachId}.png`;
      a.href = blobUrl;
      a.download = filename;
      a.target = filename;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      loadingInstance1.close();
    })
    .catch(() => {
      loadingInstance1.close();
    });
}

// 下载合同
export function downloadContract(file, offline = true) {
  //线上
  if (!offline) {
    const loadingInstance2 = ElLoading.service({
      fullscreen: true,
      text: "下载中，文件较大可能有延迟，请不要重复点击",
      lock: true,
      background: "rgba(0,0,0,0.8)",
    });
    request({
      url: "/hipp/hipp/applyinfo/download",
      method: "get",
      params: {
        hippId: file.hippId,
      },
    }).then((res) => {
      if (res.code == 200) {
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
            const filename = `签约合同`;
            a.href = blobUrl;
            a.download = filename + ".pdf";
            a.target = filename;
            a.click();
            loadingInstance2.close();
          })
          .catch(() => {
            loadingInstance2.close();
          });
      }
    });
  }
  //线下
  else {
    const loadingInstance2 = ElLoading.service({
      fullscreen: true,
      text: "下载中",
      lock: true,
      background: "rgba(0,0,0,0.8)",
    });
    let arr = [];
    for (let i = 0; i < file.offLineContractFile.length; i++) {
      let promise = request({
        url: "/file/file/downloadFileByUrl",
        params: {
          url: btoa(file.offLineContractFile[i].attachUrl),
        },
        method: "get",
        responseType: "blob",
      });
      arr.push(promise);
    }

    Promise.all(arr)
      .then((values) => {
        for (let i = 0; i < values.length; i++) {
          const blobUrl = window.URL.createObjectURL(new Blob([i]));
          const a = document.createElement("a");
          const filename = `签约合同`;
          a.href = blobUrl;
          a.download = filename + ".pdf";
          a.target = filename;
          a.click();
          window.URL.revokeObjectURL(blobUrl);
          if (i == values.length - 1) {
            setTimeout(() => {
              loadingInstance2.close();
            }, values.length * 700);
          }
        }
      })
      .catch((err) => {
        loadingInstance2.close();
      });
  }
}

export function isPDF(str = "") {
  return str[str.lastIndexOf(".") + 1] == "p";
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

//获取电子签平台url
export const getEssbasicOrg = () => {
  return request({
    url: "/hipp/hipp/applyinfo/initEssbasicOrg",
    method: "get",
  });
};

