import { useCallback, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate, type Location } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Loading from '../components/Loading'

const Login = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const location = useLocation()
  const navigate = useNavigate()

  const loginState = useMemo(
    () => location.state as { from?: Location; unauthorized?: boolean } | undefined,
    [location.state],
  )

  const unauthorized = Boolean(loginState?.unauthorized)

  const fromPathname = loginState?.from?.pathname ?? '/'

  const handleSwitchAccount = useCallback(() => {
    void loginWithRedirect({
      authorizationParams: {
        prompt: 'select_account',
      },
    })
  }, [loginWithRedirect])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const returnTo = fromPathname
      void loginWithRedirect({
        appState: {
          returnTo,
          target: returnTo,
        },
        authorizationParams: {
          prompt: 'select_account',
        },
      })
    }
  }, [fromPathname, isAuthenticated, isLoading, loginWithRedirect])

  useEffect(() => {
    if (!isLoading && isAuthenticated && !unauthorized) {
      navigate(fromPathname, { replace: true })
    }
  }, [fromPathname, isAuthenticated, isLoading, navigate, unauthorized])

  if (unauthorized) {
    return (
      <main className="page">
        <h1>Sin permisos</h1>
        <p>No tienes permisos para acceder al panel de control.</p>
        <p>
          Regresa al <Link to="/">inicio</Link> o inicia sesión con una cuenta con privilegios de
          administrador.
        </p>
        <button type="button" className="button" onClick={handleSwitchAccount}>
          Cambiar de cuenta
        </button>
      </main>
    )
  }

  return <Loading message="Redirigiendo a Auth0..." />
}

export default Login
