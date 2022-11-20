<template>

  <div class="wrapper" >

      <div class="header">
        <el-button text :icon="ArrowLeft" @click="handleReturn">返回</el-button>
        <div class="name">{{info.orgName}}</div>
        <div class="salesman">销售人员：{{info.saleUserName}}</div>
      </div>

    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="加入日期">
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
        <el-input v-model="queryParams.queryContractCode" placeholder="搜合同编号" style="width: 250px"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <div class="table-container">
      <el-table :data="deptList" stripe  v-loading="loading">
        <el-table-column prop="contractCode" label="合同编号" width="180" align="center" >
          <template #default="scope">{{scope.row.contractCode?scope.row.contractCode:'--'}}</template>
        </el-table-column>
        <el-table-column label="下载合同" prop="download" show-overflow-tooltip align="center">
          <template #default="scope">
            <el-button link type="primary" @click="downloadContract(scope.row.hippId)" v-if="scope.row.status>2">下载</el-button>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="签约清单" align="center">
          <template #default="scope">
            <el-link :href="scope.row.applyListAttachFile" v-if=" scope.row.applyListAttachFile" type="primary">查看</el-link>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="signTime" label="签约日期"  align="center">
          <template #default="scope">{{scope.row.signTime?scope.row.signTime:'--'}}</template>
        </el-table-column>
        <el-table-column prop="partyAUser" label="签约人"  align="center"/>
        <el-table-column prop="amountPayable" label="应付金额(元)"  align="center">
          <template #default="scope">{{scope.row.amountPayable?scope.row.amountPayable:'--'}}</template>
        </el-table-column>
        <el-table-column prop="amountActuallyPaid" label="实付金额(元)"   align="center">
          <template #default="scope">{{scope.row.amountActuallyPaid?scope.row.amountActuallyPaid:'--'}}</template>

        </el-table-column>
        <el-table-column label="支付时间" prop="payTime" show-overflow-tooltip align="center">
          <template #default="scope">{{scope.row.payTime?scope.row.payTime:'--'}}</template>
        </el-table-column>
        <el-table-column label="支付类型" prop="payType" show-overflow-tooltip align="center">
          <template #default="scope">{{scope.row.payType?scope.row.payType==1?'微信':'线下':'--'}}</template>
        </el-table-column>
        <el-table-column label="支付凭证" prop="hippPayVouchers" show-overflow-tooltip align="center">
          <template #default="scope">
            <el-link :href="scope.row.paymentVoucherAttachFile" v-if=" scope.row.paymentVoucherAttachFile">查看</el-link>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="状态"  show-overflow-tooltip align="center" fixed="right">
          <template #default="scope">
            <div class="item-wrapper-inbox" v-if="scope.row.status === 1 || scope.row.status === 3 || scope.row.status === 4">
              <div class="dot wait" ></div>
              <div>{{ scope.row.status === 1?'待签约':scope.row.status === 3?'待付款':'待进件' }}</div>
            </div>

            <div class="item-wrapper-inbox" v-if="scope.row.status === 2 || scope.row.status === 10 ">
              <div class="dot complete" ></div>
              <div>{{ scope.row.status === 2?'已失效': '已归档'}}</div>
            </div>

            <div class="item-wrapper-inbox" v-if="scope.row.status === 5 ">
              <div class="dot audit" ></div>
              <div>审核中</div>
            </div>

            <div class="item-wrapper-inbox" v-if="scope.row.status === 6 ">
              <div class="dot reject" ></div>
              <div>驳回</div>
            </div>

            <div class="item-wrapper-inbox" v-if="scope.row.status === 7 ">
              <div class="dot agree" ></div>
              <div>审核通过</div>
            </div>

            <span v-if="!scope.row.status">--</span>

          </template>
        </el-table-column>

      </el-table>
    </div>

    <div class="tab-list">
      <div class="tab-list-item">
        <div class="item-wrapper">
          <div class="dot complete"></div>
          <div>已失效</div>
        </div>
        <div class="item-wrapper">
          <div class="dot complete"></div>
          <div>已归档</div>
        </div>
      </div>
      <div class="tab-list-item">
        <div class="item-wrapper">
          <div class="dot wait"></div>
          <div>待签约</div>
        </div>
        <div class="item-wrapper">
          <div class="dot wait"></div>
          <div>待付款</div>
        </div>
        <div class="item-wrapper">
          <div class="dot wait"></div>
          <div>待进件</div>
        </div>

      </div>
      <div class="tab-list-item">
        <div class="item-wrapper">
          <div class="dot audit"></div>
          <div>审核中</div>
        </div>
        <div class="item-wrapper">
          <div class="dot reject"></div>
          <div>驳回</div>
        </div>
        <div class="item-wrapper">
          <div class="dot agree"></div>
          <div>审核通过</div>
        </div>
      </div>
    </div>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getPagination"
    />
  </div>

</template>

<script setup >

import {useRouter} from "vue-router";
import {getCurrentInstance, ref ,onMounted} from "vue";
import {ArrowLeft,View,} from '@element-plus/icons-vue';
import request from "@/utils/request";
import {downLoadFile,downloadContract} from "@/api/insurance/customer";


const queryTime=ref([])
const router=useRouter()
const {proxy}=getCurrentInstance()
const info=ref({
  orgName: router.currentRoute.value.query.orgName,
  saleUserName: router.currentRoute.value.query.saleUserName || '暂无',
  orgId: router.currentRoute.value.query.orgId,
})
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  corpId:info.value.orgId,
  queryContractCode:'',

})
const defaultParams = ref({
  corpId:info.value.orgId,
  pageNum: 1,
  pageSize: 10,
})
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
const showSearch = ref(true)
const loading = ref(false)
const total = ref('')
const deptList = ref([])


//返回
const handleReturn = () => {
  const obj = { path: "/insurance/customer" };
  proxy.$tab.closeOpenPage(obj);
}

// 搜索
const handleQuery = () => {
  if(queryTime.value){
    let [begin,end]=queryTime.value
    queryParams.value.querySignTimeStart=begin
    queryParams.value.querySignTimeEnd=end
  }else{
    queryParams.value.querySignTimeStart=''
    queryParams.value.querySignTimeEnd=''
  }

  getDeptList(queryParams.value)
}

//获取表格数据
const getDeptList=(params)=>{
  request(
      {
        url:"/hipp/admin/hipp/applyinfo/list",
        method:"get",
        params:params
      }
  ).then((res)=>{
    if(res.code==200){
      total.value=Number(res.data.total)
      deptList.value=res.data.list
    }

  }).catch((err)=>console.log(err))
}

const resetQuery=()=>{
  queryTime.value=[]
  queryParams.value.queryContractCode=''
  queryParams.value.querySignTimeStart=''
  queryParams.value.querySignTimeEnd=''
  getDeptList(defaultParams.value)
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

// const downLoadContract=(url)=>{
//   request({
//     url:"/file/file/downloadFileByUrl",
//     params:{
//       url:btoa(url)
//     },
//     method:'get',
//     responseType: 'blob'
//   }).then((res)=>{
//     const blobUrl = window.URL.createObjectURL(new Blob([res]))
//     const a = document.createElement('a')
//     const filename = 'xxxx.pdf'
//     a.href = blobUrl
//     a.download = filename
//     a.target = filename
//     a.click()
//     window.URL.revokeObjectURL(blobUrl)
//   })
// }

const preview=(url)=>{
  window.location.href = url
}

onMounted(()=>{
  getDeptList(defaultParams.value)
})
</script>


<style lang="scss" >
$complete:#ADADAD;
$wait:#FF7301;
$audit:#4672FF;
$reject:#FF5A40;
$agree:#80D249;
$base-black:#333;

.complete{
  background: $complete;
}
.wait{
  background: $wait;
}
.audit{
  background: $audit;
}
.reject{
  background: $reject;
}.agree{
   background: $agree;
 }

.wrapper{
  margin: 20px;
  padding:10px;
  .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #E5E5E5;
  padding-bottom: 20px;
  margin-bottom: 30px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #333333;
  line-height: 39px;
  .name {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    line-height: 39px;
  }
  .salesman {
    font-size: 14px;
  }
}
}



.table-container{
  margin: 10px;
  padding: 30px;
}

.tab-list{
  //margin-left: 500px;
  margin-top: 30px;
  display: flex;
  padding: 30px;
  float:right;
  .tab-list-item{
    margin: 0 15px;
    .item-wrapper{
      display: flex;
      font-size: 0.6rem;
      align-items: center;
      font-weight: bold;
      margin: 10px 0;
      color: $base-black;
      .dot{
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 15px;
      }
    }
  }
}

.item-wrapper-inbox{
  display: flex;
  font-size: 0.6rem;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  //margin: 10px 0;
  color: $base-black;
  .dot{
    width: 5px;
    height: 5px;
    border-radius: 50%;
    margin-right: 5px;
  }
}


.el-input{
  width: 400px !important;
}

</style>
