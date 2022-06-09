<template>
  <div class="app-container" id="bodyDiv">
    <el-button
        @click="btnclick"
    >
      hahah
    </el-button>
  </div>
</template>

<script setup name="Config">
import ZhihuiEditor from 'zhihui-editor-sdk'
import {onMounted, ref} from "vue";
const option = {
  appid: 'commonIframe',
  channel: 'commonIframe',
  stamp: 'testUserId',
  timestamp: 1654743233248,
  scope: 'all', // 注意此处的scope是按照字符串传入
  templateId: '6254db7bccc34b01db8666ec',
  from: 'material',
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjczODAzZTE1ZGNhOTAzNjY1ZDU2ZGIiLCJuYW1lIjoiY29tbW9uSWZyYW1ldGVzdFVzZXJJZCIsImF2YXRhciI6IiIsInBpZCI6IjYyNzM3N2QyYmU4MDI4MGFmZTVlOGQzZiIsImNvbnRhY3QiOlt7Il9pZCI6IjYyNzM4MDNlMTVkY2E5MDM2NjVkNTZkZSIsImNoYW5uZWwiOiJjb21tb25JZnJhbWUiLCJzdGFtcCI6InRlc3RVc2VySWQiLCJwcm9qZWN0IjoiNjI3Mzc3ZDJiZTgwMjgwYWZlNWU4ZDNmIn1dLCJjcmVhdGVkQXQiOiIyMDIyLTA1LTA1VDA3OjQzOjU4LjU2NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA2LTA5VDAyOjQ0OjAwLjA2MVoiLCJpYXQiOjE2NTQ3NDMzMDYsImV4cCI6MTY1NzMzNTMwNn0.JhcfkEHhm0WTpxkp-qLTOEU2hCmo6pSs8Cfiy2mdtqo",
  styleConfig:{
    hasBackground: false,
    hasQuitButton: false,
    parentDomId: 'bodyDiv',
    iframeStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10000,
      display: 'block',
      width: '100%',
      height: '100%',
  }
}}
const zhihuiEditor = new ZhihuiEditor(option)
const btnclick = ()=>{
  console.log(123)
  zhihuiEditor.openIframe()
}
</script>
