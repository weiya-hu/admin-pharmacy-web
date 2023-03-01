<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip :content="showSearch ? '隐藏搜索' : '显示搜索'" class="item" effect="dark" placement="top">
        <el-button circle icon="Search" @click="toggleSearch()"/>
      </el-tooltip>
      <el-tooltip class="item" content="刷新" effect="dark" placement="top">
        <el-button circle icon="Refresh" @click="refresh(props.showLoading)"/>
      </el-tooltip>
      <el-tooltip v-if="columns" class="item" content="显隐列" effect="dark" placement="top">
        <el-button circle icon="Menu" @click="showColumn()"/>
      </el-tooltip>
    </el-row>
    <el-dialog v-model="open" :title="title" append-to-body>
      <el-transfer
          v-model="value"
          :data="columns"
          :titles="['显示', '隐藏']"
          @change="dataChange"
      ></el-transfer>
    </el-dialog>
  </div>
</template>

<script setup>

import {ElLoading} from 'element-plus'

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true,
  },
  columns: {
    type: Array,
  },
  showLoading: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:showSearch', 'queryTable']);

// 显隐数据
const value = ref([]);
// 弹出层标题
const title = ref("显示/隐藏");
// 是否显示弹出层
const open = ref(false);

// 搜索
function toggleSearch() {
  emits("update:showSearch", !props.showSearch);
}

// 刷新
function refresh(showLoading = false) {
  const options = {
    text: '加载中'
  }
  if (props.showLoading) {
    const instance = ElLoading.service(options)
    emits("queryTable", {
      isLoading: props.showLoading,
      instance
    });
  } else {
    emits('queryTable')
  }

}

// 右侧列表元素变化
function dataChange(data) {
  for (let item in props.columns) {
    const key = props.columns[item].key;
    props.columns[item].visible = !data.includes(key);
  }
}

// 打开显隐列dialog
function showColumn() {
  open.value = true;
}

// 显隐列初始默认隐藏列
for (let item in props.columns) {
  if (props.columns[item].visible === false) {
    value.value.push(parseInt(item));
  }
}
</script>

<style lang='scss' scoped>
:deep(.el-transfer__button) {
  border-radius: 50%;
  display: block;
  margin-left: 0px;
}

:deep(.el-transfer__button:first-child) {
  margin-bottom: 10px;
}

.my-el-transfer {
  text-align: center;
}
</style>