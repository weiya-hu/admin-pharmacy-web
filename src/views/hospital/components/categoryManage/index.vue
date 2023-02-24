<template>
  <div class="manage">
    <header>
      <div class="head">
        <span class="title">功能列表</span>
        <div class="search">
          <div class="search_icon">
          </div>
          <input placeholder="请输入名称"
                 class="serach_input" />
        </div>
        <div class="add">
          <el-button @click="openCreateCategoryDialog" size="large" type="primary">新建功能块</el-button>
        </div>
      </div>
    </header>
    <main>
      <div class="mainTable">
        <el-table
          :data="tableData"
          style="width: 100%; margin-bottom: 20px;font-size: 16px"
          row-key="categoryId"
          default-expand-all
          :header-cell-style="{ fontSize: '16px'}"
          :tree-props="{children: 'childs'}"
        >
          <el-table-column align="center" prop="name" label="功能块名称" />
          <el-table-column align="center" prop="name" label="创建时间" />
          <el-table-column align="center" prop="address" label="菜单等级" />
          <el-table-column align="center" prop="address" label="操作">
            <el-button link type="primary">启用</el-button>
            <el-button link type="danger">禁用</el-button>
            <el-button link type="primary">编辑</el-button>
          </el-table-column>
        </el-table>
      </div>
    </main>

    <el-dialog
      title="新建菜单"
      width="40%"
      append-to-body
      :close-on-click-modal="false"
      draggable
      center
      v-model="createCategoryShow"
    >
      <el-form label-width="180px">
        <el-form-item label="菜单等级">
          <el-select @change="changeGrade" v-model="itemAdd.grade">
            <el-option v-for="(item,index) in categoryGradeOption" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isShowParent" label="上级菜单名">
          <el-select v-model="itemAdd.pid">
            <el-option :value="item.value" v-for="(item,index) in parentOptions" :label="item.label" :key="index">
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isShowParent" label="菜单名称">
          <el-input v-model="itemAdd.name"></el-input>
        </el-form-item>
        <el-form-item v-if="!isShowParent" label="子菜单名称">
          <el-input v-model="itemAdd.name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="createCategoryConfirm" type="primary">确 定</el-button>
          <el-button @click="createCategoryShow = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script setup name="categoryManage">
import { computed, onMounted, ref, watch } from "vue";
import useHospitalConfigStore from "@/store/modules/hospitalConfig";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { addCategory, getCategoryDetail, getEditorList } from "@/api/hospital/hospitalConfig";

const router = useRouter();
const route = useRoute();
const hospitalConfigStore = useHospitalConfigStore();
const itemAdd = ref({
  grade: "1",
  corpId: "",
  name: "",
  pid: ""
});
let queryParmas = {
  corpId: route.query?.corpId
};
const navs = computed(() => hospitalConfigStore.navBar);
const dataList = computed(() => hospitalConfigStore.category);
const parentOptions = ref([]);
const isShowParent = ref(false);
const tableData = ref([]);
const createCategoryShow = ref(false);
const categoryGradeOption = [
  {
    label: "一级菜单",
    value: "1"
  },
  {
    label: "二级菜单",
    value: "2"
  }

];
const openCreateCategoryDialog = () => {
  createCategoryShow.value = true;
};
const changeGrade = () => {
  if (itemAdd.value.grade == "2" && parentOptions.value.length == 0) {
    ElMessage.error("当前一级菜单为空，请先创建一级菜单");
    itemAdd.value.grade = "1";
  }
};
const createCategoryConfirm = () => {
  addCategory(Object.assign(itemAdd.value, queryParmas)).then(async res => {
    await hospitalConfigStore.generateNavs(queryParmas);
    innitParentOption();
    innitEditorList();
    createCategoryShow.value = false;
  });
};
const innitParentOption = () => {
  parentOptions.value = (navs.value.filter(item => {
    if (item.name !== "栏目管理") {
      return true;
    } else {
      return false;
    }
  })).map(item => {
    return {
      label: item.name,
      value: item.categoryId
    };
  });
};
const innitEditorList = () => {
  tableData.value = dataList.value;
};
watch(() => itemAdd.value.grade, () => {
  if (itemAdd.value.grade == "1") {
    isShowParent.value = false;
  } else {
    isShowParent.value = true;
  }
}, {
  immediate: true
});
watch(() => router.currentRoute.value.path, (newValue, oldValue) => {
  if (route.query?.corpId) {
    hospitalConfigStore.generateNavs(queryParmas).then(res => {
      innitParentOption();
      innitEditorList();
    });
  }
}, { immediate: true });

onMounted(() => {
});

</script>

<style scoped lang="scss">
.manage {
  padding: 0 20px;

  .head {
    display: flex;
    margin-top: 40px;
    justify-content: space-evenly;

    .title {
      font-size: 25px;
      font-weight: 800;
      display: inline-block;
      width: 150px;
      text-align: center;
    }

    .search {
      width: 30%;
      height: 40px;
      background: #F5F5F5;
      display: flex;
      flex-direction: row;
      border-radius: 10px;
      padding: 2px 5px;

      .search_icon {
        width: 10%;
        z-index: 100;
        background: url("@/assets/images/searchIcon/serc.png") no-repeat 50% 50%;
      }

      .serach_input {
        width: 90%;
        border: none;
        background-color: #F5F5F5;
        outline: none;
        color: #333333;
        font-size: 20px;
      }
    }

    .add {
      margin-left: 50px;
    }


  }

  main {
    margin: 40px;
  }

  footer {
    width: 100%;
    height: 100px;
    line-height: 100px;
    align-self: flex-end;

    .pagination {
      text-align: center;
      width: 200px;
      margin: 0 auto;
    }
  }
}

</style>


