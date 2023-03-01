<template>
  <div class="categoryList_outBox" v-loading="publicLoading" element-loading-text="加载中...">
    <header>
      <div class="head">
        <span class="title">{{ defaultTableConfig.title }}</span>
        <div class="search">
          <div @click="searchCategoryByKeyword" class="search_icon">
          </div>
          <input v-model="keyword" @keyup.enter="searchCategoryByKeyword" placeholder="请输入名称"
                 class="serach_input" />
        </div>
        <div class="add">
          <el-button @click="createArticle" size="large" type="primary">{{ defaultTableConfig.createTitle }}</el-button>
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
            <el-button v-if="scope.row.status=='1'" link @click="()=>handlePosted(scope.row)" type="primary">发布
            </el-button>
            <el-button v-if="scope.row.status=='2'" link @click="()=>handleWithdrawn(scope.row)" type="primary">撤回
            </el-button>
            <el-button link type="primary">预览</el-button>
          </template>
        </publicTable>
      </div>
    </main>
    <footer>
      <div class="pagination">
        <!--        {{Number(total)}}-->
        <el-pagination layout="prev, pager, next" :total="Number(total)" />
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
import { _ } from "lodash";

const keyword = ref("");
const isAddOrPut = ref(true);
const formInstance = ref(null);
const hospitalConfigStore = useHospitalConfigStore();
let publicLoading = computed(() => hospitalConfigStore.publicLoading);
let dataInfo = computed(() => hospitalConfigStore.categoryDataList);
let total = computed(() => hospitalConfigStore.total);
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
    let result = formInstance.value.sendQueryParams();
    result.post = _.escape(result.post);
    addEditorItem({ ...result }).then(res => {
      if (res.code == 200) {
        ElMessage.success("新增内容成功");
        filterPubliceTableDataList();
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
//过滤列表数据
const filterPubliceTableDataList = () => {
  if (keyword.value == "") {
    let { categoryId, corpId, name } = hospitalConfigStore.activeBarInfo;
    hospitalConfigStore.getCategoryDataList({ categoryId, corpId, name });
  } else {
    hospitalConfigStore.filterCategoryDataList({ keyword: keyword.value });
  }
};
//条件搜索
const searchCategoryByKeyword = () => {
  hospitalConfigStore.filterCategoryDataList({ keyword: keyword.value });
};

//修改内容
const handlePut = () => {
  try {
    let result = formInstance.value.sendQueryParams();
    result.post = _.escape(result.post);
    changeEditorItem({ ...result }).then(res => {
      if (res.code == 200) {
        ElMessage.success("修改内容成功");
        filterPubliceTableDataList();
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
        filterPubliceTableDataList();
      }
    });
  } catch {
    ElMessage.error("删除失败");
  }
};
//发布富文本内容
const handlePosted = (row) => {
  row.status = 2;
  try {
    changeEditorItem({ ...row }).then(res => {
      if (res.code == 200) {
        ElMessage.success("发布内容成功");
        filterPubliceTableDataList();
      }
    });
  } catch {
    ElMessage.error("发布异常");
  }
};
//撤回富文本内容
const handleWithdrawn = (row) => {
  row.status = 1;
  try {
    changeEditorItem({ ...row }).then(res => {
      if (res.code == 200) {
        ElMessage.success("撤回内容成功");
        filterPubliceTableDataList();
      }
    });
  } catch {
    ElMessage.error("撤回异常");
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


