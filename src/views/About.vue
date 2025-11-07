<script setup>
import { computed } from 'vue'
import pkg from '../../package.json'

const repoMap = {
  vue: { name: 'Vue 3', repo: 'https://github.com/vuejs/core' },
  'vue-router': { name: 'Vue Router', repo: 'https://github.com/vuejs/router' },
  pinia: { name: 'Pinia', repo: 'https://github.com/vuejs/pinia' },
  'vue-i18n': { name: 'Vue I18n', repo: 'https://github.com/intlify/vue-i18n-next' },
  'element-plus': { name: 'Element Plus', repo: 'https://github.com/element-plus/element-plus' },
  '@element-plus/icons-vue': { name: 'Element Plus Icons', repo: 'https://github.com/element-plus/element-plus-icons' },
  dayjs: { name: 'Day.js', repo: 'https://github.com/iamkun/dayjs' },
  echarts: { name: 'Apache ECharts', repo: 'https://github.com/apache/echarts' },
  'countup.js': { name: 'CountUp.js', repo: 'https://github.com/inorganik/CountUp.js' },
  'pinia-plugin-persistedstate': { name: 'Pinia Persistedstate', repo: 'https://github.com/prazdevs/pinia-plugin-persistedstate' },
  vite: { name: 'Vite', repo: 'https://github.com/vitejs/vite' },
  '@vitejs/plugin-vue': { name: 'Vite Plugin Vue', repo: 'https://github.com/vitejs/vite-plugin-vue' },
}

const techList = computed(() => {
  const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
  return Object.keys(allDeps)
    .map((pkgName) => {
      const info = repoMap[pkgName] || { name: pkgName, repo: '' }
      return {
        displayName: info.name || pkgName,
        packageName: pkgName,
        version: allDeps[pkgName],
        repo: info.repo || '',
      }
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
})
</script>

<template>
  <el-card>
    <el-table :data="techList" border style="width: 100%">
      <el-table-column label="名称" prop="displayName" width="220" />
      <el-table-column label="npm 包名" prop="packageName" width="260" />
      <el-table-column label="版本号" prop="version" width="160" />
      <el-table-column label="源码地址">
        <template #default="{ row }">
          <el-link :href="row.repo" target="_blank" type="primary">{{ row.repo || 'N/A' }}</el-link>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped>
</style>