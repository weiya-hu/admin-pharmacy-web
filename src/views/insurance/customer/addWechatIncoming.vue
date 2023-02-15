<template>
  <div class="wechart-coming flexa">
    <div>
      <ManagerInfo />
      <MainInfo />
      <BankInfo />
    </div>
    <div>
      <SettlementInfo />
      <BusinessInfo />
      <SupplyInfo />
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import ManagerInfo from './components/managerInfo.vue'
import SettlementInfo from './components/settlementInfo.vue'
import MainInfo from './components/mainInfo.vue'
import BusinessInfo from './components/businessInfo.vue'
import BankInfo from './components/bankInfo.vue'
import SupplyInfo from './components/supplyInfo.vue'
</script>

<style lang="scss" scoped>
.wechart-coming{
  width: 1440px;
  margin: 0 auto;
  &:deep(.el-form-item.is-required.asterisk-left>.el-form-item__label:before){
      content: '';
      margin-right:0;
    }
  &:deep(.el-form-item.is-required.asterisk-left>.el-form-item__label>.label-explain>div>span::before){
    content: '*';
    margin-right:4px;
    color:var(--el-color-danger);
  }
}

</style>
