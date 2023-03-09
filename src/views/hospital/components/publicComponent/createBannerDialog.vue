<template>
  <!--  新增二级菜单下的内容选项  -->
  <div class="dialog_form">
    <el-form :rules="categoryArticleRuler" ref="categoryArticleInstance" :model="queryParames" label-width="110px">
      <el-form-item class="label" label-width="110px" label="banner标题:" prop="title">
        <el-input placeholder="64字以内" v-model="queryParames.title"></el-input>
      </el-form-item>
      <el-form-item class="label" label-width="110px" label="图片:">
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
      </el-form-item>
      <el-form-item class="label" label-width="110px" label="简述:" prop="des">
        <el-input v-model="queryParames.des"></el-input>
      </el-form-item>
      <el-form-item label-width="110px" label="排序:" prop="sort">
        <!--        <el-input v-model.number="queryParames.sort"></el-input>-->
        <el-select v-model="queryParames.sort">
          <el-option v-for="item in sortArray" :value="item" :label="item" :key="item">{{ item }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="110px" label="链接界面:" prop="pageUrl">
        <el-select v-model="queryParames.pageUrl">
          <el-option :key="item.value" v-for="item in linkOptions" :label="item.label" :value="item.value">{{ item.label
            }}
          </el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label-width="110px" label="已上架/未上架:" prop="status">-->
<!--        <el-select v-model="queryParames.status">-->
<!--          <el-option :value="1" label="已上架">已上架</el-option>-->
<!--          <el-option :value="0" label="未上架">未上架</el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
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
import linkOptions from "@/views/hospital/config/categoryLinkAndOptions/linkOptions";

const data = ref({
  path: "banner"
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
  des: "",//简述
  picUrl: "",//图片
  title: "",//标题
  pageUrl: "",//跳转界面
  sort: null,//  序号,
  status: 0
});
const categoryArticleRuler = ref({
  title: [
    {
      required: true,
      message: "请输入标题名称",
      trigger: "blur"
    }
  ]
});
//排序
const sortArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const clearForm = () => {
  uploadFile.value = [];
  dialogImageUrl.value = null;
  queryParames.value = {
    categoryId: "",//类型主键
    corpId: "",//企业ID
    des: "",//简述
    picUrl: "",//图片
    title: "",//标题
    pageUrl: "",//跳转界面
    sort: null,//  序号
    bannerId: null,
    status: 0
  };
};
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
  queryParames.value.picUrl = "";
  dialogImageUrl.value = null;
  uploadInstance.value.handleRemove(file);

};
const handlePictureCardPreview = (file) => {
  dialogVisible.value = true;
};
//文件上传成功的回调
const upSuccess = (response) => {
  if (response.code == 200) {
    ElMessage.success("图片上传成功");
    queryParames.value.picUrl = response.data.url;
    dialogImageUrl.value = response.data.url;
    uploadFile.value = [];
    if (queryParames.value.picUrl !== "") {
      uploadFile.value.push({ url: queryParames.value.picUrl });
    }
  }
};
const exceed = () => {
  ElMessage.error("最多上传一张封面图");
};
//处理回显数据
const handleReveal = (receiveData) => {
  let {
    picUrl
  } = receiveData;
  uploadFile.value = [];
  if (picUrl !== "") {
    uploadFile.value.push({ url: picUrl });
  }
  dialogImageUrl.value = picUrl;
  queryParames.value.picUrl = picUrl;
  queryParames.value = Object.assign(queryParames.value, receiveData);
};
//移除校验
const removeValidate = () => {
  categoryArticleInstance.value.clearValidate();
};

const emit = defineEmits(["backToPhone"]);
defineExpose({
  validateForm,
  sendQueryParams,
  clearForm,
  handleReveal,
  removeValidate
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

.label::v-deep(.el-input__wrapper) {
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

:deep(.el-form-item__label) {
  //justify-content: flex-start;
}

::v-deep(.el-input) {
  width: 100% !important;
}

::v-deep(.el-select) {
  width: 100% !important;
}

.dialog_form {
  width: 100%;

  .editor {

  }
}

</style>


