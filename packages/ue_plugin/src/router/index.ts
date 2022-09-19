import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import CallApis from '@/views/CallApis.vue'
import ImportJson from '@/views/ImportJson.vue'

const BASE_URL = import.meta.env.VITE_BASE_URL
  ? import.meta.env.VITE_BASE_URL
  : '/plugin/gah'

const routes: RouteRecordRaw[] = [
  {
    path: '/call-apis',
    name: 'CallApis',
    component: CallApis,
  },
  {
    path: '/import-json',
    name: 'ImportJson',
    component: ImportJson,
  }
]


const history = createWebHashHistory(BASE_URL)
const router = createRouter({ history, routes })

export default router
