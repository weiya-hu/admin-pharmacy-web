<template>
  <div>
    <!--  筛选-->
    <div class="search-container">
      <el-form
          v-show="showSearch"
          ref="queryRef"
          :inline="true"
          :model="queryParams"
      >
        <el-form-item label="签约日期">
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
          <el-select
              v-model="queryParams.region"
              class="m-2"
              placeholder="所属区域"
              @change="selectChange"
          >
            <el-option
                v-for="(item, index) in area"
                :key="index"
                :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
              v-model="queryParams.queryQuickSearch"
              placeholder="搜企业名称/联系人/联系电话"
              style="width: 250px"
              @change="inputChange"
          />
        </el-form-item>
        <el-form-item>
          <div class="search-item"></div>
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
        <el-button
            icon="View"
            style="margin-left: 20px"
            type="warning"
            @click="handleShare"
        >分享
        </el-button>

        <el-button
            icon="Plus"
            style="margin-left: 20px"
            type="primary"
            @click="addDialog=true"
        >新建企业
        </el-button>


      </el-row>
    </div>

    <!--制表  -->
    <div class="table-container">
      <el-table :data="deptList" stripe>
        <el-table-column
            align="center"
            label="企业名称"
            prop="orgName"
            show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.orgName ? scope.row.orgName : "--" }}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="联系人"
            prop="orgContactUser"
            show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.orgContactUser ? scope.row.orgContactUser : "--" }}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="联系电话"
            prop="orgContactTel"
            show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.orgContactTel ? scope.row.orgContactTel : "--" }}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="所属区域"
            prop="orgRegion"
            show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.orgRegion ? scope.row.orgRegion : "--" }}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="详细地址"
            prop="orgAddress"
            show-overflow-tooltip
            width="300"
        >
          <template #default="scope">
            {{ scope.row.orgAddress ? scope.row.orgAddress : "--" }}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="加入日期"
            prop="joinDate"
            show-overflow-tooltip
            sortable
        >
          <template #default="scope">
            {{ scope.row.joinDate ? scope.row.joinDate : "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="签约付款" prop="pay">
          <template #default="scope">
            <el-tooltip content="查看" placement="top">
              <el-button
                  :icon="View"
                  size="large"
                  text
                  type="primary"
                  @click="goSignRecord(scope.row)"
              >
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

    <!--    连接-->
    <el-dialog
        v-model="dialogVisible"
        :close-on-click-modal="true"
        append-to-body
        draggable
        width="750px"
    >
      <template #header>
        <span
        >下方是您的专属邀请链接，复制并分享给客户，客户通过此链接进行申请，即为您的业绩</span
        >
      </template>
      <div>
        <p class="state_url">{{ state.url }}</p>
        <!--      <el-link :underline="false" icon="DocumentCopy" v-copyText="state.url" v-copyText:callback="copyTextSuccess">复制</el-link>-->
      </div>
    </el-dialog>

    <!--    新建企业-->
    <el-dialog v-model="addDialog" :close-on-click-modal="true" align-center append-to-body center>

    </el-dialog>


    <pagination
        v-show="total > 0"
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNum"
        :total="total"
        @pagination="getPagination"
    />
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {View, Plus} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {getMyCustomer, returnUrl} from "@/api/insurance/insurance";
import modal from "@/plugins/modal";
import {ElMessage} from "element-plus";

const router = useRouter();
const state = reactive({
  url: "",
});
const dialogVisible = ref(false);
const addDialog = ref(false);
const queryTime = ref([]);
const area = ref(["重庆", "北京", "成都", "陕西"]);

//快速切换时间
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
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  userType: 2,
});
const defaultParams = ref({
  pageNum: 1,
  pageSize: 10,
  userType: 2,
});
const showSearch = ref(true);
const loading = ref(false);
const total = ref(0);
const deptList = ref([]);

onMounted(() => {
  getDeptList(defaultParams.value);
});

const resetQuery = () => {
  queryTime.value = [];
  queryParams.value.region = "";
  queryParams.value.queryQuickSearch = "";
  queryParams.value.queryJoinDateStart = "";
  queryParams.value.queryJoinDateEnd = "";
  getDeptList(defaultParams.value);
};

const goSignRecord = (row) => {
  let {saleUserName, orgName, orgId} = row;
  router.push({
    path: "/insurance/customer/signRecord",
    query: {
      saleUserName,
      orgId,
      orgName,
    },
  });
};

// 分享
const handleShare = () => {
  dialogVisible.value = true;
  returnUrl({productId: "admin"}).then((res) => {
    state.url = res.data;
  });
};

// 复制
function copyTextSuccess() {
  ElMessage.success("复制成功");
  console.log("url", state.url);
}

const handleQuery = () => {
  if (queryTime.value) {
    let [begin, end] = queryTime.value;
    queryParams.value.queryJoinDateStart = begin;
    queryParams.value.queryJoinDateEnd = end;
  } else {
    queryParams.value.queryJoinDateStart = "";
    queryParams.value.queryJoinDateEnd = "";
  }
  getDeptList(queryParams.value);
};

const getDeptList = (params) => {
  getMyCustomer(params).then((res) => {
    if (res.code === 200) {
      total.value = Number(res.data.total);
      deptList.value = res.data.list;
    } else {
      modal.msgError({
        message: "获取客户失败",
        type: "error",
        center: true,
      });
    }
  });
};

const getList = () => {
  getDeptList(queryParams.value);
};

const getPagination = (e) => {
  let {limit, page} = e;
  queryParams.value.pageNum = page;
  queryParams.value.pageSize = limit;
  getDeptList(queryParams.value);
};

const dateChange = (date) => {
  if (!date) {
    queryParams.value.queryJoinDateStart = "";
    queryParams.value.queryJoinDateEnd = "";
    getDeptList(queryParams.value);
  } else {
    queryParams.value.queryJoinDateStart = date[0];
    queryParams.value.queryJoinDateEnd = date[1];
    getDeptList(queryParams.value);
  }
};

const selectChange = () => {
  getDeptList(queryParams.value);
};

const inputChange = () => {
  getDeptList(queryParams.value);
};
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

//.search-item {
//  display: flex;
//  justify-content: flex-end;
//  margin-top: 30px;
//}
</style>
