import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import { layoutRoutes } from './routes'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: layoutRoutes,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router