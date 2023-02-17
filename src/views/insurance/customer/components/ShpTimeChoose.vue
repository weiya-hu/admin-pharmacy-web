<template>
  <div class="timeContainer">
    <el-date-picker @change="(time)=>{dataPicker(time)}"
                    :disabled="isDisable"
                    v-model="chooseValue"
                    type="date"
                    :placeholder="props.chooseTag=='begin'?'开始时间':'结束时间'"
                    value-format="YYYY-MM-DD"
    />
  </div>
</template>
<script setup lang="ts">
/**
 * @chooseTag 选择标识
 * @beginTime 开始时间
 *@endTime 结束时间
 */
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";

const emit = defineEmits(["update:modelValue"]);
const props = withDefaults(
  defineProps<{
    chooseTag: string,
    beginTime?: any,
    endTime?: any,
    defaultTime: any,
    disable?: Boolean
  }>(),
  {
    beginTime: "",
    endTime: "",
    disable: false
  }
);

let chooseValue = ref();
let isDisable = ref(false);
/**时间日期选择*/
const dataPicker = (time) => {
  switch (props.chooseTag) {
    case "begin":
      verifiyBeginTime(time);
      break;
    case "end":
      verifiyEndTime(time);
      break;
  }
};
/**校验开始日期*/
const verifiyBeginTime = (time) => {
  if (props.endTime == "长期") {
    emit("update:modelValue", chooseValue.value);
    return;
  }
  if (!props.endTime) {
    emit("update:modelValue", chooseValue.value);
  } else if (props.endTime) {
    if (compareDate(time, props.endTime)) {
      emit("update:modelValue", chooseValue.value);
    } else {
      chooseValue.value = null;
      ElMessage.error("开始时间必须小于结束时间");
      emit("update:modelValue", null);
    }
  }
};

/**校验结束日期*/
const verifiyEndTime = (time) => {
  if (!props.beginTime) {
    emit("update:modelValue", chooseValue.value);
  } else if (props.beginTime) {
    if (compareDate(props.beginTime, time)) {
      emit("update:modelValue", chooseValue.value);
    } else {
      chooseValue.value = null;
      ElMessage.error("结束时间必须大于开始时间");
      emit("update:modelValue", null);
    }
  }
};
/**两个时间比较大小*/
const compareDate = (dateTime1, dateTime2) => {
  let formatDate1 = new Date(dateTime1);
  let formatDate2 = new Date(dateTime2);
  if (formatDate1 > formatDate2) {
    return false;
  } else {
    return true;
  }
};
watch(() => [props.defaultTime, props.disable], () => {
  chooseValue.value = props.defaultTime;
  isDisable.value = props.disable;
}, {
  immediate: true,
  deep: true
});
</script>
<style lang="scss" scoped>

.timeContainer {
  ::v-deep(.el-input) {
    width: 186px !important;
  }

}

</style>