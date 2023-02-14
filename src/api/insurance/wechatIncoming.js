import request from "@/utils/request";
// 身份证识别
export function idCardOcr(data) {
    return request({
        url: "/pay/ocr/idCardOcr",
        method: "get",
        params: data,
    });
}
