<template>
  <div class="config_box">
    <div class="sideBar">
      <sideBar></sideBar>
    </div>
    <div class="content">
      <div class="back">
        <topBack />
      </div>
      <div class="main">
        <component :is="isShowComponent?categoryManage:hospitalCategoryList">
        </component>
      </div>
    </div>
  </div>
</template>
<script setup name="HospitalConfig">
import WangEditor from "../../components/WangEditor/index.vue";
import sideBar from "./components/sideBar/index.vue";
import topBack from "./components/topBack/index.vue";
import categoryManage from "./components/categoryManage/index.vue";
import hospitalCategoryList from "./components/hospitalCategoryList/index.vue";
import { computed, ref } from "vue";
import useHospitalConfigStore from "@/store/modules/hospitalConfig";

const hospitalConfigStore = useHospitalConfigStore();
let isShowComponent = computed(() => hospitalConfigStore.isShowComponent);

</script>

<style scoped lang="scss">
.config_box {
  padding: 0 10px;
  width: 100%;
  height: 100vh;
  display: flex;

  .header {
  }

  .content {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;

    .sideBar {
      height: 100%;
      flex: 1;
    }

    .main {
      width: 100%;
      height: 100%;
      flex: 9
    }
  }
}
</style>

