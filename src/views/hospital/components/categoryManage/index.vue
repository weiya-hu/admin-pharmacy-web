<template>
  <div class="manage">
    <header>
      <div class="head">
        <span class="title">功能列表</span>
        <div class="search">
          <div @click="searchCategoryByName" class="search_icon">
          </div>
          <input @keyup.enter="searchCategoryByName" v-model="searchKey" placeholder="请输入名称"
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
          <el-table-column prop="name" label="功能块名称" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="code" label="编码" />
          <el-table-column prop="address" label="菜单等级">
            <template #default="scope">
              <span style="color:#8e8e9d;" v-if="scope.row.pid==null">一级菜单</span>
              <span style="color:#8e8e9d;" v-else>二级菜单</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                @change="(value)=>{changeStatus(value,scope.row)}"
                style="--el-switch-off-color: #ff4949;--el-switch-on-color: #13ce66"
                size="small"
                inline-prompt
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="禁用"
              />
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template #default="scope">
              <el-button v-if="scope.row.pid==null" @click="()=>showLink(scope.row)" link type="primary">链接
              </el-button>
              <!--              <el-button v-if="scope.row.status=='0'" @click="()=>handleEnable(scope.row)" link type="primary">启用-->
              <!--              </el-button>-->
              <!--              <el-button v-if="scope.row.status=='1'" @click="()=>handleProhibition(scope.row)" link type="danger">禁用-->
              <!--              </el-button>-->
              <el-button v-if="scope.row.pid!==null" @click="()=>handleEditor(scope.row)" link type="primary">编辑
              </el-button>
              <!--              <el-button v-if="scope.row.pid!==null" @click="()=>{deleteCategory(scope.row)}" link type="primary">删除-->
              <!--              </el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
    <el-dialog
      @close="handleCancel"
      :title="addOrEditor?'新建菜单':'修改菜单'"
      append-to-body
      :close-on-click-modal="false"
      draggable
      center
      top="60vh"
      v-model="createCategoryShow"
      width="20%"
    >
      <el-form :rules="categoryFormRuler" :model="itemAdd" ref="categoryFormInstance" label-width="100px">
        <el-form-item label="菜单等级:">
          <el-select @change="changeGrade" v-model="itemAdd.grade">
            <el-option :disabled="index==0?true:false" v-for="(item,index) in categoryGradeOption" :key="index"
                       :value="item.value" :label="item.label">
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isShowParent" label="上级菜单名:" prop="pid">
          <el-select @change="chooseParentNode" v-model="itemAdd.pid">
            <el-option :value="item.value" v-for="(item,index) in parentOptions"
                       :label="item.label" :key="index">
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isShowParent" label="子菜单名称:" prop="name">
          <el-input class="label" v-model="itemAdd.name"></el-input>
        </el-form-item>
        <el-form-item v-if="isShowParent" label="编码:" prop="code">
          <el-input class="label" v-model="itemAdd.code"></el-input>
        </el-form-item>
        <el-form-item v-if="!isShowParent" label="菜单名称:">
          <el-input class="label" v-model="itemAdd.name"></el-input>
        </el-form-item>
        <!--        <el-form-item label="是否启用:">-->
        <!--          <el-radio-group v-model="itemAdd.status" class="ml-4">-->
        <!--            <el-radio :model-value="1" :label="1" size="large">是</el-radio>-->
        <!--            <el-radio :model-value="0" :label="0" size="large">否</el-radio>-->
        <!--          </el-radio-group>-->
        <!--        </el-form-item>-->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="createCategoryConfirm" type="primary">确 定</el-button>
          <el-button @click="handleCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      title="链接查看"
      append-to-body
      :close-on-click-modal="false"
      draggable
      center
      top="60vh"
      v-model="linkShow"
      width="30%"
    >
      <div style="display: flex;justify-content: center">
        <span style="font-size: 28px;font-weight: bold;color: #337ab7">{{ link }}</span>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="linkShow=false">关闭</el-button>
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
import {
  addCategory,
  changeCategoryItem,
  deleteCategoryItem,
  getCategoryDetail,
  getEditorList
} from "@/api/hospital/hospitalConfig";
import linkMap from "@/views/hospital/config/categoryLinkAndOptions/categoryLinkMap";

let categoryFormInstance = ref(null);
const categoryFormRuler = ref({
  name: [
    {
      required: true,
      message: "请输入菜单名称",
      trigger: "blur"
    }
  ],
  pid: [
    {
      required: true,
      message: "请选择上级菜单名称",
      trigger: "change"
    }
  ],
  code: [
    {
      required: true,
      message: "请编写菜单编码",
      trigger: "blur"
    }
  ]
});
const linkShow = ref(false);
const disPid = ref(false);
const router = useRouter();
const route = useRoute();
const hospitalConfigStore = useHospitalConfigStore();
const parentNodeCode = computed(() => hospitalConfigStore.activeParentBarInfo.code);
const itemAdd = ref({
  grade: "2",
  corpId: "",
  name: "",
  pid: null,
  status: "1",
  code: null
});
let queryParmas = {
  corpId: route.query?.corpId
};
const link = ref(null);
const addOrEditor = ref(true);
const searchKey = ref("");
const parentNode = ref(null);
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
const resetItemAdd = () => {
  itemAdd.value = {
    grade: "2",
    corpId: "",
    name: "",
    pid: null,
    status: "0",
    code: null
  };
};
//关键字搜索
const searchCategoryByName = () => {
  // hospitalConfigStore.filterCategory({ name: searchKey.value });
};
//展示链接
const showLink = (row) => {
  linkShow.value = true;
  link.value = linkMap.get(row.code);
};
const handleCancel = async () => {
  categoryFormInstance.value.resetFields();
  createCategoryShow.value = false;
  resetItemAdd();
};
const chooseParentNode = ($event) => {
  parentNode.value = navs.value.filter((item) => {
    return item.categoryId == $event;
  })[0];
};
const openCreateCategoryDialog = () => {
  addOrEditor.value = true;
  disPid.value = false;
  createCategoryShow.value = true;
};
const changeGrade = () => {
  if (itemAdd.value.grade == "2" && parentOptions.value.length == 0) {
    ElMessage.error("当前一级菜单为空，请先创建一级菜单");
    itemAdd.value.grade = "1";
  }
};
const createCategoryConfirm = async () => {
  let result = await categoryFormInstance.value.validate();
  result && (function() {
    if (itemAdd.value?.categoryId == undefined) {
      //新建菜单
      addCategory({ ...Object.assign(itemAdd.value, queryParmas) }).then(async res => {
        if (res.code == 200) {
          ElMessage.success("新增菜单成功");
          await hospitalConfigStore.generateNavs(queryParmas);
          innitParentOption();
          innitEditorList();
          createCategoryShow.value = false;
        }
      }).catch(rej => {
        ElMessage.error("新增失败");
      }).finally(() => {
        createCategoryShow.value = false;
        resetItemAdd();
      });
    } else {
      changeCategoryItem({ ...Object.assign(itemAdd.value, queryParmas) }).then(async res => {
        if (res.code == 200) {
          ElMessage.success("修改菜单成功");
          await hospitalConfigStore.generateNavs(queryParmas);
          innitParentOption();
          innitEditorList();
          createCategoryShow.value = false;
        }
      }).catch(rej => {
        ElMessage.error("修改失败");
      }).finally(() => {
        createCategoryShow.value = false;
        resetItemAdd();
      });
    }
  })();
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
const changeStatus = (status, row) => {
  if (row.pid == null && row.childs?.length !== 0) {
    if (status == 1) {
      handleEnable(row);
      row.childs.forEach(item => {
        handleEnable(item);
      });
    } else {
      handleProhibition(row);
      row.childs.forEach(item => {
        handleProhibition(item);
      });
    }
  } else {
    if (status == 1) {
      handleEnable(row);
    } else {
      handleProhibition(row);
    }
  }


};
//菜单启用
const handleEnable = (row) => {
  row.status = "1";
  try {
    changeCategoryItem({ ...row }).then(async res => {
      if (res.code == 200) {
        // ElMessage.success("菜单启用成功");
        await hospitalConfigStore.generateNavs(queryParmas);
        innitParentOption();
        innitEditorList();
      }
    });
  } catch {
    // ElMessage.error("菜单启用失败");
  }
};
//菜单禁用
const handleProhibition = (row) => {
  row.status = "0";
  try {
    changeCategoryItem({ ...row }).then(async res => {
      if (res.code == 200) {
        // ElMessage.success("菜单禁用成功");
        await hospitalConfigStore.generateNavs(queryParmas);
        innitParentOption();
        innitEditorList();
      }
    });
  } catch {
    // ElMessage.error("菜单禁用失败");
  }
};
//菜单编辑
const handleEditor = (row) => {
  addOrEditor.value = false;
  disPid.value = true;
  resetItemAdd();
  createCategoryShow.value = true;
  itemAdd.value = { ...row };
  let { pid } = row;
  if (pid !== null) {
    isShowParent.value = true;
    itemAdd.value.grade = "2";
  } else {
    isShowParent.value = false;
    itemAdd.value.grade = "1";
  }
};
//菜单编辑修改
const changeCategoryConfirm = () => {

};
//删除菜单
const deleteCategory = ($event) => {
  try {
    deleteCategoryItem({ categoryId: $event.categoryId }).then(async res => {
      if (res.code == 200) {
        ElMessage.error("菜单删除成功");
        await hospitalConfigStore.generateNavs(queryParmas);
        innitParentOption();
        innitEditorList();
      }
    });
  } catch {
    ElMessage.error("菜单删除失败");
  }
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
    queryParmas.corpId = route.query?.corpId;
    hospitalConfigStore.generateNavs(queryParmas).then(async res => {
      await hospitalConfigStore.generateNavs(queryParmas);
      innitParentOption();
      innitEditorList();
    });
  }
}, { immediate: true });
onMounted(() => {
});
</script>

<style scoped lang="scss">
::v-deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

::v-deep(.el-upload:hover ) {
  border-color: var(--el-color-primary);
}

::v-deep(.el-form-item__label) {
  font-weight: 800;
  display: flex;
  justify-content: flex-end;
}

::v-deep(.el-icon.avatar-uploader-icon) {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.label::v-deep(.el-input__wrapper) {
  box-shadow: none;
  cursor: default;
  border-radius: 0;
  border-bottom: 1px solid #e8e8e8;

  .el-input__inner {
    cursor: default !important;
  }
}

.label::v-deep(.el-select-dropdown__item) {
}

::v-deep(.el-input) {
  width: 100% !important;
}

::v-deep(.el-select) {
  width: 100% !important;
}

.manage {
  padding: 0 20px;
  width: calc(100% - 200px);

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


