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
      <el-form-item label="参数键名" prop="configKey">
        <el-input
            v-model="queryParams.configKey"
            placeholder="请输入参数键名"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
            @clear="handleSearch"
        />
      </el-form-item>
      <el-form-item label="系统内置" prop="configType">
        <el-select v-model="queryParams.configType" placeholder="系统内置" clearable @clear="handleSearch">
          <el-option
              v-for="dict in sys_yes_no"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
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
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="configList">
      <el-table-column label="租户名称" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="参数键名" prop="configKey" :show-overflow-tooltip="true" />
      <el-table-column label="参数键值" prop="configValue" />
      <el-table-column label="创建时间" prop="createdAt">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统内置" prop="configType">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.configType" />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="200" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="primary"
              @click="handleUpdate(scope.row)"
              v-if="scope.row.status == 1"
          >禁用</el-button>
          <el-button
              type="danger"
              @click="handleUpdate(scope.row)"
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

<script setup name="Config">
import { listTenant, disableTenant, enableTenant, saveTenant } from "@/api/tenant/tenant";

const { proxy } = getCurrentInstance();
const { sys_yes_no } = proxy.useDict("sys_yes_no");

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
    configKey: undefined,
    configType: undefined
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询参数列表 */
function getList() {
  loading.value = true;
  listTenant(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
    configList.value = response.data.list;
    total.value = Number(response.data.total);
    loading.value = false;
  });
}
/** 表单重置 */
function reset() {
  form.value = {
    configId: undefined,
    name: undefined,
    configKey: undefined,
    configValue: undefined,
    configType: "Y",
    remark: undefined
  };
  proxy.resetForm("configRef");
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
getList();
</script>
