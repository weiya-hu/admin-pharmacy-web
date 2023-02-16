<template>
  <div class="">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="white-space: nowrap;">超级管理员信息</span>
          <span class="desc"
          >超级管理员需在开户后进行签约，并可接收日常重要管理信息和进行资金操作，请确定其为商户法定代表人或负责人。</span
          >
        </div>
      </template>
      <el-form ref="managerRef" :model="form" :rules="rules">
        <el-form-item prop="contactType">
          <template #label>
            <labelExplain label="超级管理员类型">
              <template #explain>
                <div>主体为“个体工商户/企业/政府机关/事业单位/社会组织”，可选择：经营者/法人经办人 。（经办人：经商户授权办理微信支付业务的人员）。</div>
              </template>
            </labelExplain>
          </template>
          <el-select
              v-model="form.contactType"
              placeholder="请选择超级管理员类型"
              class="form-input"
              @change="handleChange"
          >
            <el-option label="经营者/法人" value="LEGAL"/>
            <el-option label="经办人" value="SUPER"/>
          </el-select>
        </el-form-item>

        <el-form-item prop="contactName">
          <template #label>
            <labelExplain label="超级管理员姓名" :explainShow="false"></labelExplain>
          </template>
          <el-input
              v-model="form.contactName"
              placeholder="请输入超级管理员姓名"
              class="form-input"
          />
        </el-form-item>

        <el-form-item prop="contactIdDocType" v-if="form.contactType === 'SUPER'">
          <template #label>
            <labelExplain label="超级管理员证件类型" :explainShow="false"></labelExplain>
          </template>
          <el-select
              v-model="form.contactIdDocType"
              placeholder="请选择超级管理员证件类型"
              class="form-input"
          >
            <el-option v-for='item in IDtypes' :label="item.label" :value="item.value" :key="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item prop="contactIdNumber" v-if="form.contactType === 'SUPER'">
          <template #label>
            <labelExplain label="超级管理员身份证件号码">
              <template #explain>
                <div>1、“超级管理员身份证号码”与“超级管理员微信openid”，二选一必填<br/>2、超级管理员签约时，校验微信号绑定的银行卡实名信息，是否与该证件号码一致<br/>3、可传身份证、来往内地通行证、来往大陆通行证、护照等证件号码
                </div>
              </template>
            </labelExplain>
          </template>
          <el-input
              v-model="form.contactIdNumber"
              placeholder="请输入超级管理员身份证件号码"
              class="form-input"
          />
        </el-form-item>

        <el-form-item prop="contactIdDocCopy" v-if="form.contactType === 'SUPER'">
          <template #label>
            <labelExplain label="超级管理员证件正面照片">
              <template #explain>
                <div>请上传超级管理员证件的正面照片;若证件类型为身份证，请上传人像面照片;请上传彩色照片or彩色扫描件or复印件（需加盖公章鲜章），可添加“微信支付”相关水印（如微信支付认证）</div>
              </template>
            </labelExplain>
          </template>
          <el-upload
              v-model:file-list="zFileList"
              :action="uploadData.uploadUrl"
              :headers="{'Authorization':uploadData.token}"
              method:="get"
              accept="image/*"
              :limit="1"
              :show-file-list="true"
              list-type="picture-card"
              :on-exceed="handleExceed"
              :on-success="zHandleAvatarSuccess"
              :on-preview="zhandlePictureCardPreview"
              :on-remove="zhandleRemove"
              :before-upload="beforeAvatarUpload"
          >
            <el-icon class="form-img" color="#666666">
              <Plus/>
            </el-icon>
          </el-upload>
          <el-dialog v-model="zDialogVisible">
            <img :src="zDialogImageUrl" alt="" style="width: 100%;object-fit: contain;"/>
          </el-dialog>
        </el-form-item>

        <el-form-item prop="contactIdDocCopyBack"
                      v-if="form.contactType === 'SUPER' && form.contactIdDocType !== 'IDENTIFICATION_TYPE_OVERSEA_PASSPORT'">
          <template #label>
            <labelExplain label="超级管理员证件反面照片">
              <template #explain>
                <div>请上传超级管理员证件的反面照片;若证件类型为身份证，请上传国徽照片;请上传彩色照片or彩色扫描件or复印件（需加盖公章鲜章），可添加“微信支付”相关水印（如微信支付认证）</div>
              </template>
            </labelExplain>
          </template>
          <el-upload
              v-model:file-list="fFileList"
              :action="uploadData.uploadUrl"
              :headers="{'Authorization':uploadData.token}"
              method:="get"
              accept="image/*"
              :limit="1"
              :show-file-list="true"
              list-type="picture-card"
              :on-exceed="handleExceed"
              :on-success="fHandleAvatarSuccess"
              :on-preview="fhandlePictureCardPreview"
              :on-remove="fhandleRemove"
              :before-upload="beforeAvatarUpload"
          >
            <el-icon class="form-img" color="#666666">
              <Plus/>
            </el-icon>
          </el-upload>
          <el-dialog v-model="fDialogVisible">
            <img :src="fDialogImageUrl" alt="" style="width: 100%;object-fit: contain;"/>
          </el-dialog>
        </el-form-item>

        <el-form-item prop="contactPeriodBegin" v-if="form.contactType === 'SUPER'">
          <template #label>
            <labelExplain label="超级管理员证件有效期时间" :explainShow="false"></labelExplain>
          </template>
          <el-date-picker v-model="form.contactPeriodBegin" type="date" placeholder="请选择有效期开始日期"
                          value-format="YYYY-MM-DD"
                          @change="getStartTime" style="width: 47%"/>
          <span style="width: 6%;text-align: center">至</span>
          <span v-if="formDateRadio == -1">长期有效</span>
          <el-date-picker v-model="form.contactPeriodEnd" disabled type="date" placeholder="有效期结束日期" v-else
                          style="width: 47%"/>
        </el-form-item>
        <el-form-item v-if="form.contactType === 'SUPER'">
          <template #label>
            <labelExplain label="" :explainShow="false"></labelExplain>
          </template>
          <el-radio-group v-model.number="formDateRadio" @change="getStartTime">
            <el-radio :label="5">5年</el-radio>
            <el-radio :label="10">10年</el-radio>
            <el-radio :label="20">20年</el-radio>
            <el-radio :label="-1">长期有效</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="businessAuthorizationLetter" v-if="form.contactType === 'SUPER'">
          <template #label>
            <labelExplain label="业务办理授权函">
              <template #explain>
                <div>请参照
                  <el-link type="primary" href="https://kf.qq.com/faq/220509Y3Yvym220509fQvYR7.html" target="_blank">
                    示例图
                  </el-link>
                  打印业务办理授权函，全部信息需打印，不支持手写商户信息，并加盖公章
                </div>
              </template>
            </labelExplain>
          </template>
          <ShpUploadFile v-model="form.businessAuthorizationLetter" :limit="1" :multiple="false"
                         flag="businessAuthorizationLetter"></ShpUploadFile>
        </el-form-item>

        <el-form-item prop="openid">
          <template #label>
            <labelExplain label="超级管理员微信OpenID">
              <template #explain>
                <div>1、“超级管理员身份证件号码”与“超级管理员微信openid”，二选一必填<br/>2、超级管理员签约时，校验微信号是否与该微信openid一致</div>
              </template>
            </labelExplain>
          </template>
          <el-input
              v-model="form.openid"
              placeholder="请输入超级管理员微信OpenID"
              class="form-input"
          />
        </el-form-item>

        <el-form-item label="联系手机" prop="mobilePhone">
          <template #label>
            <labelExplain label="联系手机">
              <template #explain>
                <div>1、11位数字<br/>2、用于接收微信支付的重要管理信息及日常操作验证码</div>
              </template>
            </labelExplain>
          </template>
          <el-input
              v-model="form.mobilePhone"
              placeholder="请输入联系人手机"
              maxlength="11"
              class="form-input"
          />
        </el-form-item>

        <el-form-item prop="contactEmail">
          <template #label>
            <labelExplain label="联系邮箱">
              <template #explain>
                <div>用于接收微信支付的开户邮件及日常业务通知</div>
              </template>
            </labelExplain>
          </template>
          <el-input
              v-model="form.contactEmail"
              placeholder="请输入联系邮箱"
              type="email"
              class="form-input"
          />
        </el-form-item>

<!--        <el-form-item>-->
<!--          <el-button @click="submit()">保存</el-button>-->
<!--        </el-form-item>-->
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import {Plus} from '@element-plus/icons-vue';
import {ElMessage} from "element-plus";
import {getToken} from '@/utils/auth';
import LabelExplain from "@/views/insurance/customer/components/labelExplain";
import {idCardOcr} from "@/api/insurance/wechatIncoming";
import ShpUploadFile from './ShpUploadFile.vue';

const {proxy} = getCurrentInstance();

const form = ref({
  contactType: '', //超级管理员类型
  contactName: '', //超级管理员姓名
  contactIdDocType: '', //超级管理员证件类型
  contactIdNumber: '', //超级管理员身份证件号码
  contactIdDocCopy: null, //超级管理员证件正面照片
  contactIdDocCopyBack: null, //超级管理员证件反面照片
  contactPeriodBegin: '', //超级管理员证件有效期开始时间
  contactPeriodEnd: '', //超级管理员证件有效期结束时间
  businessAuthorizationLetter: null, //业务办理授权函
  openid: '', //超级管理员微信OpenID
  mobilePhone: '', //联系手机
  contactEmail: '' //联系邮箱
});
let wechartData = sessionStorage.getItem('wechartFormData')
let wechartDatas = wechartData?JSON.parse(wechartData).contactInfo:null
wechartDatas && (form.value = wechartDatas)

const formDateRadio = ref(5);
const zDialogVisible = ref(false);
const zDialogImageUrl = ref('');
const zFileList = ref([])
const fDialogVisible = ref(false);
const fDialogImageUrl = ref('');
const fFileList = ref([]);
const managerRef = ref()

// 超级管理员证件类型
const IDtypes = [
  {
    label: '中国大陆居民-身份证',
    value: "IDENTIFICATION_TYPE_IDCARD"
  },
  {
    label: '其他国家或地区居民-护照',
    value: 'IDENTIFICATION_TYPE_OVERSEA_PASSPORT'
  },

  {
    label: '中国香港居民-来往内地通行证 ',
    value: "IDENTIFICATION_TYPE_HONGKONG_PASSPORT"
  },

  {
    label: '中国澳门居民-来往内地通行证',
    value: "IDENTIFICATION_TYPE_MACAO_PASSPORT"
  },

  {
    label: '中国台湾居民-来往大陆通行证 ',
    value: "IDENTIFICATION_TYPE_TAIWAN_PASSPORT"
  },

  {
    label: '外国人居留证',
    value: "IDENTIFICATION_TYPE_FOREIGN_RESIDENT"
  },
  {
    label: '港澳居民证 ',
    value: "IDENTIFICATION_TYPE_HONGKONG_MACAO_RESIDENT"
  },
  {
    label: '台湾居民证 ',
    value: "IDENTIFICATION_TYPE_TAIWAN_RESIDENT"
  }
];

// 身份证号码验证
const validNumber = (rule, value, callback) => {
  let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  if (form.value.contactType === 'SUPER' && (form.value.contactIdNumber == '' && value == '')) {
    callback(new Error('请输入“超级管理员身份证件号码”或“超级管理员微信openid”'))
  } else if (value === '') {
    callback(new Error('请输入超级管理员身份证件号码'))
  } else if (!reg.test(value)) {
    callback(new Error('请输入正确超级管理员身份证件号码'))
  } else {
    callback()
  }
}
// 手机号码验证
const validPhone = (rule, value, callback) => {
  let reg = /^1([3-9][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
  if (value === '' || value === undefined) {
    callback(new Error('请输入联系号码'))
  } else if (!reg.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}
// 邮箱验证
const validEmail = (rule, value, callback) => {
  let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (value === '' || value === undefined) {
    callback(new Error('请输入联系邮箱'))
  } else if (!reg.test(value)) {
    callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}
// openid验证
const validOpenid = (rule, value, callback) => {
  if (form.value.contactType !== 'SUPER' && value == '') {
    callback(new Error('请输入超级管理员微信OpenID'))
  } else if (form.value.contactType === 'SUPER' && (form.value.contactIdNumber == '' && value == '')) {
    callback(new Error('请输入“超级管理员身份证件号码”或“超级管理员微信openid”'))
  } else {
    callback()
  }
}
const rules = reactive({
  contactType: [{required: true, message: "请选择超级管理员类型", trigger: "change"}],
  contactName: [{required: true, message: "请输入超级管理员姓名", trigger: "blur"}],
  contactIdDocType: [{required: true, message: "请输入超级管理员证件类型", trigger: "change"}],
  contactIdNumber: [{ required: true, validator: validNumber, trigger: "blur" }],
  contactIdDocCopy: [{required: true, message: "请上传超级管理员证件正面照片", trigger: "change"}],
  contactIdDocCopyBack: [{required: true, message: "请上传超级管理员证件反面照片", trigger: "change"}],
  contactPeriodBegin: [{required: true, message: "请选择超级管理员证件有效期开始时间", trigger: "change"}],
  businessAuthorizationLetter: [{required: true, message: "请上传业务办理授权函", trigger: "change"}],
  openid: [{required: true, validator: validOpenid, trigger: "blur" }],
  mobilePhone: [{required: true, validator: validPhone, trigger: "blur"}],
  contactEmail: [{required: true, validator: validEmail, trigger: "blur"}]
})

const handleChange = (val) => {
  console.log(val)
  if (val === 'LEGAL') {
    form.value.contactIdDocType = ''
    form.value.contactIdNumber = ''
    form.value.contactIdDocCopy = null
    form.value.contactIdDocCopyBack = null
    form.value.contactPeriodBegin = ''
    form.value.contactPeriodEnd = ''
    form.value.businessAuthorizationLetter = null
    zFileList.value = []
    fFileList.value = []
  }
}
const getStartTime = () => {
  let startTime = form.value.contactPeriodBegin
  let yearNum = Number(formDateRadio.value)
  if (startTime && yearNum !== -1) {
    let year = startTime.substring(0, 4)
    let monthDay = startTime.substring(4)
    form.value.contactPeriodEnd = Number(year) + yearNum + monthDay
  } else if (yearNum === -1) {
    form.value.contactPeriodEnd = '长期'
  } else {
    form.value.contactPeriodEnd = ''
  }
}

// 微信图片上传
let uploadData = reactive({
  uploadUrl: import.meta.env.VITE_APP_BASE_API + 'pay/media/wxPictureUpload',
  token: getToken()
})

// 上传验证
function beforeAvatarUpload(file) {
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

const handleExceed = () => {
  ElMessage.error(`最多上传1张图片`)
}

// 身份证正面上传、查看
const zHandleAvatarSuccess = (res) => {
  if (res.code === 200) {
    idCardOcr({url: res.data[0].url}).then(res_id => {
      if (res_id.code === 200) {
        if (res_id.data.authority !== '' || res_id.data.validDate !== '') {
          ElMessage.error('请上传超级管理员证件正面照片')
          zFileList.value = []
        } else {
          form.value.contactIdDocCopy = res.data[0]
          form.value.contactIdNumber = res_id.data.idNum
          form.value.contactName = res_id.data.name
        }
      } else {
        zFileList.value = []
      }
    }).catch(err => {
      zFileList.value = []
    })
  }
}
const zhandleRemove = () => {
  form.value.contactIdNumber = ''
  form.value.contactName = ''
  form.value.contactIdDocCopy = null
}
const zhandlePictureCardPreview = (uploadFile) => {
  zDialogImageUrl.value = uploadFile.url
  zDialogVisible.value = true
}
// 身份证反面上传、查看
const fHandleAvatarSuccess = (res) => {
  if (res.code === 200) {
    idCardOcr({url: res.data[0].url}).then(res_id => {
      if (res_id.code === 200) {
        if (res_id.data.authority === '' || res_id.data.validDate === '') {
          ElMessage.error('请上传超级管理员证件反面照片')
          fFileList.value = []
        } else {
          form.value.contactIdDocCopyBack = res.data[0]
          if (res_id.data.validDate.substring(11) === '长期') {
            formDateRadio.value = -1
          } else {
            let startYear = res_id.data.validDate.substring(0, 4)
            let endYear = res_id.data.validDate.substring(11, 15)
            formDateRadio.value = Number(endYear - startYear)
            form.value.contactPeriodBegin = res_id.data.validDate.substring(0, 10).replaceAll('.', '-')
            form.value.contactPeriodEnd = res_id.data.validDate.substring(11).replaceAll('.', '-')
          }
        }
      } else {
        fFileList.value = []
      }
    }).catch(err => {
      fFileList.value = []
    })
  }
}
const fhandleRemove = () => {
  form.value.contactPeriodBegin = ''
  form.value.contactPeriodEnd = ''
  form.value.contactIdDocCopyBack = null
  formDateRadio.value = 5
}
const fhandlePictureCardPreview = (uploadFile) => {
  fDialogImageUrl.value = uploadFile.url
  fDialogVisible.value = true
}

const emit = defineEmits(["result"]);
const submit = () => {
  managerRef.value.validate(valid => {
    if (valid) {
      console.log('超级管理员', form.value)
      emit('result', {contactInfo: form.value})
    } else {
      emit('result', false)
    }
  })
}

defineExpose({
  submit,
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
      font-weight: normal;
      font-size: 12px;
      margin-left: 40px;
    }
  }
}

.form-input {
  width: 100%;
}

.form-span {
  color: #999999;
  font-size: 12px;
  margin-left: 15px;
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
