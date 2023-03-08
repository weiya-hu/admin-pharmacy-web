<template>
  <div class="navItem">
    <!--  当不存在child时展示-->
    <template v-if="!nav.childs">
      <el-menu-item @click="($event)=>changeCategory($event)" :index="nav.categoryId">{{ nav.name }}
      </el-menu-item>
    </template>
    <!--当存在childs时展示-->
    <el-sub-menu :index="nav.categoryId" v-else>
      <template #title>
        <span class="menu-title">{{ nav.name }}</span>
      </template>
      <sideBarItem
        v-for="child in nav.childs"
        :nav="child"
      />
    </el-sub-menu>
  </div>
</template>
<script setup name="sideBarItem">
import useHospitalConfigStore from "@/store/modules/hospitalConfig";

const hospitalConfigStore = useHospitalConfigStore();
const props = defineProps({
  nav: {
    type: Object,
    required: true
  }
});
//获取菜单项
const changeCategory = ($event, nav) => {
  if (props.nav.name !== "栏目管理") {
    if (props.nav.name !== "banner图管理") {
      hospitalConfigStore.changeComponentShow(false);
      hospitalConfigStore.changeActiveBarInfo(props.nav);
    } else if (props.nav.name == "banner图管理") {
      //  单独请求banner图列表的接口
      hospitalConfigStore.changeComponentShow(false);
      hospitalConfigStore.changeActiveBarInfo(props.nav);
    }
  } else {
    hospitalConfigStore.changeComponentShow(true);
  }
  sessionStorage.setItem("activeBar", JSON.stringify(props.nav));
};
</script>

<style scoped lang="scss">


</style>


