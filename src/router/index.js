import { useAuthStore } from '@/stores/useAuth'
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
      component: () => import('@/pages/homelab/Layout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'homelab.index',
          component: () => import('@/pages/homelab/IndexView.vue'),
        },
        {
          path: 'pods',
          name: 'homelab.pod',
          component: () => import('@/pages/homelab/Pods.vue'),
        },
        {
          path: 'nodes',
          name: 'homelab.node',
          component: () => import('@/pages/homelab/Nodes.vue'),
        },
        {
          path: 'services',
          name: 'homelab.service',
          component: () => import('@/pages/homelab/Services.vue'),
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
  const { checkAuth } = useAuthStore()
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!(await checkAuth())) {
      next({
        name: 'login',
        query: {
          callback: to.fullPath,
        },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
