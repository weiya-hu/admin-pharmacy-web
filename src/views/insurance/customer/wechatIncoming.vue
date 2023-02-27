<template>
  <div class="outbox">

    <div style="display: flex; justify-content: right;margin-right: 20px">
      <el-button
          plain
          type="primary"
          @click="toAdd"
      >新增进件
      </el-button
      >
    </div>

    <WechartIncommingTable
        :tableListConfig="wechartIncomingConfig"
        :tableListData="tableListData"
    >
      <template #businessCodeSlot="scope">
        {{ scope.row.businessCode }}
      </template>
      <template #certTypeSlot="scope">
        {{ scope.row.certType }}
      </template>
      <template #contactNameSlot="scope">
        {{ scope.row.contactName }}
      </template>
      <template #contactTypeSlot="scope">
        {{ scope.row.contactType }}
      </template>
      <template #docPeriodBeginSlot="scope">
        {{ scope.row.docPeriodBegin }}
      </template>
      <template #docPeriodEndSlot="scope">
        {{ scope.row.docPeriodEnd }}
      </template>
      <template #financeInstitutionSlot="scope">
        {{ scope.row.financeInstitution == 0 ? "否" : "是" }}
      </template>
      <template #idDocAddressSlot="scope">
        {{ scope.row.idDocAddress }}
      </template>
      <template #idDocNameSlot="scope">
        {{ scope.row.idDocName }}
      </template>
      <template #idDocNumberSlot="scope">
        {{ scope.row.idDocNumber }}
      </template>

      <template #idDocTypeSlot="scope">
        {{ getIdType(scope.row.idDocType) }}
      </template>

      <template #idHolderTypeSlot="scope">
        {{ scope.row.idHolderType == "LEGAL" ? "法人" : "经办人" }}
      </template>

      <template #licenseAddressSlot="scope">
        {{ scope.row.licenseAddress }}
      </template>

      <template #licenseMerchantNameSlot="scope">
        {{ scope.row.licenseMerchantName }}
      </template>

      <template #merchantShortnameSlot="scope">
        {{ scope.row.merchantShortname }}
      </template>

      <template #licenseNumberSlot="scope">
        {{ scope.row.licenseNumber }}
      </template>

      <template #licensePeriodBeginSlot="scope">
        {{ scope.row.licensePeriodBegin }}
      </template>

      <template #licensePeriodEndSlot="scope">
        {{ scope.row.licensePeriodEnd }}
      </template>

      <template #ownerSlot="scope">
        {{ scope.row.owner == 0 ? "否" : "是" }}
      </template>

      <template #salesScenesTypeNameSlot="scope">
        {{
          scope.row.salesScenesTypeName ? scope.row.salesScenesTypeName : "--"
        }}
      </template>

      <template #servicePhoneSlot="scope">
        {{ scope.row.servicePhone }}
      </template>

      <template #signUrlSlot="scope">
        <el-link :href="scope.row.signUrl" text type="primary">啦啦啦</el-link>
      </template>

      <template #statusMsgSlot="scope">
        {{ scope.row.statusMsg ? scope.row.statusMsg : '--' }}
      </template>

      <template #subMchidSlot="scope">
        {{ scope.row.subMchid ? scope.row.subMchid : "--" }}
      </template>

      <template #subjectTypeSlot="scope">
        {{ getsubjectTypes(scope.row.subjectType) }}
      </template>

      <template #wechatApplymentIdSlot="scope">
        {{ scope.row.wechatApplymentId ? scope.row.wechatApplymentId : "--" }}
      </template>

      <template #rejectReasonSlot="scope">
        {{ scope.row.rejectReason ? scope.row.rejectReason : "--" }}
      </template>
    </WechartIncommingTable>
    <div>
      <Pagination
          v-show="total > 0"
          v-model:limit="params.pageSize"
          v-model:page="params.pageNum"
          :total="total"
          @pagination="getPagination"

      ></Pagination>
    </div>
  </div>
</template>

<script setup>
import {getApplymentList} from "@/api/insurance/wechatIncoming";
import {onMounted, ref} from "vue";

import wechartIncomingConfig from "./wechartIncomingConfig";
import WechartIncommingTable from "@/views/insurance/customer/components/wechartIncommingTable";
import vueQr from "vue-qr/src/packages/vue-qr.vue";

const router = useRouter();
const params = ref({
  pageSize: 10,
  pageNum: 1
});
const loading = ref(false);
const total = ref(0);
const list = ref([]);
const tableListData = ref([]);
const idTypes = {
  IDENTIFICATION_TYPE_IDCARD: "中国大陆居民-身份证",
  IDENTIFICATION_TYPE_OVERSEA_PASSPORT: "其他国家或地区居民-护照",
  IDENTIFICATION_TYPE_HONGKONG_PASSPORT: "中国香港居民-来往内地通行证",
  IDENTIFICATION_TYPE_MACAO_PASSPORT: "中国澳门居民-来往内地通行证",
  IDENTIFICATION_TYPE_TAIWAN_PASSPORT: "中国台湾居民-来往大陆通行证",
  IDENTIFICATION_TYPE_FOREIGN_RESIDENT: "外国人居留证",
  IDENTIFICATION_TYPE_HONGKONG_MACAO_RESIDENT: "港澳居民证",
  IDENTIFICATION_TYPE_TAIWAN_RESIDENT: "台湾居民证",
};
const financeTypes = {
  BANK_AGENT: "银行业",
  PAYMENT_AGENT: "支付机构",
  INSURANCE: "保险业",
  TRADE_AND_SETTLE: "交易及结算类金融机构",
  OTHER: "其他金融机构",
};
const subjectTypes = {
  SUBJECT_TYPE_INDIVIDUAL: "个体户",
  SUBJECT_TYPE_ENTERPRISE: "企业",
  SUBJECT_TYPE_GOVERNMENT: "党政机关",
  SUBJECT_TYPE_INSTITUTIONS: "事业单位",
  SUBJECT_TYPE_OTHERS: "其他组织",
};

const getIdType = (val) => {
  for (let i in idTypes) {
    if (i == val) return idTypes[i];
  }
};


const getsubjectTypes = (val) => {
  for (let i in subjectTypes) {
    if (i == val) return subjectTypes[i];
  }
};

const getPagination = () => {
  getApplymentList(params.value).then((res) => {
    if (res.code == 200) {
      tableListData.value = res.data.list;
      total.value = Number(res.data.total);
    }
  });
};

const toAdd = () =>{
  sessionStorage.removeItem('wechartFormData')
  router.push('/insurance/addWechatIncoming')
}

onMounted(() => {
  getApplymentList(params.value).then((res) => {
    if (res.code == 200) {
      tableListData.value = res.data.list;
      total.value = Number(res.data.total);
    }
  });
});
</script>

<style lang="scss" scoped>
.outbox {
  padding: 20px;
}
</style>
