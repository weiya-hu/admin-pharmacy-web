<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="套餐名" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入套餐名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租户状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择租户状态" clearable>
          <el-option label="启用" :value="1"/>
          <el-option label="禁用" :value="0"/>
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
            v-hasPermi="['wecom:package:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['wecom:package:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['wecom:package:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="packageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="套餐编号" align="center" prop="tenantPackageId"/>
      <el-table-column label="套餐名" align="center" prop="name"/>
      <el-table-column label="租户状态" align="center" prop="status"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['wecom:package:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['wecom:package:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改租户套餐对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="packageRef" :model="form" :rules="rules" label-width="85px">
        <el-form-item label="套餐名" prop="name">
          <el-input v-model="form.name" placeholder="请输入套餐名"/>
        </el-form-item>
        <el-form-item label="平台产品ID">
          <el-select v-model="form.platformProductId" placeholder="请输入平台产品ID" style="width: 100%;">
            <el-option v-for="dict in platform_product_id"
                       :key="dict.value"
                       :label="dict.label"
                       :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="租户状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/反选</el-checkbox>
          <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动
          </el-checkbox>
          <el-tree
              class="tree-border"
              :data="menuOptions"
              show-checkbox
              ref="menuRef"
              node-key="menuId"
              :check-strictly="!menuCheckStrictly"
              empty-text="加载中，请稍候"
              :props="{ label: 'menuName', children: 'children' }"
          ></el-tree>
        </el-form-item>
        <!--        <el-form-item label="关联的菜单编号" prop="menuIds">-->
        <!--          <el-input v-model="form.menuIds" type="textarea" placeholder="请输入内容" />-->
        <!--        </el-form-item>-->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Package">
import {listPackage, getPackage, delPackage, addPackage, updatePackage} from "@/api/tenant/tenantPackage";
import {roleMenuTreeselect, treeselect as menuTreeselect} from "@/api/system/menu";

const {proxy} = getCurrentInstance();
const { platform_product_id } = proxy.useDict("platform_product_id");
// const { ${dictsNoSymbol} } = proxy.useDict(${dicts});

const packageList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const menuExpand = ref(false);
const menuNodeAll = ref(false);
const menuOptions = ref([]);
const menuRef = ref()
const menuCheckStrictly = ref(true)
const data = reactive({
  form: {
    status: 1
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null, status: null, menuIds: null,
  },
  rules: {
    name: [
      {required: true, message: "套餐名不能为空", trigger: "blur"}
    ], status: [
      {required: true, message: "租户状态不能为空", trigger: "blur"}
    ], menuIds: [
      {required: true, message: "关联的菜单编号不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询租户套餐列表 */
function getList() {
  loading.value = true;
  listPackage(queryParams.value).then(response => {
    packageList.value = response.data.list;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    tenantPackageId: null,
    name: null,
    status: 1,
    remark: null,
    menuIds: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    platformProductId: null
  };
  proxy.resetForm("packageRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.tenantPackageId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  getMenuTreeselect();
  open.value = true;
  title.value = "添加租户套餐";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _tenantPackageId = row.tenantPackageId || ids.value
  getPackage(_tenantPackageId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改租户套餐";
    let checkedKeys = response.data.menuIds;
    menuTreeselect().then(response => {
      menuOptions.value = response.data;
      checkedKeys.forEach((v) => {
        nextTick(() => {
          menuRef.value.setChecked(v, true, false);
        });
      });
    });
  });
}

// /** 提交按钮 */
function submitForm() {
  proxy.$refs["packageRef"].validate(valid => {
    if (valid) {
      form.value.menuIds = getMenuAllCheckedKeys();
      if (form.value.tenantPackageId != null) {
        updatePackage(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPackage(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _tenantPackageIds = row.tenantPackageId || ids.value;
  proxy.$modal.confirm('是否确认删除租户套餐编号为"' + _tenantPackageIds + '"的数据项？').then(function () {
    return delPackage(_tenantPackageIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('wecom/package/export', {
    ...queryParams.value
  }, `package_${new Date().getTime()}.xlsx`)
}

/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value, type) {
  if (type == "menu") {
    let treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      menuRef.value.store.nodesMap[treeList[i].menuId].expanded = value;
    }
  } else if (type == "dept") {
    let treeList = deptOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  }
}

/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value, type) {
  if (type == "menu") {
    menuRef.value.setCheckedNodes(value ? menuOptions.value : []);
  } else if (type == "dept") {
    deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
  }
}

/** 树权限（父子联动） */
function handleCheckedTreeConnect(value, type) {
  if (type == "menu") {
    menuCheckStrictly.value = value ? true : false;
  } else if (type == "dept") {
    form.value.deptCheckStrictly = value ? true : false;
  }
}

/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}

/** 查询菜单树结构 */
function getMenuTreeselect() {
  menuTreeselect().then(response => {
    menuOptions.value = response.data;
  });
}

getList();
</script>
