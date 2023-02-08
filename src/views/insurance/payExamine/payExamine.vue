<template>
  <div class="app-container">
    <!--  筛选-->
    <el-form>
      <el-form
          v-show="showSearch"
          ref="queryRef"
          :inline="true"
          :model="queryParams"
      >
        <el-form-item label="支付日期">
          <el-date-picker
              v-model="queryTime"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              type="daterange"
              value-format="YYYY-MM-DD"
              @change="dateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-input
              v-model="queryParams.queryContractCode"
              placeholder="搜合同编号/企业名称/销售人员"
              style="width: 250px"
              @change="inputChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="Search" type="primary" @click="handleQuery"
          >搜索
          </el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <right-toolbar
            v-model:showSearch="showSearch"
            @queryTable="getList"
        ></right-toolbar>
      </el-row>
    </el-form>

    <!--  表格-->
    <el-table v-loading="loading" :data="deptList" stripe>
      <el-table-column align="center" label="合同编号">
        <template #default="scope">
          <span>{{
              scope.row.contractCode ? scope.row.contractCode : "--"
            }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="签约方式">
        <template #default="scope">
          {{ scope.row.signType == 2 ? '线下' : '线上' }}
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="下载合同"
          prop="download"
      >
        <template #default="scope">
          <template v-if="scope.row.signType==2 && scope.row.offLineContractFile.length>0 && scope.row.status>2">
            <el-button
                v-if="scope.row.offLineContractFile[0].ext=='pdf' "
                link
                type="primary"
                @click="downloadContract(scope.row)"
            >下载
            </el-button>
            <template
                v-else-if="scope.row.offLineContractFile[0].ext!='pdf'">
              <el-image
                  style="width: 50px; height: 50px"
                  :src="scope.row.offLineContractFile[0].attachUrl"
                  :zoom-rate="1.2"
                  :preview-src-list="scope.row.offLineContractFile.map((m) =>m.attachUrl)" fit="cover"
                  preview-teleported
                  @switch="setUrl"
                  @close="urlIndex.value=0"
              >
                <template #viewer>
                  <div class="downLoad-viewer" @click="picdownLoad(scope.row)">下载</div>
                </template>
              </el-image>
            </template>
            <span v-else>--</span>
          </template>
          <template v-else-if="scope.row.signType==1 && scope.row.status>2 && scope.row.essbasicSuccess">
            <el-button
                link
                type="primary"
                @click="downloadContract(scope.row,false)"
            >下载
            </el-button>
          </template>
          <template v-else><span>--</span></template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="签约清单">
        <template #default="scope">
          <el-link
              v-if="scope.row.applyListAttachFile"
              :href="scope.row.applyListAttachFile"
              type="primary"
          >下载
          </el-link>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="签约机构数量（家）">
        <template #default="scope">
          <span>{{
              scope.row.applyOrgNum ? scope.row.applyOrgNum : "--"
            }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="应付金额（元）">
        <template #default="scope">
          <span>{{
              scope.row.amountPayable ? scope.row.amountPayable : "--"
            }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实付金额（元）">
        <template #default="scope">
          <span>{{
              scope.row.amountActuallyPaid ? scope.row.amountActuallyPaid : "--"
            }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付时间" show-overflow-tooltip width="170">
        <template #default="scope">
          {{ scope.row.payTime ? scope.row.payTime : "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付凭证" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="
              scope.row.paymentVoucherAttachFile &&
              scope.row.paymentVoucherAttachFile.length > 0
            ">
            <el-image
                style="width: 50px; height: 50px"
                :src="scope.row.paymentVoucherAttachFile[0].attachUrl"
                :zoom-rate="1.2"
                :preview-src-list="scope.row.paymentVoucherAttachFile.map((m) =>m.attachUrl)" fit="cover"
                preview-teleported
            />
          </div>

          <span v-else>--</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="企业名称" show-overflow-tooltip width="300">
        <template #default="scope">
          {{ scope.row.partyACorpName ? scope.row.partyACorpName : "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属区域">
        <template #default="scope">
          {{ scope.row.region ? scope.row.region : "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售人员">
        <template #default="scope">
          {{ scope.row.salesperson ? scope.row.salesperson : "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="状态">
        <template #default="scope">
          <div
              v-if="scope.row.status > 3 && scope.row.status < 11"
              class="item-wrapper-inbox"
          >
            <div class="dot agree"></div>
            <div>凭证真实</div>
          </div>

          <div v-if="scope.row.status === 11" class="item-wrapper-inbox">
            <div class="dot audit"></div>
            <div>{{ scope.row.statusName }}</div>
          </div>

          <div v-if="scope.row.status === 12" class="item-wrapper-inbox">
            <div class="dot reject"></div>
            <div>{{ scope.row.statusName }}</div>
          </div>

          <span v-if="!scope.row.status">--</span>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          fixed="right"
          label="操作"
          min-width="180"
      >
        <template #default="scope">
          <el-tooltip
              v-if="scope.row.status == 11"
              content="凭证真实"
              placement="top"
          >
            <el-button
                :icon="Finished"
                text
                type="primary"
                @click="handleClick('agree', scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
              v-if="scope.row.status == 11"
              content="驳回凭证"
              placement="top"
          >
            <el-button
                :icon="RemoveFilled"
                text
                type="warning"
                @click="handleClick('reject', scope.row)"
            ></el-button>
          </el-tooltip>
          <span v-if="scope.row.status != 11">--</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNum"
        :total="total"
        @pagination="getPagination"
    />

    <!--  驳回弹出层-->
    <el-dialog
        v-model="rejectDialog"
        append-to-body
        center
        width="60%"
        z-index="1000"
    >
      <template #header>
        <div style="font-weight: bold">请填写驳回原因</div>
      </template>

      <el-input
          v-model="rejectReason"
          :rows="2"
          placeholder="请输入驳回原因"
          type="textarea"
      />

      <template #footer>
        <el-button type="warning" @click="goReject(2, rejectReason)"
        >驳回
        </el-button>
      </template>
    </el-dialog>

    <!--  支付凭证-->
    <el-dialog v-model="paymentVoucherDialog" align-center center width="50%">
      <template #header>共计{{ paymentVoucherList.length }}张图片</template>

      <div class="demo-image__lazy">
        <el-image
            v-for="attachUrl in paymentVoucherList"
            :key="attachUrl"
            :src="attachUrl"
            fit="contain"
            lazy
            preview-teleported
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {Finished, RemoveFilled} from "@element-plus/icons-vue";
import {
  auditPayment,
  downloadContract, downLoadFile,
  getAuditHippList,
} from "@/api/insurance/insurance";
import {ElMessage, ElMessageBox} from "element-plus";

const showSearch = ref(true);
const deptList = ref([]);
const total = ref(0);
const queryTime = ref("");
const loading = ref(false);
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  queryContractCode: "",
  statusList: ["11", "12", "4", "5", "6", "7", "10"],
});
const defaultParams = ref({
  pageNum: 1,
  pageSize: 10,
  statusList: ["11", "12", "4", "5", "6", "7", "10"],
});

const rejectDialog = ref(false);
const rejectReason = ref("");
const detailHippId = ref("");
// 支付凭证变量
const paymentVoucherDialog = ref(false);
const paymentVoucherList = ref([]);
const urlIndex = ref(0);

//methods
const dateChange = (date) => {
  if (!date) {
    queryParams.value.queryPayTimeStart = "";
    queryParams.value.queryPayTimeEnd = "";
    getDeptList(queryParams.value);
  } else {
    queryParams.value.queryPayTimeStart = date[0];
    queryParams.value.queryPayTimeEnd = date[1];
    getDeptList(queryParams.value);
  }
};

const inputChange = () => {
  getDeptList(queryParams.value);
};

const handleQuery = () => {
  if (queryTime.value) {
    let [begin, end] = queryTime.value;
    queryParams.value.queryPayTimeStart = begin;
    queryParams.value.queryPayTimeEnd = end;
  } else {
    queryParams.value.queryPayTimeStart = "";
    queryParams.value.queryPayTimeEnd = "";
  }

  getDeptList(queryParams.value);
};

const resetQuery = () => {
  queryTime.value = "";
  queryParams.value.queryContractCode = "";
  queryParams.value.queryPayTimeStart = "";
  queryParams.value.queryPayTimeEnd = "";
  getDeptList(defaultParams.value);
};

const getList = () => {
};

const handleClick = async (type, row) => {
  detailHippId.value = row.hippId;
  if (type === "agree") {
    ElMessageBox.confirm("确认此付款凭证真实", "", {
      confirmButtonText: "确认",
      cancelButtonText: "再看看资料",
      type: "warning",
    })
        .then(() => {
          auditPayment(detailHippId.value, 1).then((res) => {
            if (res.code == 200) {
              ElMessage({
                message: "确认凭证真实性成功",
                type: "success",
              });
              let index = deptList.value.indexOf(row);
              deptList.value[index].statusName = "凭证真实";
              deptList.value[index].status = "4";
            } else {
              ElMessage({
                message: "确认凭证真实性失败",
                type: "error",
              });
            }
          });
        })
        .catch(() => {
        });
  } else {
    rejectDialog.value = true;
  }
};

const getDeptList = (params) => {
  getAuditHippList(params)
      .then((res) => {
        if (res.code == 200) {
          total.value = Number(res.data.total);
          deptList.value = res.data.list;
        }
      })
      .catch((err) => console.log(err));
};

const goReject = () => {
  auditPayment(detailHippId.value, 2, rejectReason.value).then((res) => {
    if (res.code == 200) {
      ElMessage({
        message: "驳回支付凭证成功",
        type: "success",
        zIndex: 10000,
      });
      rejectDialog.value = false;
      rejectReason.value = "";
      getDeptList(queryParams.value);
    } else {
      ElMessage({
        message: "驳回支付凭证失败",
        type: "error",
        zIndex: 10000,
      });
      rejectDialog.value = false;
    }
  });
};

const getPagination = (e) => {
  let {limit, page} = e;
  (queryParams.value.pageNum = page),
      (queryParams.value.pageSize = limit),
      getDeptList(queryParams.value);
};

// const showPaymentPictures = async (row) => {
//   if (Array.isArray(row)) {
//     paymentVoucherList.value.length = 0;
//     for (let i of row) {
//       paymentVoucherList.value.push(i.attachUrl);
//     }
//     paymentVoucherDialog.value = true;
//   }
// };


const setUrl = (num) => {
  let num1 = num == 0 ? 0 : num;
  urlIndex.value = num1;
}

const picdownLoad = ({offLineContractFile}) => {
  downLoadFile(offLineContractFile[urlIndex.value], '合同照片')
}

onMounted(() => {
  getDeptList(defaultParams.value);
});
</script>

<style lang="scss" scoped>
$complete: #adadad;
$wait: #ff7301;
$audit: #4672ff;
$reject: #ff5a40;
$agree: #80d249;
$base-black: #333;
.complete {
  background: $complete;
}

.wait {
  background: $wait;
}

.audit {
  background: $audit;
}

.reject {
  background: $reject;
}

.agree {
  background: $agree;
}

.item-wrapper-inbox {
  display: flex;
  font-size: 0.6rem;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  //margin: 10px 0;
  color: $base-black;

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    margin-right: 5px;
  }
}

.demo-image__lazy {
  height: 450px;
  overflow-y: auto;
  text-align: center;
}

.demo-image__lazy .el-image {
  display: block;
  min-height: 200px;
  //min-width: 320px;
  margin-bottom: 10px;
}

.demo-image__lazy .el-image:last-child {
  margin-bottom: 0;
}

.downLoad-viewer {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(160px);
  width: 44px;
  height: 44px;
  background: #606266;
  border-radius: 50%;
  overflow: hidden;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px !important;
  cursor: pointer;
}


</style>
