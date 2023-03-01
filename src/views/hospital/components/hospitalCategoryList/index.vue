<template>
  <div class="categoryList_outBox" v-loading="publicLoading" element-loading-text="加载中...">
    <header>
      <div class="head">
        <span class="title">简介列表</span>
        <div class="search">
          <div class="search_icon">
          </div>
          <input placeholder="请输入名称"
                 class="serach_input" />
        </div>
        <div class="add">
          <el-button @click="createArticle" size="large" type="primary">新建</el-button>
        </div>
      </div>
    </header>
    <main>
      <div class="contentList">
        <publicTable
          :propList="defaultTableConfig.propList"
          :listData="dataInfo"
        >
          <template #status="scope">
            <span v-if="scope.row.status=='1'" style="color: red">草稿</span>
            <span v-if="scope.row.status=='2'" style="color: green">已发布</span>
            <span v-if="scope.row.status=='3'" style="color: red">已删除</span>
          </template>

          <template #handler="scope">
            <el-button link @click="()=>{handleEditor(scope.row)}" type="primary">编辑</el-button>
            <el-button @click="()=>deleteEditor(scope.row.postId)" link type="primary">删除</el-button>
            <el-button type="primary">发布</el-button>
            <el-button type="primary">撤回</el-button>
            <el-button link type="primary">预览</el-button>
          </template>
        </publicTable>
      </div>
    </main>
    <footer>
      <div class="pagination">
        <el-pagination layout="prev, pager, next" :total="100" />
      </div>
    </footer>
  </div>
  <el-dialog
    title="新建内容"
    width="50%"
    append-to-body
    :close-on-click-modal="false"
    draggable
    center
    v-model="isShowArticeDialog"
  >
    <createContentDialog
      ref="formInstance"
    >
    </createContentDialog>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isAddOrPut" @click="handlePut" type="primary">修改</el-button>
        <el-button v-if="isAddOrPut" @click="addCategoryArticle" type="primary">确 定</el-button>
        <el-button @click="isShowArticeDialog= false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup name="hospitalCategoryList">
import publicTable from "@/views/hospital/components/publicComponent/publicTable.vue";
import hospitalIntroductionConfig from "@/views/hospital/config/tableConfig/hospitalIntroductionConfig";
import configMap from "@/views/hospital/config/tableConfig";
import createContentDialog from "@/views/hospital/components/publicComponent/createContentDialog";
import { computed, nextTick, ref } from "vue";
import useHospitalConfigStore from "@/store/modules/hospitalConfig";
import { addEditorItem, changeEditorItem, deleteEditorItem } from "@/api/hospital/hospitalConfig";
import { ElMessage } from "element-plus";

const isAddOrPut = ref(true);
const formInstance = ref(null);
const hospitalConfigStore = useHospitalConfigStore();
let publicLoading = computed(() => hospitalConfigStore.publicLoading);
let dataInfo = computed(() => hospitalConfigStore.categoryDataList);
const isShowArticeDialog = ref(false);
//新建文章
const createArticle = () => {
  isAddOrPut.value = true;
  isShowArticeDialog.value = true;
  hospitalConfigStore.innitShowConfig();
};
const defaultTableConfig = computed(() => hospitalConfigStore.publicTableConfig);
//新增内容
const addCategoryArticle = () => {
  try {
    addEditorItem({ ...formInstance.value.sendQueryParams() }).then(res => {
      if (res.code == 200) {
        ElMessage.success("新增内容成功");
        hospitalConfigStore.getCategoryDataList(hospitalConfigStore.activeBarInfo);
      }
    });
    isShowArticeDialog.value = false;
  } catch {
    ElMessage.error("新增异常");
    isShowArticeDialog.value = false;
  } finally {
    formInstance.value.clearForm();
  }
};
//修改内容
const handlePut = () => {
  try {
    changeEditorItem({ ...formInstance.value.sendQueryParams() }).then(res => {
      if (res.code == 200) {
        ElMessage.success("修改内容成功");
        hospitalConfigStore.getCategoryDataList(hospitalConfigStore.activeBarInfo);
      }
    });
    isShowArticeDialog.value = false;
  } catch {
    ElMessage.error("修改异常");
    isShowArticeDialog.value = false;
  } finally {
    formInstance.value.clearForm();
  }
};
//删除富文本内容
const deleteEditor = (id) => {
  try {
    deleteEditorItem({ postId: id }).then(res => {
      if (res.code == 200) {
        ElMessage.success("删除成功");
        hospitalConfigStore.getCategoryDataList(hospitalConfigStore.activeBarInfo);
      }
    });
  } catch {
    ElMessage.error("删除失败");
  }
};
//点击编辑
const handleEditor = (row) => {
  isAddOrPut.value = false;
  isShowArticeDialog.value = true;
  console.log(row);
  nextTick(() => {
    formInstance.value.handleReveal(row);
  });
};

</script>

<style scoped lang="scss">
.categoryList_outBox {
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
    .contentList {
      margin: 60px 0;
    }
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


