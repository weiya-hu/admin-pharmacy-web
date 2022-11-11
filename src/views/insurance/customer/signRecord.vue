<template>


  <div class="wrapper" >

    <div class="header">
      <div class="goback">
        <el-icon :size="15" color="#999999">
          <ArrowLeft />
        </el-icon>
        <el-button size="small" color="">返回</el-button>
      </div>

      <h2>{{fullName}}</h2>
      <el-divider />
    </div>

    <div class="search-container">
      <div class="date-choose">
        <span>签约日期</span>
        <el-date-picker
            v-model="date"
            type="daterange"
            :shortcuts="shortcuts"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size='large'
        />
      </div>
      <div class="all-search">
        <el-input v-model="input2" placeholder="搜索合同编号" size="large">
          <template #append><el-button :icon="Search" /></template>
        </el-input>
      </div>
    </div>

    <div class="table-container">
      <el-table :data="tableData" stripe style="width: 100%"  max-height="800"  border	>
        <el-table-column prop="corp" label="合同编号" width="180" align="center" />
        <el-table-column prop="contact" label="合同" width="180" align="center"/>
        <el-table-column prop="phone" label="签约清单" align="center"/>
        <el-table-column prop="area" label="签约日期"  align="center"/>
        <el-table-column prop="address" label="签约人"  align="center"/>
        <el-table-column prop="from" label="应付金额(元)"  align="center"/>
        <el-table-column prop="date" label="实付金额(元)"   align="center"/>
        <el-table-column prop="pay" label="支付类型" align="center" />
        <el-table-column prop="pay" label="支付时间" align="center" />
        <el-table-column prop="pay" label="支付凭证" align="center" />
        <el-table-column prop="status" label="状态" align="center" >
          <template #default="{row}">
            <div class="dot"></div>
            <div>{{ row.status }}</div>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <div class="tab-list">
      <div class="tab-list-item">
        <div class="item-wrapper">
          <div class="dot complete"></div>
          <dvi>已失效</dvi>
        </div>
        <div class="item-wrapper">
          <div class="dot complete"></div>
          <dvi>已归档</dvi>
        </div>
      </div>
      <div class="tab-list-item">
        <div class="item-wrapper">
          <div class="dot wait"></div>
          <dvi>待签约</dvi>
        </div>
        <div class="item-wrapper">
          <div class="dot wait"></div>
          <dvi>待付款</dvi>
        </div>
        <div class="item-wrapper">
          <div class="dot wait"></div>
          <dvi>待进件</dvi>
        </div>

      </div>
      <div class="tab-list-item">
        <div class="item-wrapper">
          <div class="dot audit"></div>
          <dvi>审核中</dvi>
        </div>
        <div class="item-wrapper">
          <div class="dot reject"></div>
          <dvi>驳回</dvi>
        </div>
        <div class="item-wrapper">
          <div class="dot agree"></div>
          <div>审核通过</div>
        </div>

      </div>
    </div>


  </div>



</template>

<script setup >

import {computed, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
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

let corpName=ref('xxx医药公司'),
    input=ref(''),
    date=ref('');

let fullName=computed(()=>{
  return corpName.value+` 签约记录`
})

let tableData=[{
  status:"待付款"
}]



</script>

<style>
body{
  background-color: #FAFAFA ;
}

</style>

<style lang="scss" >
$complete:#ADADAD;
$wait:#FF7301;
$audit:#4672FF;
$reject:#FF5A40;
$agree:#80D249;
$base-black:#333;

.complete{
  background: $complete;
}
.wait{
  background: $wait;
}
.audit{
  background: $audit;
}
.reject{
  background: $reject;
}.agree{
   background: $agree;
 }

.wrapper{

  margin: 20px;
  padding:10px
}
.header {
  .goback{
    display: flex;
    align-items: center;
  }
}
.header {
 h2{
   text-align: center;
 }
}

.goback{
  span{
    color: #999;
    font-weight: bold;
    font-size: 13px;
  }
}

.search-container{
  display: flex;
  .date-choose{
      span{
        margin-right: 30px;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
      }
  }
  .all-search{
    margin-left: 30px;
  }
}

.my-table-header{
  background: #EDEDED !important;
}

.el-table th{
  color: #666 !important;
}

.table-container{
  margin: 10px;
  padding: 30px;
}

.tab-list{
  //margin-left: 500px;
  float: right;
  display: flex;
  padding: 30px;
  .tab-list-item{
    margin: 0 15px;
    .item-wrapper{
      display: flex;
      font-size: 0.6rem;
      align-items: center;
      font-weight: bold;
      margin: 10px 0;
      color: $base-black;
      .dot{
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 15px;
      }
    }
  }
}



.el-input{
  width: 400px !important;
}

</style>