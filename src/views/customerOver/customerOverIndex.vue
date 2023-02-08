<template>
  <div class="app-container">
    <div>
      <header style="margin-bottom: 20px;">客户移交，当企业成员出现变动或调整，企业可将其负责的客户分配给其它成员继续提供服务。</header>
      <p style="color: #999999;">提示：1次只能将所选的客户移交给1个成员</p>
    </div>

    <div style="margin-bottom: 20px;">
      <p>筛选</p>
      <div>
        <el-button text type="primary" @click="onClick('sale')">按销售人员筛选客户</el-button>
        <el-tag
            v-for="tag in saleTags"
            :key="tag.userId"
            closable
            @close="handleClose(tag)"
            style="margin-left: 10px;"
        >
          {{ tag.userName }}
        </el-tag>
      </div>
      <div>
        <el-button text type="primary" @click="onClick('relay')">选择接替成员</el-button>
        <el-tag v-for="item in relayTags" :key="item.userId" closable @close="handleRelayClose(item)" style="margin-left: 10px;">{{ item.userName }}</el-tag>
      </div>
    </div>

    <el-table :data="customerList" v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column prop="orgName" label="客户" show-overflow-tooltip/>
      <el-table-column prop="userName" label="销售" show-overflow-tooltip/>
      <el-table-column prop="createTime" label="注册时间" show-overflow-tooltip/>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <div style="width: 100%;text-align: center;margin-top: 20px;">
      <el-button type="primary" @click="handleClick" :disabled="isHandover">确认转接</el-button>
    </div>

    <el-dialog :title="title" v-model="dialogVisible" width="480px" :close-on-click-modal="false" draggable :show-close="false">
      <el-form :model="form" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="form.username" placeholder="搜索销售人员" :suffix-icon="Search" @change="saleChange" v-if="title === '销售人员'"></el-input>
          <el-input v-model="form.userName" placeholder="搜索接替成员" :suffix-icon="Search" @change="relayChange" v-if="title === '接替成员'"></el-input>
        </el-form-item>
        <div style="color: #999999;">
          <p>{{title === '销售人员' ? '多选' : '单选'}}</p>
          <el-divider />
        </div>
        <el-form-item v-if="title === '销售人员'">
          <el-checkbox-group v-model="sales">
            <el-checkbox v-for="item in saleList" :key="item.userId" :label="item.userId">{{item.userName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="title === '接替成员'">
          <el-radio-group v-model="relays">
            <el-radio v-for="item in relayList" :key="item.userId" :label="item.userId">{{item.userName}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {getCurrentInstance, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import { Search } from '@element-plus/icons-vue'
import {
  existsCustomerSalesUserList,
  getHippServiceAllAddCode,
  getSaleAndCustomerInfo,
  saveOrgRel
} from "@/api/customer/handover";

const {proxy} = getCurrentInstance();
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  userIds: []
});
const loading = ref(false);
const title = ref('');
const dialogVisible = ref(false);
const form = ref({
  username: '',
  userName: ''
});
const customerList = ref([]);
const customerIds = ref([]);
const isHandover = ref(true);
const total = ref(0);

// 销售人员
const sales = ref([]);
const saleList = ref([]);
// 接替员
const relays = ref('');
const relayList = ref([]);
const saleTags = ref([]);
const relayTags = ref([]);

// 多选选中数据
const handleSelectionChange = (selection) => {
  customerIds.value = selection
  isHandover.value = !selection.length;
}
function saleChange() {
  getSaleList()
}
function relayChange() {
  getRelayList()
}
// 数据初始化
function getList() {
  loading.value = true
  getSaleAndCustomerInfo(queryParams.value).then(res => {
    if (res.code === 200) {
      loading.value = false
      customerList.value = res.data.list
      total.value = Number(res.data.total)
    }
  })
}
// 销售人员列表
function getSaleList() {
  existsCustomerSalesUserList(proxy.addDateRange(form.value)).then(res => {
    if (res.code === 200) {
      saleList.value = res.data
    }
  })
}
// 交替成员列表
function getRelayList() {
  getHippServiceAllAddCode(proxy.addDateRange(form.value)).then(res => {
    if (res.code === 200) {
      relayList.value = res.data
    }
  })
}
// 点击事件
function onClick(type) {
  if (type === 'sale') {
    dialogVisible.value = true
    title.value = '销售人员'
    getSaleList()
    sales.value = saleTags.value.map(item => item.userId)
  } else if (type === 'relay') {
    dialogVisible.value = true
    title.value = '接替成员'
    getRelayList()
    if (relayTags.value[0] !== undefined) {
      relays.value = relayTags.value[0].userId
    }
  }
}
// 销售人员关闭
function handleClose(tag) {
  saleTags.value.splice(saleTags.value.indexOf(tag),1)
  sales.value = saleTags.value.map(item => item.userId)
  queryParams.value.userIds = sales.value
  getList()
}
// 交接人员关闭
function handleRelayClose(item) {
  relayTags.value.splice(relayTags.value.indexOf(item), 1)
  relays.value = ''
}
// 转接
function handleClick() {
  if (relayTags.value.length === 0) {
    ElMessage.error('请选择接替成员')
  } else {
    let data = {
      orgIds: customerIds.value.map(item => item.orgId),
      userId: relayTags.value[0].userId,
      userName: relayTags.value[0].userName
    }
    ElMessageBox.confirm('你所选择的客户会移交给 "' + relayTags.value[0].userName + '" 吗', '提示', {
      confirmButtonText: '立即移交',
      cancelButtonText: '再想想',
      type: 'warning'
    }).then(() => {
      saveOrgRel(data).then(res => {
        if (res.code === 200) {
          ElMessage.success('操作成功')
          getList()
        }
      })
    }).catch(() => {})
  }
}
// 取消
function cancel() {
  form.value = {
    username: '',
    userName: ''
  }
  dialogVisible.value = false
}
// 确定
function confirm() {
  if (title.value === '销售人员') {
    queryParams.value.userIds = sales.value
    // saleTags.value = saleList.value.filter(item => sales.value.indexOf(item.userId) > -1)
    existsCustomerSalesUserList({}).then(res => {
      if (res.code === 200) {
        saleTags.value = res.data.filter(item => sales.value.indexOf(item.userId) > -1)
      }
    })
    dialogVisible.value = false
    getList()
  } else if (title.value === '接替成员') {
    relayTags.value = relayList.value.filter(item => item.userId === relays.value)
    dialogVisible.value = false
  }
}

getList()
</script>

<style lang="scss" scoped>
.el-checkbox, .el-radio{
  width: 100%;
}
</style>
