<template>
  <div class="wechart-coming" v-loading="loading">
    <div class="flex">
      <div>
        <ManagerInfo ref="formInfoRef1" @result="getValue" class="form-item"/>
        <MainInfo ref="formInfoRef2" @result="getValue" class="form-item"/>
        <BankInfo ref="formInfoRef3" @result="getValue" class="form-item"/>
      </div>
      <div>
        <SettlementInfo ref="formInfoRef4" @result="getValue" class="form-item"/>
        <BusinessInfo ref="formInfoRef5" @result="getValue"  class="form-item"/>
        <SupplyInfo ref="formInfoRef6" @result="getValue" class="form-item"/>
      </div>
    </div>
    
    <el-button type="primary" plain class="submit-button" @click="submit">提交</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { addWxpayApplyment_api } from '@/api/insurance/wechatIncoming'
import ManagerInfo from './components/managerInfo.vue'
import SettlementInfo from './components/settlementInfo.vue'
import MainInfo from './components/mainInfo.vue'
import BusinessInfo from './components/businessInfo.vue'
import BankInfo from './components/bankInfo.vue'
import SupplyInfo from './components/supplyInfo.vue'
import { ElMessage } from 'element-plus'
const loading=ref(true)
const formInfoRef1 = ref()
const formInfoRef2 = ref()
const formInfoRef3 = ref()
const formInfoRef4 = ref()
const formInfoRef5 = ref()
const formInfoRef6 = ref()
let num =0
let arr = []


const submit = ()=>{
  formInfoRef1.value.submit()
  formInfoRef2.value.submit()
  formInfoRef3.value.submit()
  formInfoRef4.value.submit()
  // formInfoRef5.value.submit()
  formInfoRef6.value.submit()
}

const getValue = async(val)=>{
  if(val){
    num=num +1
    arr.push(val)
    console.log(num)
    if(num == 5){
      console.log(arr)
      let data = {}
      arr.forEach(m=>{
        data = {
          ...m
        }
      })
      console.log(data)
      const {code, msg} = await addWxpayApplyment_api(data)
      code == 200 && ElMessage.success(msg)
      code !== 200 && ElMessage.error(msg)
      
    }
  }else{
    num =0
    arr = []
  }
}

onMounted(()=>{
  console.log(55)
})
nextTick(()=>{
  console.log(66)
  loading.value = false
})
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
  .submit-button{
    width: 200px;
    height: 40px;
    display: block;
    margin: 30px auto;
  }
  .form-item{
    // margin-bottom: 20px;
  }
}

</style>
