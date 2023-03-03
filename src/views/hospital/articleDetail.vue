<template>
  <div class="article_box">
    <div style="display: flex;justify-content: space-evenly">
      <div style="padding-right: 50px;flex: 2">
        <createContentDialog
          @backToPhone="handleBackToPhone"
          ref="formInstance"
        >
        </createContentDialog>
      </div>
      <!--         实时预览-->
      <div class="phone" style="flex: 1">
        <img class="phoneImg" src="@/assets/images/hospitalImage/Phone2X.png">
        <div class="content" v-html="previewPost"></div>
      </div>
    </div>
    <footer>
      <div class="footer">
        <el-button v-if="currentPostId" @click="handlePut" type="primary">修改</el-button>
        <el-button v-if="!currentPostId" @click="addCategoryArticle" type="primary">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import createContentDialog from "@/views/hospital/components/publicComponent/createContentDialog";
import { _ } from "lodash";
import { addEditorItem, changeEditorItem, geteEditorDetail } from "@/api/hospital/hospitalConfig";
import { ElMessage } from "element-plus";
import router from "@/router";
import { useRoute } from "vue-router";
import useHospitalConfigStore from "@/store/modules/hospitalConfig";

const hospitalConfigStore = useHospitalConfigStore();
const route = useRoute();
const formInstance = ref();
let previewPost = ref(null);
const currentPostId = ref(null);
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
          // filterPubliceTableDataList();
          router.replace(`/hospital/hospitalConfig?corpId=${route.query.corpId}`);
        }
      });
    } catch (error) {
      ElMessage.error(error);
    } finally {
      formInstance.value.clearForm();
    }
  })();
};
//修改内容
const handlePut = () => {
  try {
    let result = formInstance.value.sendQueryParams();
    result.post = _.escape(result.post);
    changeEditorItem({ ...result }).then(res => {
      if (res.code == 200) {
        ElMessage.success("修改内容成功");
        // filterPubliceTableDataList();
        router.replace(`/hospital/hospitalConfig?corpId=${route.query.corpId}`);
      }
    });
  } catch {
    ElMessage.error("修改异常");
  } finally {
    formInstance.value.clearForm();
  }
};
//返回
const cancel = () => {
  router.replace(`/hospital/hospitalConfig?corpId=${route.query.corpId}`);
};
onMounted(() => {
  formInstance.value.clearForm();
  if (route.query.code) {
    nextTick(() => {
      hospitalConfigStore.innitShowConfig(route.query.code);
    });
  }
  if (route.query.postId) {
    currentPostId.value = route.query.postId;
    //  请求编辑数据
    geteEditorDetail({ postId: currentPostId.value }).then(res => {
      if (res.code == 200) {
        nextTick(() => {
          formInstance.value.handleReveal(_.cloneDeep(res.data));
        });
      }
    });
  }
});
</script>

<style scoped lang="scss">
.article_box {
  padding: 100px 50px;

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

  footer {
    margin-top: 100px;
    text-align: center;
  }
}


</style>


