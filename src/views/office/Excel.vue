<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'

const { t } = useI18n({ useScope: 'global' })
const fileName = ref('')
const sheetNames = ref([])
const activeSheet = ref('')
const html = ref('')
let workbook = null

async function onFileChange(file) {
  const raw = file?.raw
  if (!raw) return
  fileName.value = raw.name || ''
  const buf = await raw.arrayBuffer()
  workbook = XLSX.read(buf, { type: 'array' })
  sheetNames.value = workbook.SheetNames || []
  activeSheet.value = sheetNames.value[0] || ''
  renderSheet(activeSheet.value)
}

function renderSheet(name) {
  if (!workbook || !name) return
  const ws = workbook.Sheets[name]
  html.value = XLSX.utils.sheet_to_html(ws)
}

function onTabChange(name) {
  activeSheet.value = name
  renderSheet(name)
}

function reset() {
  fileName.value = ''
  sheetNames.value = []
  activeSheet.value = ''
  html.value = ''
  workbook = null
}
</script>

<template>
  <el-card>
    <template #header>
      <span>{{ t('menu.officeExcel') }}</span>
    </template>
    <div style="margin-bottom:12px; display:flex; gap:12px; align-items:center;">
      <el-upload
        :show-file-list="false"
        :auto-upload="false"
        accept=".xlsx,.xls,.csv"
        @change="onFileChange"
      >
        <el-button type="primary">{{ t('common.upload') || '上传文件' }}</el-button>
      </el-upload>
      <el-button @click="reset">{{ t('common.reset') || '清空' }}</el-button>
      <span v-if="fileName" style="color:#909399;">{{ fileName }}</span>
    </div>

    <div v-if="sheetNames.length">
      <el-tabs v-model="activeSheet" @tab-click="(pane)=>onTabChange(pane.paneName)">
        <el-tab-pane v-for="name in sheetNames" :key="name" :name="name" :label="name" />
      </el-tabs>
    </div>

    <div v-if="html" style="overflow:auto; max-height:60vh;">
      <div v-html="html"></div>
    </div>
    <el-empty v-else description="请选择Excel文件" />
  </el-card>
</template>

<style scoped>
</style>