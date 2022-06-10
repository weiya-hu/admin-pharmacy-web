<template>
  <div class="app-container" id="bodyDiv">
    <el-button @click="openClick">调起智绘iframe</el-button>
    <el-button @click="closeClick">关闭智绘iframe</el-button>

  </div>
</template>

<script setup name="Tenant">
import ZhihuiEditor from 'zhihui-editor-sdk';
let header = {
  wmx:'www'
}
let option = {
  system: 'test',
  appid: 'apollo',
  channel: 'commonIframe',
  stamp: 'testUserId',
  timestamp: 1629711353224,
  sig: '525168cbc665e0443225725ea5aa8a5d751346a400dcfc184ff98d42df5e37ac',
  templateId: '60f0e9e54a44ad541160ba1b',
  from: 'template',
  leftConfig: {
    system: {
      hasSystemTemplate: true,
      hasTeamTemplate: false,
      hasSystemImg: true,
      hasSystemCommonMaterial: true,
      hasTeamCommonMaterial: true,
      hasSystemPeopleMaterial: true,
      hasTeamPeopleMaterial: true,
      hasSystemBgMaterial: true,
      hasTeamBgMaterial: true,
      hasSystemText: true,
      hasSystemUpload: true,
      hasSystemCache: true,
    },
    user: [
      {
        menuName: '二维码',
        menuIcon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fku.90sjimg.com%2Felement_pic%2F01%2F40%2F63%2F34573d0a8594022.jpg&refer=http%3A%2F%2Fku.90sjimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1657441993&t=2bb0acfcf7ae6dbb65b469cf3cb61f91',
        menuIconActive: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F01%2F37%2F17%2F33573c3f244e076.jpg&refer=http%3A%2F%2Fku.90sjimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1657442028&t=4be97ae97fc9063bf2abc37d4cbf74cb',
        type: 'showAll',
        dataConfig: {
          url: 'https://taishan.qq.com/api/ape/search',
          // url: 'http://192.168.123.96:8080/wecom/poster/queryQrCodeList',
          headers: header,
        }
      },
    ]
  },
  styleConfig: {
    hasBackground: false,
    hasQuitButton: false,
    parentDomId: 'bodyDiv',
    iframeStyle: {
      position: 'absolute',
      left: 0,
      zIndex: 10000,
      display: 'block',
      width: '100%',
      height: '100%',
    },
  },
  headConfig: {
    logoUrl: 'xxx',
    downloadName: '保存',
    onClickDownload: (res) => {
      console.log(res)
    },
    isDownloadImg: true,
  },
  loadingConfig: {
    logoUrl: 'http://localhost/src/assets/logo/logo.png'
  },
  rightConfig:{
    canvas:{
      canvasSize: true,
      canvasBg: true,
      canvasFontAdd:true,
      canvasImgAdd: true
    },
    text:{},
    img:{},
    group:{},
    common:{},
  },
  templateDataConfig:[

  ]
};
const zhihuiEditor = new ZhihuiEditor(option)
const openClick = ()=>{
  console.log(123)
  zhihuiEditor.openIframe()
}
const closeClick = ()=>{
  zhihuiEditor.closeIframe()
}
</script>
