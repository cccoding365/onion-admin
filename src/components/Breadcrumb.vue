<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

function go(path) {
  router.push(path)
}
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="m in route.matched" :key="m.path" :to="{ path: m.path }">
      {{ t(m.meta?.titleKey || 'breadcrumb.home') }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
</style>