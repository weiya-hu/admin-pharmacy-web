<template>
  <div class="wrapper">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>超级管理员信息</span>
          <span class="desc"
          >超级管理员需在开户后进行签约，并可接收日常重要管理信息和进行资金操作，请确定其为商户法定代表人或负责人。</span
          >
        </div>
      </template>
      <el-form model="form" :rules="rules">
        <el-form-item label="超级管理员类型" prop="type">
          <el-select
              v-model="contact_info.contact_type"
              placeholder="请选择超管类型"
          >
            <el-option label="经营者/法人" value="LEGAL"/>
            <el-option label="经办人" value="SUPER"/>
          </el-select>
        </el-form-item>

        <el-form-item label="超管姓名" prop="name">
          <el-input
              v-model="contact_info.contact_name"
              placeholder="请输入超管姓名"
              input-style="width:200px"
          />
        </el-form-item>

        <el-form-item label="超管证件类型" prop="IDtype">
          <el-select
              v-model="contact_info.contact_id_doc_type"
              placeholder="请选择超管证件类型"
          >
            <el-option v-for='(item,index) in IDtypes' :label="item.label" :value="item.value" :key="index"/>
          </el-select>
        </el-form-item>

        <el-form-item label="超管身份证件号码" prop="IDnum">
          <el-input
              v-model="contact_info.contact_id_number"
              placeholder="请输入超管身份证件号码"
              input-style="width:200px"
          />
        </el-form-item>

        <el-form-item label="超管证件正面照片" style="align-items: center;font-weight: bold">
          <el-upload
              class="avatar-uploader"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              auto-upload="false"
              limit="1"
          >
            <img v-if="frontImg" :src="frontImg" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="超管证件反面照片" style="align-items: center;font-weight: bold">
          <el-upload
              class="avatar-uploader"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              auto-upload="false"
              limit="1"
          >
            <img v-if="rareImg" :src="rareImg" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="超管证件有效期开始时间" prop="IDbegin">
          <el-date-picker
              v-model="contact_info.contact_period_begin"
              type="date"
              placeholder="选择开始时间"
              style="width: 80%"
          />
        </el-form-item>

        <el-form-item label="超管证件有效期结束时间" style="font-weight: bold">
          <el-form-item label="长期有效">
            <el-switch v-model="isLong"/>
          </el-form-item>
          <el-date-picker
              v-if="!isLong"
              v-model="contact_info.contact_period_end"
              type="date"
              placeholder="选择结束时间"
              style="width: 80%"
          />
        </el-form-item>


        <el-form-item label="业务办理授权函" style="align-items: center;font-weight: bold">
          <el-upload
              class="avatar-uploader"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              auto-upload="false"
              limit="1"
          >
            <img v-if="rareImg" :src="rareImg" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>


        <el-form-item label="超管微信OpenID (选填)" prop="openID">
          <el-input
              v-model="contact_info.openid"
              placeholder="请输入超管身份证件号码"
              input-style="width:200px"
          />
        </el-form-item>

        <el-form-item label="联系手机" prop="phone">
          <el-input
              v-model="contact_info.mobile_phone"
              placeholder="请输入联系人手机"
              input-style="width:200px"
              type="tel"
              maxlength="11"
              clearable
          />
        </el-form-item>

        <el-form-item label="联系邮箱" prop="email">
          <el-input
              v-model="contact_info.contact_email"
              placeholder="请输入联系邮箱"
              input-style="width:200px"
              type="email"
              clearable
          />
        </el-form-item>


      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import {Plus} from '@element-plus/icons-vue';
import {ElMessage} from "element-plus";


//超管信息
const contact_info = ref({
  contact_type: '',
  contact_name: '',
  contact_contact_id_doc_type: '',
  contact_id_number: '',
  contact_period_begin: '',
  contact_period_end: '',
  openid: "",
  mobile_phone: '',
  contact_email: ''
});


//主体资料
const subject_info = ref({
  subject_type: '',
  finance_institution: false,
  business_license_info: {
    license_number: '',
    merchant_name: '',
    legal_person: '',
    license_address: '',
    period_begin: '',
    period_end: '',
  },
  certificate_info: {
    cert_type: '',
    cert_number: '',
    merchant_name: '',
    company_address: '',
    legal_person: '',
    period_begin: '',
    period_end: '',


  },
  finance_institution_info: {
    finance_type: '',
    finance_license_pics: '',
  },
  identity_info: {
    id_holder_type: '',
    id_doc_type: '',
  },
  id_card_info: {
    id_card_name: '',
    id_card_number: '',
    id_card_address: '',
    card_period_begin: '',
    card_period_end: '',
  },
  id_doc_info: {
    id_doc_name: '',
    id_doc_number: '',
    id_doc_address: '',
    doc_period_begin: '',
    doc_period_end: '',
  },
  ubo_info_list: []

})


//经营资料
const business_info = ref({})


const form = reactive({
  contact_info: contact_info.value
});

// const contact_info = reactive({});

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
  },

];

const subjectTypes = [
  {
    label: '个体户',
    value: "SUBJECT_TYPE_INDIVIDUAL"
  },
  {
    label: '企业',
    value: 'SUBJECT_TYPE_ENTERPRISE'
  },
  {
    label: '政府机关',
    value: 'SUBJECT_TYPE_GOVERNMENT'
  },
  {
    label: '事业单位',
    value: 'SUBJECT_TYPE_INSTITUTIONS0'
  },
  {
    label: '社会组织',
    value: 'SUBJECT_TYPE_OTHERS'
  },
]

const frontImg = ref('');

const rareImg = ref('');

const isLong = ref(false)

const rules = reactive({})

const showValue = () => {
  console.log(form.contact_info)
}

const handleAvatarSuccess = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('仅支持图片格式')
    return false
  }
  return true
}

</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: space-around;
  padding: 30px;
  margin: 30px;
}

.box-card {
  //width: 8000px;

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

.el-upload {
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 22px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  text-align: center;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
}

</style>
