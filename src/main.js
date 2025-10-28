import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { ToastService, Tooltip } from 'primevue'

import '@/assets/tailwind.css'
import 'primeicons/primeicons.css'

const pinia = createPinia()
const app = createApp(App)

const pcs = window.localStorage.getItem('prefers-dark-mode')
if (pcs == 'true') {
  window.document.documentElement.classList.add('dark-mode')
} else {
  if (pcs == null) {
    const dm = window.matchMedia('(prefers-color-scheme: dark)').matches
    window.localStorage.setItem('prefers-dark-mode', dm.toString())
    dm && window.document.documentElement.classList.add('dark-mode')
  }
}
app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode',
    },
  },
})
app.use(ToastService)
app.directive('tooltip', Tooltip)

app.mount('#app')
