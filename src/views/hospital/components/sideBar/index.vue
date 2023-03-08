<template>
  <div class="navbar">
    <el-menu
      style="height: 100%;font-weight: 600;font-size: 14pt"
      background-color="#f9f9f9"
      text-color="#333333"
      :unique-opened="true"
      active-text-color="#409EFF"
      :collapse-transition="false"
      :default-active="activeCategoryId"
      mode="vertical"
      @open="handleActiveBar"
    >
      <template v-for="nav in navs">
        <sideBarItem
          :nav="nav"
        >
        </sideBarItem>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import sideBarItem from "./sideBarItem/index.vue";
import variables from "@/assets/styles/variables.module.scss";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import usePermissionStore from "@/store/modules/permission";
import useHospitalConfigStore from "@/store/modules/hospitalConfig";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const settingsStore = useSettingsStore();
const hospitalConfigStore = useHospitalConfigStore();
const sideTheme = computed(() => settingsStore.sideTheme);
const theme = computed(() => settingsStore.theme);
const navs = computed(() => hospitalConfigStore.allActiveNav);
const responseNav = computed(() => hospitalConfigStore.category);
const activeCategoryId = ref(null);
const handleActiveBar = () => {
  activeCategoryId.value = JSON.parse(sessionStorage.getItem("activeBar")).categoryId;
  let categoryIdArray = responseNav.value.map(item => {
    return item.categoryId;
  });
  !categoryIdArray.includes(activeCategoryId.value) && (function() {
    if (activeCategoryId.value == "01") {
      //栏目管理
      hospitalConfigStore.changeComponentShow(true);
    } else if (activeCategoryId.value == "001") {
      //banner管理
      hospitalConfigStore.changeComponentShow(false);
      //  单独获取banner图列表
      hospitalConfigStore.changeActiveBarInfo(JSON.parse(sessionStorage.getItem("activeBar")));
    } else {
      hospitalConfigStore.changeComponentShow(false);
      hospitalConfigStore.changeActiveBarInfo(JSON.parse(sessionStorage.getItem("activeBar")));
    }
  })();
};
onMounted(() => {
  if (JSON.parse(sessionStorage.getItem("activeBar"))?.categoryId) {
    activeCategoryId.value = JSON.parse(sessionStorage.getItem("activeBar")).categoryId;
  } else {
    activeCategoryId.value = null;
  }
  if (route.query?.corpId) {
    hospitalConfigStore.changeCopId(route.query.corpId);
  }
});
</script>

<style scoped lang="scss">
.navbar {
  width: 200px;
  height: 100vh;
  background-color: #f9f9f9;
  overflow: auto;
}

</style>


