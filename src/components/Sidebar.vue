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

function filterVisibleRoute(r) {
  return (
    r && r.component && r.meta && r.meta.titleKey && !r.meta.hidden && user.hasAccess(r)
  )
}

const visibleRoutes = layoutRoutes
  .map((r) => {
    // 处理有子路由的分组
    if (Array.isArray(r.children) && r.children.length > 0) {
      const children = r.children.filter((c) => filterVisibleRoute(c))
      if (filterVisibleRoute(r) || children.length > 0) {
        return { ...r, children }
      }
      return null
    }
    return filterVisibleRoute(r) ? r : null
  })
  .filter(Boolean)
</script>

<template>
  <el-menu
    :default-active="route.path"
    :collapse="app.collapsed"
    router
    unique-opened
  >
    <template v-for="r in visibleRoutes" :key="r.path">
      <el-sub-menu v-if="Array.isArray(r.children) && r.children.length" :index="r.path">
        <template #title>
          <el-icon>
            <component :is="Icons[r.meta?.icon]" />
          </el-icon>
          <span v-if="!app.collapsed">{{ t(r.meta?.titleKey) }}</span>
        </template>
        <el-menu-item v-for="c in r.children" :key="c.path" :index="c.path">
          <span>{{ t(c.meta?.titleKey) }}</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :index="r.path">
        <el-icon>
          <component :is="Icons[r.meta?.icon]" />
        </el-icon>
        <span v-if="!app.collapsed">{{ t(r.meta?.titleKey) }}</span>
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
