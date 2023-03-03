<template>
  <div class="navbar">
    <el-menu
      style="height: 100%;font-weight: 600;font-size: 14pt"
      background-color="#f9f9f9"
      text-color="#333333"
      :unique-opened="true"
      active-text-color="#409EFF"
      :collapse-transition="false"
      mode="vertical"
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
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const settingsStore = useSettingsStore();
const hospitalConfigStore = useHospitalConfigStore();
const sideTheme = computed(() => settingsStore.sideTheme);
const theme = computed(() => settingsStore.theme);
const navs = computed(() => hospitalConfigStore.allActiveNav);
const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
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


