<template>
  <div class="supply-info wrapper">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>补充材料</span>
          <span class="desc"
          >根据实际审核情况，会额外要求商家提供指定的补充资料。</span
          >
        </div>
      </template>
      <el-form model="formValue" :rules="rules">
        <el-form-item prop="legalPersonCommitment" class="flexl">
          <template #label>
            <labelExplain label="法人开户承诺函">
              <template #explain>
                <div>请上传法定代表人或负责人亲笔签署的开户承诺函扫描件（
                  <el-link type="primary" href='#' @click="downloadTemplete">下载模板</el-link>
                  ）。亲笔签名承诺函内容清晰可见，不得有涂污，破损，字迹不清晰现象。
                </div>
              </template>
            </labelExplain>
          </template>
          <ShpUploadFile v-model="formValue.legalPersonCommitment" @success="upSuccess"></ShpUploadFile>
        </el-form-item>
        <el-form-item prop="legalPersonVideo" class="flexl">
          <template #label>
            <labelExplain label="法人开户意愿视频">
              <template #explain>
                <div>1、建议法人按如下话术录制“法人开户意愿视频”：
我是#公司全称#的法定代表人（或负责人），特此证明本公司申请的商户号为我司真实意愿开立且用于XX业务（或XX服务）。我司现有业务符合法律法规及腾讯的相关规定。
                </div>
                <div>2、支持上传5M内的视频，格式可为avi、wmv、mpeg、mp4、mov、mkv、flv、f4v、m4v、rmvb；</div>
              </template>
            </labelExplain>
          </template>
          <ShpUploadFile v-model="formValue.legalPersonVideo" :exnameList="['.avi','.wmv','.mpeg','.mp4','.mov','.mkv','.flv','.f4v','.m4v','.rmvb']"></ShpUploadFile>
        </el-form-item>
        <el-form-item prop="businessAdditionPics" class="flexl">
          <template #label>
            <labelExplain label="补充材料">
              <template #explain>
                <div>最多可上传5张照片</div>
              </template>
            </labelExplain>
          </template>
          <ShpUploadFile v-model="formValue.businessAdditionPics" :limit="5" :multiple="true" flag="businessAdditionPics"></ShpUploadFile>
        </el-form-item>
        <el-form-item prop="businessAdditionMsg" class="flexl">
          <template #label>
            <labelExplain label="补充说明">
              <template #explain>
                <div>512字以内</div>
              </template>
            </labelExplain>
          </template>
          <ShpUploadFile  v-model="formValue.businessAdditionMsg"></ShpUploadFile>
        </el-form-item>
        <div @click="foem">fgdfg</div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { QuestionFilled, InfoFilled } from '@element-plus/icons-vue'
import labelExplain from './labelExplain.vue'
import ShpUploadFile from './ShpUploadFile.vue'
import { downloadGet } from '../../../../utils/request'

const formValue = ref({
  legalPersonCommitment:'',
  legalPersonVideo:'',
  businessAdditionPics:[],
  businessAdditionMsg:''
})

const rules = ref()

const upSuccess = ()=>{
  console.log(formValue.value)
}

const downloadTemplete = ()=>{
  console.log(454646);
  downloadGet('https://oss.cloud.shanhaiping.com/test/123333/22222/2023/02/10/18/63e617a82e80c92fb646ae39.pdf','开户承诺函.pdf')
}

const foem =()=>{
  console.log(formValue.value)
}
</script>

<style lang="scss" scoped>
.supply-info{
  .box-card { 
    width: 650px;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 24px;
      font-weight: bold;

      .desc {
        font-weight: normal;
        font-size: 12px;
        width: 350px;
        margin-left: 40px;
      }
    }
    
  }
  :deep(.download-templete){
      color: var(--el-button-bg-color);
      cursor: pointer;
      :hover{
        color:var(--el-button-hover-text-color);
        text-decoration: underline;
        text-decoration-color: var(--el-button-hover-text-color);
      }
    }
}

</style>