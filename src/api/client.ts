import axios from 'axios'

function trimTrailingSlash(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8082/api'

export const api = axios.create({
  baseURL: trimTrailingSlash(BASE),
  headers: { 'Content-Type': 'application/json' },
})
