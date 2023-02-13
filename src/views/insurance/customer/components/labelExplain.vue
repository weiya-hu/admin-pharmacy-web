<template>
  <div class="flexr label-explain" > 
    <span>{{props.label}}</span> 
    <el-popover
      placement="top-start"
      title="字段释义"
      :width="300"
      trigger="hover"
      :content="props.explain"
    >
      <template #default v-if="!props.explain">
        <slot name="explain"></slot>
      </template>
      <template #reference>
        <QuestionFilled style="width: 15px;margin-left: 4px;"/>
      </template>
    </el-popover>
    
  </div>
</template>

<script setup>
/**
 * @name Label
 * @param label:label文字
 * @param explain:悬浮显示的解释文字，单纯的文字用这个,传了这个参数，explain插槽的就不会显示
 * @slot explain:悬浮显示的解释文字，里面有点击的链接的用这个。点击的链接标签统一用<el-link type="primary" href="" target="_blank"></el-link>
 */
import { QuestionFilled, InfoFilled } from '@element-plus/icons-vue'
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  explain: {
    type: String,
    default: false
  },
})
</script>

<style lang="scss" scoped>
.label-explain{
  width: 180px;
}
</style>