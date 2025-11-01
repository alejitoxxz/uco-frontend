import axios from 'axios'

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/uco-challenge/api/v1`,
})
