<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });
</script>

<template>
    <el-card class="error-card" shadow="hover">
      <div class="code">500</div>
      <div class="message">Internal Server Error</div>
      <div class="hint">
        {{ t("breadcrumb.home") }} → {{ t("menu.examples500") }}
      </div>
    </el-card>
</template>

<style scoped>
.error-card {
  text-align: center;
  padding: 24px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.code {
  font-size: 48px;
  font-weight: 700;
  color: #e6a23c;
}
.message {
  font-size: 16px;
  margin-top: 8px;
}
.hint {
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
}
</style>
