<template>
  <div class="app-container">
    <div class="header">
      <div class="name">{{info.name}}</div>
      <div class="salesman">销售人员：{{info.salesman}}</div>
      <el-divider />
    </div>
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="签约日期">
        <el-date-picker
            v-model="queryParams.date"
            type="date"
            placeholder="签约日期"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryParams.name" placeholder="搜合同编号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table :data="deptList">
      <el-table-column label="协议编号" />
    </el-table>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const info = ref({
  name: router.currentRoute.value.query.name,
  salesman: router.currentRoute.value.query.salesman
})
const queryParams = ref({
  date: '',
  name: ''
})
const showSearch = ref(true)
const deptList = []

// 搜索
const handleQuery = () => {

}
// 重置
const resetQuery = () => {

}
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  .name {
    text-align: center;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #333333;
    line-height: 39px;
  }
  .salesman {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #333333;
    line-height: 39px;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
