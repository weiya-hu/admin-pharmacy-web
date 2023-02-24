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
          :propList="hospitalIntroductionConfig.propList"
          :listData="dataInfo"
        >
          <template #handler>
            <el-button link type="primary">编辑</el-button>
            <el-button link type="primary">发布</el-button>
            <el-button link type="primary">撤回</el-button>
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
    width="60%"
    append-to-body
    :close-on-click-modal="false"
    draggable
    center
    v-model="isShowArticeDialog"
  >
    <createContentDialog>

    </createContentDialog>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addCategoryArticle" type="primary">确 定</el-button>
        <el-button>取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup name="hospitalCategoryList">
import publicTable from "@/views/hospital/components/publicComponent/publicTable.vue";
import hospitalIntroductionConfig from "@/views/hospital/config/hospitalIntroductionConfig";
import configMap from "@/views/hospital/config";
import createContentDialog from "@/views/hospital/components/publicComponent/createContentDialog";
import { computed, ref } from "vue";
import useHospitalConfigStore from "@/store/modules/hospitalConfig";

const hospitalConfigStore = useHospitalConfigStore();
let publicLoading = computed(() => hospitalConfigStore.publicLoading);
let dataInfo = computed(() => hospitalConfigStore.categoryDataList);
const isShowArticeDialog = ref(false);
const createArticle = () => {
  isShowArticeDialog.value = true;
};
const addCategoryArticle = () => {


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


