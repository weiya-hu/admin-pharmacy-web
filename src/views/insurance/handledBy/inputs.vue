<template>
  <div>
    <div class="app-container">
      <el-button :icon="ArrowLeft" text @click="handleReturn">返回</el-button>

      <h3 s style="text-align: center; font-weight: bold">进件清单</h3>
      <el-divider />
      <div class="header">
        <div class="salesman">合同号：{{ info.contractCode }}</div>
        <div class="salesman">签约日期：{{ info.signTime }}</div>
        <div class="salesman">本单签约机构 {{ info.applyOrgNum }} 家</div>
      </div>
      <el-table v-loading="loading" :data="deptList" stripe>
        <el-table-column
          align="center"
          label="机构名称"
          prop="orgName"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="医药机构编码"
          prop="orgCode"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="统一社会信用代码"
          min-width="120"
          prop="orgCreditCode"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="拟定电子凭证接入通道"
          prop="accessChannel"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{
              scope.row.accessChannel == 1
                ? "微信"
                : scope.row.accessChannel == 2
                ? "支付宝"
                : "国家医保App"
            }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="申请接入应用类型"
          prop="appType"
          show-overflow-tooltip
        >
          <template #default="{ row: { appType } }">
            {{
              appType == 1
                ? "微信小程序"
                : appType == "2"
                ? "微信公众号"
                : appType == "5"
                ? "网页"
                : "移动App"
            }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="申请接入应用名称"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span>{{ scope.row.appName ? scope.row.appName : "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="定点医药机构联系人"
          prop="orgContactUser"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span>{{
              scope.row.orgContactUser ? scope.row.orgContactUser : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="定点医药机构联系电话"
          min-width="100"
          prop="orgContactTel"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span>{{
              scope.row.orgContactTel ? scope.row.orgContactTel : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="申请函(附件)">
          <template #default="scope">
            <el-link
              v-if="scope.row.applyFiles && scope.row.applyFiles.length > 0"
              :href="scope.row.applyFiles[0].attachUrl"
              target="_blank"
              type="primary"
              >查看
            </el-link>
            <span v-else>--</span>
            <!--          <el-button type="primary" link @click="downLoadFile(scope.row.applyFiles[0])" v-if="scope.row.applyFiles && scope.row.applyFiles.length>0">下载</el-button>-->
          </template>
        </el-table-column>
        <el-table-column align="center" label="定点机构协议">
          <template #default="scope">
            <el-link
              v-if="
                scope.row.institutionalAgreementList &&
                scope.row.institutionalAgreementList.length > 0
              "
              :href="scope.row.institutionalAgreementList[0].attachUrl"
              target="_blank"
              type="primary"
              >查看
            </el-link>
            <span v-else>--</span>
            <!--          <el-button type="primary" link @click="downLoadFile(scope.row.applyFiles[0])" v-if="scope.row.applyFiles && scope.row.applyFiles.length>0">下载</el-button>-->
          </template>
        </el-table-column>
        <el-table-column align="center" label="国家平台回执">
          <template #default="scope">
            <el-link
              v-if="
                scope.row.platformReceiptList &&
                scope.row.platformReceiptList.length > 0
              "
              :href="scope.row.platformReceiptList[0].attachUrl"
              target="_blank"
              type="primary"
              >查看
            </el-link>
            <span v-else>--</span>
            <!--          <el-button type="primary" link @click="downLoadFile(scope.row.applyFiles[0])" v-if="scope.row.applyFiles && scope.row.applyFiles.length>0">下载</el-button>-->
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="状态"
          show-overflow-tooltip
        >
          <template #default="scope">
            <div v-if="scope.row.status === 1" class="item-wrapper-inbox">
              <div class="dot complete"></div>
              <div>{{ scope.row.statusName }}</div>
            </div>

            <div v-if="scope.row.status === 2" class="item-wrapper-inbox">
              <div class="dot wait"></div>
              <div>{{ scope.row.statusName }}</div>
            </div>

            <div v-if="scope.row.status === 3" class="item-wrapper-inbox">
              <div class="dot audit"></div>
              <div>{{ scope.row.statusName }}</div>
            </div>

            <div v-if="scope.row.status === 4" class="item-wrapper-inbox">
              <div class="dot reject"></div>
              <div>驳回</div>
            </div>

            <div v-if="scope.row.status === 5" class="item-wrapper-inbox">
              <div class="dot agree"></div>
              <div>{{ scope.row.statusName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          min-width="200"
        >
          <template #default="scope">
            <el-tooltip content="查看" hide-after="0" placement="top">
              <el-button
                v-if="scope.row.canCheck == true"
                :icon="View"
                text
                type="primary"
                @click="goDetail(scope.$index)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.canUpLoadFile"
              :content="scope.row.status == 3 ? '上传回执' : '重新上传回执'"
              hide-after="0"
              placement="top"
            >
              <el-button
                :icon="UploadFilled"
                text
                type="primary"
                @click="upLoadFilled(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.status == 3"
              content="驳回"
              hide-after="0"
              placement="top"
            >
              <el-button
                :icon="Remove"
                text
                type="danger"
                @click="showRejectLog(scope.row.detailId)"
              ></el-button>
            </el-tooltip>
            <span
              v-if="
                scope.row.status != 3 &&
                !scope.row.canUpLoadFile &&
                !scope.row.canCheck
              "
              >--</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--  进件明细弹出层-->
    <el-dialog v-model="dialogVisible" align-center center width="40%">
      <template #header>
        <div style="font-weight: bold">
          请根据实际情况确认下列信息，可直接提交审核
        </div>
      </template>

      <div class="dialog-container">
        <div class="diglog-item">
          <div class="key">机构名称：</div>
          <div class="value">{{ singleDetail.orgName }}</div>
        </div>
        <div class="diglog-item">
          <div class="key">定点医药机构编码：</div>
          <div class="value">
            {{ singleDetail.orgCode }}
          </div>
        </div>
        <div class="diglog-item">
          <div class="key">统一社会信用代码：</div>
          <div class="value">
            {{ singleDetail.orgCreditCode }}
          </div>
        </div>
        <div class="diglog-item">
          <div class="key">拟定电子凭证接入渠道：</div>
          <div class="value">
            {{
              singleDetail.accessChanne == 1
                ? "微信"
                : singleDetail.accessChanne == 2
                ? "支付宝"
                : "国家医保App"
            }}
          </div>
        </div>
        <div class="diglog-item">
          <div class="key">申请接入应用类型：</div>
          <div class="value">
            {{
              singleDetail.appType == 1
                ? "微信小程序"
                : singleDetail.appType == 2
                ? "微信公众号"
                : singleDetail.appType == 5
                ? "h5网页"
                : "移动App"
            }}
          </div>
        </div>

        <div class="diglog-item">
          <div class="key">申请接入应用名称：</div>
          <div class="value">
            {{ singleDetail["appName"] }}
          </div>
        </div>

        <div class="diglog-item">
          <div class="key">定点医药机构联系人：</div>
          <div class="value">{{ singleDetail.orgContactUser }}</div>
        </div>

        <div class="diglog-item">
          <div class="key">定点医药机构联系电话：</div>
          <div class="value">
            {{ singleDetail.orgContactTel }}
          </div>
        </div>

        <div class="diglog-item">
          <div class="key">授权经办人：</div>
          <div class="value">
            {{ singleDetail.platformOperatorName || "暂无" }}
          </div>
        </div>

        <div class="diglog-item">
          <div class="key">授权经办人账号：</div>
          <div class="value">
            {{ singleDetail.platformOperatorAccount || "暂无" }}
          </div>
        </div>

        <div class="diglog-item">
          <div class="key">授权经办人密码：</div>
          <div class="value">
            {{ singleDetail.platformOperatorPwd || "暂无" }}
          </div>
        </div>

        <div
          v-if="
            singleDetail.institutionalAgreementList.length > 0 &&
            singleDetail.institutionalAgreementList
          "
          class="diglog-item item-between"
        >
          <div class="key">定点机构协议：</div>
          <div class="value">
            <el-link
              :href="singleDetail.institutionalAgreementList[0].attachUrl"
              target="_blank"
              type="primary"
              >查看
            </el-link>
          </div>
        </div>

        <div
          v-if="singleDetail.applyFiles.length > 0 && singleDetail.applyFiles"
          class="diglog-item item-between"
        >
          <div class="key">申请函：</div>
          <div class="value value-button">
            <el-link
              v-if="
                singleDetail.applyFiles.length > 0 && singleDetail.applyFiles
              "
              :href="singleDetail.applyFiles[0].attachUrl"
              target="_blank"
              type="primary"
              >查看
            </el-link>
          </div>
        </div>

        <div
          v-if="singleDetail.status == 3 || singleDetail.status == 5"
          class="diglog-item item-between"
        >
          <div class="key">国家平台回执：</div>
          <div class="value value-button value-flex">
            <el-link
              v-if="
                singleDetail.platformReceiptList &&
                singleDetail.platformReceiptList.length > 0
              "
              :href="singleDetail.platformReceiptList[0].attachUrl"
              :underline="false"
              style="margin-right: 20px"
              target="_blank"
              type="primary"
              >查看
            </el-link>

            <el-upload
              ref="uploadRef2"
              v-model:file-list="fileList"
              :action="rewriteAction()"
              :before-upload="beforeUpLoad"
              :data="upLoadData"
              :headers="{ Authorization: getToken() }"
              :limit="1"
              :on-error="upLoadError"
              :on-exceed="exceed"
              :on-success="upLoadSuccess"
              accept=".pdf"
              class="upload-demo"
              multiple
              name="files"
            >
              <el-button type="primary"
                >{{
                  singleDetail.platformReceiptList &&
                  singleDetail.platformReceiptList.length > 0
                    ? "重新上传"
                    : "上传"
                }}
              </el-button>
              <template #tip>
                <div class="el-upload__tip">
                  回执需要以pdf的格式上传且最多上传一张
                </div>
              </template>
            </el-upload>
          </div>
        </div>

        <div v-if="singleDetail.status == 4" class="diglog-item item-between">
          <div class="key">驳回原因：</div>
          <div>{{ singleDetail.reason || "暂无" }}</div>
        </div>

        <el-divider></el-divider>
        <div class="diglog-item item-center">
          <el-button
            v-if="singleDetail.status == 3"
            type="warning"
            @click="showRejectLog(singleDetail.detailId)"
            >驳回
          </el-button>
          <el-button
            color="#FF5A40"
            size="normal"
            style="color: #fff"
            @click="dialogVisible = false"
            >关闭
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!--  上传回执弹出层-->
    <el-dialog
      v-model="upLoadShow"
      :append-to-body="true"
      align-center="true"
      center
      width="60%"
      z-index="100"
    >
      <template #header>
        <div style="font-weight: bold">请上传回执</div>
      </template>

      <el-upload
        ref="uploadRef1"
        v-model:file-list="fileList"
        :action="rewriteAction()"
        :before-upload="beforeUpLoad"
        :data="upLoadData"
        :headers="{ Authorization: getToken() }"
        :limit="1"
        :on-error="upLoadError"
        :on-exceed="exceed"
        :on-success="upLoadSuccess"
        accept=".pdf"
        class="upload-demo"
        multiple
        name="files"
      >
        <el-button type="primary">选择文件后自动上传</el-button>
        <template #tip>
          <div class="el-upload__tip">
            回执需要以pdf的格式上传且最多能上传一份
          </div>
        </template>
      </el-upload>
    </el-dialog>

    <!--  驳回弹出层-->
    <el-dialog
      v-model="rejectDiglog"
      append-to-body
      center
      width="60%"
      z-index="3000"
    >
      <template #header>
        <div style="font-weight: bold">请填写驳回原因</div>
      </template>

      <el-input
        v-model="rejectReason"
        :rows="2"
        placeholder="请输入驳回原因"
        type="textarea"
      />

      <template #footer>
        <el-button type="warning" @click="rejectApply()">驳回</el-button>
      </template>
    </el-dialog>

    <pagination
      v-show="total > 0"
      v-model:limit="params.pageSize"
      v-model:page="params.pageNum"
      :total="total"
      @pagination="getPagination"
    />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { getCurrentInstance, onMounted, ref } from "vue";
import { ArrowLeft, Remove, UploadFilled, View } from "@element-plus/icons-vue";
import { getToken } from "@/utils/auth";
import { ElMessage, ElNotification } from "element-plus";
import {
  changeDetailStatus,
  getHippDetailList,
} from "@/api/insurance/insurance";

const uploadRef1 = ref();
const uploadRef2 = ref();

const router = useRouter();
const { proxy } = getCurrentInstance();
const info = ref({
  hippId: router.currentRoute.value.query.hippId || "暂无",
  contractCode: router.currentRoute.value.query.contractCode || "暂无",
  signTime: router.currentRoute.value.query.signTime || "暂无",
  applyOrgNum: router.currentRoute.value.query.applyOrgNum || "暂无",
});
const singleDetail = ref("");

const dialogVisible = ref(false);

const upLoadShow = ref(false);

const rejectDiglog = ref(false);

const deptList = ref([]);

const total = ref(0);

const fileList = ref([]);

const upLoadData = ref({});

const params = ref({
  hippId: info.value.hippId,
  pageSize: 10,
  pageNum: 1,
});

//驳回HippID
const rejectHippId = ref("");

//驳回原因
const rejectReason = ref("");

//methods
const exceed = () => {
  ElNotification({
    message: "只能上传1个文件",
    type: "warning",
    duration: 2000,
    zIndex: 1000,
  });
};

const upLoadSuccess = (res, { name }) => {
  fileList.value = [];
  if (res.code == 200) {
    ElNotification({
      title: "上传成功",
      message: `${name}上传成功`,
      type: "success",
      zIndex: 100000,
    });

    if (singleDetail.value.status == 3) {
      changeDetailStatus(singleDetail.value.detailId, 5)
        .then((res) => {
          if (res.code == 200) {
            ElMessage({
              type: "success",
              message: "明细已审核通过",
              zIndex: 10000,
            });
          } else {
            ElMessage({
              type: "error",
              message: "明细审核通过失败",
              zIndex: 10000,
            });
          }
        })
        .catch((err) => {});
    }
    upLoadShow.value = false;
    let { attachUrl } = res.data[0];
    if (singleDetail.value) {
      if (
        singleDetail.value.platformReceiptList.length > 0 &&
        singleDetail.value.platformReceiptList
      ) {
        singleDetail.value.platformReceiptList[0].attachUrl = attachUrl;
      } else {
        singleDetail.value.platformReceiptList.push({
          attachUrl: attachUrl,
        });
      }
    }
    getDeptList(params.value);
  } else {
    upLoadShow.value = false;
    ElNotification({
      title: "上传失败",
      message: res.data.msg,
      duration: 2000,
      type: "error",
      zIndex: 100000,
    });
  }
};

const upLoadError = (err) => {
  ElNotification({
    title: "上传失败",
    message: err,
    duration: 2000,
    type: "error",
  });
};

const rewriteAction = () => {
  return (
    import.meta.env.VITE_APP_BASE_API + "/hipp/hipp/attachment/uploadAttachment"
  );
};

const beforeUpLoad = () => {
  upLoadData.value = {
    bizId: singleDetail.value.detailId,
    bizType: 6,
    hippId: info.value.hippId,
  };
};

const getDeptList = (params) => {
  getHippDetailList(params).then((res) => {
    if (res.code == 200) {
      deptList.value = res.data.list;
      total.value = Number(res.data.total);
    }
  });
};

const handleReturn = () => {
  proxy.$router.go(-1);
};

const goDetail = (index) => {
  dialogVisible.value = true;
  singleDetail.value = deptList.value[index];
};

const upLoadFilled = (row) => {
  upLoadShow.value = true;
  singleDetail.value = row;
};

const showRejectLog = (detailId) => {
  rejectHippId.value = detailId;
  rejectDiglog.value = true;
};

const rejectApply = () => {
  if (rejectReason.value) {
    changeDetailStatus(rejectHippId.value, 4, rejectReason.value)
      .then((res) => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: "驳回成功",
            zIndex: 10000,
          });
          rejectDiglog.value = false;
          rejectReason.value = "";
          getDeptList(params.value);
        } else {
          ElMessage({
            type: "error",
            message: res.data.msg ? `驳回失败: ${err.msg}` : `驳回失败`,
            zIndex: 10000,
          });
        }
      })
      .catch(() => {});
  } else {
    ElNotification({
      title: "驳回理由不能为空",
      type: "warning",
      zIndex: 10000,
    });
  }
};

const getPagination = (e) => {
  let { limit, page } = e;
  (params.value.pageNum = page),
    (params.value.pageSize = limit),
    getDeptList(params.value);
};

onMounted(() => {
  getDeptList(params.value);
});
</script>

<style lang="scss" scoped>
$complete: #adadad;
$wait: #ff7301;
$audit: #4672ff;
$reject: #ff5a40;
$agree: #80d249;
$base-black: #333;
.header {
  justify-content: center;
  display: flex;
  align-items: center;
  margin: 30px auto;
  font-family: PingFang SC;
  font-weight: bold;
  color: #333333;
  line-height: 39px;

  .name {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    line-height: 39px;
  }

  .salesman {
    font-size: 14px;
    margin-right: 80px;
    text-align: center;
  }
}

.item-wrapper-inbox {
  display: flex;
  font-size: 0.6rem;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  //margin: 10px 0;
  color: $base-black;

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    margin-right: 5px;
  }

  .wait {
    background: $wait;
  }

  .audit {
    background: $audit;
  }

  .reject {
    background: $reject;
  }

  .agree {
    background: $agree;
  }
}

.tab-list {
  //margin-left: 500px;
  float: right;
  display: flex;
  padding: 30px;

  .tab-list-item {
    margin: 0 15px;

    .item-wrapper {
      display: flex;
      font-size: 0.6rem;
      align-items: center;
      font-weight: bold;
      margin: 10px 0;
      color: $base-black;

      .dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 15px;
      }
    }
  }
}

.dialog-container {
  .diglog-item {
    margin: 30px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .key {
      font-size: 14px;
      color: #666;
    }

    .value {
      font-size: 16px;
      color: $base-black;
      font-weight: bold;
    }

    .value-flex {
      display: flex;
      align-items: center;
    }
  }

  .item-between {
    justify-content: space-between !important;
  }

  .item-center {
    justify-content: center !important;
  }
}

.complete {
  background: $complete;
}

:deep .el-upload-list__item-file-name {
  width: 250px !important;
}
</style>
