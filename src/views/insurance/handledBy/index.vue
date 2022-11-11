<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item>
        <el-select v-model="queryParams.region" placeholder="所属区域">
          <el-option v-for="item in regionList" :value="item.value" :label="item.name" :key="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.source" placeholder="客户来源">
          <el-option v-for="item in sourceList" :value="item.value" :label="item.name" :key="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="加入日期">
        <el-date-picker
            v-model="queryParams.date"
            type="date"
            placeholder="加入日期"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryParams.name" placeholder="搜企业名称/联系人/联系电话" style="width: 250px"/>
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
      <el-table-column prop="name" label="企业名称" show-overflow-tooltip/>
      <el-table-column prop="user" label="联系人"/>
      <el-table-column prop="phone" label="联系电话" show-overflow-tooltip/>
      <el-table-column prop="region" label="所属区域"/>
      <el-table-column prop="address" label="详细地址" show-overflow-tooltip/>
      <el-table-column prop="source" label="客户来源"/>
      <el-table-column prop="date" label="加入日期" show-overflow-tooltip/>
      <el-table-column prop="salesman" label="销售人员"/>
      <el-table-column label="申请记录">
        <template #default="scope">
          <el-button text type="primary" :icon="View" @click="handleSee(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {View} from '@element-plus/icons-vue';

const router = useRouter();
const total = ref(0)
const queryParams = ref({
  region: '',
  source: '',
  date: '',
  name: '',
  pageNum: 1,
  pageSize: 10
})
const showSearch = ref(true)

// 所属区域
const regionList = [
  {value: '1', name: '四川'},
  {value: '2', name: '重庆'},
  {value: '3', name: '陕西'}
]
// 客户来源
const sourceList = [
  {value: '1', name: '店绩'},
  {value: '2', name: '线下'}
]
const deptList = [
  {
    name: '陕西xxx医药有限公司',
    user: '马玉',
    phone: '13302943376',
    region: '陕西',
    address: '陕西省西安市',
    source: '店绩',
    date: '2022.10.18',
    salesman: '黄军'
  }
]
// 搜索
const handleQuery = () => {

}
// 重置
const resetQuery = () => {

}
// 刷新表格数据
const getList = () => {

}
// 查看申请记录
const handleSee = (row) => {
  router.push({
    path: '/customer/Details',
    query: {name: row.name, salesman: row.salesman}
  })
}
</script>


