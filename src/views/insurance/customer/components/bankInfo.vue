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
                <div>1、若主体为企业/政府机关/事业单位/社会组织，可填写：对公银行账户<br/>2、若主体为个体户，可选择填写：对公银行账户或经营者个人银行卡
                </div>
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
                <div>1、选择“经营者个人银行卡”时，开户名称必须与“经营者证件姓名”一致<br/>2、选择“对公银行账户”时，开户名称必须与营业执照上的“商户名称”一致
                </div>
              </template>
            </labelExplain>
          </template>
          <el-input v-model="form.accountName" placeholder="请输入开户名称"/>
        </el-form-item>

        <el-form-item prop="accountBank">
          <template #label>
            <labelExplain label="开户银行">
              <template #explain>
                <div>1、17家直连银行，请根据开户银行对照表直接填写银行名<br/>2、非17家直连银行，该参数请填写为“其他银行”。
                </div>
              </template>
            </labelExplain>
          </template>
          <el-select v-model="form.accountBank" placeholder="请选择开户银行" style="width: 100%;"
                     @change="handleChangeBank">
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
          <el-select v-model="state.province" placeholder="请选择省份" style="width: 32%;margin-right: 2%;"
                     @change="provincChange">
            <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-select v-model="state.city" placeholder="请选择城市" style="width: 32%;margin-right: 2%;"
                     @change="cityChange">
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-select v-model="state.area" placeholder="请选择地区" style="width: 32%;" @change="areaChange">
            <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id"/>
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

        <el-form-item v-if="form.accountBank === '其他银行'" prop="bankBranchId">
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

        <el-form-item v-if="form.accountBank === '其他银行'" prop="bankName">
          <template #label>
            <labelExplain label="开户银行全称（含支行）">
              <template #explain>
                <div>1、17家直连银行无需填写，如为其他银行，则开户银行全称（含支行）和 开户银行联行号二选一<br/>2、需填写银行全称，如“深圳农村商业银行XXX支行”,详细参见
                  <el-link type="primary" @click="dialogVisible = true">开户银行全称（含支行）对照表</el-link>
                </div>
              </template>
            </labelExplain>
          </template>
          <el-select
              v-model="form.bankName"
              :loading="loadingSelect"
              :remote-method="remoteMethod"
              filterable
              placeholder="请输入开户银行全称（含支行）"
              remote
              reserve-keyword
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
      </el-form>
    </el-card>
    <el-dialog v-model="dialogVisible" draggable title="开户银行全称（含支行）对照表">
      <el-input v-model="name" placeholder="请输入银行名称" @change="handleChange"></el-input>
      <el-table v-loading="loading" :data="tableData" height="580" style="margin-top: 20px;">
        <el-table-column label="联行号" prop="bankBranchId"/>
        <el-table-column label="开户银行全称" min-width="270" prop="bankName"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import LabelExplain from "@/views/insurance/customer/components/labelExplain";
import {bankInfo, bankType, listArea, listCity, listProvince} from "@/api/insurance/wechatIncoming";

const {proxy} = getCurrentInstance();
const form = ref({
  bankAccountType: null,//账户类型
  accountName: '', //开户名称
  accountBank: null, //开户银行
  bankAddressCode: '', //开户银行省市编码
  bankBranchId: '', //开户银行联行号
  bankName: '', //开户银行全称（含支行）
  accountNumber: '', //银行账号
})

let wechartData = sessionStorage.getItem('wechartFormData')
let wechartDatas = wechartData ? JSON.parse(wechartData).bankAccountInfo : null
wechartDatas && (form.value = wechartDatas)

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

const validBankid = ((rule, value, callback) => {
  if ((value === '' || value === undefined) && form.value.bankName === '') {
    callback(new Error('请输入开户“银行联行号”或“开户银行全称（含支行）”'))
  } else {
    callback()
  }
})
const validBankName = (rule, value, callback) => {
  if ((form.value.bankBranchId === '' || form.value.bankBranchId === undefined) && (value === '' || value === undefined)) {
    callback(new Error('请输入开户“银行联行号”或“开户银行全称（含支行）”'))
  } else {
    callback()
  }
}
const rules = reactive({
  bankAccountType: [{required: true, message: "请选择账户类型", trigger: "change"}],
  accountName: [{required: true, message: "请输入开户名称", trigger: "blur"}],
  accountBank: [{required: true, message: "请选择开户银行", trigger: "change"}],
  bankAddressCode: [{required: true, message: "请输入开户银行省市编码", trigger: "change"}],
  bankBranchId: [{required: true, validator: validBankid, trigger: "blur"}],
  bankName: [{required: true, validator: validBankName, trigger: "blur"}],
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

const getBankAddressCode = () => {
  let bankAddressCode = String(form.value.bankAddressCode)
  let provinceData = bankAddressCode.substring(0, 2) + '0000'
  let cityData = bankAddressCode.substring(0, 4) + '00'
  provinceList.value.filter(item => item.id == provinceData).forEach(items => state.value.province = items.id)
  listCity({pid: state.value.province}).then(res => {
    if (res.code === 200) {
      cityList.value = res.data
      cityList.value.filter(item => item.id == cityData).forEach(items => state.value.city = items.id)
      listArea({pid: state.value.city}).then(res => {
        if (res.code === 200) {
          areaList.value = res.data
          areaList.value.filter(item => item.id == form.value.bankAddressCode).forEach(items => state.value.area = items.id)
        }
      })
    }
  })
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
const handleChangeBank = (val) => {
  if (val !== '其他银行') {
    form.value.bankBranchId = ''
    form.value.bankName = ''
  }
}

const emit = defineEmits(["result"]);
const submit = () => {
  proxy.$refs["bankRef"].validate(valid => {
    if (valid) {
      emit('result', {bankAccountInfo: form.value})
    } else {
      emit('result', false)
    }
  })
}
const getBankType = async () => {
  await bankType('pay_bank_info').then(res => {
    if (res.code === 200) {
      accountBankList.value = res.data
    }
  })
  await listProvince().then(res => {
    if (res.code == 200) {
      provinceList.value = res.data
    }
  })
  if (form.value.bankAddressCode) {
    getBankAddressCode()
  }
}

getBankType()

defineExpose({
  submit, // 上传
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
</style>
