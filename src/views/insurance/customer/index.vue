<template>

  <!--  筛选-->
  <div class="search-container">

    <!--  所属区域-->
    <div class="search-item">
      <el-select class="m-2" placeholder="所属区域" size="large" v-model="chooseArea" :change="AreaChange()">
        <el-option
            v-for="(item,index) in area"
            :key="index"

            :value="item"
        />
      </el-select>
    </div>

    <!--  客户来源-->
    <div class="search-item">
      <el-select class="m-2" placeholder="客户来源" size="large" v-model="from">
        <el-option
            v-for="(item,index) in region"
            :key="index"
            :value="item"
        />
      </el-select>
    </div>

    <!-- 日期 -->
    <div class="search-item">
      <el-date-picker
          v-model="date"
          type="daterange"
          :shortcuts="shortcuts"
          range-separator='—'
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size='large'
      />
    </div>


    <!--  其他查询-->
    <div class="search-item">
      <!--  <el-input v-model="input" placeholder="搜索企业名称/联系人/联系电话"  size="large" autosize/>-->
      <!--  <template v-slot="#prepend">-->
      <!--    <el-button :icon="Search" />-->
      <!--  </template>-->

      <el-input v-model="input2" placeholder="通过企业名称/联系人/电话搜索" size="large">
        <template #append>
          <el-button :icon="Search"/>
        </template>
      </el-input>
    </div>

    <div class="search-item">
      <el-button @click="handleShare" type="primary">分享</el-button>
    </div>
  </div>

  <!--制表  -->
  <div class="table-container">
    <el-table :data="tableData" stripe style="width: 100%" max-height="800">
      <el-table-column prop="corp" label="企业名称" width="180" align="center"/>
      <el-table-column prop="contact" label="联系人" width="180" align="center"/>
      <el-table-column prop="phone" label="联系电话" align="center"/>
      <el-table-column prop="area" label="所属区域" align="center"/>
      <el-table-column prop="address" label="详细地址" width="300" align="center"/>
      <el-table-column prop="from" label="客户来源" align="center"/>
      <el-table-column prop="date" label="加入日期" sortable align="center"/>
      <el-table-column prop="pay" label="签约付款" align="center">
        <template #default="scope">
          <el-button size="small" color="#008c8c" @click="goSignRecord(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <!--      <el-table-column prop="operation" label="操作" fixed="right" align="center">-->
      <!--        <el-button-->
      <!--            size="small"-->
      <!--            color="#008c8c"-->
      <!--        >编辑</el-button-->
      <!--        >-->
      <!--      </el-table-column>-->
    </el-table>
  </div>
  <el-dialog v-model="dialogVisible" width="750px" append-to-body draggable :close-on-click-modal="false">
    <template #header>
      <span>下方是您的专属邀请链接，复制并分享给客户，客户通过此链接进行申请，即为您的业绩</span>
    </template>
    <div>
      <p class="state_url">{{ state.url }}</p>
      <!--      <el-link :underline="false" icon="DocumentCopy" v-copyText="state.url" v-copyText:callback="copyTextSuccess">复制</el-link>-->
    </div>

  </el-dialog>
</template>

<script lang="ts" setup>
import {ref, onMounted, reactive} from 'vue'
import {Search} from '@element-plus/icons-vue'
import {useRouter} from 'vue-router'
import {returnUrl} from '../../../api/insurance/customer'
import {ElMessage} from "element-plus";

const router = useRouter()
const state = reactive({
  url: ''
})
const dialogVisible = ref(false)

let area = ref(["重庆", '北京', '成都', '陕西']),
    region = ['店绩', '线下'],
    chooseArea = ref(''),
    date = ref(''),
    from = ref(''),
    input = ref('');

//快速切换时间
const shortcuts = [
  {
    text: '前一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '前一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '前一季度',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]


const tableData = ref([
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
])

onMounted(() => {
  // tableData.value.map(i=>{
  //   i['pay']='查看'
  //   i['operation']='编辑'
  //   return i
  // })
})

function AreaChange() {

}

function goSignRecord(row) {

  router.push({
    path: '/customer/signRecord',
  })
}

// 分享
const handleShare = () => {
  dialogVisible.value = true
  returnUrl({productId: 'admin'}).then(res => {
    state.url = res.data
  })
}

// 复制
function copyTextSuccess() {
  ElMessage.success('复制成功')
  console.log('url', state.url)
}

</script>

<style lang="scss" scoped>
:root {
  font-size: 16px !important;
}

.search-container {
  margin: 10px;
  padding: 30px;
  display: flex;
}

.search-container .search-item {
  margin-right: 5rem;
}

.el-input {
  width: 400px !important;
}


.el-table tr {
  background: #EDEDED !important;

}

.el-table th {
  color: #666 !important;
}

.table-container {
  margin: 10px;
  padding: 30px;
}

.state_url {
  text-align: center;
  line-height: 27px;
  font-weight: bold;
  font-size: 18px;
}

</style>