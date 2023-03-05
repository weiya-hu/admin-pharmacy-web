<template>
  <div>
    <!--  筛选-->
    <div class="search-container">
      <el-form
        v-show="showSearch"
        ref="queryRef"
        :inline="true"
        :model="queryParams"
      >
        <el-form-item label="签约日期">
          <el-date-picker
            v-model="queryTime"
            :shortcuts="shortcuts"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="加入日期"
            type="daterange"
            value-format="YYYY-MM-DD"
            @change="dateChange"
          />
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="queryParams.region"
            class="m-2"
            placeholder="所属区域"
            @change="selectChange"
          >
            <el-option
              v-for="(item, index) in area"
              :key="index"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="queryParams.queryQuickSearch"
            placeholder="搜企业名称/联系人/联系电话"
            style="width: 250px"
            @change="inputChange"
          />
        </el-form-item>
        <el-form-item>
          <div class="search-item"></div>
          <el-button icon="Search" type="primary" @click="handleQuery"
            >搜索
          </el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <right-toolbar
          v-model:showSearch="showSearch"
          show-loading
          @queryTable="getList"
        ></right-toolbar>
        <el-button
          icon="View"
          style="margin-left: 20px"
          type="warning"
          @click="handleShare"
          >分享
        </el-button>

        <el-button
          icon="Plus"
          style="margin-left: 20px"
          type="primary"
          @click="
            () => {
              addDialog = true;
              isSave = true;
              form = {};
            }
          "
          >新建企业
        </el-button>
      </el-row>
    </div>

    <!--制表  -->
    <div class="table-container">
      <el-table :data="deptList" stripe>
        <el-table-column
          align="center"
          label="企业名称"
          prop="orgName"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.orgName ? scope.row.orgName : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="联系人"
          prop="orgContactUser"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.orgContactUser ? scope.row.orgContactUser : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="联系电话"
          prop="orgContactTel"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.orgContactTel ? scope.row.orgContactTel : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="所属区域"
          prop="orgRegion"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.orgRegion ? scope.row.orgRegion : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="详细地址"
          prop="orgAddress"
          show-overflow-tooltip
          width="300"
        >
          <template #default="scope">
            {{ scope.row.orgAddress ? scope.row.orgAddress : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="加入日期"
          prop="joinDate"
          show-overflow-tooltip
          sortable
        >
          <template #default="scope">
            {{ scope.row.joinDate ? scope.row.joinDate : "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" show-overflow-tooltip>
          <template #default="scope">
            {{
              scope.row.state == "draft"
                ? "待激活"
                : scope.row.state == "active"
                ? "启用"
                : "禁用"
            }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="申请记录" prop="pay">
          <template #default="scope">
            <!--            <el-tooltip content="查看">-->
            <!--              <el-button-->
            <!--                  :icon="View"-->
            <!--                  size="large"-->
            <!--                  text-->
            <!--                  type="primary"-->
            <!--                  @click="goSignRecord(scope.row)"-->
            <!--              >-->
            <!--              </el-button>-->
            <!--            </el-tooltip>-->
            <span
              v-if="scope.row.state == 'active'"
              style="cursor: pointer; color: #409eff"
              @click="goSignRecord(scope.row)"
              >查看</span
            >
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="编辑" prop="pay" width="240">
          <template #default="scope">
            <!--            <el-tooltip content="编辑信息">-->
            <!--              <el-button-->
            <!--                  :icon="Edit"-->
            <!--                  size="large"-->
            <!--                  text-->
            <!--                  type="primary"-->
            <!--                  @click="editCorpInfo(scope.row)"-->
            <!--              >-->
            <!--              </el-button>-->
            <!--            </el-tooltip>-->
            <span
              style="cursor: pointer; color: #409eff; margin-right: 20px"
              @click="editCorpInfo(scope.row)"
              >编辑</span
            >

            <!--            <el-tooltip content="企业二维码">-->
            <!--              <el-button-->
            <!--                  :icon="Open"-->
            <!--                  size="large"-->
            <!--                  text-->
            <!--                  type="primary"-->
            <!--                  @click="activeCorp(scope.row)"-->
            <!--              >-->
            <!--              </el-button>-->
            <!--            </el-tooltip>-->
            <span
              style="cursor: pointer; color: #409eff; margin-right: 20px"
              @click="activeCorp(scope.row)"
              >企业二维码</span
            >
            <span
              style="cursor: pointer; color: #409eff"
              @click="
                () => {
                  importToHospital(scope.row);
                }
              "
              >导入到医院</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--    连接-->
    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="true"
      append-to-body
      draggable
      width="750px"
    >
      <template #header>
        <span
          >下方是您的专属邀请链接，复制并分享给客户，客户通过此链接进行申请，即为您的业绩</span
        >
      </template>
      <div>
        <p class="state_url">{{ state.url }}</p>
        <!--      <el-link :underline="false" icon="DocumentCopy" v-copyText="state.url" v-copyText:callback="copyTextSuccess">复制</el-link>-->
      </div>
    </el-dialog>

    <!--    新建企业-->
    <el-dialog
      v-model="addDialog"
      :close-on-click-modal="true"
      align-center
      append-to-body
      center
      @close="addClose"
    >
      <!--      表单-->
      <el-form ref="newCorp" :model="form" :rules="rules">
        <el-form-item label="企业全称" prop="name">
          <el-input v-model="form.name" placeholder="请输入企业全称"></el-input>
        </el-form-item>

        <el-form-item label="统一社会信用代码" prop="creditCode">
          <el-input
            v-model="form.creditCode"
            placeholder="请输入统一社会信用代码"
          ></el-input>
        </el-form-item>

        <el-form-item label="企业类型" prop="corpType">
          <el-select v-model="form.corpType" placeholder="请选择企业类型">
            <el-option
              v-for="item in corpType"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="form.corpType === 6"
          label="企业类型"
          prop="orgLevel"
        >
          <el-select v-model="form.orgLevel" placeholder="请选择医疗机构等级">
            <el-option
              v-for="item in orgLevel"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="负责人" prop="createUserName">
          <el-input
            v-model="form.createUserName"
            placeholder="请输入负责人姓名"
          ></el-input>
        </el-form-item>

        <el-form-item label="负责人电话" prop="mobile">
          <el-input
            v-model="form.mobile"
            :maxlength="11"
            placeholder="请输入负责人电话"
            @input="xxx"
          ></el-input>
        </el-form-item>

        <el-form-item prop="agree">
          <el-checkbox
            v-model="agree"
            label="请务必确认以上信息完全正确，错误信息会导致后续工作展开不便"
            @change="handleAgree"
          ></el-checkbox>
        </el-form-item>
      </el-form>

      <div style="display: flex; justify-content: center">
        <el-button style="text-align: center" type="primary" @click="save"
          >保存
        </el-button>
      </div>
    </el-dialog>

    <!--    激活码-->
    <el-dialog
      v-model="showActive"
      :close-on-click-modal="true"
      align-center
      append-to-body
      center
    >
      <template #header
        >请将以下二维码截图发给客户，让客户激活系统权限
      </template>
      <div style="display: flex; justify-content: center">
        <vue-qr :size="200" :text="activeCorpId"></vue-qr>
      </div>
      <template #footer>
        <el-button type="primary" @click="showActive = false">完成</el-button>
      </template>
    </el-dialog>

    <pagination
      v-show="total > 0"
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNum"
      :total="total"
      @pagination="getPagination"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { View, Plus, Edit, Open } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import {
  editCorp,
  getMyCustomer,
  importCorpToHospital,
  queryCorp,
  registCorp,
  returnUrl,
} from "@/api/insurance/insurance";
import modal from "@/plugins/modal";
import { ElLoading, ElMessage } from "element-plus";
import vueQr from "vue-qr/src/packages/vue-qr.vue";

const router = useRouter();
const state = reactive({
  url: "",
});

const dialogVisible = ref(false);
const addDialog = ref(false);
const showActive = ref(false);
const queryTime = ref([]);
const area = ref(["重庆", "北京", "成都", "陕西"]);
const newCorp = ref(null);
const form = ref({});
const activeCorpId = ref("");
const currentCorpId = ref("");
const xxx = (val) => {
  form.value.mobile = val.replace(/[^0-9.]/g, "");
};
const oldPhone = ref("");

const corpType = [
  { value: 3, label: "连锁药房" },
  { value: 4, label: "药店" },
  { value: 6, label: "定点医疗机构" },
];

const orgLevel = [
  { value: 1, label: "一级" },
  { value: 2, label: "二级" },
  { value: 3, label: "三级" },
  { value: 4, label: "未定级" },
];

//自定义规则
const vaildators = {
  validSocialCredit: (rule, value, callback) => {
    const reg = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/;
    if (value == "") {
      callback(new Error("请输入统一社会信用代码"));
    } else if (!reg.test(value)) {
      callback(new Error("格式有误，请输入18位统一社会信用代码"));
    } else {
      callback();
    }
  },
  validAgree: (rule, value, cb) => {
    if (!agree.value) {
      cb(new Error("请先勾选保证信息真实性"));
    } else {
      cb();
    }
  },
};
const rules = {
  name: [{ required: true, message: "必填", trigger: "blur" }],
  creditCode: [
    {
      required: true,
      validator: vaildators.validSocialCredit,
      trigger: "blur",
    },
  ],
  corpType: [{ required: true, message: "必填", trigger: "blur" }],
  orgLevel: [{ required: true, message: "必填", trigger: "blur" }],
  authCode: [{ required: true, trigger: "blur" }],
  createUserName: [{ required: true, message: "必填", trigger: "blur" }],
  mobile: [
    { required: true, message: "必填", trigger: "blur" },
    {
      max: 11,
      min: 11,
      message: "请输入11位手机号",
      trigger: "blur",
    },
  ],
  agree: [
    { required: true, trigger: "change", validator: vaildators.validAgree },
  ],
};
const agree = ref(false);
//新增还是编辑
const isSave = ref(null);
const handleAgree = (e) => {
  agree.value = e;
};
const addClose = () => {
  newCorp.value.resetFields();
  agree.value = false;
};

//注册或者编辑公司
const save = () => {
  if (isSave.value) {
    newCorp.value
      .validate()
      .then((res) => {
        modal
          .confirm("确认当前录入的企业信息无误", "", "再看看")
          .then((res) => {
            registCorp(form.value).then((res) => {
              if (res.code == 200) {
                modal.msgSuccess({
                  message: "新建企业成功",
                });
                getDeptList(queryParams.value);
                addDialog.value = false;
                form.value = {};
                activeCorpId.value = `http://db.yb.shanhaiping.com/empower?corpId=${res.data.orgId}`;
                showActive.value = true;
              }
            });
          })
          .catch((err) => {});
      })
      .catch((err) => {
        modal.msgError({
          message: "请按红字提示排除错误",
        });
      });
  } else {
    newCorp.value
      .validate()
      .then(() => {
        form.value.phone = form.value.mobile;
        form.value.legalPerson = form.value.createUserName;
        form.value.oldPhone = oldPhone.value;
        form.value.corpId = currentCorpId.value;

        editCorp(form.value)
          .then((res) => {
            if (res.code == 200) {
              modal.msgSuccess({
                message: "修改公司信息成功",
              });
              addDialog.value = false;
              getDeptList(queryParams.value);
              form.value = {};
            }
          })
          .catch();
      })
      .catch((err) =>
        modal.msgError({
          message: "请按红字提示排除错误",
        })
      );
  }
};

//编辑公司(回填公司信息)
const editCorpInfo = (row) => {
  isSave.value = false;
  let { orgId } = row;
  currentCorpId.value = orgId;
  queryCorp(orgId)
    .then((res) => {
      if (res.code == 200) {
        form.value = {
          name: res.data.name,
          creditCode: res.data.creditCode,
          corpType: res.data.corpType,
          createUserName: res.data.legalPerson,
          mobile: res.data.phone,
          orgLevel: res.data.orgLevel,
        };
        oldPhone.value = res.data.phone;
        addDialog.value = true;
      }
    })
    .catch();
};

//激活二维码
const activeCorp = (row) => {
  let { orgId } = row;
  queryCorp(orgId).then((res) => {
    if (res.code == 200) {
      showActive.value = true;
      activeCorpId.value = `http://db.yb.shanhaiping.com/empower?corpId=${orgId}`;
    }
  });
};
//导入企业到公众号后台医院列表当中
const importToHospital = (row) => {
  if (row.state == "draft") {
    ElMessage.error("当前企业未激活");
  } else {
    let queryParams = { corpId: row.orgId };
    try {
      importCorpToHospital(queryParams).then((res) => {
        if (res.code == 200) {
          ElMessage.success("导入成功");
        }
      });
    } catch (error) {
      ElMessage.error(error);
    }
  }
};
//快速切换时间
const shortcuts = [
  {
    text: "前一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "前一月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "前一季度",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  userType: 2,
});
const defaultParams = ref({
  pageNum: 1,
  pageSize: 10,
  userType: 2,
});
const showSearch = ref(true);
const loading = ref(false);
const total = ref(0);
const deptList = ref([]);

onMounted(() => {
  getDeptList(defaultParams.value);
});

const resetQuery = () => {
  queryTime.value = [];
  queryParams.value.region = "";
  queryParams.value.queryQuickSearch = "";
  queryParams.value.queryJoinDateStart = "";
  queryParams.value.queryJoinDateEnd = "";
  getDeptList(defaultParams.value);
};

const goSignRecord = (row) => {
  let { saleUserName, orgName, orgId } = row;
  router.push({
    path: "/insurance/customer/signRecord",
    query: {
      saleUserName,
      orgId,
      orgName,
    },
  });
};

// 分享
const handleShare = () => {
  dialogVisible.value = true;
  returnUrl({ productId: "admin" }).then((res) => {
    state.url = res.data;
  });
};

// 复制
function copyTextSuccess() {
  ElMessage.success("复制成功");
  console.log("url", state.url);
}

const handleQuery = () => {
  if (queryTime.value) {
    let [begin, end] = queryTime.value;
    queryParams.value.queryJoinDateStart = begin;
    queryParams.value.queryJoinDateEnd = end;
  } else {
    queryParams.value.queryJoinDateStart = "";
    queryParams.value.queryJoinDateEnd = "";
  }
  getDeptList(queryParams.value);
};

const getDeptList = (params) => {
  getMyCustomer(params).then((res) => {
    if (res.code === 200) {
      total.value = Number(res.data.total);
      deptList.value = res.data.list;
    } else {
      modal.msgError({
        message: "获取客户失败",
        type: "error",
        center: true,
      });
    }
  });
};

const getList = async (e) => {
  console.log(e);
  await getDeptList(queryParams.value);
  if (e.isLoading) {
    e.instance.close();
  }
};

const getPagination = (e) => {
  let { limit, page } = e;
  queryParams.value.pageNum = page;
  queryParams.value.pageSize = limit;
  getDeptList(queryParams.value);
};

const dateChange = (date) => {
  if (!date) {
    queryParams.value.queryJoinDateStart = "";
    queryParams.value.queryJoinDateEnd = "";
    getDeptList(queryParams.value);
  } else {
    queryParams.value.queryJoinDateStart = date[0];
    queryParams.value.queryJoinDateEnd = date[1];
    getDeptList(queryParams.value);
  }
};

const selectChange = () => {
  getDeptList(queryParams.value);
};

const inputChange = () => {
  getDeptList(queryParams.value);
};
</script>

<style lang="scss" scoped>
:root {
  font-size: 16px !important;
}

.search-container {
  margin: 10px;
  padding: 30px;
}

.table-container {
  margin: 10px;
}

.state_url {
  text-align: center;
  line-height: 27px;
  font-weight: bold;
  font-size: 18px;
}

//.search-item {
//  display: flex;
//  justify-content: flex-end;
//  margin-top: 30px;
//}
</style>
