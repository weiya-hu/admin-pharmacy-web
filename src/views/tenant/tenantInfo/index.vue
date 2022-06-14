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
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable @clear="handleSearch">
          <el-option
              v-for="dict in wecom_tenant_staus"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
        >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tenantList">
      <el-table-column label="租户名称" prop="name" :show-overflow-tooltip="true" width="150" fixed />
      <el-table-column label="租户版权" prop="copyright" :show-overflow-tooltip="true" />
      <el-table-column label="主页" prop="url" :show-overflow-tooltip="true" />
      <el-table-column label="登录背景" prop="loginBackground" :show-overflow-tooltip="true" />
      <el-table-column label="IP" prop="serverIps" :show-overflow-tooltip="true" />
      <el-table-column label="logo地址" prop="logo" :show-overflow-tooltip="true" />
      <el-table-column label="状态" width="120" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-tooltip content="分配权限" placement="top">
            <el-button
                type="text"
                icon="Edit"
                @click="handleUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
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
    <!-- 新增 -->
    <el-dialog title="新增租户" v-model="openData" width="550px" append-to-body draggable>
      <el-form :model="form" label-width="80px" ref="tenantData" :rules="rules">
        <el-form-item label="租户名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="企业ID" prop="plainCorpId">
          <el-input v-model="form.plainCorpId" />
        </el-form-item>
        <el-form-item label="主页" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="登录背景" prop="loginBackground">
          <el-input v-model="form.loginBackground" />
        </el-form-item>
        <el-form-item label="IP" prop="serverIps">
          <el-input v-model="form.serverIps" />
        </el-form-item>
        <el-form-item label="logo地址" prop="logo">
          <el-input v-model="form.logo" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in wecom_tenant_staus"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="roleRef" :model="form" label-width="80px">
        <el-form-item label="菜单权限">
<!--          <el-checkbox v-model="tenantExpand" @change="handleCheckedTreeExpand">展开/折叠</el-checkbox>-->
<!--          <el-checkbox v-model="tenantNodeAll" @change="handleCheckedTreeNodeAll">全选/反选</el-checkbox>-->
<!--          <el-checkbox v-model="form.tenantCheckStrictly" @change="handleCheckedTreeConnect">父子联动</el-checkbox>-->
          <el-tree
              class="tree-border"
              :data="tenantOptions"
              show-checkbox
              default-expand-all
              ref="tenantRef"
              node-key="menuId"
              :check-strictly="!form.tenantCheckStrictly"
              empty-text="加载中，请稍候"
              :props="{ label: 'menuName', children: 'children' }"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitDataScope">确 定</el-button>
          <el-button @click="cancelDataScope">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Tenant">
import { listTenant, disableTenant, enableTenant, saveTenant, treeselectTenant, updateTenant } from "@/api/tenant/tenant";
const { proxy } = getCurrentInstance();
const { wecom_tenant_staus } = proxy.useDict("wecom_tenant_staus");

const tenantList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const dateRange = ref([]);
const data = reactive({
  form:{},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    status: undefined
  },
  rules: {
    name: [{ required: true, message: "租户名称不能为空", trigger: "blur" }],
    plainCorpId: [{ required: true, message: "企业信息ID不能为空", trigger: "blur" }],
  },
});
const openData = ref(false)
const open = ref(false);
const title = ref("");

const tenantOptions = ref([]);
const tenantExpand = ref(false);
const tenantNodeAll = ref(false);
const tenantRef = ref(null);

const { queryParams, form, rules } = toRefs(data);

/** 查询参数列表 */
function getList() {
  loading.value = true;
  listTenant(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
    tenantList.value = response.data.list;
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
/** 新增 */
function handleAdd() {
  reset()
  openData.value = true
}

/** 租户状态修改 */
function handleStatusChange(row) {
  let text = row.status === 0 ? "启用" : "禁用";
  proxy.$modal.confirm('确认要"' + text + '""' + row.name + '"角色吗?').then(function () {
    if (row.status === 0){
      return disableTenant(row.id).then(res =>{
        proxy.$modal.msgSuccess(text + "成功");
        getList()
      })
    } else if(row.status = 1) {
      return enableTenant(row.id).then(res =>{
        proxy.$modal.msgSuccess(text + "成功");
        getList()
      })
    }
  })
}

// 弹窗
/** 重置新增的表单以及其他数据  */
function reset() {
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([]);
  }
  tenantExpand.value = false;
  tenantNodeAll.value = false;
  form.value = {
    tenantCheckStrictly: true,

    name: undefined,
    plainCorpId: undefined,
    url: undefined,
    loginBackground: undefined,
    serverIps: undefined,
    logo: undefined,
    status: '0',
  };
  proxy.resetForm("tenantData");
}
/** 确定按钮 */
function submitForm(){
  proxy.$refs["tenantData"].validate(valid => {
    if (valid) {
      // form.value.menuIds = getMenuAllCheckedKeys();
      saveTenant(form.value).then(response => {
        proxy.$modal.msgSuccess("新增成功");
        openData.value = false;
        getList();
      });
    }
  })
}
/** 取消按钮 */
function cancel() {
  openData.value = false;
  reset();
}


/** 分配权限 */
function handleUpdate(row){
  open.value = true;
  title.value = "配置权限";
  getTenantTreeselect()
}
/** 查询菜单树结构 */
function getTenantTreeselect() {
  treeselectTenant().then(response => {
    tenantOptions.value = response.data;
  });
}
/** 确定 */
function submitDataScope(){

}
/** 取消 */
function cancelDataScope(){
  open.value = false;
  reset()
}
getList();
</script>
