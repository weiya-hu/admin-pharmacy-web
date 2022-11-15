<template>
  <div class="app-container">


    <el-button text :icon="ArrowLeft" @click="handleReturn">返回</el-button>

    <h3 style="text-align: center;font-weight: bold" s>进件清单</h3>
    <el-divider />
    <div class="header">
      <div class="salesman">合同号：{{info.contactCode}}</div>
      <div class="salesman">签约日期：{{info.signTime}}</div>
      <div class="salesman">本单签约机构 {{info.applyOrgNum}} 家</div>
    </div>


    <el-table :data="deptList" v-loading="loading" stripe >
      <el-table-column label="机构名称" prop="orgName" show-overflow-tooltip align="center"/>
      <el-table-column label="医药机构编码" prop="orgCode" show-overflow-tooltip align="center"/>
      <el-table-column label="统一社会信用代码" prop="orgCreditCode" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column label="拟定电子凭证接入通道" prop="accessChannel" show-overflow-tooltip align="center"/>
      <el-table-column label="申请接入应用类型" prop="appType" show-overflow-tooltip align="center"/>
      <el-table-column label="申请接入应用名称" prop="appName" show-overflow-tooltip width="130" align="center"/>
      <el-table-column label="定点医药机构联系人" prop="orgContactUser" show-overflow-tooltip width="100" align="center"/>
      <el-table-column label="定点医药机构联系电话" prop="orgContactTel" show-overflow-tooltip width="100" align="center">

      </el-table-column>
      <el-table-column label="申请函(附件)" prop="hippPayinfos[0].payTime" show-overflow-tooltip align="center">
        <template #default="scope">{{scope.row.hippPayinfos?scope.row.hippPayinfos[0].payTime:'--'}}</template>
      </el-table-column>
      <el-table-column label="状态"  show-overflow-tooltip align="center" fixed="right">
        <template #default="scope">
          <div class="item-wrapper-inbox" v-if="scope.row.status === 1 ">
            <div class="dot complete" ></div>
            <div>请上传附件</div>
          </div>

          <div class="item-wrapper-inbox" v-if="scope.row.status === 2 ">
            <div class="dot wait" ></div>
            <div>待提交</div>
          </div>

          <div class="item-wrapper-inbox" v-if="scope.row.status === 3 ">
            <div class="dot audit" ></div>
            <div>审核中</div>
          </div>

          <div class="item-wrapper-inbox" v-if="scope.row.status === 4 ">
            <div class="dot reject" ></div>
            <div>驳回</div>
          </div>

          <div class="item-wrapper-inbox" v-if="scope.row.status === 5 ">
            <div class="dot agree" ></div>
            <div>审核通过</div>
          </div>

        </template>
      </el-table-column>
      <el-table-column label="操作" width="130" align="center" fixed="right">
        <template #default="scope">
          <el-button text type="primary" :icon="View" @click="goDetail(scope.$index)" v-if="scope.row.canCheck==true"></el-button>
          <el-tooltip content="上传回执" placement="top">
            <el-button v-if="scope.row.canUpLoadFile===true" text type="primary" :icon="UploadFilled" @click="handleClick('file', scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog
      v-model="dialogVisible"
      width="60%"
      align-center
      center
  >
    <template #header>
      <div style="font-weight: bold">请根据实际情况完善以下信息，完善且确认无误，可直接提交审核</div>
    </template>

      <div class="dialog-container">
        <div class="diglog-item">
          <div class="key">机构名称：</div>
          <div class="value">{{singleDetail.orgName}}</div>
        </div>
        <div class="diglog-item">
          <div class="key">定点医药机构编码：
          </div>
          <div class="value">
            {{singleDetail.orgCode}}
          </div>
        </div>
        <div class="diglog-item">
          <div class="key">统一社会信用代码：
          </div>
          <div class="value">
            {{singleDetail.orgCreditCode}}
          </div>
        </div>
        <div class="diglog-item">
          <div class="key">拟定电子凭证接入渠道：
          </div>
          <div class="value">
            {{singleDetail.accessChannel}}
          </div>
        </div>
        <div class="diglog-item">
          <div class="key">申请接入应用类型：
          </div>
          <div class="value">
            {{singleDetail.appType}}
          </div>
        </div>

        <div class="diglog-item">
          <div class="key">申请接入应用名称：
          </div>
          <div class="value">
            {{singleDetail['appName']}}
          </div>
        </div>

        <div class="diglog-item">
          <div class="key">定点医药机构联系人：
          </div>
          <div class="value">{{singleDetail.orgContactUser}}
          </div>
        </div>

        <div class="diglog-item">
          <div class="key">定点医药机构联系电话：</div>
          <div class="value">
            {{singleDetail.orgContactTel}}
          </div>
        </div>

        <div class="diglog-item">
          <div class="key">授权经办人：</div>
          <div class="value">
            {{singleDetail.platformOperatorName}}
          </div>
        </div>

        <div class="diglog-item">
          <div class="key">授权经办人账号：</div>
          <div class="value">{{singleDetail.platformOperatorAccount}}</div>
        </div>

        <div class="diglog-item">
          <div class="key">授权经办人密码：</div>
          <div class="value">
            {{singleDetail.platformOperatorPwd}}
          </div>
        </div>


      </div>

  </el-dialog>

<!--  <el-button @click="goDetail" color="#008c8c">测试查看</el-button>-->


</template>

<script setup>
import {useRouter} from "vue-router";
import {getCurrentInstance, ref ,onMounted} from "vue";
import request from "@/utils/request";
import {ArrowLeft,UploadFilled} from "@element-plus/icons-vue";

const router=useRouter();
const { proxy } = getCurrentInstance();
const info = ref({
  hippId: router.currentRoute.value.query.hippId,
  contactCode: router.currentRoute.value.query.contactCode,
  signTime: router.currentRoute.value.query.signTime,
  applyOrgNum: router.currentRoute.value.query.applyOrgNum,
})
const singleDetail=ref({})

const dialogVisible=ref(false)

const deptList=ref([])

const total=ref(0)

const getDeptList=()=>{
  request(
      {
        url:"/hipp/admin/hipp/detail/list",
        method:"get",
        params:{
          hippId: info.value.hippId,
          pageSize:10,
          pageNum:1
        }
      }
  ).then((res)=>{
    if(res.code==200){
      deptList.value=res.data.list
      total.value=res.data.total
    }
  })
}

const handleReturn=()=>{}

const goDetail=(index)=>{
  if(index){
    dialogVisible.value=true
    singleDetail.value=deptList.value[index]
  }
}

onMounted(()=>{
  getDeptList()
})

</script>

<style scoped lang="scss">
$complete:#ADADAD;
$wait:#FF7301;
$audit:#4672FF;
$reject:#FF5A40;
$agree:#80D249;
$base-black:#333;
.header {
  justify-content: center;
  display: flex;
  align-items: center;
  margin: 30px auto;
  font-family: PingFang SC;
  font-weight: bold;
  color: #333333;
  line-height: 39px;
  .name {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    line-height: 39px;
  }
  .salesman {
    font-size: 14px;
    margin-right: 80px;
    text-align: center;
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

.dialog-container{
  margin: 0 40px;
  .diglog-item{
    margin: 30px 40px;
    display: flex;
    .key{
      font-size: 14px;
      color: #666;

    }
    .value{
      font-size: 16px;
      color: $base-black;
    }
  }
}

</style>