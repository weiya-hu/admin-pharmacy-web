<template>
  <div class="back_box">
    <div class="title">
      功能管理
    </div>
    <div class="back">
      <el-icon size="20" style="color: #337ab7">
        <ArrowLeftBold />
      </el-icon>
      <el-button link type="primary" @click="handleBack" class="back_text">
        返回
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const handleBack = () => {
  router.replace("/hospital/hospitalList");
};
</script>

<style scoped lang="scss">
.back_box {
  width: 100%;
  height: 150px;
  padding: 20px 15px 0 15px;
  background-color: #304156;

  .title {
    font-size: 25px;
    font-weight: 800;
    margin-bottom: 10px;
    color: #fff;
  }

  .back {
    display: flex;
    align-items: center;
  }
}

</style>


