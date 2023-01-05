<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
      <el-form-item label="租户名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入租户名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
            @clear="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQueryParam">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      </el-col>
      <right-toolbar :showSearch="true" @queryTable="handleQuery"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tableListData">
      <el-table-column label="租户编号" prop="tenantId" fixed width="180" show-overflow-tooltip />
      <el-table-column label="租户名称" prop="name" fixed width="160" show-overflow-tooltip />
      <el-table-column label="租户版本" prop="packageId" fixed width="100" show-overflow-tooltip />
      <el-table-column label="联系人" prop="contactName" width="150" show-overflow-tooltip />
      <el-table-column label="联系电话" prop="contactMobile" width="120" show-overflow-tooltip />
      <el-table-column label="账号额度" prop="accountCount" />
      <el-table-column label="过期时间" prop="expireTime" width="150" show-overflow-tooltip />
      <el-table-column label="绑定域名" prop="domain" width="150" show-overflow-tooltip />
      <el-table-column label="租户状态" prop="status">
        <template #default="scope">
          <dict-tag :options="wecom_tenant_staus" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="140" show-overflow-tooltip />
      <el-table-column label="操作" fixed="right" width="270">
        <template #default="scope">
          <el-button type="text" icon="View" size="small" @click="queryInfoById(scope.row)">查看</el-button>
          <el-button type="text" icon="Edit" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" icon="Pointer" size="small" @click="handleView(scope.row)">查看参数</el-button>
          <!--          <el-button type="text" icon="Delete"  @click="handleDelete(scope.row)"  >删除  </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
    <!-- 新增 -->
    <el-dialog :title="thisHandleType"  v-model="shouAddDia" width="60%" :close-on-click-modal="false" draggable>
      <el-form :model="formData" ref="formDataRef" label-width="150px" :rules="formRule" :disabled="thisHandleType==='查看详情'">
        <el-row>
          <el-col :span="12">
            <el-form-item label="租户账号" prop="username" v-if="thisHandleType==='新增租户'">
              <el-input v-model="formData.username"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租户密码" prop="password" v-if="thisHandleType==='新增租户'">
              <el-input type="password" v-model="formData.password"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="租户名称" prop="name">
              <el-input v-model="formData.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="租户版本" prop="packageId">
              <el-select v-model="formData.packageId" multiple style="width: 100%">
                <el-option v-for="(item,index) in packageList" :key="index" :value="item.id" :label="item.name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系人" prop="contactName">
              <el-input v-model="formData.contactName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人电话" prop="contactMobile">
              <el-input v-model="formData.contactMobile"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过期时间" prop="expireTime">
              <el-date-picker style="width: 100%" v-model="formData.expireTime" type="date" placeholder="请选择版本到期时间"
                              value-format="YYYY-MM-DD HH:mm:ss"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号数量" prop="accountCount">
              <el-input type="number" v-model.number="formData.accountCount"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="formData.status"
                inline-prompt
                :active-value="0"
                :inactive-value="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="绑定域名" prop="domain">
              <el-input v-model="formData.domain"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formCancel">取 消</el-button>
          <el-button type="primary" @click="formSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 回调参数 -->
    <el-dialog title="查看参数" v-model="dialogVisible" width="720px" :close-on-click-modal="false" draggable destroy-on-close>
      <el-descriptions :column="1" border size="large">
        <el-descriptions-item label="企业ID" label-align="right" align="center">{{ state.corpId }}</el-descriptions-item>
        <el-descriptions-item label="应用名" label-align="right" align="center">{{ state.agentName }}</el-descriptions-item>
        <el-descriptions-item label="应用密钥" label-align="right" align="center">{{ state.agentSecret }}</el-descriptions-item>
        <el-descriptions-item label="回调url" label-align="right" align="center">{{ state.backOffUrl }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="Tenant">
import {lastYear} from '@/utils/dateUtils'
import {listTenant, saveTenant, updateTenant, getTenantDetail, getTenantInfo} from "@/api/tenant/tenant";
import {getSimpleList} from "@/api/tenant/tenantPackage";
import {ElMessage} from "element-plus";

const {proxy} = getCurrentInstance();
const {wecom_tenant_staus} = proxy.useDict("wecom_tenant_staus");
const thisHandleType = ref('新增租户')
const formDataRef = ref()
//租户版本列表
const packageList = ref([])
//新增表单
const formData = ref({
  name: '',
  packageId: [],
  accountCount: 10,
  contactMobile: '',
  contactName: '',
  domain: '',
  expireTime: lastYear('right', 1),
  password: '',
  status: 1,
  username: '',
})
// 参数
const state = ref({
  corpId: '',
  agentName: '',
  agentSecret: '',
  backOffUrl: ''
})
//表单验证
const formRule = reactive({
  name: [{required: true, message: "不能为空", trigger: "blur"}],
  accountCount: [{required: true, message: "不能为空", trigger: "blur"}],
  contactName: [{required: true, message: "不能为空", trigger: "blur"}],
  expireTime: [{required: true, message: "不能为空", trigger: "blur"}],
  packageId: [{required: true, message: "不能为空", trigger: "change"}],
  password: [{required: true, message: "不能为空", trigger: "blur"}],
  status: [{required: true, message: "不能为空", trigger: "blur"}],
  username: [{required: true, message: "不能为空", trigger: "blur"}],
})

//新增表单弹窗
const shouAddDia = ref(false)
// 查看参数
const dialogVisible = ref(false)

//查询表单
const queryRef = ref()
//列表查询参数
const queryParams = reactive({
  name: '',
  pageNum: 1,
  pageSize: 10,
})
//总数据条数
const total = ref(0)
//列表数据
const tableListData = ref([])
//列表loading状态
const loading = ref(false)

//重置查询参数
const resetQueryParam = () => {
  queryRef.value.resetFields()
  handleQuery()
}
//重置表单数据
const resetFormData = ()=>{
  formData.value = {
    name: '',
    packageId: [],
    accountCount: 10,
    contactMobile: '',
    contactName: '',
    domain: '',
    expireTime: lastYear('right', 1),
    password: '',
    status: 1,
    username: '',

  }
}
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
}
//查询列表
const getList = () => {
  /** 搜索按钮操作 */
  listTenant(queryParams).then(res => {
    if (res.code === 200) {
      tableListData.value = res.data.list
      total.value = Number(res.data.total)
    }
  })
}
//查看详情
const queryInfoById = (row) => {
  resetFormData()
  thisHandleType.value = '查看详情'
  getTenantDetail(row.tenantId)
      .then(res => {
        if (res.code === 200) {
          formData.value = res.data
          formData.value.packageId = res.data.packageId?res.data.packageId.split(','):[]
          shouAddDia.value = true
        }
      })
}


//新增弹窗
const handleAdd = () => {
  resetFormData()
  shouAddDia.value = true
  thisHandleType.value = '新增租户'
}
//编辑弹窗
const handleEdit = (row) => {
  resetFormData()
  shouAddDia.value = true
  thisHandleType.value = '编辑租户'
  getTenantDetail(row.tenantId)
      .then(res => {
        if (res.code === 200) {
          formData.value = res.data
          formData.value.packageId = res.data.packageId?res.data.packageId.split(','):[]
        }
      })
}
const handleView = (row) => {
  getTenantInfo(row.tenantId).then(res => {
    if (res.code === 200) {
      dialogVisible.value = true
      if (res.data == null) {
        state.value = {
          corpId: '',
          agentName: '',
          agentSecret: '',
          backOffUrl: ''
        }
      } else {
        state.value = res.data
      }
    }
  })
}
//提交
const formSubmit =  () => {
   formDataRef.value.validate(v => {
    if (v) {
      let param = formData.value;
      if(formData.value.packageId){
        param.packageId = formData.value.packageId.toString()
      }
      if(thisHandleType.value === '新增租户'){
         saveTenant(param)
            .then(res=>{
              if(res.code === 200){
                ElMessage.success('新增成功！')
                shouAddDia.value = false
                handleQuery()
              }
            })
      }else if(thisHandleType.value === '编辑租户'){
         updateTenant(param)
            .then(res=>{
              if(res.code === 200){
                ElMessage.success('编辑成功！')
                shouAddDia.value = false
                handleQuery()
              }
            })
      }
    }
  })
}
//取消
const formCancel = () => {
  shouAddDia.value = false
  resetFormData()
}
const getPackageSimpleList = () => {
  getSimpleList().then(res => {
    if (res.code === 200) {
      packageList.value = res.data
    }
  })
}

getList()
getPackageSimpleList()
</script>

<style lang='scss' scoped>
</style>
