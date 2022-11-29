<template>
  <div>
    <div class="app-container">
      <el-form
        v-show="showSearch"
        ref="queryRef"
        :inline="true"
        :model="queryParams"
      >
        <el-form-item>
          <el-select
            v-model="queryParams.region"
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
        <el-form-item></el-form-item>
        <el-form-item label="起止时间">
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
        ·
        <el-form-item>
          <el-input
            v-model="queryParams.queryQuickSearch"
            placeholder="搜企业名称/联系人/联系电话"
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

      <el-table :data="deptList">
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
        <el-table-column align="center" label="联系人" prop="orgContactUser">
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
        <el-table-column align="center" label="所属区域" prop="orgRegion">
          <template #default="scope">
            {{ scope.row.orgRegion ? scope.row.orgRegion : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="详细地址"
          prop="orgAddress"
          show-overflow-tooltip
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
        >
          <template #default="scope">
            {{ scope.row.joinDate ? scope.row.joinDate : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          :formatter="caseTypeNamesFormat"
          align="center"
          label="销售人员"
          prop="saleUserName"
        >
          <template #default="scope">
            {{ scope.row.saleUserName ? scope.row.saleUserName : "--" }}
          </template>
        </el-table-column>
        <el-table-column label="申请记录">
          <template #default="scope">
            <el-tooltip content="查看" hide-after="0" placement="top">
              <el-button
                :icon="View"
                text
                type="primary"
                @click="handleSee(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import request from "@/utils/request";
import { View } from "@element-plus/icons-vue";

const router = useRouter();
const total = ref(0);
const queryTime = ref("");
const queryParams = ref({
  region: "",
  pageNum: 1,
  pageSize: 10,
  userType: 1,
  queryQuickSearch: "",
});

const defaultParams = ref({
  userType: 1,
  pageNum: 1,
  pageSize: 10,
});
const showSearch = ref(true);

// 所属区域
const area = ref(["重庆", "北京", "成都", "陕西"]);

const deptList = ref([]);

// 搜索
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
// 重置
const resetQuery = () => {
  queryParams.value.queryQuickSearch = "";
  queryTime.value = "";
  queryParams.value.region = "";
  queryParams.value.queryJoinDateStart = "";
  queryParams.value.queryJoinDateEnd = "";
  getDeptList(defaultParams.value);
};
// 改变分页规则
const getPagination = (e) => {
  let { limit, page } = e;
  (queryParams.value.pageNum = page), (queryParams.value.pageSize = limit);
  getDeptList(queryParams.value);
};

const caseTypeNamesFormat = (row) => {
  return row.saleUserName ? row.saleUserName : "--";
};

//获取我的客户
const getDeptList = (params) => {
  request({
    url: "/hipp/hipp/rel/getMyCustomer",
    method: "get",
    params,
  })
    .then((res) => {
      if (res.code == 200) {
        total.value = Number(res.data.total);
        deptList.value = res.data.list;
      }
    })
    .catch((err) => console.log(err));
};

// 查看申请记录
const handleSee = ({ orgId, saleUserName, orgName }) => {
  router.push({
    path: "/insurance/handleBy/details",
    query: { orgId, saleUserName, orgName },
  });
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

onMounted(() => {
  getDeptList(defaultParams.value);
});
</script>
