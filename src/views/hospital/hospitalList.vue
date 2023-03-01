<template>
  <div v-loading="isLoading" class="out_box" element-loading-text="加载中...">
    <header>
      <div class="search">
        <div class="search_icon" @click="innitListData">
        </div>
        <input v-model="searchParams.name" class="serach_input" placeholder="请输入医院名称"
               @keyup.enter="innitListData"/>
      </div>
      <div class="code">
        <span class="code_imageicon"></span>
        <span>
          授权二维码
        </span>
      </div>
    </header>
    <main>
      <div class="list_content">
        <template v-for="(item,index) in listData" :key="index">
          <el-card class="box-card" shadow="always" style="width:260pt;height: 235pt">
            <template #header>
              <div class="status">
                <span v-if="item.status=='1'" class="green"></span>
                <span v-else class="red"></span>
              </div>
            </template>
            <div class="content">
              <div class="baseInfo" @click="()=>{handleHospital(item)}">
                <div class="Logo">
                  <img :src="item.logo"/>
                </div>
                <div class="name">
                  {{ item.fullname }}
                </div>
              </div>
              <div class="control">
                <div class="test_desc">
                  <span v-if="item.status=='1'" style="color: green">启用</span>
                  <span v-else style="color: red">禁用</span>
                </div>
                <div class="switch">
                  <customSwitch
                      :model-value="item.status=='1'?true:false"
                      @change="(value)=>{changeStatus(value,index)}"
                  >
                  </customSwitch>
                </div>
              </div>
            </div>
          </el-card>
        </template>
      </div>
    </main>
    <footer>
      <div class="pagination">
        <el-pagination :total="total" layout="prev, pager, next" @change="changePagination"/>
      </div>
    </footer>
  </div>
</template>

<script name="HospitalList" setup>
import {onMounted, ref} from "vue";
import {banHospital, getHospitalList} from "@/api/hospital/hospitalList";
import {useRouter} from "vue-router";
import customSwitch from "./components/publicComponent/switch.vue";
import modal from "@/plugins/modal";

const router = useRouter();
//列表数据条数
let total = ref(0);
//列表数据详情
let listData = ref([]);
//加载loading效果
const isLoading = ref(false);
//搜索参数
let searchParams = ref({
  isAsc: null,//排序的方向desc或者asc
  name: null,//医院名称
  orderByColumn: null,//排序列
  pageNum: 1,//当前记录起始索引
  pageSize: 10,//每页显示记录数
  status: null//状态
});
//改变状态
const changeStatus = (value, index) => {
  let result = value ? "1" : "0";
  let data = {
    status: result,
    corpId: listData.value[index].corpId
  }
  listData.value[index].status = result;

  banHospital(data).then(res => {
    if (res.code == 200) {
      modal.msgSuccess({
        message: result == '1' ? '已启用' : '已禁用'
      })
    }
  })
};
//改变页
const changePagination = (value) => {
  console.log(value);
};
//进入医院
const handleHospital = (data) => {
  router.push(`/hospital/hospitalConfig?corpId=${data.corpId}`);
};
//初始化列表数据
const innitListData = async () => {
  try {
    let resultDataList = await getHospitalList(searchParams.value);
    if (resultDataList.code == 200) {
      listData.value = resultDataList.data.list;
      total.value = Number(resultDataList.data.total);
    }
  } finally {
    isLoading.value = false;
  }
};
onMounted(() => {
  isLoading.value = true;
  innitListData();
});
</script>

<style lang="scss" scoped>
.out_box {
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  width: 100%;
  height: 100%;

  header {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .search {
      width: 30%;
      height: 40px;
      line-height: 40px;
      background: #F5F5F5;
      display: flex;
      flex-direction: row;
      border-radius: 10px;
      padding: 2px 5px;

      .search_icon {
        width: 10%;
        z-index: 100;
        background: url("@/assets/images/searchIcon/serc.png") no-repeat 50% 50%;
      }

      .serach_input {
        width: 90%;
        border: none;
        background-color: #F5F5F5;
        outline: none;
        color: #333333;
        font-size: 20px;
      }
    }

    .code {
      width: 150px;
      height: 30px;
      border-radius: 10px;
      border: 1px solid #DDDDDD;
      display: flex;
      justify-content: space-between;
      padding: 0 20px 0 10px;
      align-items: center;

      .code_imageicon {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url("@/assets/images/codeImage/code.png") no-repeat 50% 50%;
      }
    }
  }


  main {
    flex: 1;
    margin: 20px;

    .list_content {
      padding: 20px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      //justify-content: space-between;

      //.box-card:not(:nth-child(4n)) {
      //  margin-right: calc(4% / 3);
      //}

      .add-card {
        border-radius: 20px;
        margin: 10px;

        .content {
          width: 25vw;

          .el-icon.avatar-uploader-icon {
            font-size: 50px;
            color: #8c939d;
            text-align: center;
            line-height: 200px;
          }

          .baseInfo {
            height: 100%;

            .add_Logo {
              margin-top: 40px;
              width: 80%;
              height: 200px;
              text-align: center;
              line-height: 200px;
              border: 1px dashed #D2D2D2;
              border-radius: 10px;
            }

            .add_Name {
              font-size: 16px;
              height: 50px;
              line-height: 50px;
            }

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
        }
      }

      .box-card {
        border-radius: 20px;
        margin: 10px;

        .status {
          width: 100%;
          display: flex;
          justify-content: flex-end;

          .green {
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: green;
          }

          .red {
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: red;
          }
        }

        .content {
          .baseInfo {
            .add_Logo {
              width: 100%;
              height: 200px;
              text-align: center;
              line-height: 200px;
              border: 1px dashed #D2D2D2;
              border-radius: 5px;
            }

            .add_Name {
              font-size: 16px;
            }

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 200px;
          }

          .control {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 0 10px;
            height: 50px;
            line-height: 50px;
            border-top: 1px solid #ececec;
          }
        }
      }
    }
  }
;


  footer {
    width: 100%;
    height: 100px;
    line-height: 100px;
    margin-top: 20px;

    .pagination {
      text-align: center;
      width: 200px;
      margin: 0 auto;
    }
  }
}
</style>


