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
            <el-button text type="primary" @click="showQrCode(scope.row)"
            >查看授权码
            </el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogShow" align-center="true" append-to-body center lock-scroll show-close>
      <template #footer>
        <h2 style="text-align: center">商户授权码</h2>
        <div class="qr-wrapper">
          <vue-qr ref="qrcode" :size="200" :text="signUrl" logo-src=""></vue-qr>
        </div>
      </template>
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
const qrcode = ref({});
const loading = ref(false);
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
// const list = ref([]);
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 20px;
  //padding: 20px;

  .qr-wrapper {
    display: flex;
    justify-content: center;
  }
}
</style>
