import { authReq } from '@/utils/axios'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomeView.vue'),
    },
    {
      path: '/sign-in',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
    },
    {
      path: '/homelab',
      name: 'homelab',
      meta: { requiresAuth: true },
      component: () => import('@/pages/homelab/Layout.vue'),
      children: [
        {
          path: '',
          name: 'homelab.index',
          component: () => import('@/pages/homelab/IndexView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFound.vue'),
    },
  ],
})

router.resolve({
  name: 'not-found',
  params: { pathMatch: ['not', 'found'] },
}).href

router.beforeEach(async (to, _, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    try {
      await authReq.post('/check')
      next()
    } catch {
      next({ name: 'login', query: { callback: encodeURI(to.fullPath) } })
    }
  } else {
    next()
  }
})

export default router
