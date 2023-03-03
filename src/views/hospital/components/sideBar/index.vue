<template>
  <div class="navbar">
    <el-menu
      style="height: 100%"
      :default-active="activeMenu"
      :background-color="sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
      :text-color="sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
      :unique-opened="true"
      :active-text-color="theme"
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
  height: 100%;
}

</style>


