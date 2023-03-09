<template>
  <div v-loading="isLoading" element-loading-text="加载中..." class="management_box">
    <header>
      <el-form :model="searchParams" style="display: flex">
        <el-form-item class="label" label="名称">
          <el-input v-model="searchParams.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item class="label" label="机构编码">
          <el-input v-model="searchParams.code" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item class="label" label="省份">
          <el-input v-model="searchParams.province" placeholder="请输入省份"></el-input>
        </el-form-item>
      </el-form>
      <div class="handleSearch">
        <el-button type="primary" @click="getPagination">搜索</el-button>
        <el-button @click="resetDate">重置</el-button>
        <el-button type="primary" @click="addOrg">新增机构</el-button>
        <el-button type="primary" @click="exportExcel">文件导出</el-button>
      </div>
    </header>
    <main>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="num" label="序号" />
        <el-table-column prop="sw" label="商务" />
        <el-table-column prop="id" label="商务id" />
        <el-table-column prop="fw" label="类目" />
        <el-table-column prop="code" label="编码" />
        <el-table-column prop="city" label="城市" />
        <el-table-column prop="county" label="区县" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="province" label="省份" />
        <el-table-column prop="yyr" label="运营人" />
        <el-table-column prop="yyrId" label="运营人ID" />
        <el-table-column prop="name" label="连锁名称" />
        <el-table-column align="center" fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" link @click="()=>changeDetail(scope.row)">修改</el-button>
            <el-button type="primary" size="small" link @click="()=>deleteOrg(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <div class="pagination">
        <Pagination
          v-show="total > 0"
          v-model:limit="searchParams.pageSize"
          v-model:page="searchParams.pageNum"
          :total="total"
          @pagination="getPagination"
        ></Pagination>
      </div>
    </footer>
    <el-dialog width="30%" v-model="isShowChange" title="修改机构信息" center>
      <el-form ref="formChangeInstance" :rules="form_rulers" :model="orgDetail">
        <el-form-item label-width="100px" class="change" label="机构名称">
          <el-input v-model="orgDetail.name" placeholder="请输入机构名称"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="机构编码">
          <el-input v-model="orgDetail.code" placeholder="请输入机构编码"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="商务id">
          <el-input v-model="orgDetail.swId" placeholder="请输入商务id"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="商务">
          <el-input v-model="orgDetail.sw" placeholder="请输入商务"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="城市">
          <el-input v-model="orgDetail.city" placeholder="请输入城市"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="区县">
          <el-input v-model="orgDetail.county" placeholder="请输入区县"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="省份">
          <el-input v-model="orgDetail.province" placeholder="请输入省份"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="连锁名称">
          <el-input v-model="orgDetail.name" placeholder="请输入连锁名称"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="运营人">
          <el-input v-model="orgDetail.yyr" placeholder="请输入运营人"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="changeConfirm">确定</el-button>
        <el-button @click="changeCanCel">取消</el-button>
      </template>
    </el-dialog>
    <el-dialog width="30%" v-model="isShowAdd" title="新增机构信息" center>
      <el-form ref="formAddInstance" :rules="form_rulers" :model="orgDetail">
        <el-form-item label-width="100px" class="change" label="机构名称">
          <el-input v-model="orgDetail.name" placeholder="请输入机构名称"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="机构编码">
          <el-input v-model="orgDetail.code" placeholder="请输入机构编码"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="商务id">
          <el-input v-model="orgDetail.swId" placeholder="请输入商务id"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="商务">
          <el-input v-model="orgDetail.sw" placeholder="请输入商务"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="城市">
          <el-input v-model="orgDetail.city" placeholder="请输入城市"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="区县">
          <el-input v-model="orgDetail.county" placeholder="请输入区县"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="省份">
          <el-input v-model="orgDetail.province" placeholder="请输入省份"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="连锁名称">
          <el-input v-model="orgDetail.name" placeholder="请输入连锁名称"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" class="change" label="运营人">
          <el-input v-model="orgDetail.yyr" placeholder="请输入运营人"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
        <el-button @click="changeCanCel">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import { getHospitalList } from "@/api/hospital/hospitalList";
import {
  addOreManage,
  deleteOreManage,
  getOreManageList,
  updateOreManageDetail,
  exportExcelFile
} from "@/api/mTOrgManagement/mTOrgManagement";
import { ElMessage } from "element-plus";

const formChangeInstance = ref();
const formAddInstance = ref();
const isShowChange = ref(false);
const isShowAdd = ref(false);
const isLoading = ref(false);
const total = ref(2);
//机构详情
let orgDetail = ref({
  swId: "",//商务id
  sw: "",//商务
  id: "",//主链id
  fw: "",//类目
  num: "",//序号
  code: "",//编码
  addr: "",//机构地址
  city: "",//城市
  county: "",//区县
  name: "",//名称
  province: "",//省份

  yyr: "",//运营人
  yyrId: ""//运营人ID
});
const form_rulers = ref({
  num: [{
    required: true,
    message: "请输入序号",
    trigger: "blur"
  }],
  code: [{
    required: true,
    message: "请输入编码",
    trigger: "blur"
  }],
  addr: [{
    required: true,
    message: "请输入机构地址",
    trigger: "blur"
  }],
  city: [{
    required: true,
    message: "请输入城市",
    trigger: "blur"
  }],
  county: [{
    required: true,
    message: "请输入区县",
    trigger: "blur"
  }],
  sw: [{
    required: true,
    message: "请输入商务",
    trigger: "blur"
  }],
  swId: [{
    required: true,
    message: "请输入商务id",
    trigger: "blur"
  }],
  name: [{
    required: true,
    message: "请输入连锁名称",
    trigger: "blur"
  }],
  level: [{
    required: true,
    message: "请输入机构等级",
    trigger: "blur"
  }],

  province: [{
    required: true,
    message: "请输入省份",
    trigger: "blur"
  }],
  twoType: [{
    required: true,
    message: "请输入标题名称",
    trigger: "blur"
  }],
  type: [{
    required: true,
    message: "请输入连锁名称",
    trigger: "blur"
  }],
  yyr: [{
    required: true,
    message: "请输入机构类型",
    trigger: "blur"
  }],
  yyrId: [{
    required: true,
    message: "请输入运营人",
    trigger: "blur"
  }]
});

//搜索参数
let searchParams = ref({
  name: undefined,
  code: undefined,
  province: undefined,
  pageNum: 1,
  pageSize: 10
});
const tableData = ref([]);
const getPagination = async () => {
  try {
    isLoading.value = true;
    let resultDatalist = await getOreManageList(searchParams.value);
    if (resultDatalist.code == 200) {
      tableData.value = resultDatalist.data.list;
      total.value = Number(resultDatalist.data.total);
    }
  } finally {
    isLoading.value = false;
  }
};
//内容重置
const resetDate = async () => {
  searchParams.value = {
    name: "",
    code: "",
    province: "",
    pageNum: 1,
    pageSize: 10
  };
  try {
    let resultDatalist = await getOreManageList(searchParams.value);
    if (resultDatalist.code == 200) {
      tableData.value = resultDatalist.data.list;
      total.value = Number(resultDatalist.data.total);
    }
  } finally {
    isLoading.value = false;
  }
};
//删除机构
const deleteOrg = async ($event) => {
  try {
    let res = await deleteOreManage({ id: $event.id });
    if (res.code == 200) {
      ElMessage.success("删除成功");
      await getPagination();
    }
  } catch (error) {
    ElMessage.error(error);
  }
};
//确认修改机构
const changeConfirm = async () => {
  try {
    // let isValidate = await formChangeInstance.value.validate();
    // isValidate &&
    // await (async function() {
    let result = updateOreManageDetail(orgDetail.value);
    if (result.code == 200) {
      ElMessage.success("修改成功");
      await getPagination();
    }
    // })();
  } catch (error) {
    ElMessage.error(("修改失败"));
  } finally {
    isShowChange.value = false;
  }
};
//取消修改/新增机构
const changeCanCel = () => {
  isShowAdd.value = false;
  isShowChange.value = false;
  orgDetail.value = {
    swId: "",//商务id
    sw: "",//商务
    id: "",//主链id
    fw: "",//类目
    num: "",//序号
    code: "",//编码
    addr: "",//机构地址
    city: "",//城市
    county: "",//区县
    name: "",//名称
    province: "",//省份
    yyr: "",//运营人
    yyrId: ""//运营人ID
  };
};
//导出excel文件
const exportExcel = async () => {
  if (searchParams.value.name == "" && searchParams.value.code == "" && searchParams.value.province == "") {
    ElMessage.error("数据量过大请筛选之后再导出");
    return;
  }
  let { name, code, province } = searchParams.value;
  let result = await exportExcelFile({ name, code, province });
  console.log(result);
  let blob = new Blob([result.data], { type: "application/vnd.ms-excel;charset=utf-8" });
  let downloadElement = document.createElement("a");
  let href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  downloadElement.download = "export_excel.xlsx";
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
};

//新增机构
const addOrg = () => {
  isShowAdd.value = true;
};
//确认新增
const confirmAdd = async () => {
  let isValidate = await formAddInstance.value.validate();
  try {
    isValidate && await (async function() {
      let result = await addOreManage(orgDetail.value);
      if (result.code == 200) {
        ElMessage.success("新增成功");
      }
    })();
  } catch (error) {
    ElMessage.error(error);
  } finally {
    orgDetail.value = {
      swId: "",//商务id
      sw: "",//商务
      id: "",//主链id
      fw: "",//类目
      num: "",//序号
      code: "",//编码
      addr: "",//机构地址
      city: "",//城市
      county: "",//区县
      name: "",//名称
      province: "",//省份
      name: "",//连锁名称
      yyr: "",//运营人
      yyrId: ""//运营人ID
    };
    isShowAdd.value = false;
    await getPagination();
  }
};
//修改机构
const changeDetail = ($event) => {
  isShowChange.value = true;
  nextTick(() => {
    orgDetail.value = { ...$event };
  });
};
//获取机构列表
onMounted(async () => {
  try {
    isLoading.value = true;
    let resultDatalist = await getOreManageList({});
    if (resultDatalist.code == 200) {
      tableData.value = resultDatalist.data.list;
      total.value = Number(resultDatalist.data.total);
    }
  } catch (error) {
    ElMessage.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
<style scoped lang="scss">
.change:deep(.el-input__wrapper) {
  box-shadow: none;
  cursor: default;
  border-radius: 0;
  border-bottom: 1px solid #e8e8e8;

  .el-input__inner {
    cursor: default !important;
  }
}

:deep(.el-form-item__label) {
  justify-content: flex-start;
}

.management_box {
  header {
    margin: 20px 0;
    display: flex;

    .handleSearch {
      margin-left: 20px;
    }

    .label {
      margin-left: 20px;
    }
  }

  padding: 50px;
  background: #FFFFFF;
  width: 100%;
  height: 100%;

}
</style>




