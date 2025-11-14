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
    <div class="excel-toolbar">
      <el-upload
        :show-file-list="false"
        :auto-upload="false"
        accept=".xlsx,.xls,.csv"
        @change="onFileChange"
      >
        <el-button type="primary">{{ t('common.upload') || '上传文件' }}</el-button>
      </el-upload>
      <el-button @click="reset">{{ t('common.reset') || '清空' }}</el-button>
      <span v-if="fileName" class="excel-filename">{{ fileName }}</span>
    </div>

    <div v-if="sheetNames.length" class="excel-tabs">
      <el-tabs v-model="activeSheet" @tab-click="(pane)=>onTabChange(pane.paneName)">
        <el-tab-pane v-for="name in sheetNames" :key="name" :name="name" :label="name" />
      </el-tabs>
    </div>

    <div v-if="html" class="excel-scroll">
      <div class="excel-view" v-html="html"></div>
    </div>
    <el-empty v-else description="请选择Excel文件" />
  </el-card>
</template>

<style scoped>
.excel-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.excel-filename { color: #909399; }
.excel-tabs { margin-bottom: 8px; }
.excel-scroll { overflow: auto; max-height: 60vh; border: 1px solid #ebeef5; border-radius: 8px; }

:deep(.excel-view table) { width: 100%; border-collapse: collapse; table-layout: fixed; background-color: #fff; font-size: 14px; line-height: 1.5; }
:deep(.excel-view th),
:deep(.excel-view td) { border: 1px solid #ebeef5; padding: 8px 12px; color: #303133; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 240px; }
:deep(.excel-view thead th) { position: sticky; top: 0; background-color: #f5f7fa; z-index: 1; box-shadow: 0 1px 0 rgba(0,0,0,0.04); }
:deep(.excel-view tbody tr:nth-child(odd)) { background-color: #fafafa; }
:deep(.excel-view tbody tr:hover) { background-color: #f0f9ff; }
</style>