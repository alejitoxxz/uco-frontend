import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { GetTokenSilentlyOptions } from '@auth0/auth0-react'

type GetAccessToken = (options?: GetTokenSilentlyOptions) => Promise<string>

let client: AxiosInstance | null = null
let interceptorId: number | null = null

const createClient = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  })

export const getApiClient = () => {
  if (!client) {
    client = createClient()
  }

  return client
}

export const attachTokenInterceptor = (getAccessTokenSilently: GetAccessToken, options?: GetTokenSilentlyOptions) => {
  const apiClient = getApiClient()

  if (interceptorId !== null) {
    apiClient.interceptors.request.eject(interceptorId)
  }

  interceptorId = apiClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
    try {
      const token = await getAccessTokenSilently(options)
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    } catch (error) {
      console.error('Unable to retrieve access token', error)
    }

    return config
  })
}

export default getApiClient()
