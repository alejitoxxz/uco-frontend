import { Auth0Provider, type AppState } from '@auth0/auth0-react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Auth0ProviderWithNavigateProps {
  children: ReactNode
}

const getEnv = (key: string) => {
  const value = import.meta.env[key]
  if (!value) {
    console.warn(`Auth0 environment variable "${key}" is not defined.`)
  }
  return value
}

const Auth0ProviderWithNavigate = ({ children }: Auth0ProviderWithNavigateProps) => {
  const navigate = useNavigate()

  const domain = getEnv('VITE_AUTH0_DOMAIN')
  const clientId = getEnv('VITE_AUTH0_CLIENT_ID')
  const audience = getEnv('VITE_AUTH0_AUDIENCE')

  const onRedirectCallback = useCallback(
    (appState?: AppState) => {
      const targetUrl = appState?.returnTo ?? window.location.pathname
      navigate(targetUrl, { replace: true })
    },
    [navigate],
  )

  if (!domain || !clientId) {
    return children
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience ?? undefined,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation={import.meta.env.VITE_AUTH0_CACHE_LOCATION ?? 'memory'}
      useRefreshTokens={import.meta.env.VITE_AUTH0_USE_REFRESH_TOKENS === 'true'}
    >
      {children}
    </Auth0Provider>
  )
}

export default Auth0ProviderWithNavigate
