<template>
  <!--  新增二级菜单下的内容选项  -->
  <div class="dialog_form">
    <el-form :rules="categoryArticleRuler" ref="categoryArticleInstance" :model="queryParames" label-width="100px">
      <el-form-item label="标题:" prop="title">
        <el-input placeholder="64字以内" v-model="queryParames.title"></el-input>
      </el-form-item>
      <el-form-item label="封面图:">
        <el-upload
          accept="image/jpeg,image/png,image/bmp,image/jpg,image/jif"
          ref="uploadInstance"
          :data="data"
          :headers="headers"
          :action="hostUrl"
          :on-success="upSuccess"
          :on-change="upChange"
          :on-exceed="exceed"
          :file-list="uploadFile" :limit="1" list-type="picture-card" :auto-upload="true">
          <el-icon>
            <Plus />
          </el-icon>
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="dialogImageUrl" alt="" />
              <span class="el-upload-list__item-actions">
<!--          <span-->
                <!--            class="el-upload-list__item-preview"-->
                <!--            @click="handlePictureCardPreview(file)"-->
                <!--          >-->
                <!--            <el-icon><zoom-in /></el-icon>-->
                <!--          </span>-->
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
            </div>
          </template>
        </el-upload>
        <!--        <el-dialog v-model="dialogVisible">-->
        <!--          <img :src="dialogImageUrl" alt="Preview Image" />-->
        <!--        </el-dialog>-->
      </el-form-item>
      <el-form-item label="摘要:">
        <el-input v-model="queryParames.desc"></el-input>
      </el-form-item>
      <!--      <el-form-item label="版本:">-->
      <!--        <el-input></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item label="正文:" prop="post">
        <div class="editor">
          <WangEditor
            v-model="queryParames.post"
            :defaultValue="defaultHtml"
            ref="wangEditorInstance"
          >
          </WangEditor>
        </div>
      </el-form-item>
    </el-form>
  </div>

</template>
<script setup>
import { computed, nextTick, onMounted, ref, shallowRef, watch } from "vue";
import { _ } from "lodash";
import WangEditor from "@/components/WangEditor/index";
import useHospitalConfigStore from "@/store/modules/hospitalConfig";
import { getToken } from "@/utils/auth";
import { ElMessage } from "element-plus";

const data = ref({
  path: "thumbnail"
});
const uploadInstance = ref(null);
const headers = ref({ Authorization: "Bearer " + getToken() });
const hostUrl = ref(`${window.location.protocol}//${window.location.host}${process.env.NODE_ENV === "development" ? "/dev-api" : "/prod-api"}/file/file/upload`);
const uploadFile = ref([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const disabled = ref(false);
const hospitalConfigStore = useHospitalConfigStore();
const defaultHtml = computed(() => hospitalConfigStore.publicEditorDefault);
const categoryArticleInstance = ref();
let queryParames = ref({
  categoryId: "",//类型主键
  corpId: "",//企业ID
  desc: "",//摘要
  post: "",//文本
  thumbnail: "",//缩略图
  title: "",//标题
  top: ""//是否置顶;1：是；2：否
});
const categoryArticleRuler = ref({
  title: [
    {
      required: true,
      message: "请输入标题名称",
      trigger: "blur"
    }
  ],
  post: [
    {
      required: true,
      message: "请填写文章内容",
      trigger: "blur"
    }
  ]
});
const clearForm = () => {
  uploadFile.value = [];
  dialogImageUrl.value = null;
  queryParames.value = {
    categoryId: "",//类型主键
    corpId: "",//企业ID
    desc: "",//摘要
    post: "",//文本
    thumbnail: "",//缩略图
    title: "",//标题
    top: ""//是否置顶;1：是；2：否
  };
};
const wangEditorInstance = shallowRef(null);
const upChange = async (file, list) => {
  if (!file.name || file.status === "fail") {
    return;
  }
  const tmpcnt = file.name.lastIndexOf(".");
  const exname = file.name.substring(tmpcnt);
  const names = [".jpeg", ".png", ".bmp", ".jpg", ".jif"];
  if (!names.includes(exname)) {
    ElMessage.error(`请上传${names.join(",")}格式的文件`);
    uploadInstance.value.handleRemove(file);
  } else if (file.size && file.size / 1024 / 1024 > 5) {
    ElMessage.error(`请上传小于5M的文件`);
    uploadInstance.value.handleRemove(file);
  } else {
    return;
  }
};
const sendQueryParams = () => {
  let { categoryId, corpId } = hospitalConfigStore.activeBarInfo;
  return { ...queryParames.value, categoryId, corpId };
};
const validateForm = async () => {
  return await categoryArticleInstance.value.validate();
};
const handleRemove = (file) => {
  uploadFile.value = [];
  queryParames.value.thumbnail = "";
  dialogImageUrl.value = null;
  uploadInstance.value.handleRemove(file);

};
const handlePictureCardPreview = (file) => {
  dialogVisible.value = true;
};
//文件上传成功的回调
const upSuccess = (response) => {
  if (response.code == 200) {
    ElMessage.success("封面图上传成功");
    queryParames.value.thumbnail = response.data.url;
    dialogImageUrl.value = response.data.url;
    uploadFile.value = [];
    if (queryParames.value.thumbnail !== "") {
      uploadFile.value.push({ url: queryParames.value.thumbnail });
    }
  }
};
const exceed = () => {
  ElMessage.error("最多上传一张封面图");
};
//处理回显数据
const handleReveal = (receiveData) => {
  let {
    post,
    thumbnail
  } = receiveData;
  post = _.unescape(_.unescape(post));
  uploadFile.value = [];
  if (thumbnail !== "") {
    uploadFile.value.push({ url: thumbnail });
  }
  dialogImageUrl.value = thumbnail;
  queryParames.value.thumbnail = thumbnail;
  hospitalConfigStore.publicEditorDefault = post;
  queryParames.value = Object.assign(queryParames.value, receiveData);
};
const emit = defineEmits(["backToPhone"]);
watch(() => queryParames.value.post, () => {
  emit("backToPhone", _.unescape(queryParames.value.post));
}, {
  immediate: true
});
defineExpose({
  validateForm,
  sendQueryParams,
  clearForm,
  handleReveal
});
</script>

<style lang="scss" scoped>
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

::v-deep(.el-input__wrapper) {
  box-shadow: none;
  cursor: default;
  border-radius: 0;
  border-bottom: 1px solid #e8e8e8;

  .el-input__inner {
    cursor: default !important;
  }
}

::v-deep(.el-input__inner) {


}

::v-deep(.el-input) {
  width: 100%;
}

.dialog_form {
  width: 100%;

  .editor {

  }
}

</style>


