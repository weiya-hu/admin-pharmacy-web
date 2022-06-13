<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="租户名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入租户名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
            @clear="handleSearch"
        />
      </el-form-item>
<!--      <el-form-item label="参数键名" prop="url">-->
<!--        <el-input-->
<!--            v-model="queryParams.url"-->
<!--            placeholder="请输入参数键名"-->
<!--            clearable-->
<!--            style="width: 240px"-->
<!--            @keyup.enter="handleQuery"-->
<!--            @clear="handleSearch"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable @clear="handleSearch">
          <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" style="width: 308px;">
        <el-date-picker
            v-model="dateRange"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @clear="handleSearch"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="DArrowLeft"
            @click="handleClose"
        >返回</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Check"
            @click="handleSave"
            v-hasPermi="['system:config:remove']"
        >保存</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="configList">
      <el-table-column label="租户名称" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="主页" prop="url" :show-overflow-tooltip="true" />
      <el-table-column label="租户版权" prop="copyright" :show-overflow-tooltip="true" />
      <el-table-column label="登录背景" prop="loginBackground" :show-overflow-tooltip="true" />
      <el-table-column label="logo地址" prop="logo" :show-overflow-tooltip="true" />
      <el-table-column label="服务器IP" prop="serverIps" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" prop="createdAt" :show-overflow-tooltip="true">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="danger"
              @click="handleDisable(scope.row)"
              v-if="scope.row.status == 1"
          >禁用</el-button>
          <el-button
              type="primary"
              @click="handleEnable(scope.row)"
              v-if="scope.row.status == 0"
          >启用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

  </div>
</template>

<script setup name="Tenant">
import { listTenant, disableTenant, enableTenant, saveTenant } from "@/api/tenant/tenant";
const { proxy } = getCurrentInstance();

const configList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const dateRange = ref([]);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    url: undefined,
    status: undefined
  },
});
const statusList = ref([
  {value: 0, label: '禁用'},
  {value: 1, label: '启用'}
])

const { queryParams } = toRefs(data);

/** 查询参数列表 */
function getList() {
  loading.value = true;
  listTenant(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
    configList.value = response.data.list;
    total.value = Number(response.data.total);
    loading.value = false;
  });
}
/** 搜索按钮操作 */
function handleQuery() {
  dateRange.value = [];
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 清空事件 */
function handleSearch(){
  handleQuery()
}
/** 返回按钮操作 */
function handleClose() {
  const obj = { path: "/system/dict" };
  proxy.$tab.closeOpenPage(obj);
}
/** 保存 */
function handleSave(){
  // saveTenant().then(res =>{
  //
  // })
}
/** 禁用 */
function handleDisable(row){
  disableTenant(row.id).then(res =>{
    getList()
  })
}
/** 启用 */
function handleEnable(row){
  enableTenant(row.id).then(res =>{
    getList()
  })
}
getList();
</script>
