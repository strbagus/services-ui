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
      component: () => import('@/components/Layout.vue'),
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
          path: 'disks',
          name: 'homelab.disk',
          component: () => import('@/pages/homelab/Disks.vue'),
        },
        {
          path: 'services',
          name: 'homelab.service',
          component: () => import('@/pages/homelab/Services.vue'),
        },
        {
          path: 'resources',
          name: 'homelab.resources',
          component: () => import('@/pages/homelab/resources/Index.vue'),
        },
        {
          path: 'resources/:category',
          name: 'homelab.resources.category',
          component: () => import('@/pages/homelab/resources/CategoryDynamic.vue'),
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
