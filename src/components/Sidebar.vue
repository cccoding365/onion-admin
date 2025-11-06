<script setup>
import { useAppStore } from '../stores/app'
import { useUserStore } from '../stores/user'
import { useRoute } from 'vue-router'
import { layoutRoutes } from '../router/routes'
import * as Icons from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const app = useAppStore()
const user = useUserStore()
const route = useRoute()

const visibleRoutes = layoutRoutes.filter((r) => {
  // 过滤掉重定向等没有 meta/titleKey 的项
  return r.component && r.meta && r.meta.titleKey && user.hasAccess(r)
})
</script>

<template>
  <el-menu
    :default-active="route.path"
    :collapse="app.collapsed"
    router
    unique-opened
  >
    <template v-for="r in visibleRoutes" :key="r.path">
      <el-menu-item :index="r.path">
        <el-icon>
          <component :is="Icons[r.meta?.icon]" />
        </el-icon>
        <span>{{ t(r.meta?.titleKey) }}</span>
      </el-menu-item>
    </template>
  </el-menu>
  
</template>

<style scoped>
.el-menu {
  border-right: none;
  height: 100%;
  background-color: transparent;
}
</style>
