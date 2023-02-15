<template>
  <el-table stripe v-loading="loading" :data="list">
    <template v-for="(itemConfig,index) in props.tableListConfig">
      <el-table-column align="center" :label="itemConfig.label" width="180">
        <template v-if="itemConfig.slotName" #default="scope">
          <slot :row="scope.row" :name="itemConfig.slotName">
          </slot>
        </template>
      </el-table-column>
    </template>
    <el-table-column
      align="center"
      label="操作"
      show-overflow-tooltip
    >
      <template #default="scope">
        <div>二维码</div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    tableListConfig: [],
    tableListData: []
  }>(),
  {}
);
import { onMounted, ref } from "vue";

const params = ref({});
const loading = ref(false);
const list = ref([]);
</script>

<style lang="scss" scoped>


</style>
