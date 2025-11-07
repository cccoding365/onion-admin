<script setup>
import Sidebar from '../components/Sidebar.vue'
import TopNav from '../components/TopNav.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import Tabs from '../components/Tabs.vue'
import { useAppStore } from '../stores/app'
import { useRoute } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })

const app = useAppStore()
const route = useRoute()
const localeMap = { 'zh-CN': zhCn, en }
</script>

<template>
  <el-config-provider :locale="localeMap[app.locale]">
    <el-container class="app-layout">
      <el-aside :width="app.collapsed ? '64px' : '200px'" class="sidebar">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header>
          <div style="display:flex;align-items:center;justify-content:space-between;height:100%;">
            <Breadcrumb />
            <TopNav />
          </div>
        </el-header>
        <!-- <Tabs /> -->
        <el-main>
          <RouterView />
        </el-main>
        <el-footer>
          <div class="footer-content">
            <span>{{ t('footer.copyright') }}</span>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<style scoped>
/* 可在此处追加局部样式 */
.el-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}
</style>