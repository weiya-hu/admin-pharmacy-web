<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item>
        <el-select v-model="queryParams.region" placeholder="所属区域">
          <el-option v-for="item in regionList" :value="item.value" :label="item.name" :key="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
<!--        <el-select v-model="queryParams.source" placeholder="客户来源">-->
<!--          <el-option v-for="item in sourceList" :value="item.value" :label="item.name" :key="item.value"/>-->
<!--        </el-select>-->
      </el-form-item>
      <el-form-item label="加入日期">
        <el-date-picker
            v-model="queryParams.date"
            type="date"
            placeholder="加入日期"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryParams.name" placeholder="搜企业名称/联系人/联系电话" style="width: 250px"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :data="deptList.value" >
      <el-table-column prop="orgName" label="企业名称" show-overflow-tooltip align="center"/>
      <el-table-column prop="orgContactUser" label="联系人" align="center"/>
      <el-table-column prop="orgContactTel" label="联系电话" show-overflow-tooltip align="center"/>
      <el-table-column prop="orgRegion" label="所属区域" align="center"/>
      <el-table-column prop="orgAddress" label="详细地址" show-overflow-tooltip align="center"/>
      <el-table-column prop="joinDate" label="加入日期" show-overflow-tooltip align="center"/>
      <el-table-column prop="saleUserName" label="销售人员" align="center" :formatter="caseTypeNamesFormat">
      </el-table-column>
      <el-table-column label="申请记录">
        <template #default="scope">
          <el-button text type="primary"  @click="handleSee(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
  <pagination
      :total="total"
      v-show="total > 0"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
  />

</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import request from "@/utils/request";
import {getUserInfo} from "@/utils/auth";
import {onMounted} from "vue";

const router = useRouter();
const total = ref(0)
const queryParams = ref({
  region: '',
  // source: '',
  date: '',
  name: '',
  pageNum: 1,
  pageSize: 10,
  userType:2
})
const defaultParams = ref({
  userType:1,
  pageNum: 1,
  pageSize: 10,
})
const showSearch = ref(true)

// 所属区域
const regionList = [
  {value: '1', name: '四川'},
  {value: '2', name: '重庆'},
  {value: '3', name: '陕西'}
]
// 客户来源
const sourceList = [
  {value: '1', name: '店绩'},
  {value: '2', name: '线下'}
]
let deptList =[]


onMounted(()=>{
  let useInfo=ref(getUserInfo())
  getDeptList(useInfo.value.corpId)
})
// 搜索
 const handleQuery = () => {
    request(
        {
          url:"/hipp/hipp/rel/getMyCustomer",
          method:"get",
          params:queryParams.value
        }
    ).then((res)=>{
      if(res.code==200){
        deptList.value=res.data.list
        total.value=res.data.total
      }
    })
}
// 重置
const resetQuery = () => {
  queryParams.value.date=''
  queryParams.value.region=''
  queryParams.value.name=''
}
// 刷新表格数据
const getList = () => {

}
const caseTypeNamesFormat=(row)=>{
  return row.saleUserName?row.saleUserName:'--'
}

//获取客服
const getDeptList=()=>{
   request(
      {
        url:"/hipp/hipp/rel/getMyCustomer",
        method:"get",
        params:defaultParams.value
      }
  ).then((res)=>{
    if(res.code==200){
       total.value=res.data.total
       deptList.value=res.data.list
    }
   }).catch((err)=>console.log(err))
}


// 查看申请记录
const handleSee = ({name,salesman}) => {
  router.push({
    path: '/customer/Details',
    query: {name: name, salesman: salesman}
  })
}
</script>


