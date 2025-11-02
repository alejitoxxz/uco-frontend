import axios from 'axios'
import { parseApiError } from '../utils/parseApiError'

function trimTrailingSlash(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8082/api'

export const api = axios.create({
  baseURL: trimTrailingSlash(BASE),
  headers: { 'Content-Type': 'application/json' },
})

export const apiClient = api

api.interceptors.response.use(
  (response) => response,
  (error) => {
    ;(error as any).__niceMessage = parseApiError(error)
    return Promise.reject(error)
  }
)
