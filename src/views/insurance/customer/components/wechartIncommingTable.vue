<template>
  <div class="wrapper">
    <el-table v-loading="loading" :data="props.tableListData" stripe>
      <template v-for="(itemConfig, index) in props.tableListConfig">
        <el-table-column
            :fixed="itemConfig.isFixed"
            :label="itemConfig.label"
            :prop="itemConfig.prop"
            align="center"
            show-overflow-tooltip
        >
          <template v-if="itemConfig.slotName" #default="scope">
            <slot :name="itemConfig.slotName" :row="scope.row"></slot>
          </template>
        </el-table-column>
      </template>
      <el-table-column
          align="center"
          fixed="right"
          label="操作"
          show-overflow-tooltip
      >
        <template #default="scope">
          <div style="display: flex; justify-content: center">
            <el-button v-if="scope.row.status>2 && scope.row.status!=4 && scope.row.status!=9" text type="primary"
                       @click="showQrCode(scope.row)"
            >查看授权码
            </el-button>
            <el-button v-if="scope.row.status==4" text type="danger"
                       @click="$router.push(`/insurance/addWechatIncoming?applyMentId=${scope.row.applyMentId}`)"
            >修改进件信息
            </el-button>
            <span v-if="scope.row.status<2">--</span>
          </div>

        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        v-model="dialogShow"
        align-center="true"
        center
        lock-scroll
        show-close
    >
      <h2 style="text-align: center">商户授权码</h2>
      <div class="qr-wrapper">
        <!--        <el-link :herf="signUrl">{{ signUrl }}</el-link>-->
        <iframe id="iframe" :src="signUrl"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  tableListConfig: Array,
  tableListData: Array,
});

import {onMounted, ref} from "vue";
import {getSignUrl} from "@/api/insurance/wechatIncoming";
import vueQr from "vue-qr/src/packages/vue-qr.vue";

const params = ref({});
const signUrl = ref("");
const loading = ref(false);
const iframe = ref();
const dialogShow = ref(false);
const showQrCode = async (row) => {
  if (row.signUrl) {
    signUrl.value = row.signUrl;
    dialogShow.value = true;
  } else {
    let res = await getSignUrl(row.applyMentId);
    if (res.code == 200) {
      signUrl.value = res.data;
      dialogShow.value = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 20px;

  .qr-wrapper {
    display: flex;
    justify-content: center;

    iframe {
      width: 430px;
      height: 430px;
      border: none;
    }
  }
}
</style>
