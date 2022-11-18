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
      <el-table-column label="申请接入应用类型" prop="appType" show-overflow-tooltip align="center">
        <template #default="{row:{appType}}">
          {{appType==1?'微信小程序':appType=='2'?'微信公众号':appType=='5'?'网页':'移动App'}}
        </template>
      </el-table-column>
      <el-table-column label="申请接入应用名称" prop="appName" show-overflow-tooltip width="130" align="center"/>
      <el-table-column label="定点医药机构联系人" prop="orgContactUser" show-overflow-tooltip width="100" align="center"/>
      <el-table-column label="定点医药机构联系电话" prop="orgContactTel" show-overflow-tooltip width="100" align="center">

      </el-table-column>
      <el-table-column label="申请函(附件)"  align="center">
        <template #default="scope">
          <el-link href="scope.row.applyFiles[0].attachUrl" v-if=" scope.row.applyFiles && scope.row.applyFiles.length>0" v-if="scope.row.applyFiles && scope.row.applyFiles.length>0">查看</el-link>
            <span v-else>--</span>
<!--          <el-button type="primary" link @click="downLoadFile(scope.row.applyFiles[0])" v-if="scope.row.applyFiles && scope.row.applyFiles.length>0">下载</el-button>-->
        </template>
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
          <el-tooltip content="查看" placement="top">
            <el-button text type="primary" :icon="View" @click="goDetail(scope.$index)" v-if="scope.row.canCheck==true"></el-button>
          </el-tooltip>
          <el-tooltip content="上传回执" placement="top">
            <el-button v-if="scope.row.canUpLoadFile===true" text type="primary" :icon="UploadFilled" @click="upLoadFilled(scope)"></el-button>
          </el-tooltip>
          <el-tooltip content="驳回" placement="top">
            <el-button type="warn" @click="showRejectLog(scope.row)" :icon="Remove" text></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>

<!--  进件明细弹出层-->
  <el-dialog
      v-model="dialogVisible"
      width="40%"
      align-center
      center
      class="single-dialog"
  >
    <template #header>
      <div style="font-weight: bold">请根据实际情况确认下列信息，可直接提交审核</div>
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

        <div class="diglog-item item-between">
          <div class="key">定点机构协议：</div>
          <div class="value">
            <el-link :href=`${singleDetail}.institutionalAgreementList[0].attachUrl`></el-link>
          </div>
        </div>


        <div class="diglog-item item-between">
          <div class="key">申请函：</div>
          <div class="value value-button">
            <el-link :href=`${singleDetail}.applyFiles[0].attachUrl`></el-link>
          </div>
        </div>

        <div class="diglog-item item-between" v-if="singleDetail.status==5 || singleDetail.status==3">
          <div class="key">国家平台回执：</div>
          <div class="value value-button">
            <el-upload
                v-model:file-list="fileList"
                class="upload-demo"
                :action="rewriteAction()"
                multiple
                :data="upLoadData"
                name="files"
                :headers="{'Authorization':getToken()}"
                accept=".pdf"
                limit=3
                :on-exceed="exceed"
                :on-success="upLoadSuccess"
                :on-error="upLoadError"
            >
              <el-button type="primary">选择文件后自动上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  回执需要以pdf的格式上传
                </div>
              </template>
            </el-upload>
          </div>
        </div>

        <div class="diglog-item item-between" v-if="singleDetail.status==4">
          <div class="key">驳回原因：</div>
          <div>{{singleDetail.reason}}</div>
        </div>

        <div class="diglog-item item-center">
          <el-button type="warn" @click="rejectApply(singleDetail.hippId)" v-if="singleDetail.status==3">驳回</el-button>
          <el-button color="#FF5A40" size="normal" style="color:#fff;">关闭</el-button>
        </div>
      </div>

  </el-dialog>

<!--  上传回执弹出层-->
  <el-dialog
      v-model="upLoadShow"
      width="60%"
      align-center
      center
  >
    <template #header>
      <div style="font-weight: bold">请上传回执</div>
    </template>

    <el-upload
        v-model:file-list="fileList"
        class="upload-demo"
        :action="rewriteAction()"
        multiple
        :data="upLoadData"
        name="files"
        :headers="{'Authorization':getToken()}"
        accept=".pdf"
        limit=3
        :on-exceed="exceed"
        :on-success="upLoadSuccess"
        :on-error="upLoadError"
    >
      <el-button type="primary">选择文件后自动上传</el-button>
      <template #tip>
        <div class="el-upload__tip">
          回执需要以pdf的格式上传
        </div>
      </template>
    </el-upload>
  </el-dialog>

<!--  驳回弹出层-->
  <el-dialog
      v-model="rejectDiglog"
      width="60%"
      center
      z-index="100"
  >
    <template #header>
      <div style="font-weight: bold">请填写驳回原因</div>
    </template>

    <el-input
        v-model="rejectReason"
        :rows="2"
        type="textarea"
        placeholder="请输入驳回原因"
    />

    <template #footer><el-button type="warning" @click="rejectApply(rejectHippId)">驳回</el-button></template>
  </el-dialog>


<!--    <el-button @click="dialogVisible=true">测试驳回</el-button>-->

  <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="params.pageNum"
      v-model:limit="params.pageSize"
      @pagination="getPagination"
  />

</template>

<script setup>
import {useRouter} from "vue-router";
import {getCurrentInstance, ref ,onMounted} from "vue";
import request from "@/utils/request";
import {ArrowLeft,UploadFilled,View,Remove} from "@element-plus/icons-vue";
import {getToken} from "@/utils/auth";
import { ElNotification  } from 'element-plus';
import {downLoadFile} from "@/api/insurance/customer";

const router=useRouter();
const { proxy } = getCurrentInstance();
const info = ref({
  hippId: router.currentRoute.value.query.hippId,
  contractCode: router.currentRoute.value.query.contractCode,
  signTime: router.currentRoute.value.query.signTime,
  applyOrgNum: router.currentRoute.value.query.applyOrgNum,
})
const singleDetail=ref({})

const dialogVisible=ref(false)

const upLoadShow=ref(false)

const rejectDiglog=ref(false)

const deptList=ref([])

const total=ref(0)

const fileList=ref([])

const upLoadData=ref({

})

//驳回HippID
const rejectHippId=ref('')

//驳回原因
const rejectReason=ref('')


const exceed=()=>{
  ElNotification ({
    message: '只能上传3个文件',
    type: 'warning',
    duration:2000
  })
}

const upLoadSuccess=(res, {name})=>{
  if(res.code==200){
    ElNotification ({
      title: '上传成功',
      message:`${name}上传成功`,
      type: 'success',
})
  }
}

const upLoadError=(err)=>{
  ElNotification({
    title:'上传失败',
    message:err,
    duration:2000,
    type:'error'
  })
}

const rewriteAction=()=>{
  return import.meta.env.VITE_APP_BASE_API+'/hipp/hipp/attachment/uploadAttachment'
}

const params=ref({
  hippId: info.value.hippId,
  pageSize:10,
  pageNum:1
})



const getDeptList=(params)=>{
  request(
      {
        url:"/hipp/admin/hipp/detail/list",
        method:"get",
        params
      }
  ).then((res)=>{
    if(res.code==200){
      deptList.value=res.data.list
      total.value=res.data.total
    }
  })
}

const handleReturn=()=>{
  // window.history.go(-1)
  proxy.$router.go(-1)
}

const goDetail=(index)=>{
  if(index){
    dialogVisible.value=true
    singleDetail.value=deptList.value[index]
  }
}

const upLoadFilled=({applyFiles})=>{
if(applyFiles){
  upLoadShow.value=true
  let{bizId}=applyFiles[0]
  upLoadData.value={
    bizId,
    bizType:6,
    hippId:info.value.hippId
  }
}

}


const showRejectLog=({hippId})=>{
  rejectHippId.value=hippId
  rejectDiglog.value=true
}

const rejectApply=(hippId)=>{
  request({
    url: '/hipp/admin/hipp/detail/updateState',
    params:{
      errReason:rejectReason.value,
      status:5,
      hippId,
    }
  })
}

const getPagination=(e)=>{
  let {limit,page}=e
  params.value.pageNum=page,
  params.value.pageSize=limit,
  getDeptList(params.value)
}


onMounted(()=>{
  getDeptList(params.value)
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

  .diglog-item{
    margin: 30px 40px;
    display: flex;
    align-items: center;
    .key{
      font-size: 14px;
      color: #666;

    }
    .value{
      font-size: 16px;
      color: $base-black;
    }

  }
  .item-between{
    justify-content: space-between !important;
  }
  .item-center{
    justify-content: center !important;
  }
}

.single-dialog{
  border-radius: 20px !important;
}

</style>