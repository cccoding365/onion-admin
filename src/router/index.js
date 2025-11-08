import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
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

// NProgress 配置
NProgress.configure({ showSpinner: false })

// 路由权限控制：需要登录且符合角色或权限要求，并显示顶部加载进度
router.beforeEach((to) => {
  NProgress.start()
  const user = useUserStore()
  const requiresAuth = to.matched.some((r) => Array.isArray(r.meta?.roles) || Array.isArray(r.meta?.permissions))
  if (requiresAuth) {
    const loggedIn = !!user.token
    if (!loggedIn) {
      NProgress.done()
      return { path: '/auth', query: { redirect: to.fullPath } }
    }
    const allowed = to.matched.every((r) => user.hasAccess(r))
    if (!allowed) {
      NProgress.done()
      return { path: '/403' }
    }
  }
  return true
})

router.afterEach(() => {
  NProgress.done()
})

router.onError(() => {
  NProgress.done()
})

export default router