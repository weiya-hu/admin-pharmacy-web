import request from '@/utils/request'
import {ElNotification} from "element-plus";


// 推荐人注册
export function returnUrl(data) {
    return request({
        url: '/wecom/refereeRegister/returnUrl',
        method: 'get',
        params: data
    })
}

//blob下载

export function downLoadFile(file){

    let {attachId,attachUrl}=file
     request({
        url:"/file/file/downloadFileByUrl",
        params:{
            url:btoa(attachUrl)
        },
        method:'get',
        responseType: 'blob'
    }).then((res)=>{
       if(res.code==200){
           const blobUrl = window.URL.createObjectURL(new Blob([res]))
           const a = document.createElement('a')
           const filename = `文件${attachId}`
           a.href = blobUrl
           a.download = filename
           a.target = filename
           a.click()
           window.URL.revokeObjectURL(blobUrl)
       }

    })
}

export  function  downloadContract(hippId){

     request({
        url: '/hipp/hipp/applyinfo/download',
        method: 'get',
        params: {
            hippId
        }
    }).then(res=>{
        if(res.code==200){
            request({
                url:"/file/file/downloadFileByUrl",
                params:{
                    url:btoa(res.data)
                },
                method:'get',
                responseType: 'blob'
            }).then((res)=>{
                    const blobUrl = window.URL.createObjectURL(new Blob([res]))
                    const a = document.createElement('a')
                    const filename = `电子签合同`
                console.log(blobUrl)
                    a.href = blobUrl
                    a.download = filename+'.pdf'
                    a.target = filename
                    a.click()
                    window.URL.revokeObjectURL(blobUrl)

            }).catch(err=>{
                console.log(err)})
        }
     })

}