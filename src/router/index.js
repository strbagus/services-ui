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
      component: () => import('@/pages/homelab/Layout.vue'),
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

export default router
