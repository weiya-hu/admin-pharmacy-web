<template>
  <div class="app-container">
    <div class="header">
      <el-button text :icon="ArrowLeft" @click="handleReturn">返回</el-button>
      <div class="name">{{info.name}}</div>
      <div class="salesman">销售人员：{{info.salesman}}</div>
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
    <el-table :data="deptList" v-loading="loading">
      <el-table-column label="协议编号" prop="code" show-overflow-tooltip />
      <el-table-column label="下载协议" prop="download" show-overflow-tooltip />
      <el-table-column label="签约清单" prop="list" show-overflow-tooltip>

      </el-table-column>
      <el-table-column label="签约人" prop="user" show-overflow-tooltip />
      <el-table-column label="签约日期" prop="signingDate" show-overflow-tooltip />
      <el-table-column label="签约机构数量(家)" prop="quantity" show-overflow-tooltip width="130" />
      <el-table-column label="应付金额(元)" prop="payable" show-overflow-tooltip width="100" />
      <el-table-column label="实付金额(元)" prop="paid" show-overflow-tooltip width="100" />
      <el-table-column label="支付时间" prop="date" show-overflow-tooltip />
      <el-table-column label="支付类型" prop="type" show-overflow-tooltip>

      </el-table-column>
      <el-table-column label="支付凭证" prop="voucher" show-overflow-tooltip />
      <el-table-column label="进件申请" prop="apply" show-overflow-tooltip>

      </el-table-column>
      <el-table-column label="状态" prop="status" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.status === 1">待签约</span>
          <span v-if="scope.row.status === 2">已失效</span>
          <span v-if="scope.row.status === 3">待付款</span>
          <span v-if="scope.row.status === 4">待进件</span>
          <span v-if="scope.row.status === 5">审核中</span>
          <span v-if="scope.row.status === 6">驳回</span>
          <span v-if="scope.row.status === 7">审核通过</span>
          <span v-if="scope.row.status === 10">已归档</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template #default="scope">
          <el-button text type="primary" :icon="View" @click="handleClick('see', scope.row)"></el-button>
          <el-tooltip content="归档" placement="top">
            <el-button v-if="scope.row.status===7" text type="primary" :icon="Check" @click="handleClick('file', scope.row)"></el-button>
          </el-tooltip>
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
import {useRouter} from "vue-router";
import {getCurrentInstance, ref} from "vue";
import {ArrowLeft,View, Check} from '@element-plus/icons-vue';

const router = useRouter();
const { proxy } = getCurrentInstance();
const info = ref({
  name: router.currentRoute.value.query.name,
  salesman: router.currentRoute.value.query.salesman
})
const queryParams = ref({
  date: '',
  name: '',
  pageNum: 1,
  pageSize: 10
})
const showSearch = ref(true)
const loading = ref(false)
const total = ref(0)
const deptList = [{
  code: 'SHPS100003',
  download: '签约成功下载电子合同',
  list: '',
  user: '蓝天',
  signingDate: '2022.10.20',
  quantity: '30',
  payable: '300000',
  paid: '300000',
  date: '2022.10.21',
  type: '线下支付',
  voucher: '已付款',
  apply: '',
  status: 7,
}]

// 搜索
const handleQuery = () => {

}
// 重置
const resetQuery = () => {

}
// 刷新表格数据
const getList = () => {
}
// 按钮
const handleClick = (type, row) => {
  if (type === 'see') {

  } else if (type === 'file') {

  }
}
// 返回
const handleReturn = () => {
  const obj = { path: "/customer/HandledBy" };
  proxy.$tab.closeOpenPage(obj);
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #E5E5E5;
  padding-bottom: 20px;
  margin-bottom: 30px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #333333;
  line-height: 39px;
  .name {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    line-height: 39px;
  }
  .salesman {
    font-size: 14px;
  }
}
</style>
