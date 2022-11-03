<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="客户端" prop="client">
        <el-input
          v-model="queryParams.client"
          placeholder="请输入客户端名称"
          clearable
          @keyup.enter="getList"
          @clear="getList"
          class="el-input"
        />
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本号"
          clearable
          @keyup.enter="getList"
          @clear="getList"
          class="el-input"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getList"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="versionList" row-key="versionId">
      <el-table-column
        prop="client"
        label="客户端名称"
        fixed
        :show-overflow-tooltip="true"
        min-width="180"
      >
      </el-table-column>
      <el-table-column
        prop="version"
        label="版本号"
        :show-overflow-tooltip="true"
        min-width="180"
      ></el-table-column>
      <el-table-column
        prop="upgradeContent"
        label="描述"
        :show-overflow-tooltip="true"
        min-width="180"
      ></el-table-column>
      <el-table-column
        prop="versionId"
        label="版本ID"
        min-width="180"
      ></el-table-column>
      <el-table-column
        prop="upgradeTime"
        label="上线时间"
        :show-overflow-tooltip="true"
        min-width="180"
      >
        <template #default="{ row }">
          <span>{{ parseTime(row.upgradeTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        min-width="120"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            type="text"
            icon="Plus"
            @click="handleAdd(scope.row)"
          ></el-button>
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
          ></el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="open" width="680px" draggable>
      <el-form
        ref="versionRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        scroll-to-error
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户端名称" prop="client">
              <el-input
                v-model="form.client"
                placeholder="请输入客户端名称"
                class="form-input_width"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上线时间" prop="upgradeTime">
              <el-date-picker
                v-model="form.upgradeTime"
                type="date"
                placeholder="请选择上线时间"
                class="form-input_width"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="版本号" prop="version">
              <el-input
                v-model="form.version"
                placeholder="请输入版本号"
                class="form-input_width"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="版本描述" prop="upgradeContent">
              <el-input
                type="textarea"
                v-model="form.upgradeContent"
                placeholder="请输入版本描述"
              />
            </el-form-item>
          </el-col>
        </el-row>
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

<script setup>
import { versionList_api, versionAdd_api, versionDelete_api, versionUpdate_api } from "@/api/system/version";

const { proxy } = getCurrentInstance();

const versionList = ref([]);
const open = ref(false);
const loading = ref(false);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    client: undefined,
    version: undefined,
  },
  rules: {
    client: [
      { required: true, message: "请输入客户端名", trigger: "blur" },
    ],
    upgradeTime: [
      { required: true, message: "请选择上线时间", trigger: "blur" },
    ],
		version: [
      { required: true, message: "请输入版本号", trigger: "blur" },
    ],
		upgradeContent: [
      { required: true, message: "请输入版本描述", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询菜单列表 */
function getList() {
  loading.value = true;
  versionList_api({ ...queryParams.value }).then(({ data, success }) => {
    loading.value = false;
    //返回来的数据重构成树结构，每一个数组的第一个当父元素，然后所有的当子元素，如果客户端只有一个版本则没有children
    success && (()=>{
      let list = data.map( val =>{
        return val.clientList.length>1 ?{
          ... val.clientList[0],
          children : val.clientList.splice(1)
        } : val.clientList[0]
      })
      versionList.value = list
    })();
  });
}
/** 表单重置 */
function reset() {
  form.value = {
    client: undefined,
		upgradeContent:undefined,
		upgradeTime:undefined,
		version:undefined
  };
  proxy.resetForm("versionRef");
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  getList()
}
/** 新增按钮操作 */
function handleAdd(row) {
  reset();
  form.value.client = row.client
  open.value = true;
  title.value = "添加菜单";
}
/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
	form.value = row
	open.value = true;
  title.value = "修改菜单";
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["versionRef"].validate((valid) => {
    if (valid) {
      if (title.value === "修改菜单") {
        versionUpdate_api(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        versionAdd_api(form.value).then((response) => {
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
  proxy.$modal
    .confirm('是否确认删除客户端"' + row.client + '"的数据项?')
    .then(function () {
      return versionDelete_api({id : row.versionId});
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

getList();
</script>
<style lang="scss" scoped>
.el-radio {
  margin-right: 15px;
}

.el-input {
  width: 200px;
}

.form-input_width {
  width: 220px;
}
</style>
