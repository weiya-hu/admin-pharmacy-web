<template>
  <div class="">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="white-space: nowrap;">结算银行账户</span>
          <span class="desc"
          >请填写商家提现收款的银行账户信息。</span
          >
        </div>
      </template>
      <el-form ref="bankRef" :model="form" :rules="rules">
        <el-form-item prop="bankAccountType">
          <template #label>
            <labelExplain label="账户类型">
              <template #explain>
                <div>1、若主体为企业/政府机关/事业单位/社会组织，可填写：对公银行账户<br/>2、若主体为个体户，可选择填写：对公银行账户或经营者个人银行卡</div>
              </template>
            </labelExplain>
          </template>
          <el-select
              v-model="form.bankAccountType"
              placeholder="请选择账户类型"
              style="width: 100%;"
          >
            <el-option label="对公银行账户" value="BANK_ACCOUNT_TYPE_CORPORATE"/>
            <el-option label="经营者个人银行卡" value="BANK_ACCOUNT_TYPE_PERSONAL"/>
          </el-select>
        </el-form-item>

        <el-form-item prop="accountName">
          <template #label>
            <labelExplain label="开户名称">
              <template #explain>
                <div>1、选择“经营者个人银行卡”时，开户名称必须与“经营者证件姓名”一致<br/>2、选择“对公银行账户”时，开户名称必须与营业执照上的“商户名称”一致</div>
              </template>
            </labelExplain>
          </template>
          <el-input v-model="form.accountName" placeholder="请输入开户名称"/>
        </el-form-item>

        <el-form-item prop="accountBank">
          <template #label>
            <labelExplain label="开户银行">
              <template #explain>
                <div>1、17家直连银行，请根据开户银行对照表直接填写银行名<br/>2、非17家直连银行，该参数请填写为“其他银行”。</div>
              </template>
            </labelExplain>
          </template>
          <el-select v-model="form.accountBank" placeholder="请选择开户银行" style="width: 100%;">
            <el-option v-for="item in accountBankList" :key="item.dictValue" :label="item.dictLabel"
                       :value="item.dictValue"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <template #label>
            <label-explain label="开户银行省市区">
              <template #explain>
                <div>选择开户银行省市区</div>
              </template>
            </label-explain>
          </template>
          <el-select v-model="state.province" @change="provincChange" placeholder="请选择省份"
                     style="width: 32%;margin-right: 2%;">
            <el-option v-for="item in provinceList" :value="item.id" :label="item.name" :key="item.id"/>
          </el-select>
          <el-select v-model="state.city" @change="cityChange" placeholder="请选择城市" style="width: 32%;margin-right: 2%;">
            <el-option v-for="item in cityList" :value="item.id" :label="item.name" :key="item.id"/>
          </el-select>
          <el-select v-model="state.area" @change="areaChange" placeholder="请选择地区" style="width: 32%;">
            <el-option v-for="item in areaList" :value="item.id" :label="item.name" :key="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item prop="bankAddressCode">
          <template #label>
            <labelExplain label="开户银行省市编码">
              <template #explain>
                <div>请先选择开户银行省市区，至少精确到市</div>
              </template>
            </labelExplain>
          </template>
          <el-input v-model="form.bankAddressCode" placeholder="请输入开户银行省市编码"/>
        </el-form-item>

        <el-form-item prop="bankBranchId" v-if="form.accountBank === '其他银行'">
          <template #label>
            <labelExplain label="开户银行联行号">
              <template #explain>
                <div>1、17家直连银行无需填写，如为其他银行，则开户银行全称（含支行）和开户银行联行号二选一，详细参见
                  <el-link type="primary" @click="dialogVisible = true">开户银行全称（含支行）对照表</el-link>
                </div>
              </template>
            </labelExplain>
          </template>
          <el-input v-model="form.bankBranchId" placeholder="请输入银行联行号"/>
        </el-form-item>

        <el-form-item prop="bankName" v-if="form.accountBank === '其他银行'">
          <template #label>
            <labelExplain label="开户银行全称（含支行）">
              <template #explain>
                <div>1、17家直连银行无需填写，如为其他银行，则开户银行全称（含支行）和 开户银行联行号二选一<br/>2、需填写银行全称，如“深圳农村商业银行XXX支行”,详细参见
                  <el-link type="primary" @click="dialogVisible = true">开户银行全称（含支行）对照表</el-link>
                </div>
                <!--                <div>1、17家直连银行无需填写，如为其他银行，则开户银行全称（含支行）和 开户银行联行号二选一<br />2、需填写银行全称，如“深圳农村商业银行XXX支行”</div>-->
              </template>
            </labelExplain>
          </template>
          <el-select
              v-model="form.bankName"
              filterable
              remote
              reserve-keyword
              placeholder="请输入开户银行全称（含支行）"
              :remote-method="remoteMethod"
              :loading="loadingSelect"
              style="width: 100%;"
          >
            <el-option
                v-for="item in bankNameList"
                :key="item.id"
                :label="item.bankName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="accountNumber">
          <template #label>
            <labelExplain label="银行账号">
              <template #explain>
                <div>数字，长度遵循系统支持的卡号长度要求</div>
              </template>
            </labelExplain>
          </template>
          <el-input v-model="form.accountNumber" placeholder="请输入银行账号"/>
        </el-form-item>

        <!--        <el-form-item>-->
        <!--          <el-button @click="submit">保存</el-button>-->
        <!--        </el-form-item>-->
      </el-form>
    </el-card>
    <el-dialog v-model="dialogVisible" title="开户银行全称（含支行）对照表" draggable>
      <el-input v-model="name" placeholder="请输入银行名称" @change="handleChange"></el-input>
      <el-table :data="tableData" v-loading="loading" height="580" style="margin-top: 20px;">
        <el-table-column prop="bankBranchId" label="联行号"/>
        <el-table-column prop="bankName" label="开户银行全称" min-width="270"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import LabelExplain from "@/views/insurance/customer/components/labelExplain";
import {bankInfo, bankType, listArea, listCity, listProvince} from "@/api/insurance/wechatIncoming";
import {ElMessage} from "element-plus";

const {proxy} = getCurrentInstance();
const form = ref({
  bankAccountType: '',//账户类型
  accountName: '', //开户名称
  accountBank: '', //开户银行
  bankAddressCode: '', //开户银行省市编码
  bankBranchId: '', //开户银行联行号
  bankName: '', //开户银行全称（含支行）
  accountNumber: '', //银行账号
})
const accountBankList = ref([])
const state = ref({
  province: '',
  city: '',
  area: ''
})
const provinceList = ref([])
const cityList = ref([])
const areaList = ref([])
const loadingSelect = ref(false)
const bankNameList = ref([])

const name = ref('')
const dialogVisible = ref(false)
const loading = ref(false)
const tableData = ref([])

const rules = reactive({
  bankAccountType: [{required: true, message: "请选择账户类型", trigger: "change"}],
  accountName: [{required: true, message: "请输入开户名称", trigger: "blur"}],
  accountBank: [{required: true, message: "请选择开户银行", trigger: "change"}],
  bankAddressCode: [{required: true, message: "请输入开户银行省市编码", trigger: "blur"}],
  // bankBranchId: [{ required: true, message: "请输入开户银行联行号", trigger: "blur" }],
  // bankName: [{ required: true, message: "请输入开户银行全称（含支行）", trigger: "blur" }],
  accountNumber: [{required: true, message: "请输入银行账号", trigger: "blur"}]
})

//省市区
const provincChange = (val) => {
  listCity({pid: val}).then(res => {
    if (res.code === 200) {
      cityList.value = res.data
      state.value.city = ''
      state.value.area = ''
      form.value.bankAddressCode = ''
    }
  })
}
const cityChange = (val) => {
  listArea({pid: val}).then(res => {
    if (res.code === 200) {
      areaList.value = res.data
      state.value.area = ''
      form.value.bankAddressCode = ''
      if (res.data.length === 0 || res.data == null) {
        form.value.bankAddressCode = val
      }
    }
  })
}
const areaChange = (val) => {
  form.value.bankAddressCode = val
}

const remoteMethod = (query) => {
  loadingSelect.value = true
  bankInfo({name: query}).then(res => {
    if (res.code === 200) {
      loadingSelect.value = false
      bankNameList.value = res.data
      form.value.bankBranchId = res.data.id
    } else {
      loadingSelect.value = false
    }
  })
}
const handleChange = (val) => {
  loading.value = true
  bankInfo({name: val}).then(res => {
    if (res.code === 200) {
      loading.value = false
      tableData.value = res.data
    } else {
      loading.value = false
    }
  })
}

const emit = defineEmits(["result"]);
const submit = () => {
  proxy.$refs["bankRef"].validate(valid => {
    if (valid) {
      if (form.value.accountBank === '其他银行' && (form.value.bankBranchId == '' && form.value.bankName == '')) {
        ElMessage.error('请输入开户银行联行号或开户银行全称（含支行）')
      } else {
        emit('result', {bankAccountInfo: form.value})
        console.log('银行账户', form.value)
      }
    } else {
      emit('result', false)
    }
  })
}
const getBankType = () => {
  bankType('pay_bank_info').then(res => {
    if (res.code === 200) {
      accountBankList.value = res.data
    }
  })
  listProvince().then(res => {
    if (res.code == 200) {
      provinceList.value = res.data
    }
  })
}

getBankType()

defineExpose({
  submit, // 上传
})
</script>

<style lang="scss" scoped>
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
</style>
