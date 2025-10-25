import axios from 'axios'

export const hlReq = axios.create({
  baseURL: import.meta.env.VITE_API_METRIC,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
})

export const authReq = axios.create({
  baseURL: import.meta.env.VITE_API_AUTH,
  withCredentials: true,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})
