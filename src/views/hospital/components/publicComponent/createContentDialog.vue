<template>
  <!--  新增二级菜单下的内容选项  -->
  <div class="dialog_form">
    <el-form>
      <el-form-item label="标题">
        <el-input placeholder="64字以内" v-model="queryParames.title"></el-input>
      </el-form-item>
      <el-form-item label="封面图">

      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="queryParames.desc"></el-input>
      </el-form-item>
      <el-form-item label="版本">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="正文">
        <div class="editor">
          <WangEditor>

          </WangEditor>
        </div>
      </el-form-item>
    </el-form>
  </div>

</template>

<script setup>
import { ref } from "vue";
import WangEditor from "@/components/WangEditor/index";

let queryParames = ref({
  categoryId: "",//类型主键
  corpId: "",//企业ID
  desc: "",//摘要
  post: "",//文本
  thumbnail: "",//缩略图
  title: "",//标题
  top: ""//是否置顶;1：是；2：否
});
</script>

<style lang="scss" scoped>
.dialog_form {


  .editor {


  }
}

</style>


