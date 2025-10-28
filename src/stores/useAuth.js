import { authReq } from '@/utils/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const checked = ref(false)
  const checkAuth = async () => {
    if (checked.value) return checked.value
    try {
      await authReq.post('/check')
      checked.value = true
    } catch {
      checked.value = false
    }
    return checked.value
  }
  return { checkAuth }
})
