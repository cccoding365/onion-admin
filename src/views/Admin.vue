<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <el-card>
    <template #header>
      <span>{{ t('menu.admin') }}</span>
    </template>
    <div>
      Admin area. Only admin can access.
    </div>
  </el-card>
</template>

<style scoped>
</style>