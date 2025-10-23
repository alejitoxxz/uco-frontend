import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Loading from '../components/Loading'

interface ProtectedRouteProps {
  children: JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void loginWithRedirect({
        appState: { returnTo: location.pathname },
      })
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, location.pathname])

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
