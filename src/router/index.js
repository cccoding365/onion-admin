import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import { layoutRoutes } from './routes'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: layoutRoutes,
  },
  { path: '/auth', component: () => import('../views/Auth.vue') },
  { path: '/403', component: () => import('../views/Forbidden.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由权限控制：需要登录且角色符合要求
router.beforeEach((to) => {
  const user = useUserStore()
  const requiresRole = to.matched.some((r) => Array.isArray(r.meta?.roles))
  if (requiresRole) {
    const loggedIn = !!user.token
    if (!loggedIn) {
      return { path: '/auth', query: { redirect: to.fullPath } }
    }
    const allowed = to.matched.every((r) => !r.meta?.roles || user.hasAccess(r))
    if (!allowed) {
      return { path: '/403' }
    }
  }
  return true
})

export default router