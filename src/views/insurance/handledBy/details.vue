<template>
  <div class="app-container">
    <div class="header">
      <el-button text :icon="ArrowLeft" @click="handleReturn">返回</el-button>
      <div class="name">{{info.orgName}}</div>
      <div class="salesman">销售人员：{{info.salesman}}</div>
    </div>
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="签约日期">
        <el-date-picker value-format="YYYY-MM-DD"
                        v-model="queryTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="加入日期"
                        end-placeholder="结束日期"
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

    <el-table :data="deptList" v-loading="loading" stripe >
      <el-table-column label="合同编号" prop="contractCode" show-overflow-tooltip align="center">
        <template #default="scope">
          <span>{{scope.row.contractCode?scope.row.contractCode:'--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下载合同" prop="download" show-overflow-tooltip align="center">
        <template #default="scope" >
          <el-button link type="primary" @click="downloadContract(scope.row.hippId)" v-if="scope.row.status>2">下载</el-button>
        <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="签约清单" prop="list" show-overflow-tooltip align="center">
        <template #default="scope">
          <el-link :href="scope.row.applyListAttachFile" v-if=" scope.row.applyListAttachFile">查看</el-link>

          <!--          <el-button link type="primary" @click="downLoadFile(scope.row.applyListAttachFile[0])" v-if="scope.row.applyListAttachFile && scope.row.applyListAttachFile.length>0">下载</el-button>-->
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="签约人" prop="partyAUser" show-overflow-tooltip align="center">
        <template #default="scope">
          <span>{{scope.row.partyAUser?scope.row.partyAUser:'--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="签约日期" prop="signTime" show-overflow-tooltip align="center">
        <template #default="scope">
          <span>{{scope.row.signTime?scope.row.signTime:'--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="签约机构数量(家)" prop="applyOrgNum" show-overflow-tooltip width="130" align="center">
        <template #default="scope">
          <span>{{scope.row.applyOrgNum?scope.row.applyOrgNum:'--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="应付金额(元)" prop="amountPayable" show-overflow-tooltip width="100" align="center">
        <template #default="scope">
          <span>{{scope.row.amountPayable?scope.row.amountPayable:'--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实付金额(元)"  show-overflow-tooltip width="100" align="center">
        <template #default="scope">{{scope.row.amountActuallyPaid?scope.row.amountActuallyPaid:'--'}}</template>
      </el-table-column>
      <el-table-column label="支付时间"  show-overflow-tooltip align="center">
        <template #default="scope">{{scope.row.payTime?scope.row.payTime:'--'}}</template>
      </el-table-column>
      <el-table-column label="支付类型" show-overflow-tooltip align="center">
        <template #default="scope">{{scope.row.payType?scope.row.payType==1?'微信':'线下':'--'}}</template>

      </el-table-column>
      <el-table-column label="支付凭证"  show-overflow-tooltip align="center">
        <template #default="scope">
          <el-link :href="scope.row.paymentVoucherAttachFile" v-if=" scope.row.paymentVoucherAttachFile">查看</el-link>
<!--          <el-button link type="primary" @click="downLoadFile(scope.row.paymentVoucherAttachFile[0])" v-if=" scope.row.paymentVoucherAttachFile && scope.row.paymentVoucherAttachFile.length>0">查看</el-button>-->
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="进件申请" prop="hippApplys" show-overflow-tooltip align="center">
        <template #default="scope">
          <el-link :href="scope.row.incomingPartListAttachFile" v-if=" scope.row.incomingPartListAttachFile">查看</el-link>

<!--          <el-button type="primary" link @click="downLoadFile(scope.row.incomingPartListAttachFile[0])" v-if="scope.row.incomingPartListAttachFile && scope.row.incomingPartListAttachFile.length>0">查看</el-button>-->
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
      <el-table-column label="操作" width="130" align="center" fixed="right">
        <template #default="scope">
          <el-tooltip content="查看" placement="top">
<!--            <el-button text type="primary" :icon="View" @click="handleClick('see', scope.row)" ></el-button>-->
            <el-button text type="primary" :icon="View" @click="handleClick('see', scope.row)" v-if="scope.row.status>4 && scope.row.status"></el-button>
          </el-tooltip>
          <el-tooltip content="归档" placement="top">
            <el-button v-if="scope.row.canArchive" text type="primary" :icon="Check" @click="handleClick('file', scope.row)">归档</el-button>
          </el-tooltip>
          <span v-if="scope.row.status==1 || scope.row.status==2 ||scope.row.status==3 || scope.row.status==4 || !scope.row.status">--</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getPagination"
    />
    <div class="tab-list">
      <div class="tab-list-item">
        <div class="item-wrapper">
          <div class="dot complete"></div>
          <dvi>已失效</dvi>
        </div>
        <div class="item-wrapper">
          <div class="dot complete"></div>
          <dvi>已归档</dvi>
        </div>
      </div>
      <div class="tab-list-item">
        <div class="item-wrapper">
          <div class="dot wait"></div>
          <dvi>待签约</dvi>
        </div>
        <div class="item-wrapper">
          <div class="dot wait"></div>
          <dvi>待付款</dvi>
        </div>
        <div class="item-wrapper">
          <div class="dot wait"></div>
          <dvi>待进件</dvi>
        </div>

      </div>
      <div class="tab-list-item">
        <div class="item-wrapper">
          <div class="dot audit"></div>
          <dvi>审核中</dvi>
        </div>
        <div class="item-wrapper">
          <div class="dot reject"></div>
          <dvi>驳回</dvi>
        </div>
        <div class="item-wrapper">
          <div class="dot agree"></div>
          <div>审核通过</div>
        </div>

      </div>
    </div>
  </div>



</template>

<script setup>
import {useRouter} from "vue-router";
import {getCurrentInstance, ref ,onMounted} from "vue";
import {ArrowLeft,View, Check} from '@element-plus/icons-vue';
import request from "@/utils/request";
import {downLoadFile,downloadContract} from "@/api/insurance/customer";
import {ElNotification} from "element-plus";


const router = useRouter();
const { proxy } = getCurrentInstance();
const info = ref({
  orgName: router.currentRoute.value.query.orgName,
  salesman: router.currentRoute.value.query.salesman || '暂无',
  orgId: router.currentRoute.value.query.orgId,
})
const queryTime=ref('')
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  queryContractCode:'',
  corpId:info.value.orgId,
})
const defaultParams = ref({
  corpId:info.value.orgId,
  pageNum: 1,
  pageSize: 10,
})
const showSearch = ref(true)
const loading = ref(false)
const total = ref(0)
const deptList = ref([])




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
// 重置
const resetQuery = () => {
 queryTime.value=''
  queryParams.value.queryContractCode=''
  queryParams.value.querySignTimeStart=''
  queryParams.value.querySignTimeEnd=''
  getDeptList(defaultParams.value)
}


const getList = () => {
  getDeptList(defaultParams.value)
}


// 按钮
const handleClick = (type, row) => {
  if (type === 'see') {
    router.push({
      path:"/insurance/details/inputs",
      query:{
        hippId:row.hippId,
        contractCode:row.contractCode,
        signTime:row.signTime,
        applyOrgNum:row.applyOrgNum
      }
    })
  } else if (type === 'file') {
    let {hippId}=row
    request({
      url:"/hipp/admin/hipp/detail/updateState",
      params:{
        hippId,
        status:10
      }
    }).then(res=>{
      if(res.code==200){
        ElNotification({
          title:"归档成功",
          type:'success'
        })
      }
    })
  }
}
// 返回
const handleReturn = () => {
  const obj = { path: "/insurance/handleBy" };
  proxy.$tab.closeOpenPage(obj);
}
const getDeptList=(params)=>{

  request(
      {
        url:"/hipp/admin/hipp/applyinfo/list",
        method:"get",
        params,
      }
  ).then((res)=>{
    if(res.code==200){
      total.value=Number(res.data.total)
      deptList.value=res.data.list
    }
  }).catch((err)=>console.log(err))
}


const preview=(url)=>{
  window.location.herf=url
}

// 修改分页条件
const getPagination = (e) => {
  let {limit,page}=e
  queryParams.value.pageNum=page,
      queryParams.value.pageSize=limit,
      getDeptList(queryParams.value)
}




onMounted(()=>{
 getDeptList(defaultParams.value)
})
</script>










<style lang="scss" scoped>
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

.tab-list{
  //margin-left: 500px;
  float: right;
  display: flex;
  padding: 30px;
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



</style>
