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
        <el-form-item prop="settlementId">
          <template #label>
            <labelExplain label="入驻结算规则ID">
              <template #explain>
                <div>请选择结算规则ID，详细参见<el-link type="primary" @click="onClick('settlement')">费率结算规则对照表</el-link>，示例值：719</div>
              </template>
            </labelExplain>
          </template>
          <el-input maxlength="3" v-model="form.settlementId" placeholder="请输入入驻结算规则ID" />
        </el-form-item>

        <el-form-item prop="qualificationType">
          <template #label>
            <labelExplain label="所属行业">
              <template #explain>
                <div>填写指定行业名称，详细参见<el-link type="primary" @click="onClick('settlement')">费率结算规则对照表</el-link>，示例值：餐饮</div>
              </template>
            </labelExplain>
          </template>
          <el-select v-model="form.qualificationType" filterable @change="handleChange" placeholder="请选择所属行业" style="width: 100%;">
            <el-option v-for="item in typeList" :value="item.id" :label="item.qualificationType" :key="item.id" />
          </el-select>
<!--          <el-input maxlength="128" v-model="form.qualificationType" placeholder="请输入所属行业" />-->
        </el-form-item>

        <el-form-item prop="qualifications" v-if="otherAsk === 1">
          <template #label>
            <labelExplain label="特殊资质图片">
              <template #explain>
                <div>1、根据所属行业的特殊资质要求提供，详情查看<el-link type="primary" @click="onClick('settlement')">费率结算规则对照表</el-link><br />2、最多可上传5张照片</div>
              </template>
            </labelExplain>
          </template>
          <ShpUploadFile v-model="form.qualifications" :limit="5" :multiple="true" flag="qualifications"></ShpUploadFile>
        </el-form-item>

        <el-form-item prop="activitiesId">
          <template #label>
            <labelExplain label="优惠费率活动ID">
              <template #explain>
                <div>选择指定活动ID，商户有意向报名优惠费率活动。详细参见<el-link type="primary" @click="onClick('activity')">优惠费率活动对照表</el-link>，示例值：20191030111cff5b5e</div>
              </template>
            </labelExplain>
          </template>
          <el-select v-model="form.activitiesId" placeholder="请选择优惠费率活动ID" clearable style="width: 100%;">
            <el-option v-for="item in activitiesList" :value="item.activitiesId" :label="item.activitiesId" :key="item.id" />
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
          <el-input maxlength="50" v-model="form.activitiesRate" placeholder="请输入优惠费率活动值" />
        </el-form-item>

        <el-form-item prop="activitiesAdditions">
          <template #label>
            <labelExplain label="优惠费率活动补充材料">
              <template #explain>
                <div>1、根据所选优惠费率活动，提供相关材料，详细参见<el-link type="primary" @click="onClick('activity')">优惠费率活动对照表</el-link><br />2、最多可上传5张照片</div>
              </template>
            </labelExplain>
          </template>
          <ShpUploadFile v-model="form.activitiesAdditions" :limit="5" :multiple="true" flag="activitiesAdditions"></ShpUploadFile>
        </el-form-item>

<!--        <el-form-item>-->
<!--          <el-button @click="submit">保存</el-button>-->
<!--        </el-form-item>-->
      </el-form>
    </el-card>
    <!-- 费率结算规则对照表 -->
    <el-dialog v-model="dialogVisibleTable" title="费率结算规则对照表" width="80%" draggable>
      <el-table :data="tableData" height="700">
        <el-table-column prop="settlementId" label="结算规则ID" />
        <el-table-column prop="subjectType" label="主体类型" />
        <el-table-column prop="rule" label="结算规则描述" />
        <el-table-column prop="fitType" label="适用行业范围概述" width="270" />
        <el-table-column prop="qualificationId" label="行业ID" />
        <el-table-column prop="qualificationType" label="行业名称" />
        <el-table-column prop="otherAsk" label="特殊资质是否必填">
          <template #default="scope">
            <span v-if="scope.row.otherAsk == 0">否</span>
            <span v-if="scope.row.otherAsk == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column prop="askDetail" label="特殊资质" width="240" />
      </el-table>
    </el-dialog>
    <!-- 优惠费率活动对照表 -->
    <el-dialog v-model="dialogVisibleActivity" title="费率结算规则对照表" width="60%" draggable>
    <el-table :data="activitytableData" height="580">
      <el-table-column prop="activitiesId" label="活动费率ID" />
      <el-table-column prop="activitiesName" label="活动名称" />
      <el-table-column prop="baseRate" label="标准费率" />
      <el-table-column prop="fitType" label="优惠区间">
        <template #default="scope">
          <span>{{ scope.row.minRate }} ~ {{ scope.row.maxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="活动有效期" />
      <el-table-column prop="activitiesDesc" label="活动介绍" />
      <el-table-column prop="activitiesRule" label="活动规则" />
    </el-table>
  </el-dialog>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import LabelExplain from "@/views/insurance/customer/components/labelExplain";
import {listActivity, listSettlement} from "@/api/insurance/wechatIncoming";
import ShpUploadFile from './ShpUploadFile.vue';

const { proxy } = getCurrentInstance();
const form = ref({
  settlementId: '', //入驻结算规则ID
  qualificationType: '', //所属行业
  qualifications: [], //特殊资质图片
  activitiesId: '', //优惠费率活动ID
  activitiesRate: '', //优惠费率活动值
  activitiesAdditions: [] //优惠费率活动补充材料
})
let wechartData = sessionStorage.getItem('wechartFormData')
let wechartDatas = wechartData?JSON.parse(wechartData).settlementInfo:null
// wechartDatas && (form.value = wechartDatas)

const dialogVisibleTable = ref(false)
const tableData = ref([])

const dialogVisibleActivity = ref(false)
const activitytableData = ref([])

const typeList = ref([])
const otherAsk = ref(0)
const activitiesList = ref([])

const onClick = (type) => {
  if (type === 'settlement') {
    dialogVisibleTable.value = true
    listSettlement().then(res => {
      if (res.code === 200) {
        tableData.value = res.data
      }
    })
  } else if (type === 'activity') {
    dialogVisibleActivity.value = true
    listActivity().then(res => {
      if (res.code === 200) {
        activitytableData.value = res.data
      }
    })
  }
}

const rules = reactive({
  settlementId: [{ required: true, message: "请输入入驻结算规则ID", trigger: "blur" }],
  qualificationType: [{ required: true, message: "请输入所属行业", trigger: "blur" }],
  qualifications: [{ required: true, message: "请上传特殊资质图片", trigger: "change" }],
  // activitiesId: [{ required: true, message: "请输入优惠费率活动ID", trigger: "blur" }]
})

const handleChange = (val) => {
  let obj = typeList.value.find(item => {
    return item.id === val
  })
  form.value.qualificationType = obj.qualificationType
  form.value.settlementId = obj.settlementId
  otherAsk.value = obj.otherAsk
}

const emit = defineEmits(["result"]);
const submit = () => {
  proxy.$refs["settlementRef"].validate(valid => {
    if (valid) {
      console.log('结算规则' ,form.value)
      emit('result', {settlementInfo:form.value})
    } else {
      emit('result', false)
    }
  })
}

defineExpose({
  submit,
})

const getList = () => {
  listSettlement().then(res => {
    if (res.code === 200) {
      typeList.value = res.data
    }
  })
  listActivity().then(res => {
    if (res.code === 200) {
      activitiesList.value = res.data
    }
  })
}
getList()
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
