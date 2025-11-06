<script setup>
import { useAppStore } from '../stores/app'
import { Fold, Expand, FullScreen } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const app = useAppStore()
const color = ref(app.primaryColor)
// 使用全局 i18n 作用域，保证切换语言立即影响所有组件
const { t, locale } = useI18n({ useScope: 'global' })

watch(color, (val) => app.setPrimaryColor(val))
</script>

<template>
  <div class="header-actions">
    <el-button text @click="app.toggleCollapse()">
      <el-icon>
        <component :is="app.collapsed ? Expand : Fold" />
      </el-icon>
    </el-button>

    <el-switch
      v-model="app.isDark"
      inline-prompt
      :active-text="t('actions.dark')"
      :inactive-text="t('actions.light')"
      @change="app.toggleDark"
    />

    <el-color-picker v-model="color" show-alpha :predefine="['#409EFF','#67C23A','#E6A23C','#F56C6C','#909399']" />

    <el-select v-model="app.locale" style="width:120px" @change="(val)=>{ app.setLocale(val); locale.value = val }">
      <el-option label="中文" value="zh-CN" />
      <el-option label="English" value="en" />
    </el-select>

    <div class="header-right">
      <el-button text @click="app.toggleFullscreen">
        <el-icon><FullScreen /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>