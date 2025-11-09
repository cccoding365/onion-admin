<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const { t } = useI18n({ useScope: "global" });

const router = useRouter();
function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/dashboard");
  }
}
</script>

<template>
    <div class="error-page">
      <el-card class="error-card" shadow="hover">
        <div class="code">500</div>
        <div class="message">Internal Server Error</div>
        <div class="hint">
          {{ t("breadcrumb.home") }} → {{ t("menu.examples500") }}
        </div>
        <div class="actions">
          <el-button type="primary" @click="goBack">返回</el-button>
        </div>
      </el-card>
    </div>
</template>

<style scoped>
.error-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.error-card {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 24px;
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
.actions {
  margin-top: 12px;
}
</style>
