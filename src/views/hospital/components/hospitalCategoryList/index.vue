<template>
  <div class="categoryList_outBox" v-loading="publicLoading" element-loading-text="加载中...">
    <header>
      <div class="head">
        <span class="title">{{ defaultTableConfig.title }}</span>
        <div class="search">
          <div @click="searchCategoryByKeyword" class="search_icon">
          </div>
          <input v-model.trim="keyword" @keyup.enter="searchCategoryByKeyword" placeholder="请输入名称"
                 class="serach_input" />
        </div>
        <div class="add">
          <el-button v-if="activeBar.categoryId!=='001'" @click="createArticle" size="large" type="primary">
            {{ defaultTableConfig.createTitle }}
          </el-button>
          <el-button v-else @click="addBanner" size="large" type="primary">{{ defaultTableConfig.createTitle }}
          </el-button>
        </div>
      </div>
    </header>
    <main>
      <div class="contentList">
        <publicTable
          :propList="defaultTableConfig.propList"
          :listData="dataInfo"
          v-bind="defaultTableConfig"
        >
          <template #status="scope">
            <span v-if="scope.row.status=='1'" style="color: red">草稿</span>
            <span v-if="scope.row.status=='2'" style="color: green">已发布</span>
            <span v-if="scope.row.status=='3'" style="color: red">已删除</span>
          </template>

          <template #handler="scope">
            <el-button link @click="()=>{handleEditor(scope.row)}" type="primary">编辑</el-button>
            <el-button @click="()=>deleteEditor(scope.row.postId)" link type="primary">删除</el-button>
            <el-button style="color:green;" v-if="scope.row.status=='1'" link @click="()=>handlePosted(scope.row)"
                       type="primary">发布
            </el-button>
            <el-button style="color:red;" v-if="scope.row.status=='2'" link @click="()=>handleWithdrawn(scope.row)"
                       type="primary">撤回
            </el-button>
            <el-button @click="()=>handlePreview(scope.row)" link type="primary">预览</el-button>
          </template>
          <!--        banner图插槽  -->

          <template #statusSlot="scope">
            <span v-if="scope.row.status=='0'" style="color: red">下架</span>
            <span v-if="scope.row.status=='1'" style="color: green">上架</span>
          </template>
          <template #picUrlSlot="scope">
            <el-image
              z-index="1000"
              style="width: 80px; height: 80px"
              :src="scope.row.picUrl"
              :zoom-rate="1.2"
              preview-teleported
              :preview-src-list="[scope.row.picUrl]"
              :initial-index="4"
              fit="cover"
            />
          </template>

          <template #handlerToBanner="scope">
            <el-button link @click="()=>handleBanner(scope.row)" type="primary">编辑</el-button>
            <el-button @click="()=>deleteBanner(scope.row)" link type="primary">删除</el-button>
            <el-button style="color:green;" v-if="scope.row.status=='0'" link
                       @click="()=>handlePostedOrWithdrawnToBanner('up',scope.row)"
                       type="primary">上架
            </el-button>
            <el-button style="color:red;" v-if="scope.row.status=='1'" link
                       @click="()=>handlePostedOrWithdrawnToBanner('down',scope.row)"
                       type="primary">下架
            </el-button>
          </template>
        </publicTable>
      </div>
    </main>
    <footer>
      <div class="pagination">
        <Pagination
          v-show="Number(allTotal) > 0"
          v-model:limit="params.pageSize"
          v-model:page="params.pageNum"
          :total="Number(allTotal)"
          @pagination="getPagination"
        ></Pagination>
      </div>
    </footer>
  </div>
  <el-dialog
    :title="isAddOrPut?'新建内容':'修改内容'"
    width="70%"
    append-to-body
    :close-on-click-modal="false"
    draggable
    center
    v-model="isShowArticeDialog"
  >
    <div style="display: flex;justify-content: space-evenly">
      <div style="padding-right: 50px;flex: 1">
        <createContentDialog
          @backToPhone="handleBackToPhone"
          ref="formInstance"
        >
        </createContentDialog>
      </div>
      <!--         实时预览-->
      <div class="phone">
        <img class="phoneImg" src="@/assets/images/hospitalImage/Phone2X.png">
        <div class="content" v-html="previewPost"></div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isAddOrPut" @click="handlePut" type="primary">修改</el-button>
        <el-button v-if="isAddOrPut" @click="addCategoryArticle" type="primary">确 定</el-button>
        <el-button @click="isShowArticeDialog= false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    title="预览"
    width="30%"
    append-to-body
    :close-on-click-modal="false"
    draggable
    center
    v-model="isShowPreview"
  >
    <div class="phone">
      <img class="phoneImg" src="@/assets/images/hospitalImage/Phone2X.png">
      <div class="content" v-html="previewPost"></div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="isShowPreview= false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    @close="closeBannerDialog"
    :title="isAddOrPutToBanner?'新增banner':'修改banner'"
    width="30%"
    append-to-body
    :close-on-click-modal="false"
    draggable
    center
    v-model="isShowBannerDialog"
  >
    <createBannerDialog
      ref="formInstanceToBanner"
    ></createBannerDialog>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="confirmEditorBanner" v-if="!isAddOrPutToBanner" type="primary">修改</el-button>
        <el-button @click="createBannerInfo" v-if="isAddOrPutToBanner" type="primary">确 定</el-button>
        <el-button @click="handleBannerCancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup name="hospitalCategoryList">
import publicTable from "@/views/hospital/components/publicComponent/publicTable.vue";
import hospitalIntroductionConfig from "@/views/hospital/config/tableConfig/hospitalIntroductionConfig";
import configMap from "@/views/hospital/config/tableConfig";
import createContentDialog from "@/views/hospital/components/publicComponent/createContentDialog";
import createBannerDialog from "@/views/hospital/components/publicComponent/createBannerDialog";
import { computed, nextTick, ref } from "vue";
import useHospitalConfigStore from "@/store/modules/hospitalConfig";
import { addEditorItem, changeEditorItem, deleteEditorItem } from "@/api/hospital/hospitalConfig";
import { ElMessage, ElMessageBox } from "element-plus";
import { _ } from "lodash";
import { watch } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { addBannerInfo, deleteBannerInfo, updateBannerInfo } from "@/api/hospital/bannerManagement";

const route = useRoute();
const params = ref({
  pageSize: 10,
  pageNum: 1
});
const keyword = ref("");
const isAddOrPut = ref(true);
const isAddOrPutToBanner = ref(true);
const formInstance = ref(null);
const formInstanceToBanner = ref(null);
const hospitalConfigStore = useHospitalConfigStore();
let publicLoading = computed(() => hospitalConfigStore.publicLoading);
let dataInfo = computed(() => hospitalConfigStore.categoryDataList);
let allTotal = computed(() => hospitalConfigStore.total);
const activeBar = computed(() => hospitalConfigStore.activeBarInfo);
let activeParentBarInfo = computed(() => hospitalConfigStore.activeParentBarInfo);
const corpId = computed(() => hospitalConfigStore.corpId);
const isShowBannerDialog = ref(false);
const isShowArticeDialog = ref(false);
const isShowPreview = ref(false);
let previewPost = ref(null);
const getPagination = (value) => {
  if (keyword.value == "") {
    hospitalConfigStore.getCategoryDataList(params.value);
  } else {
    hospitalConfigStore.filterCategoryDataList({ keyword: keyword.value, ...params.value });
  }
};
//新建文章
const createArticle = () => {
  router.push(`/hospital/articledetail?code=${activeParentBarInfo.value.code}&corpId=${route.query.corpId}`);
};
//banner新增
const addBanner = () => {
  isAddOrPutToBanner.value = true;
  isShowBannerDialog.value = true;
};

const defaultTableConfig = computed(() => hospitalConfigStore.publicTableConfig);
//手机预览
const handlePreview = ($event) => {
  isShowPreview.value = true;
  previewPost.value = _.unescape(_.unescape($event.post));
};
const handleBackToPhone = (value) => {
  previewPost.value = value;
};
//新增内容
const addCategoryArticle = async () => {
  await formInstance.value.validateForm() && (function() {
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
    } catch (error) {
      ElMessage.error(error);
      isShowArticeDialog.value = false;
    } finally {
      formInstance.value.clearForm();
    }
  })();
};
//新增banner内容
const createBannerInfo = async () => {
  await formInstanceToBanner.value.validateForm() && (function() {
    try {
      let result = formInstanceToBanner.value.sendQueryParams();
      addBannerInfo({ ...result, corpId: corpId.value }).then(res => {
        if (res.code == 200) {
          ElMessage.success("新增banner成功");
          filterPubliceTableDataList();
        }
      });
      isShowBannerDialog.value = false;
    } catch {
      ElMessage.error("新增banner失败");
      isShowBannerDialog.value = false;
    } finally {
      formInstanceToBanner.value.clearForm();
    }
  })();
};
//关闭banner弹框
const closeBannerDialog = () => {
  formInstanceToBanner.value.removeValidate();
  formInstanceToBanner.value.clearForm();
};
//取消处理banner的操作
const handleBannerCancel = () => {
  isShowBannerDialog.value = false;
  formInstanceToBanner.value.clearForm();
};
//过滤列表数据
const filterPubliceTableDataList = () => {
  if (keyword.value == "") {
    let { categoryId, corpId, name } = hospitalConfigStore.activeBarInfo;
    if (name == "banner图管理") {
      hospitalConfigStore.changeActiveBarInfo(JSON.parse(sessionStorage.getItem("activeBar")));
    } else {
      hospitalConfigStore.getCategoryDataList(params.value);
    }
  } else {
    hospitalConfigStore.filterCategoryDataList({ keyword: keyword.value, ...params.value });
  }
};
//条件搜索
const searchCategoryByKeyword = () => {
  let { categoryId, corpId, name } = hospitalConfigStore.activeBarInfo;
  if (name == "banner图管理") {
    hospitalConfigStore.getCategoryDataListToBanner({ title: keyword.value });
  } else {
    hospitalConfigStore.filterCategoryDataList({ keyword: keyword.value });

  }
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

//编辑banner
const handleBanner = ($event) => {
  isShowBannerDialog.value = true;
  isAddOrPutToBanner.value = false;
  nextTick(() => {
    formInstanceToBanner.value.handleReveal({ ...$event });
  });
};
//确认修改banner
const confirmEditorBanner = async () => {
  await formInstanceToBanner.value.validateForm() && await (async function() {
    let editorParams = formInstanceToBanner.value.sendQueryParams();
    try {
      let editorResult = await updateBannerInfo(editorParams);
      if (editorResult.code == 200) {
        ElMessage.success("修改成功");
        hospitalConfigStore.getCategoryDataListToBanner({ title: keyword.value });
      }
    } catch {
      ElMessage.error("修改失败");
    } finally {
      isShowBannerDialog.value = false;
      formInstanceToBanner.value.clearForm();
    }
  })();
};
//删除banner
const deleteBanner = async ($event) => {
  ElMessageBox.confirm(
    "是否删除这条banner信息?",
    "提示",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    }
  )
    .then(async () => {
      try {
        let deleteResult = await deleteBannerInfo({ bannerId: $event.bannerId });
        if (deleteResult.code == 200) {
          ElMessage.success("删除成功");
          hospitalConfigStore.getCategoryDataListToBanner({ title: keyword.value });
        }
      } catch {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {
    });
};

//下架和上架
const handlePostedOrWithdrawnToBanner = async (status, row) => {
  let params = { ...row };
  switch (status) {
    case "up":
      ElMessageBox.confirm(
        "是否上架?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          params.status = 1;
          try {
            let editorResult = await updateBannerInfo(params);
            if (editorResult.code == 200) {
              ElMessage.success("上架成功");
              hospitalConfigStore.getCategoryDataListToBanner({ title: keyword.value });
            }
          } catch {
            ElMessage.error("上架失败");
          }
        })
        .catch(() => {
        });
      break;
    case "down":
      ElMessageBox.confirm(
        "是否下架?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          params.status = 0;
          try {
            let editorResult = await updateBannerInfo(params);
            if (editorResult.code == 200) {
              ElMessage.success("下架成功");
              hospitalConfigStore.getCategoryDataListToBanner({ title: keyword.value });
            }
          } catch {
            ElMessage.error("下架失败");
          }
        })
        .catch(() => {
        });
      break;
  }
};


//点击编辑
const handleEditor = (row) => {
  // isAddOrPut.value = false;
  // isShowArticeDialog.value = true;
  // nextTick(() => {
  //   formInstance.value.handleReveal(_.cloneDeep(row));
  // });

  router.push(`/hospital/articledetail?postId=${row.postId}&corpId=${route.query.corpId}`);

};
watch(() => activeBar.value, () => {
  keyword.value = "";
}, {
  immediate: true,
  deep: true
});
</script>
<style scoped lang="scss">

.phone :deep(table) {
  border: 1px solid #cccc;
  border-collapse: collapse;
}

.phone:deep(td),
.phone:deep(th) {
  border: 1px solid #cccc;
}

.phone:deep(th) {
  border: 1px solid #cccc;
  background-color: #f5f2f0;
}

.categoryList_outBox {
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
      display: flex;
      justify-content: flex-end;
    }
  }

}

.phone {
  display: flex;
  justify-content: center;
  position: relative;
  margin-top: 40px;

  .phoneImg {
    display: inline-block;
    height: 840px;
    width: 415px;
  }

  .content {
    margin-top: 50px;
    position: absolute;
    height: 750px;
    width: 350px;
    overflow-y: auto;
  }
}

</style>


