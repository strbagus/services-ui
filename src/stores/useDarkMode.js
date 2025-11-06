import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDarkModeStore = defineStore('darkMode', () => {
  const dmState = ref(false)
  const init = () => {
    const dm = window.document.documentElement.classList.contains('dark-mode')
    dmState.value = dm
  }

  const dmToggle = () => {
    document.documentElement.classList.toggle('dark-mode')
    dmState.value = window.document.documentElement.classList.contains('dark-mode')
    window.localStorage.setItem('prefers-dark-mode', dmState.value.toString())
  }
  return { dmState, dmToggle, init }
})
