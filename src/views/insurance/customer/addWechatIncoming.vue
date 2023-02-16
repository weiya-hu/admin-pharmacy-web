<template>
  <div class="wechart-coming" v-loading="loading">
    <el-steps :active="active" finish-status="success" class="step">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
      <el-step title="步骤 6"></el-step>
    </el-steps>
    <keep-alive>
      <component :is="choose" :ref="`formInfoRef${active+1}`" @result="getValue" class="form-item"></component>
    </keep-alive>
    <div class="flexr">
      <el-button  plain class="submit-button"  @click="reback">返回</el-button>
      <el-button type="primary" plain class="submit-button"  @click="next">{{active ==5 ? '提交' : '下一步' }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from "vue";
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

const active = ref(0)
const list = {
  0:{name:ManagerInfo,todo:()=>{formInfoRef1.value.submit()}},
  1:{name:MainInfo,todo:()=>{formInfoRef2.value.submit()}},
  2:{name:BankInfo,todo:()=>{formInfoRef3.value.submit()}},
  3:{name:SettlementInfo,todo:()=>{formInfoRef4.value.submit()}},
  4:{name:BusinessInfo,todo:()=>{formInfoRef5.value.submit()}},
  5:{name:SupplyInfo,todo:()=>{formInfoRef6.value.submit()}},
}
const choose = computed(()=>{
  return list[active.value].name
})


const getValue = async(val)=>{
  console.log(111,val)
  if(val){
    let wechartData = sessionStorage.getItem('wechartFormData')
    let wechartDatas =  Object.assign(wechartData?JSON.parse(wechartData):{},val)
    sessionStorage.setItem('wechartFormData',JSON.stringify(wechartDatas))
    if(active.value == 5){
      console.log(wechartDatas)
      const {code, msg} = await addWxpayApplyment_api(wechartDatas)
      code == 200 && ElMessage.success(msg)//to do 成功后跳转

      code !== 200 && ElMessage.error(msg)
    }
    active.value = active.value<5 ? active.value+1 : 5
  }else{
    return
  }

}

const reback = ()=>{
  active.value = active.value>0 ? active.value-1 : 0
}

const next =()=>{
  list[active.value].todo()
  // 
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
  width: 1000px;
  margin: 0 auto;
  padding: 30px 0;
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
    width: 120px;
    height: 40px;
    margin: 50px 0 30px 80px;
  }
  .form-item{
    // margin-bottom: 20px;
  }
  .step{
    margin: 0 0 40px;
  }
}

</style>
