<template>
  <div class="wrapper">
    <div class="header">
      <el-button :icon="ArrowLeft" text @click="handleReturn">返回</el-button>
      <div class="name">{{ info.orgName }}</div>
      <div class="salesman">销售人员：{{ info.saleUserName }}</div>
    </div>

    <el-form
        v-show="showSearch"
        ref="queryRef"
        :inline="true"
        :model="queryParams"
    >
      <el-form-item label="加入日期">
        <el-date-picker
            v-model="queryTime"
            :shortcuts="shortcuts"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="加入日期"
            type="daterange"
            value-format="YYYY-MM-DD"
            @change="dateChange"
        />
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="queryParams.queryContractCode"
            placeholder="搜合同编号"
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
          show-loading
          @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <div class="table-container">
      <el-table v-loading="loading" :data="deptList" stripe>
        <el-table-column
            align="center"
            label="合同编号"
            prop="contractCode"
            width="180"
        >
          <template #default="scope"
          >{{ scope.row.contractCode ? scope.row.contractCode : "--" }}
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
                    :preview-src-list="scope.row.offLineContractFile.map((m) =>m.attachUrl)"
                    :src="scope.row.offLineContractFile[0].attachUrl"
                    :zoom-rate="1.2"
                    fit="cover" preview-teleported
                    style="width: 50px; height: 50px"
                    @close="urlIndex.value=0"
                    @switch="setUrl"
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


        <el-table-column align="center" label="签约清单" prop="phone">
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
        <el-table-column
            align="center"
            label="签约日期"
            min-width="120"
            prop="signTime"
        >
          <template #default="scope"
          >{{ scope.row.signTime ? scope.row.signTime : "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="签约人" prop="partyAUser">
          <template #default="scope">
            {{ scope.row.partyAUser ? scope.row.partyAUser : "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="甲方承运商" prop="tracking">
          <template #default="scope">
            {{ scope.row.tracking ? scope.row.tracking : "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="甲方承运单号" prop="trackingNumber">
          <template #default="scope">
            {{ scope.row.trackingNumber ? scope.row.trackingNumber : "--" }}
          </template>
        </el-table-column>


        <el-table-column
            align="center"
            label="应付金额(元)"
            prop="amountPayable"
        >
          <template #default="scope"
          >{{ scope.row.salesperson ? scope.row.amountPayable : "--" }}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="实付金额(元)"
            prop="amountActuallyPaid"
        >
          <template #default="scope"
          >{{
              scope.row.amountActuallyPaid ? scope.row.amountActuallyPaid : "--"
            }}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="支付时间"
            min-width="120"
            prop="payTime"
            show-overflow-tooltip
        >
          <template #default="scope"
          >{{ scope.row.payTime ? scope.row.payTime : "--" }}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="支付类型"
            prop="payType"
            show-overflow-tooltip
        >
          <template #default="scope"
          >{{
              scope.row.payType
                  ? scope.row.payType == 1
                      ? "微信"
                      : "线下"
                  : "--"
            }}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="支付凭证"
            prop="hippPayVouchers"
            show-overflow-tooltip
        >
          <template #default="scope">
            <div v-if="
              scope.row.paymentVoucherAttachFile &&
              scope.row.paymentVoucherAttachFile.length > 0
            ">
              <el-image
                  :preview-src-list="scope.row.paymentVoucherAttachFile.map((m) =>m.attachUrl)"
                  :src="scope.row.paymentVoucherAttachFile[0].attachUrl"
                  :zoom-rate="1.2"
                  fit="cover" preview-teleported
                  style="width: 50px; height: 50px"
              />
            </div>

            <span v-else>--</span>
          </template>

        </el-table-column>
        <el-table-column
            align="center"
            fixed="right"
            label="状态"
            show-overflow-tooltip
        >
          <template #default="scope">
            <div
                v-if="
                scope.row.status === 1 ||
                scope.row.status === 3 ||
                scope.row.status === 4
              "
                class="item-wrapper-inbox"
            >
              <div class="dot wait"></div>
              <div>{{ scope.row.statusName }}</div>
            </div>

            <div
                v-if="scope.row.status === 2 || scope.row.status === 10"
                class="item-wrapper-inbox"
            >
              <div class="dot complete"></div>
              <div>{{ scope.row.statusName }}</div>
            </div>

            <div v-if="scope.row.status === 5" class="item-wrapper-inbox">
              <div class="dot audit"></div>
              <div>{{ scope.row.statusName }}</div>
            </div>

            <div v-if="scope.row.status === 6" class="item-wrapper-inbox">
              <div class="dot reject"></div>
              <div>{{ scope.row.statusName }}</div>
            </div>

            <div v-if="scope.row.status === 7" class="item-wrapper-inbox">
              <div class="dot agree"></div>
              <div>{{ scope.row.statusName }}</div>
            </div>

            <div v-if="scope.row.status === 8" class="item-wrapper-inbox">
              <div class="dot reject"></div>
              <div>{{ scope.row.statusName }}</div>
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

        <el-table-column align="center" fixed="right" label="操作" width="80">
          <template #default="scope">
            <el-tooltip v-if="scope.row.status==1 && roleName=='运营管理'" content="撤销签约" placement="top-end">
              <el-button :icon="Close" text type="danger" @click="revoke(scope.row)"></el-button>
            </el-tooltip>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--//    <div class="tab-list">-->
    <!--//      <div class="tab-list-item">-->
    <!--//        <div class="item-wrapper">-->
    <!--//          <div class="dot complete"></div>-->
    <!--//          <div>已失效</div>-->
    <!--        </div>-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot complete"></div>-->
    <!--          <div>已归档</div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="tab-list-item">-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot wait"></div>-->
    <!--          <div>待签约</div>-->
    <!--        </div>-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot wait"></div>-->
    <!--          <div>待付款</div>-->
    <!--        </div>-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot wait"></div>-->
    <!--          <div>待进件</div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="tab-list-item">-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot audit"></div>-->
    <!--          <div>审核中</div>-->
    <!--        </div>-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot reject"></div>-->
    <!--          <div>驳回</div>-->
    <!--        </div>-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot agree"></div>-->
    <!--          <div>审核通过</div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <pagination
        v-show="total > 0"
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNum"
        :total="total"
        @pagination="getPagination"
    />

    <el-dialog v-model="paymentVoucherDialog" align-center center width="50%">
      <template #header>共计{{ paymentVoucherList.length }}张图片</template>

      <div class="demo-image__lazy">
        <el-image
            v-for="attachUrl in paymentVoucherList"
            :key="attachUrl"
            :src="attachUrl"
            fit="cover"
            lazy
            preview-teleported
            style="width: 50px;height: 50px"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import {computed, getCurrentInstance, onMounted, ref} from "vue";
import {ArrowLeft, Close} from "@element-plus/icons-vue";
import {downloadContract, downLoadFile, getHippList, revokeAssignment} from "@/api/insurance/insurance";
import modal from "@/plugins/modal";
import {ElMessage} from "element-plus";
import useUserStore from "@/store/modules/user";

const queryTime = ref([]);
const router = useRouter();
const {proxy} = getCurrentInstance();
const info = ref({
  orgName: router.currentRoute.value.query.orgName,
  saleUserName: router.currentRoute.value.query.saleUserName || "暂无",
  orgId: router.currentRoute.value.query.orgId,
});
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  corpId: info.value.orgId,
  queryContractCode: "",
  // statusList: ["1", "2", "4", "5", "6", "7", "8", "10", "11", "12"],
});
const defaultParams = ref({
  corpId: info.value.orgId,
  pageNum: 1,
  pageSize: 10,
  // statusList: ["1", "2", "4", "5", "6", "7", "8", "10", "11", "12"],
});
const shortcuts = [
  {
    text: "前一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "前一月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "前一季度",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
const showSearch = ref(true);
const loading = ref(false);
const total = ref(0);
const deptList = ref([]);
const urlIndex = ref(0);
const roleName = ref('')

// 支付凭证变量
const paymentVoucherDialog = ref(false);
const paymentVoucherList = ref([]);

//返回
const handleReturn = () => {
  const obj = {path: "/insurance/customer"};
  proxy.$tab.closeOpenPage(obj);
};

// 搜索
const handleQuery = () => {
  if (queryTime.value) {
    let [begin, end] = queryTime.value;
    queryParams.value.querySignTimeStart = begin;
    queryParams.value.querySignTimeEnd = end;
  } else {
    queryParams.value.querySignTimeStart = "";
    queryParams.value.querySignTimeEnd = "";
  }
  getDeptList(queryParams.value);
};

//获取表格数据
const getDeptList = (params) => {
  getHippList(params)
      .then((res) => {
        if (res.code == 200) {
          total.value = Number(res.data.total);
          deptList.value = res.data.list;
        } else {
          modal.msgError({
            message: "获取客户失败",
            type: "error",
            center: true,
          });
        }
      })
      .catch((err) => console.log(err));
};

const resetQuery = () => {
  queryTime.value = [];
  queryParams.value.queryContractCode = "";
  queryParams.value.querySignTimeStart = "";
  queryParams.value.querySignTimeEnd = "";
  getDeptList(defaultParams.value);
};

const getList = () => {

  getDeptList(queryParams.value);

};

const getPagination = (e) => {
  let {limit, page} = e;
  (queryParams.value.pageNum = page),
      (queryParams.value.pageSize = limit),
      getDeptList(queryParams.value);
};

const dateChange = (date) => {
  if (!date) {
    queryParams.value.querySignTimeStart = "";
    queryParams.value.querySignTimeEnd = "";
    getDeptList(queryParams.value);
  } else {
    queryParams.value.querySignTimeStart = date[0];
    queryParams.value.querySignTimeEnd = date[1];
    getDeptList(queryParams.value);
  }
};

const inputChange = () => {
  getDeptList(queryParams.value);
};


const setUrl = (num) => {
  let num1 = num == 0 ? 0 : num;
  urlIndex.value = num1;
}

const picdownLoad = ({offLineContractFile}) => {
  downLoadFile(offLineContractFile[urlIndex.value], '合同照片')
}

const revoke = ({hippId}) => {
  revokeAssignment(hippId).then((res) => {
    if (res.code == 200) {
      // model.msgSuccess('撤销申请成功')
      ElMessage({
        message: '撤销申请成功',
        type: "success"
      })
      getList()
    }
  })
}

onMounted(() => {
  getDeptList(defaultParams.value);
  useUserStore().getInfo().then(res => {
    roleName.value = res.user.roleName
  })
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

.wrapper {
  margin: 20px;
  padding: 10px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
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

.table-container {
  margin: 10px;
  padding: 30px;
}

.tab-list {
  //margin-left: 500px;
  margin-top: 30px;
  display: flex;
  padding: 30px;
  float: right;

  .tab-list-item {
    margin: 0 15px;

    .item-wrapper {
      display: flex;
      font-size: 0.6rem;
      align-items: center;
      font-weight: bold;
      margin: 10px 0;
      color: $base-black;

      .dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 15px;
      }
    }
  }
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

::v-deep.demo-image__lazy .el-image {
  display: block;
  max-height: 50px;
  min-height: 50px;
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
