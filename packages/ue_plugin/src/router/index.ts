import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Upload from '@/views/Upload.vue'

const BASE_URL = import.meta.env.VITE_BASE_URL
  ? import.meta.env.VITE_BASE_URL
  : '/plugin'

const routes: RouteRecordRaw[] = [
  {
    path: '/upload',
    name: 'Upload',
    component: Upload,
  },
]

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
})

export default router
