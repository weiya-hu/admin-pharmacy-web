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
    <!-- <keep-alive> -->
      <!-- <component :is="choose" :ref="`formInfoRef${active+1}`" @result="getValue" class="form-item"></component> -->
      <MainInfo v-show="active == 0"  ref="formInfoRef1" @result="getValue" class="form-item"/>
      <ManagerInfo v-show="active == 1" ref="formInfoRef2" @result="getValue" class="form-item"/>
      <BusinessInfo v-show="active == 2"  ref="formInfoRef3" @result="getValue"  class="form-item"/>
      <BankInfo v-show="active == 3"  ref="formInfoRef4" @result="getValue" class="form-item"/>
      <SettlementInfo v-show="active == 4"  ref="formInfoRef5" @result="getValue" class="form-item"/>
      <SupplyInfo v-show="active == 5"  ref="formInfoRef6" @result="getValue" class="form-item"/>
    <!-- </keep-alive> -->
    <div class="flexr">
      <el-button  plain class="submit-button"  @click="reback" v-if="active>0">上一步</el-button>
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

const router = useRouter();
const loading=ref(true)
const formInfoRef1 = ref()
const formInfoRef2 = ref()
const formInfoRef3 = ref()
const formInfoRef4 = ref()
const formInfoRef5 = ref()
const formInfoRef6 = ref()

const active = ref(0)
const list = {
  0:{name:MainInfo,todo:()=>{formInfoRef1.value.submit()}},
  1:{name:ManagerInfo,todo:()=>{formInfoRef2.value.submit()}},
  2:{name:BusinessInfo,todo:()=>{formInfoRef3.value.submit()}},
  3:{name:BankInfo,todo:()=>{formInfoRef4.value.submit()}},
  4:{name:SettlementInfo,todo:()=>{formInfoRef5.value.submit()}},
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
      code == 200 && (()=>{
        ElMessage.success(msg)//to do 成功后跳转
        router.push('/insurance/wechatIncoming')
      })()
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
  console.log(formInfoRef1.value);
  list[active.value].todo()
  // switch(active.value){
  //   case 0 :formInfoRef1.value.submit();break;
  //   case 1 :formInfoRef2.value.submit();break;
  //   case 2 :formInfoRef3.value.submit();break;
  //   case 3 :formInfoRef4.value.submit();break;
  //   case 4 :formInfoRef5.value.submit();break;
  //   case 5 :formInfoRef6.value.submit();break;
  // }
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
