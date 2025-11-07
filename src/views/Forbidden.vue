<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div style="display:flex;align-items:center;justify-content:center;height:60vh;">
    <el-empty :description="t('auth.forbidden')">
      <el-button type="primary" @click="$router.push('/dashboard')">{{ t('breadcrumb.home') }}</el-button>
    </el-empty>
  </div>
</template>

<style scoped>
</style>