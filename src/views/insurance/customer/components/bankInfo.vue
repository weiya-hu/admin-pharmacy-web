<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="white-space: nowrap;">结算银行账户</span>
          <span class="desc"
          >请填写商家提现收款的银行账户信息。</span
          >
        </div>
      </template>
      <el-form ref="bankRef" model="form" :rules="rules">
        <el-form-item prop="bankAccountType">
          <template #label>
            <labelExplain label="账户类型">
              <template #explain>
                <div>1、若主体为企业/政府机关/事业单位/社会组织，可填写：对公银行账户<br />2、若主体为个体户，可选择填写：对公银行账户或经营者个人银行卡</div>
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
                <div>1、选择“经营者个人银行卡”时，开户名称必须与“经营者证件姓名”一致<br />2、选择“对公银行账户”时，开户名称必须与营业执照上的“商户名称”一致</div>
              </template>
            </labelExplain>
          </template>
          <el-input v-model="form.accountName" placeholder="请输入开户名称" />
        </el-form-item>

        <el-form-item prop="accountBank">
          <template #label>
            <labelExplain label="开户银行">
              <template #explain>
                <div>1、17家直连银行，请根据开户银行对照表直接填写银行名<br />2、非17家直连银行，该参数请填写为“其他银行”。</div>
              </template>
            </labelExplain>
          </template>
          <el-select v-model="form.accountBank" placeholder="请选择开户银行" style="width: 100%;">
            <el-option v-for="item in accountBankList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item prop="bankAddressCode">
          <template #label>
            <labelExplain label="开户银行省市编码">
              <template #explain>
                <div>至少精确到市</div>
              </template>
            </labelExplain>
          </template>
          <el-input v-model="form.bankAddressCode" placeholder="请输入开户银行省市编码" />
        </el-form-item>

        <el-form-item prop="bankBranchId">
          <template #label>
            <labelExplain label="开户银行联行号">
              <template #explain>
                <div>1、17家直连银行无需填写，如为其他银行，则开户银行全称（含支行）和开户银行联行号二选一。</div>
              </template>
            </labelExplain>
          </template>
          <el-input v-model="form.bankBranchId" placeholder="请输入银行联行号" />
        </el-form-item>

        <el-form-item prop="bankName">
          <template #label>
            <labelExplain label="开户银行全称（含支行）">
              <template #explain>
                <div>1、17家直连银行无需填写，如为其他银行，则开户银行全称（含支行）和 开户银行联行号二选一<br />2、需填写银行全称，如"深圳农村商业银行XXX支行"，</div>
              </template>
            </labelExplain>
          </template>
          <el-input v-model="form.bankName" placeholder="请输入开户银行全称（含支行）" />
        </el-form-item>

        <el-form-item prop="accountNumber">
          <template #label>
            <labelExplain label="银行账号">
              <template #explain>
                <div>数字，长度遵循系统支持的卡号长度要求</div>
              </template>
            </labelExplain>
          </template>
          <el-input v-model="form.accountNumber" placeholder="请输入银行账号" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import LabelExplain from "@/views/insurance/customer/components/labelExplain";

const form = ref({
  bankAccountType: '',//账户类型
  accountName: '', //开户名称
  accountBank: '', //开户银行
  bankAddressCode: '', //开户银行省市编码
  bankBranchId: '', //开户银行联行号
  bankName: '', //开户银行全称（含支行）
  accountNumber: '' //银行账号
})

const rules = reactive({
  bankAccountType: [{ required: true, message: "请选择账户类型", trigger: "change" }],
  accountName: [{ required: true, message: "请输入开户名称", trigger: "blur" }],
  accountBank: [{ required: true, message: "请选择开户银行", trigger: "change" }],
  bankAddressCode: [{ required: true, message: "请输入开户银行省市编码", trigger: "blur" }],
  // bankBranchId: [{ required: true, message: "请输入开户银行联行号", trigger: "blur" }],
  // bankName: [{ required: true, message: "请输入开户银行全称（含支行）", trigger: "blur" }],
  accountNumber: [{ required: true, message: "请输入银行账号", trigger: "blur" }]
})

const accountBankList = ref([
  { value: '1', label: '工商银行' },
  { value: '2', label: '交通银行' },
  { value: '3', label: '招商银行' },
  { value: '4', label: '民生银行' },
  { value: '5', label: '中信银行' },
  { value: '6', label: '浦发银行' },
  { value: '7', label: '兴业银行' },
  { value: '8', label: '光大银行' },
  { value: '9', label: '广发银行' },
  { value: '10', label: '平安银行' },
  { value: '11', label: '北京银行' },
  { value: '12', label: '华夏银行' },
  { value: '13', label: '农业银行' },
  { value: '14', label: '建设银行' },
  { value: '15', label: '邮政储蓄银行' },
  { value: '16', label: '中国银行' },
  { value: '17', label: '宁波银行' },
  { value: '18', label: '其他银行' }
])
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
}
</style>
