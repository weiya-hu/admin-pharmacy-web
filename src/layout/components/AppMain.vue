<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.path"/>
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script setup>
import useTagsViewStore from '@/store/modules/tagsview'

const tagsViewStore = useTagsViewStore()
const route = useRoute()
tagsViewStore.addCachedView(route)
const cachedViews = computed(() => {
    return tagsViewStore.cachedViews
})

let threeSum = function(nums=[]) {
  let total=0
  if(nums.length<3) return
   if(nums.length==3){
     total=nums.reduce((total,b)=>{
       return total+=b
     })
     return total==0?[[...nums]]:[]
   }
};
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
</style>