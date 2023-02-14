<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="white-space: nowrap;">结算规则</span>
          <span class="desc"
          >请填写商家的结算费率规则、特殊资质等信息。</span
          >
        </div>
      </template>
      <el-form ref="settlementRef" model="form" :rules="rules">
        <el-form-item prop="settlementId">
          <template #label>
            <labelExplain label="入驻结算规则ID">
              <template #explain>
                <div>请选择结算规则ID，详细参见<el-link href="https://kf.qq.com/faq/220228IJb2UV220228uEjU3Q.html" type="primary" target="_blank">费率结算规则对照表</el-link>，示例值：719</div>
              </template>
            </labelExplain>
          </template>
          <el-input maxlength="3" v-model="form.settlementId" placeholder="请输入入驻结算规则ID" />
        </el-form-item>

        <el-form-item prop="qualificationType">
          <template #label>
            <labelExplain label="所属行业">
              <template #explain>
                <div>填写指定行业名称，详细参见<el-link href="https://kf.qq.com/faq/220228IJb2UV220228uEjU3Q.html" type="primary" target="_blank">费率结算规则对照表</el-link>，示例值：餐饮</div>
              </template>
            </labelExplain>
          </template>
          <el-input maxlength="128" v-model="form.qualificationType" placeholder="请输入所属行业" />
        </el-form-item>

        <el-form-item prop="qualifications">
          <template #label>
            <labelExplain label="特殊资质图片">
              <template #explain>
                <div>根据所属行业的特殊资质要求提供，详情查看<el-link href="https://kf.qq.com/faq/220228IJb2UV220228uEjU3Q.html" type="primary" target="_blank">费率结算规则对照表</el-link>，示例值：0P3ng6KTIW4-Q_l2FjmFJBZR9FwczhJehHhAZN6BKXQPcs-VvdSo</div>
              </template>
            </labelExplain>
          </template>
          <el-upload
              v-model:file-list="qFileList"
              :action="uploadData.uploadUrl"
              :headers="{'Authorization':uploadData.token}"
              method:="get"
              accept="image/*"
              multiple
              :limit="5"
              :show-file-list="true"
              list-type="picture-card"
              :on-success="qHandleAvatarSuccess"
              :on-preview="qHandlePictureCardPreview"
              :before-upload="beforeAvatarUpload"
          >
            <el-icon class="form-img" color="#666666"><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="qDialogVisible" >
            <img :src="qDialogImageUrl" alt="" style="width: 100%;object-fit: contain;" />
          </el-dialog>
        </el-form-item>

        <el-form-item prop="activitiesId">
          <template #label>
            <labelExplain label="优惠费率活动ID">
              <template #explain>
                <div>选择指定活动ID，商户有意向报名优惠费率活动。详细参见<el-link href="https://pay.weixin.qq.com/wiki/doc/apiv3_partner/terms_definition/chapter1_1_3.shtml#part-10l" type="primary" target="_blank">优惠费率活动对照表</el-link>，示例值：20191030111cff5b5e</div>
              </template>
            </labelExplain>
          </template>
          <el-input maxlength="32" v-model="form.activitiesId" placeholder="请输入优惠费率活动ID" />
        </el-form-item>

        <el-form-item prop="activitiesRate">
          <template #label>
            <labelExplain label="优惠费率活动值">
              <template #explain>
                <div>根据优惠费率活动规则，由服务商自定义填写，支持两个小数点，需在优惠费率活动ID指定费率范围内</div>
              </template>
            </labelExplain>
          </template>
          <el-input maxlength="50" v-model="form.activitiesRate" placeholder="请输入优惠费率活动值" />
        </el-form-item>

        <el-form-item prop="activitiesAdditions">
          <template #label>
            <labelExplain label="优惠费率活动补充材料">
              <template #explain>
                <div>根据所选优惠费率活动，提供相关材料，详细参见优惠费率活动对照表<el-link href="https://kf.qq.com/faq/220228IJb2UV220228uEjU3Q.html" type="primary" target="_blank">费率结算规则对照表</el-link>，示例值：餐饮</div>
              </template>
            </labelExplain>
          </template>
          <el-upload
              v-model:file-list="addFileList"
              :action="uploadData.uploadUrl"
              :headers="{'Authorization':uploadData.token}"
              method:="get"
              accept="image/*"
              multiple
              :limit="5"
              :show-file-list="true"
              list-type="picture-card"
              :on-success="addHandleAvatarSuccess"
              :on-error="addHandleAvatarErr"
              :on-preview="handlePictureCardPreview"
              :before-upload="beforeAvatarUpload"
          >
            <el-icon class="form-img" color="#666666"><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible" >
            <img :src="dialogImageUrl" alt="" style="width: 100%;object-fit: contain;" />
          </el-dialog>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import LabelExplain from "@/views/insurance/customer/components/labelExplain";
import {getToken} from "@/utils/auth";
import {ElMessage} from "element-plus";

const form = ref({
  settlementId: '', //入驻结算规则ID
  qualificationType: '', //所属行业
  qualifications: [], //特殊资质图片
  activitiesId: '', //优惠费率活动ID
  activitiesRate: '', //优惠费率活动值
  activitiesAdditions: [] //优惠费率活动补充材料
})
const addFileList = ref([]);
const qFileList = ref([])
const dialogVisible = ref(false);
const dialogImageUrl = ref('');
const qDialogVisible = ref(false);
const qDialogImageUrl = ref('');

const uploadData = ref({
  uploadUrl: import.meta.env.VITE_APP_BASE_API + 'pay/media/wxPictureUpload',
  token: getToken()
})

const rules = reactive({
  settlementId: [{ required: true, message: "请输入入驻结算规则ID", trigger: "blur" }],
  qualificationType: [{ required: true, message: "请输入所属行业", trigger: "blur" }],
  qualifications: [{ required: true, message: "请上传特殊资质图片", trigger: "change" }],
  activitiesId: [{ required: true, message: "请输入优惠费率活动ID", trigger: "blur" }],
  activitiesRate: [{ required: true, message: "请输入优惠费率活动值", trigger: "blur" }],
  activitiesAdditions: [{ required: true, message: "请上传优惠费率活动补充材料", trigger: "change" }],
})
// 上传验证
const beforeAvatarUpload = (file) => {
  const isPicture = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isPicture) {
    ElMessage.error('请上传jepg,png,jpg格式的图片!')
    return false
  } else if (!isLt2M) {
    ElMessage.error('上传图片不能超过2M!')
    return false
  }
  return true
}
//特殊资质图片
const qHandleAvatarSuccess = (res) => {
  if (res.code === 200) {
    qFileList.value = form.value.qualifications
  } else {
    ElMessage.error(res.msg)
    qFileList.value = []
  }
}
const qHandlePictureCardPreview = (uploadFile) => {
  qDialogImageUrl.value = uploadFile.url
  qDialogVisible.value = true
}

// 优惠费率活动补充材料
const addHandleAvatarSuccess = (res) => {
  if (res.code === 200) {
    addFileList.value = form.value.activitiesAdditions
  } else {
    ElMessage.error(res.msg)
    addFileList.value = []
  }
}
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

</script>

<style lang="scss" scoped>
.app-container {
  .box-card {
    width: 650px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 24px;
      font-weight: bold;

      .desc {
        width: 350px;
        font-weight: normal;
        font-size: 12px;
        margin-left: 40px;
      }
    }
  }
  .form-img {
    width: 60px;
    height: 60px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
  }
  .el-form-item {
    align-items: center;
    :deep(.el-form-item__label) {
      font-weight: 700;
    }
    :deep(.el-upload--picture-card) {
      --el-upload-picture-card-size: 60px;
      border: 0;
    }
    :deep(.el-upload-list--picture-card) .el-upload-list__item {
      width: 60px;
      height: 60px;
    }
  }
}
</style>
