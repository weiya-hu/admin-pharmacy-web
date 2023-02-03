<template>
  <div class="app-container">
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
      <el-form-item label="签约日期">
        <el-date-picker
          v-model="queryTime"
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
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deptList" stripe>
      <el-table-column
        align="center"
        label="合同编号"
        min-width="150"
        prop="contractCode"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>{{
            scope.row.contractCode ? scope.row.contractCode : "--"
          }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="签约方式">
        <template #default="scope">
          {{scope.row.signType==2?'线下':'线上'}}
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="下载合同"
          prop="download"
      >
        <template #default="scope">
          <el-button
              v-if="scope.row.status > 2 && scope.row.signType!=2"
              link
              type="primary"
              @click="downloadContract(scope.row.hippId)"
          >下载
          </el-button>
          <template v-else-if="scope.row.signType==2 && scope.row.status > 2 ">
            <div >
              <el-image
                  style="width: 50px; height: 50px"
                  :src="scope.row.offLineContractFile[0].attachUrl"
                  :zoom-rate="1.2"
                  :preview-src-list="getOfflineUrlList(scope.row)"
                  fit="cover"
                  preview-teleported
              />
            </div>
          </template>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="签约清单"
        prop="list"
        show-overflow-tooltip
      >
        <template #default="scope">
          <el-link
            v-if="scope.row.applyListAttachFile"
            :href="scope.row.applyListAttachFile"
            type="primary"
            >查看
          </el-link>

          <!--          <el-button link type="primary" @click="downLoadFile(scope.row.applyListAttachFile[0])" v-if="scope.row.applyListAttachFile && scope.row.applyListAttachFile.length>0">下载</el-button>-->
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="签约人"
        prop="partyAUser"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>{{ scope.row.partyAUser ? scope.row.partyAUser : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="签约日期"
        min-width="150"
        prop="signTime"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>{{ scope.row.signTime ? scope.row.signTime : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="签约机构数量(家)"
        prop="applyOrgNum"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>{{
            scope.row.applyOrgNum ? scope.row.applyOrgNum : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="应付金额(元)"
        prop="amountPayable"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>{{
            scope.row.amountPayable ? scope.row.amountPayable : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="实付金额(元)"
        show-overflow-tooltip
        width="100"
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
        min-width="150"
        show-overflow-tooltip
      >
        <template #default="scope"
          >{{ scope.row.payTime ? scope.row.payTime : "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付类型" show-overflow-tooltip>
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
      <el-table-column align="center" label="支付凭证" show-overflow-tooltip>
        <template #default="scope">
          <!--          <el-link-->
          <!--            v-if="scope.row.paymentVoucherAttachFile.length"-->
          <!--            :href="scope.row.paymentVoucherAttachFile[0].attachUrl"-->
          <!--            target="_blank"-->
          <!--            type="primary"-->
          <!--            >查看-->
          <!--          </el-link>-->
          <el-button
            v-if="
              scope.row.paymentVoucherAttachFile &&
              scope.row.paymentVoucherAttachFile.length > 0
            "
            link
            type="primary"
            @click="showPaymentPictures(scope.row.paymentVoucherAttachFile)"
            >查看
          </el-button>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="进件申请"
        prop="hippApplys"
        show-overflow-tooltip
      >
        <template #default="scope">
          <el-link
            v-if="scope.row.incomingPartListAttachFile"
            :href="scope.row.incomingPartListAttachFile"
            type="primary"
            >查看
          </el-link>

          <!--          <el-button type="primary" link @click="downLoadFile(scope.row.incomingPartListAttachFile[0])" v-if="scope.row.incomingPartListAttachFile && scope.row.incomingPartListAttachFile.length>0">查看</el-button>-->
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        label="状态"
        show-overflow-tooltip
        width="180"
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
      <el-table-column align="center" fixed="right" label="操作" width="130">
        <template #default="scope">
          <el-tooltip
            v-if="
              scope.row.status > 4 &&
              scope.row.status &&
              scope.row.status != 11 &&
              scope.row.status != 10 &&
              scope.row.status != 12
            "
            content="查看"
            hide-after="0"
            placement="top"
          >
            <!--            <el-button text type="primary" :icon="View" @click="handleClick('see', scope.row)" ></el-button>-->
            <el-button
              :icon="View"
              text
              type="primary"
              @click="handleClick('see', scope.row)"
            ></el-button>
          </el-tooltip>
          <!--          <el-tooltip content="归档" hide-after="0" placement="top">-->
          <!--            <el-button-->
          <!--              v-if="scope.row.canArchive"-->
          <!--              :icon="Finished"-->
          <!--              text-->
          <!--              type="primary"-->
          <!--              @click="handleClick('file', scope.row)"-->
          <!--            ></el-button>-->
          <!--          </el-tooltip>-->
          <span v-else>--</span>
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
    <!--    <div class="tab-list">-->
    <!--      <div class="tab-list-item">-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot complete"></div>-->
    <!--          <dvi>已失效</dvi>-->
    <!--        </div>-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot complete"></div>-->
    <!--          <dvi>已归档</dvi>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="tab-list-item">-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot wait"></div>-->
    <!--          <dvi>待签约</dvi>-->
    <!--        </div>-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot wait"></div>-->
    <!--          <dvi>待付款</dvi>-->
    <!--        </div>-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot wait"></div>-->
    <!--          <dvi>待进件</dvi>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="tab-list-item">-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot audit"></div>-->
    <!--          <dvi>审核中</dvi>-->
    <!--        </div>-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot audit"></div>-->
    <!--          <div>审核凭证</div>-->
    <!--        </div>-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot reject"></div>-->
    <!--          <dvi>驳回</dvi>-->
    <!--        </div>-->
    <!--        <div class="item-wrapper">-->
    <!--          <div class="dot agree"></div>-->
    <!--          <div>审核通过</div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

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
import { useRouter } from "vue-router";
import { getCurrentInstance, onMounted, ref } from "vue";
import { ArrowLeft, View } from "@element-plus/icons-vue";
import { downloadContract, getHippList } from "@/api/insurance/insurance";

const router = useRouter();
const { proxy } = getCurrentInstance();
const info = ref({
  orgName: router.currentRoute.value.query.orgName,
  saleUserName: router.currentRoute.value.query.saleUserName || "暂无",
  orgId: router.currentRoute.value.query.orgId,
});
const deptList = ref([]);
const queryTime = ref("");
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  queryContractCode: "",
  corpId: info.value.orgId,
  statusList: ["4", "5", "6", "7", "8", "10", "11", "12"],
});
const defaultParams = ref({
  corpId: info.value.orgId,
  pageNum: 1,
  pageSize: 10,
  statusList: ["4", "5", "6", "7", "8", "10", "11", "12"],
});
const showSearch = ref(true);
const loading = ref(false);
const total = ref(0);
// const deptList = ref([]);
//归档hippId
const archiveId = ref("");

// 支付凭证变量
const paymentVoucherDialog = ref(false);
const paymentVoucherList = ref([]);

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
// 重置
const resetQuery = () => {
  queryTime.value = "";
  queryParams.value.queryContractCode = "";
  queryParams.value.querySignTimeStart = "";
  queryParams.value.querySignTimeEnd = "";
  getDeptList(defaultParams.value);
};

const getList = () => {
  getDeptList(defaultParams.value);
};

// 按钮
const handleClick = (type, row) => {
  if (type === "see") {
    router.push({
      path: "/insurance/details/inputs",
      query: {
        hippId: row.hippId,
        contractCode: row.contractCode,
        signTime: row.signTime,
        applyOrgNum: row.applyOrgNum,
        hippIdStatus: row.status,
      },
    });
  } else if (type === "file") {
    // let { hippId } = row;
    // archiveId.value = hippId;
    // goArchive(archiveId.value);
  }
};

// 归档
// const goArchive = (hippId) => {
//   ElMessageBox.confirm("确认归档此申请", "", {
//     confirmButtonText: "确认",
//     cancelButtonText: "取消",
//     type: "warning",
//   })
//     .then(() => {
//       request({
//         url: "/hipp/admin/hipp/updateState",
//         params: {
//           hippId,
//           status: 10,
//         },
//       }).then((res) => {
//         if (res.code == 200) {
//           ElMessage({
//             type: "success",
//             message: "归档成功",
//           });
//         } else {
//           ElMessage({
//             type: "error",
//             message: "归档失败",
//           });
//         }
//       });
//     })
//     .catch(() => {
//       ElMessage({
//         type: "warning",
//         message: "你已经取消归档",
//       });
//     });
// };

// 返回
const handleReturn = () => {
  const obj = { path: "/insurance/handleBy" };
  proxy.$tab.closeOpenPage(obj);
};
const getDeptList = (params) => {
  getHippList(params)
    .then((res) => {
      if (res.code == 200) {
        deptList.value = res.data.list;
        total.value = Number(res.data.total);
      }
    })
    .catch((err) => console.log(err));
};

// 修改分页条件
const getPagination = (e) => {
  let { limit, page } = e;
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

const showPaymentPictures = async (row) => {
  if (Array.isArray(row)) {
    paymentVoucherList.value.length = 0;
    for (let i of row) {
      paymentVoucherList.value.push(i.attachUrl);
    }
    console.log(paymentVoucherList.value);
    paymentVoucherDialog.value = true;
  }
};

const getOfflineUrlList=({offLineContractFile})=>{
  let arr=[];
  offLineContractFile.map(i=>{
    arr.push(i.attachUrl)
  })
  return arr
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

.tab-list {
  //margin-left: 500px;
  float: right;
  display: flex;
  padding: 30px;

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

.demo-image__lazy {
  height: 450px;
  overflow-y: auto;
  text-align: center;
}

.demo-image__lazy .el-image {
  display: block;
  min-height: 200px;
  margin-bottom: 10px;
}

.demo-image__lazy .el-image:last-child {
  margin-bottom: 0;
}
</style>
