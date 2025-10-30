import axios from 'axios'
import type { GetTokenSilentlyOptions } from '@auth0/auth0-react'

type GetAccessToken = (
  options?: GetTokenSilentlyOptions,
) => Promise<string | undefined | null>

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

let requestInterceptorId: number | null = null
let responseInterceptorId: number | null = null

const getTokenOptions = (
  options?: GetTokenSilentlyOptions,
): GetTokenSilentlyOptions => ({
  ...options,
  authorizationParams: {
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    scope: import.meta.env.VITE_AUTH0_SCOPE || 'openid profile email',
    ...options?.authorizationParams,
  },
})

export const attachTokenInterceptor = (
  getAccessTokenSilently: GetAccessToken,
  options?: GetTokenSilentlyOptions,
) => {
  if (requestInterceptorId !== null) {
    api.interceptors.request.eject(requestInterceptorId)
    requestInterceptorId = null
  }

  if (responseInterceptorId !== null) {
    api.interceptors.response.eject(responseInterceptorId)
    responseInterceptorId = null
  }

  requestInterceptorId = api.interceptors.request.use(async (config) => {
    try {
      const token = await getAccessTokenSilently(getTokenOptions(options))
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    } catch (error) {
      console.error('No fue posible obtener el token de acceso', error)
    }

    return config
  })

  responseInterceptorId = api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status

      if (status === 401) {
        window.location.href = '/login'
      } else if (status === 403) {
        window.location.href = '/not-authorized'
      }

      return Promise.reject(error)
    },
  )
}

export default api
