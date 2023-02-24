<template>
  <div class="d-switch" :class="{ 'is-checked': checked }">
    <input
      class="d-switch__input"
      ref="input"
      type="checkbox"
      :checked="checked"
      @change="handleInput"
      :true-value="trueValue"
      :false-value="falseValue"
    />
    <span class="d-switch_action"></span>
  </div>
</template>

<script setup>


import { computed, ref, nextTick } from "vue";

const props = defineProps({
  modelValue: {
    type: [Number, String, Boolean]
  },
  trueValue: {
    type: [Number, String, Boolean],
    default: true
  },
  falseValue: {
    type: [Number, String, Boolean],
    default: true
  }
});
const emits = defineEmits(["update:modelValue", "change"]);

//获取input元素
const input = ref(null);
const checked = computed(() => {
  return props.modelValue === props.trueValue;
});
const handleInput = () => {
  nextTick(() => {
    const val = input.value.checked;
    emits("update:modelValue", val);
    emits("change", val);
  });
};
</script>

<style scoped lang="scss">
.d-switch {
  position: relative;
  height: 5px;
  transition: background 0.2s;
  width: 50px;
  background: #DBDBDB;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;

  .d-switch__input {
    position: relative;
    z-index: 1;
    margin: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .d-switch_action {
    position: absolute;
    transition: 0.2s;
    left: 2px;
    top: -4px;
    z-index: 0;
    height: 14px;
    width: 14px;
    background: #DBDBDB;
    border-radius: 50%;
  }

  &.is-checked {
    background: green;

    .d-switch_action {
      left: 100%;
      background: green;
      margin-left: -18px;
    }
  }
}
</style>


