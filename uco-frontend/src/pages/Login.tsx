import { useEffect } from 'react'
import { useLocation, useNavigate, type Location } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Loading from '../components/Loading'

const Login = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void loginWithRedirect({
        appState: {
          returnTo: (location.state as { from?: Location })?.from?.pathname ?? '/',
        },
      })
    }
  }, [isAuthenticated, isLoading, location.state, loginWithRedirect])

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate((location.state as { from?: Location })?.from?.pathname ?? '/', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, location.state])

  return <Loading message="Redirigiendo a Auth0..." />
}

export default Login
