import axios from 'axios'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_METRIC,
  withCredentials: true,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})

export const useReqMetric = () => {
  const router = useRouter()
  const route = useRoute()
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchData = async (url, method = 'get', payload = null) => {
    loading.value = true
    error.value = null
    try {
      let response
      if (method === 'get') {
        response = await api.get(url)
      } else if (method === 'post') {
        response = await api.post(url, payload)
      } else if (method === 'put') {
        response = await api.put(url, payload)
      } else if (method === 'delete') {
        response = await api.delete(url)
      }
      data.value = response.data
    } catch (err) {
      if (err.status == 401) {
        router.replace({ name: 'login', query: { callback: encodeURI(route.fullPath) } })
      }
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchData }
}
