<template>
  <div class="supply-info wrapper">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>补充材料</span>
          <span class="desc"
          >根据实际审核情况，会额外要求商家提供指定的补充资料。</span
          >
        </div>
      </template>
      <el-form model="formValue" :rules="rules">
        <el-form-item prop="legal_person_commitment">
          <template #label>
            <labelExplain label="法人开户承诺函">
              <template #explain>
                <div>请上传法定代表人或负责人亲笔签署的开户承诺函扫描件（
                  <el-link type="primary" href='https://kf.qq.com/faq/191018yUFjEj191018Vfmaei.html' target='_blank'>下载模板</el-link>
                  ）。亲笔签名承诺函内容清晰可见，不得有涂污，破损，字迹不清晰现象。
                </div>
              </template>
            </labelExplain>
            </template>
          <el-input
              v-model="formValue.legal_person_commitment"
              placeholder="请输入联系邮箱"
              input-style="width:200px"
              type="email"
              clearable
          />
        </el-form-item>


      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { QuestionFilled, InfoFilled } from '@element-plus/icons-vue'
import labelExplain from './labelExplain.vue'

const formValue = ref({
  legal_person_commitment:'',
})

const rules = ref()
</script>

<style lang="scss" scoped>
.supply-info{
  .box-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 24px;
      font-weight: bold;

      .desc {
        font-weight: normal;
        font-size: 12px;
        width: 350px;
        margin-left: 40px;
      }
    }
  }
}

</style>