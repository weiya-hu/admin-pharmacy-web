<template>
  <div class="">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="white-space: nowrap;">结算规则</span>
          <span class="desc"
          >请填写商家的结算费率规则、特殊资质等信息。</span
          >
        </div>
      </template>
      <el-form ref="settlementRef" :model="form" :rules="rules">
        <el-form-item prop="qualificationType">
          <template #label>
            <labelExplain label="所属行业">
              <template #explain>
                <div>填写指定行业名称，详细参见
                  <el-link type="primary" href="https://kf.qq.com/faq/220228IJb2UV220228uEjU3Q.html" target="_blank">
                    费率结算规则对照表
                  </el-link>
                  ，示例值：餐饮
                </div>
              </template>
            </labelExplain>
          </template>
          <el-select v-model="form.qualificationType" filterable @change="handleChange" placeholder="请选择所属行业"
                     style="width: 100%;">
            <el-option v-for="item in typeList" :value="item.qualificationType" :label="item.qualificationType"
                       :key="item.qualificationType"/>
          </el-select>
        </el-form-item>

        <el-form-item prop="qualifications" v-if="otherAsk === 1">
          <template #label>
            <labelExplain label="特殊资质图片">
              <template #explain>
                <div>1、根据所属行业的特殊资质要求提供，详情查看
                  <el-link href="https://kf.qq.com/faq/220228IJb2UV220228uEjU3Q.html" target="_blank">费率结算规则对照表
                  </el-link>
                  <br/>2、最多可上传5张照片
                </div>
              </template>
            </labelExplain>
          </template>
          <ShpUploadFile v-model="form.qualifications" :limit="5" :multiple="true"
                         flag="qualifications"></ShpUploadFile>
        </el-form-item>

        <el-form-item prop="activitiesId">
          <template #label>
            <labelExplain label="优惠费率活动ID">
              <template #explain>
                <div>选择指定活动ID，商户有意向报名优惠费率活动。详细参见
                  <el-link type="primary"
                           href="https://pay.weixin.qq.com/wiki/doc/apiv3_partner/terms_definition/chapter1_1_3.shtml#part-10"
                           target="_blank">优惠费率活动对照表
                  </el-link>
                  ，示例值：20191030111cff5b5e
                </div>
              </template>
            </labelExplain>
          </template>
          <el-select v-model="form.activitiesId" placeholder="请选择优惠费率活动ID" clearable style="width: 100%;">
            <el-option v-for="item in activitiesList" :value="item.activitiesId" :label="item.activitiesId"
                       :key="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item prop="activitiesRate">
          <template #label>
            <labelExplain label="优惠费率活动值">
              <template #explain>
                <div>根据优惠费率活动规则，由服务商自定义填写，支持两个小数点，需在优惠费率活动ID指定费率范围内，示例值：0.6</div>
              </template>
            </labelExplain>
          </template>
          <el-input maxlength="50" v-model="form.activitiesRate" placeholder="请输入优惠费率活动值"/>
        </el-form-item>

        <el-form-item prop="activitiesAdditions">
          <template #label>
            <labelExplain label="优惠费率活动补充材料">
              <template #explain>
                <div>1、根据所选优惠费率活动，提供相关材料，详细参见
                  <el-link type="primary"
                           href="https://pay.weixin.qq.com/wiki/doc/apiv3_partner/terms_definition/chapter1_1_3.shtml#part-10"
                           target="_blank">优惠费率活动对照表
                  </el-link>
                  <br/>2、最多可上传5张照片
                </div>
              </template>
            </labelExplain>
          </template>
          <ShpUploadFile v-model="form.activitiesAdditions" :limit="5" :multiple="true"
                         flag="activitiesAdditions"></ShpUploadFile>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {getCurrentInstance, onUpdated, reactive, ref} from "vue";
import LabelExplain from "@/views/insurance/customer/components/labelExplain";
import {listActivity, listSettlement} from "@/api/insurance/wechatIncoming";
import ShpUploadFile from './ShpUploadFile.vue';

const {proxy} = getCurrentInstance();
const emit = defineEmits(["result"]);

const form = ref({
  settlementId: '', //入驻结算规则ID
  qualificationType: null, //所属行业
  qualifications: [], //特殊资质图片
  activitiesId: null, //优惠费率活动ID
  activitiesRate: '', //优惠费率活动值
  activitiesAdditions: [] //优惠费率活动补充材料
})

let wechartData = sessionStorage.getItem('wechartFormData')
let wechartDatas = wechartData ? JSON.parse(wechartData).settlementInfo : null
wechartDatas && (form.value = wechartDatas)

const typeList = ref([])
const otherAsk = ref(0)
const activitiesList = ref([])

const rules = reactive({
  qualificationType: [{required: true, message: "请输入所属行业", trigger: "blur"}],
  qualifications: [{required: true, message: "请上传特殊资质图片", trigger: "change"}]
})

const handleChange = (val) => {
  otherAsk.value = typeList.value.filter(item => item.qualificationType == val)[0].otherAsk
  if (otherAsk.value === 0) form.value.qualifications = []
}

const submit = () => {
  proxy.$refs["settlementRef"].validate(valid => {
    if (valid) {
      emit('result', {settlementInfo: form.value})
    } else {
      emit('result', false)
    }
  })
}

defineExpose({
  submit,
})

const getList = () => {
  let wechartData = sessionStorage.getItem('wechartFormData')
  let wechartDatas = wechartData ? JSON.parse(wechartData).subjectInfo : null
  listSettlement({subjectType: wechartDatas && wechartDatas.subjectType}).then(res => {
    if (res.code === 200) {
      typeList.value = res.data
      let TypeData = res.data.filter(item => item.settlementId == form.value.settlementId)
      if (TypeData.length === 0) {
        form.value.qualificationType = null
      }
    }
  })
  if (form.value.qualifications.length !== 0) otherAsk.value = 1

  listActivity().then(res => {
    if (res.code === 200) {
      activitiesList.value = res.data
    }
  })
}

onUpdated(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.box-card {
  // width: 650px;

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
</style>
