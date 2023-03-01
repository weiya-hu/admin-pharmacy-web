<template>
  <!--  新增二级菜单下的内容选项  -->
  <div class="dialog_form">
    <el-form label-width="100px">
      <el-form-item label="标题:">
        <el-input placeholder="64字以内" v-model="queryParames.title"></el-input>
      </el-form-item>
      <el-form-item label="封面图:">
        <el-upload
          ref="uploadInstance"
          :data="data"
          :headers="headers"
          :action="hostUrl"
          :on-success="upSuccess"
          :on-exceed="exceed"
          v-model="uploadFile" :limit="1" action="#" list-type="picture-card" :auto-upload="true">
          <el-icon>
            <Plus />
          </el-icon>
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
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
        <el-dialog align-center v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="摘要:">
        <el-input v-model="queryParames.desc"></el-input>
      </el-form-item>
      <el-form-item label="版本:">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="正文:">
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
import { computed, ref, shallowRef, watch } from "vue";
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
const uploadFile = ref(null);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const disabled = ref(false);
const hospitalConfigStore = useHospitalConfigStore();
const defaultHtml = computed(() => hospitalConfigStore.publicEditorDefault);
let queryParames = ref({
  categoryId: "",//类型主键
  corpId: "",//企业ID
  desc: "",//摘要
  post: "",//文本
  thumbnail: "",//缩略图
  title: "",//标题
  top: ""//是否置顶;1：是；2：否
});
const clearForm = () => {
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
const sendQueryParams = () => {
  let { categoryId, corpId } = hospitalConfigStore.activeBarInfo;
  return { ...queryParames.value, categoryId, corpId };
};
const handleRemove = (file) => {
  uploadFile.value = null;
  queryParames.value.thumbnail = "";
  uploadInstance.value.handleRemove(file);
  console.log(queryParames.value.thumbnail);
};
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};
//文件上传成功的回调
const upSuccess = (response) => {
  if (response.code == 200) {
    ElMessage.success("封面图上传成功");
    queryParames.value.thumbnail = response.data.url;
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
  post = _.unescape(post);
  console.log(post, "post");
  dialogImageUrl.value = thumbnail;
  queryParames.value.thumbnail = thumbnail;
  hospitalConfigStore.publicEditorDefault = post;
  queryParames.value = Object.assign(queryParames.value, receiveData);
  console.log(queryParames.value);
};
defineExpose({
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
  width: 910px;
}

.dialog_form {


  .editor {

  }
}

</style>


