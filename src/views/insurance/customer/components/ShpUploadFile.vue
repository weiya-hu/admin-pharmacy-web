<template>
  <div>
    <el-upload
      v-loading="loading"
      ref="upload"
      :action="hostUrl"
      :accept="exnameList.join(',')"
      :auto-upload="true"
      :data="upData"
      :limit="limit"
      :on-change="upChange"
      :headers="hreders"
      :on-error="upError"
      :on-exceed="handleExceed"
      :on-success="upSuccess"
      :on-preview="PictureCardPreview"
      :on-remove="onRemove"
      :show-file-list="showFileList && showFile"
      class="my_upload flexl"
      :class="`my_upload${flag}`"
      :multiple="multiple"
      list-type="picture-card"
    >
      <el-icon class="form-img">
        <Plus/>
      </el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image"  style="width: 100%;object-fit: contain;"/>
    </el-dialog>
  </div>
  
</template>
<script setup lang="ts">
/**
 * @description 上传文件组件
 * @params modelValue?: string//文件名
 * @params exnameList?: string[] //支持的文件格式数组,不传默认图片格式['.jpg', '.png', '.BMP', ]
 * @params maxSize?: number //最大尺寸 单位M,不传默认5M
 * @params multiple?: boolean //是否支持多文件上传,不传默认不支持
 * @params limit?: number //上传的文件最大数,不传默认上传一张
 */
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue';

import {
  UploadFile,
  ElMessage,
} from 'element-plus'
import { getToken } from "../../../../utils/auth";

const hreders = ref({Authorization:"Bearer " + getToken()})
const props = withDefaults(
  defineProps<{
    modelValue?: string //文件名
    exnameList?: string[] //支持的文件格式数组
    maxSize?: number //最大尺寸 单位M
    showFileList?: boolean //是否显示上传的文件
    multiple?: boolean //是否支持多文件上传
    limit?: number //上传的文件最大数
    flag?: string //标识当前的dom
  }>(),
  {
    modelValue: '',
    exnameList: () => ['.jpg', '.png', '.BMP', ],
    maxSize: 5,
    showFileList: true,
    multiple: false,
    limit: 1,
    flag:''
  }
)
//文件名同步
const emit = defineEmits(['update:modelValue', 'success'])
let a=0
const upload = ref() //上传组件ref
const showFile = ref(true)
const loading = ref(false)

const dialogVisible = ref()
const dialogImageUrl = ref()

const hostUrl = ref(`${window.location.protocol}//${window.location.host}${process.env.NODE_ENV==='development'?'/dev-api':'/prod-api'}/pay/media/wxPictureUpload`)
const upData = ref()
const upChange = async (file: UploadFile, list: UploadFile[]) => {
  // console.log(file.name)
  //上传组件状态改变时 添加时效验文件格式大小
  console.log(list.length)
  if (!file.name || file.status === 'fail') {
    return
  }
  // nowFile.value = file
  const tmpcnt = file.name.lastIndexOf('.')
  const exname = file.name.substring(tmpcnt)
  const names = props.exnameList
  if (!names.includes(exname)) {
    ElMessage.error(`请上传${names.join(',')}格式的文件`)
    upload.value.handleRemove(file)
  } else if (file.size && file.size / 1024 / 1024 > props.maxSize) {
    ElMessage.error(`请上传小于${props.maxSize}M的文件`)
    upload.value.handleRemove(file)
  }else{
    return 
  }
}


const upError = (error: any) => {
  console.log(error)
  showFile.value = false
}

const handleExceed = (files: any) => {
  ElMessage.error(`最多上传${props.limit}张图片`)
}

const upSuccess=(res: any, uploadFile: UploadFile, uploadFiles: UploadFile[])=>{
  if(res.code == 200){
    (!props.multiple) ? (()=>{
      emit('update:modelValue', res.data[0].url)
      emit('success',res.data.url)
    })() :(()=>{
      let urls = []
      uploadFiles.forEach(m=>{
        if(m.response!.code == 200){
          urls.push(m.response!.data[0].url)
        }else{
          ElMessage.error(res.msg)
          upload.value.handleRemove(m)
        }
      })
      emit('update:modelValue', urls)
      emit('success',urls)
    })()
  }else{
    ElMessage.error(res.msg)
    upload.value.handleRemove(uploadFile)
  }
}

const PictureCardPreview = (uploadFile: UploadFile)=>{
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const onRemove = (uploadFile: UploadFile, uploadFiles: UploadFile[])=>{
  console.log(uploadFile,uploadFiles)
  let urls = []
  uploadFiles.forEach(m=>{
    if(m.response!.code == 200){
      urls.push(m.response!.data[0].url)
    }else{
      ElMessage.error(res.msg)
      upload.value.handleRemove(m)
    }
  })
  emit('update:modelValue', urls)
  emit('success',urls)
}



</script>
<style scoped lang="scss">
.my_upload {
  .avatar-uploader-icon{
    width: 60px;
    height: 60px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
  }
  .form-img {
    width: 60px;
    height: 60px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
  }

    :deep(.el-form-item__label) {
      font-weight: 700;
    }
    :deep(.el-upload--picture-card) {
      --el-upload-picture-card-size: 60px;
      border: 0;
      i {
        font-size: 18px;
      }
    }
    :deep(.el-upload-list--picture-card) .el-upload-list__item {
      width: 60px;
      height: 60px;
    }
}
</style>
