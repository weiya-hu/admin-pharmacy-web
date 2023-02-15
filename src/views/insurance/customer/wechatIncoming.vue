<template>
  <el-table stripe v-loading="loading" :data="list">
    <!--    <el-table-column-->
    <!--        align="center"-->
    <!--        label="申请Id"-->
    <!--        width="180"-->
    <!--    >-->
    <!--      <template #default="scope"-->
    <!--      >{{ scope.row.applyMentId ? scope.row.applyMentId : "&#45;&#45;" }}-->
    <!--      </template>-->
    <!--      <el-table-column-->
    <!--          align="center"-->
    <!--          label="补充材料说明-->
    <!--"-->
    <!--      >-->
    <!--        <template #default="scope"-->
    <!--        >{{ scope.row.businessAdditionMsg ? scope.row.businessAdditionMsg : "&#45;&#45;" }}-->
    <!--        </template>-->
    <!--        -->
    <!--        -->
    <!--    </el-table-column>-->

    <el-table-column v-for="(val,index) in labelList" :label="val.label" :prop="val.prop" :key="index">
      <template #default="scope">
        {{ scope.row.val.prop ? scope.row.val.prop : '--' }}
      </template>
    </el-table-column>


  </el-table>
</template>

<script setup>
import {getApplymentList} from "@/api/insurance/wechatIncoming";
import {computed, onMounted, ref} from "vue";

const params = ref({})
const loading = ref(false)
const list = ref([])
const labelList = computed(() => {
  let arr = []
  for (let [i, j] in Object.entries(list.value)) {
    arr.push({
      label: i,
      prop: j
    })
  }
  return arr
})

onMounted(() => {
  // getApplymentList(params.value).then(res => {
  //   if (res.code == 200) {
  //     list.value = res.data.list
  //   }
  // })
  list.value = [{
    applyMentId: 265526565,
    businessCode: "fdsfdfssdf"

  }]
})

</script>

<style lang="scss" scoped>
</style>
