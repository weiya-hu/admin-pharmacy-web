<template>
  <div class="flexr label-explain" > 
    <div class="flexr"><span>{{props.label}}</span></div>
    <el-popover
      placement="top-start"
      title="字段说明"
      :width="300"
      trigger="hover"
      :content="props.explain"
      effect="dark"
    >
      <template #default v-if="!props.explain && explainShow">
        <slot name="explain"></slot>
      </template>
      <template #reference v-if="explainShow" >
        <QuestionFilled style="width: 15px;margin-left: 4px;"/>
      </template>
    </el-popover>
    
  </div>
</template>

<script setup lang="ts">
/**
 * @name Label
 * @param label:label文字
 * @param explain:悬浮显示的解释文字，单纯的文字用这个,传了这个参数，explain插槽的就不会显示
 * @param explainShow:是否显示问号
 * @slot explain:悬浮显示的解释文字，里面有点击的链接的用这个。点击的链接标签统一用<el-link type="primary" href="" target="_blank"></el-link>
 */
import { QuestionFilled } from '@element-plus/icons-vue'
const props = withDefaults(
  defineProps<{
    label: string,
    explain?: string,
    explainShow?: boolean,
  }>(),
  {
    label: '',
    explain: '',
    explainShow: true,
  }
)

</script>

<style lang="scss" scoped>
.label-explain{
  width: 180px;
  &>div{
    width: 160px;
  }
}
</style>