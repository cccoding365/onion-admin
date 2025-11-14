<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { renderAsync } from 'docx-preview'

const { t } = useI18n({ useScope: 'global' })
const container = ref(null)
const fileName = ref('')

async function onFileChange(file) {
  const raw = file?.raw
  if (!raw) return
  fileName.value = raw.name || ''
  const buf = await raw.arrayBuffer()
  if (container.value) {
    container.value.innerHTML = ''
    await renderAsync(buf, container.value)
  }
}

function reset() {
  fileName.value = ''
  if (container.value) container.value.innerHTML = ''
}
</script>

<template>
  <el-card>
    <template #header>
      <span>{{ t('menu.officeWord') }}</span>
    </template>
    <div style="margin-bottom:12px; display:flex; gap:12px; align-items:center;">
      <el-upload
        :show-file-list="false"
        :auto-upload="false"
        accept=".docx"
        @change="onFileChange"
      >
        <el-button type="primary">{{ t('common.upload') || '上传文件' }}</el-button>
      </el-upload>
      <el-button @click="reset">{{ t('common.reset') || '清空' }}</el-button>
      <span v-if="fileName" style="color:#909399;">{{ fileName }}</span>
    </div>
    <div ref="container" style="overflow:auto; max-height:60vh;"></div>
    <el-empty v-if="!fileName" description="请选择Word(docx)文件" />
  </el-card>
</template>

<style scoped>
</style>