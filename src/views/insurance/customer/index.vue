<template>

  <!--  筛选-->
  <div class="search-container">

    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="签约日期">
        <el-date-picker value-format="YYYY-MM-DD"
                        v-model="queryTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="加入日期"
                        end-placeholder="结束日期"
                        :shortcuts="shortcuts"
        />
      </el-form-item>

 <el-form-item>
   <el-select class="m-2" placeholder="所属区域" size="normal" v-model="queryParams.region" >
     <el-option
         v-for="(item,index) in area"
         :key="index"
         :value="item"
     />
   </el-select>
 </el-form-item>

      <el-form-item>
        <el-input v-model="queryParams.queryQuickSearch" placeholder="搜企业名称/联系人/联系电话" style="width: 250px"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <div class="search-item">
      <el-button @click="handleShare" type="primary">分享</el-button>
    </div>
  </div>

  <!--制表  -->
  <div class="table-container">
    <el-table :data="deptList" stripe  >
      <el-table-column prop="orgName" label="企业名称"  align="center" show-overflow-tooltip/>
      <el-table-column prop="orgContactUser" label="联系人"  align="center" show-overflow-tooltip/>
      <el-table-column prop="orgContactTel" label="联系电话" align="center" show-overflow-tooltip/>
      <el-table-column prop="orgRegion" label="所属区域" align="center" show-overflow-tooltip/>
      <el-table-column prop="orgAddress" label="详细地址" width="300" align="center" show-overflow-tooltip/>
      <el-table-column prop="joinDate" label="加入日期" sortable align="center" show-overflow-tooltip/>
      <el-table-column prop="pay" label="签约付款" align="center">
        <template #default="scope">
      <el-tooltip content="查看" placement="top">
        <el-button :icon='View' type="primary" text @click="goSignRecord(scope.row)" size="large">
        </el-button>
      </el-tooltip>
        </template>
      </el-table-column>
      <!--      <el-table-column prop="operation" label="操作" fixed="right" align="center">-->
      <!--        <el-button-->
      <!--            size="small"-->
      <!--            color="#008c8c"-->
      <!--        >编辑</el-button-->
      <!--        >-->
      <!--      </el-table-column>-->
    </el-table>
  </div>
  <el-dialog v-model="dialogVisible" width="750px" append-to-body draggable :close-on-click-modal="false">
    <template #header>
      <span>下方是您的专属邀请链接，复制并分享给客户，客户通过此链接进行申请，即为您的业绩</span>
    </template>
    <div>
      <p class="state_url">{{ state.url }}</p>
      <!--      <el-link :underline="false" icon="DocumentCopy" v-copyText="state.url" v-copyText:callback="copyTextSuccess">复制</el-link>-->
    </div>
  </el-dialog>


  <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getPagination"
  />
</template>

<script  setup>
import {ref, onMounted, reactive} from 'vue'
import {View} from '@element-plus/icons-vue'
import {useRouter} from 'vue-router'
import {returnUrl} from '../../../api/insurance/customer'
import {ElMessage} from "element-plus";
import request from "@/utils/request";

const router = useRouter()
const state = reactive({
  url: ''
})
const dialogVisible = ref(false)
const queryTime=ref('')
const area=ref(["重庆",'北京','成都','陕西'])

//快速切换时间
const shortcuts = [
  {
    text: '前一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '前一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '前一季度',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  userType:2
})
const defaultParams = ref({
  pageNum: 1,
  pageSize: 10,
  userType:2
})
const showSearch = ref(true)
const loading = ref(false)
const total = ref(0)
const deptList = ref([])

onMounted(() => {
  getDeptList(defaultParams.value)
  // tableData.value.map(i=>{
  //   i['pay']='查看'
  //   i['operation']='编辑'
  //   return i
  // })
})

const resetQuery=()=>{
  queryTime.value=''
  queryParams.value.region=''
  queryParams.value.queryQuickSearch=''
  queryParams.value.queryJoinDateStart=''
  queryParams.value.queryJoinDateEnd=''
  getDeptList(defaultParams.value)
}

const goSignRecord =(row)=>{
  let {saleUserName,orgName,orgId}=row
  router.push({
    path: '/customer/signRecord',
    query:{
      saleUserName,
      orgId,
      orgName
    }
  })
}

// 分享
const handleShare = () => {
  dialogVisible.value = true
  returnUrl({productId: 'admin'}).then(res => {
    state.url = res.data
  })
}

// 复制
function copyTextSuccess() {
  ElMessage.success('复制成功')
  console.log('url', state.url)
}

const handleQuery = () => {
  let [begin,end]=queryTime.value
  queryParams.value.queryJoinDateStart=begin
  queryParams.value.queryJoinDateEnd=end
  getDeptList(queryParams.value)
}

const getDeptList=(params)=>{
  request(
      {
        url:"/hipp/hipp/rel/getMyCustomer",
        method:"get",
        params:params
      }
  ).then((res)=>{
    if(res.code==200){
      total.value=res.data.total
      deptList.value=res.data.list
    }
  }).catch((err)=>console.log(err))
}

const getList=()=>{
  getDeptList(queryParams.value)
}

const getPagination = (e) => {
  let {limit,page}=e
  queryParams.value.pageNum=page,
  queryParams.value.pageSize=limit,
  getDeptList(queryParams.value)

}


</script>

<style lang="scss" scoped>
:root {
  font-size: 16px !important;
}

.search-container {
  margin: 10px;
  padding: 30px;
}


.table-container {
  margin: 10px;
}

.state_url {
  text-align: center;
  line-height: 27px;
  font-weight: bold;
  font-size: 18px;
}

</style>