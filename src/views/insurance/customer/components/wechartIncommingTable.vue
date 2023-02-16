<template>
  <div class="wrapper">
    <el-table stripe v-loading="loading" :data="props.tableListData">
      <template v-for="(itemConfig, index) in props.tableListConfig">
        <el-table-column
            align="center"
            :label="itemConfig.label"
            show-overflow-tooltip
            :prop="itemConfig.prop"
            :fixed="itemConfig.isFixed"
        >
          <template v-if="itemConfig.slotName" #default="scope">
            <slot :row="scope.row" :name="itemConfig.slotName"></slot>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" label="操作" show-overflow-tooltip fixed="right">
        <template #default="scope">
          <div style="display: flex;justify-content: center">
            <el-button text type="primary" @click="showQrCode(scope.row)">授权码</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog align-center center v-model="dialogShow" lock-scroll show-close>
      <h2 style="text-align: center">商户授权码</h2>
      <div class="qr-wrapper">
        <vue-qr ref="qrcode" :text="signUrl" logo-src="" :size="200"></vue-qr>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
      tableListConfig: [];
      tableListData: [];
    }>(),
    {}
);
import {onMounted, ref} from "vue";
import {getSignUrl} from "@/api/insurance/wechatIncoming";
import vueQr from 'vue-qr/src/packages/vue-qr.vue'


const params = ref({});
const signUrl = ref('');
const qrcode = ref({})
const loading = ref(false);
const dialogShow = ref(false);
const showQrCode = async (row) => {
  if (row.signUrl) {
    signUrl.value = row.signUrl
    dialogShow.value = true
  } else {
    let res = await getSignUrl(row.applyMentId)
    if (res.code == 200) {
      signUrl.value = res.data
      dialogShow.value = true
    }
  }
}
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
