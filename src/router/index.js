import { createRouter, createWebHashHistory } from 'vue-router'

import isAuthenticatedGuard from '../modules/auth/router/auth-guard'

import authRouter from '../modules/auth/router/index.js'
import docRouter from '../modules/gestor/router/index.js'

const routes = [
  {
    path: '/',
    ...authRouter,
  },
  {
    path: '/docs',
    beforeEnter: [ isAuthenticatedGuard ],
    ...docRouter
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
