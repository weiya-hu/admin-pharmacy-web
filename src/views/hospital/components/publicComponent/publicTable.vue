<template>
  <div>
    <el-table
      :data="listData"
      style="width: 100%;font-size: 16px"
      v-bind="childrenProps"
      :header-cell-style="{ fontSize: '16px'}"
    >
      <el-table-column
        v-if="showSelectColumn"
        type="selection"
        align="center"
        width="60"
      ></el-table-column>
      <el-table-column
        v-if="showIndexColumn"
        type="index"
        label="序号"
        align="center"
        width="80"
      ></el-table-column>
      <template v-for="propItem in propList" :key="propItem.prop">
        <el-table-column v-bind="propItem" align="center"
                         :show-overflow-tooltip="propItem.tooltip!==undefined?propItem.tooltip:true">
          <template #default="scope">
            <slot :name="propItem.slotName" :row="scope.row">
              {{ scope.row[propItem.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script setup name="publicTable">
const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  listData: {
    type: Array,
    required: true
  },
  listCount: {
    type: Number,
    default: 0
  },
  propList: {
    type: Array,
    required: true
  },
  showIndexColumn: {
    type: Boolean,
    default: false
  },
  showSelectColumn: {
    type: Boolean,
    default: false
  },
  childrenProps: {
    type: Object,
    default: () => ({})
  }
});
</script>

<style scoped lang="less">

</style>
