<template>
  <div class="outbox">
    <wechartIncommingTable :tableListConfig="wechartIncomingConfig" :tableListData="tableListData">
      <template #businessCodeSlot="scope">
        <el-button>啊啊啊</el-button>
      </template>
    </wechartIncommingTable>
  </div>
</template>

<script setup>
import { getApplymentList } from "@/api/insurance/wechatIncoming";
import { onMounted, ref } from "vue";
import wechartIncommingTable from "./components/wechartIncommingTable";
import wechartIncomingConfig from "./wechartIncomingConfig";

const params = ref({});
const loading = ref(false);
const list = ref([]);
let tableListData = ref([]);
const idTypes = {
  IDENTIFICATION_TYPE_IDCARD: "中国大陆居民-身份证",
  IDENTIFICATION_TYPE_OVERSEA_PASSPORT: "其他国家或地区居民-护照",
  IDENTIFICATION_TYPE_HONGKONG_PASSPORT: "中国香港居民-来往内地通行证",
  IDENTIFICATION_TYPE_MACAO_PASSPORT: "中国澳门居民-来往内地通行证",
  IDENTIFICATION_TYPE_TAIWAN_PASSPORT: "中国台湾居民-来往大陆通行证",
  IDENTIFICATION_TYPE_FOREIGN_RESIDENT: "外国人居留证",
  IDENTIFICATION_TYPE_HONGKONG_MACAO_RESIDENT: "港澳居民证",
  IDENTIFICATION_TYPE_TAIWAN_RESIDENT: "台湾居民证"
};
const financeTypes = {
  BANK_AGENT: "银行业",
  PAYMENT_AGENT: "支付机构",
  INSURANCE: "保险业",
  TRADE_AND_SETTLE: "交易及结算类金融机构",
  OTHER: "其他金融机构"
};
const getIdType = (val) => {
  for (let i in idTypes) {
    if (i == val) return idTypes[i];
  }
};
const getFinanceType = (val) => {
  for (let i in financeTypes) {
    if (i == val) return financeTypes[i];
  }
};

onMounted(() => {
  getApplymentList(params.value).then((res) => {
    if (res.code == 200) {
      tableListData.value = res.data.list;
    }
  });
});
</script>

<style lang="scss" scoped>


</style>
