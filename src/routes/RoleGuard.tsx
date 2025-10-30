import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Loading from '../components/Loading'
import { Roles, userHasRole } from '../auth/roles'

interface GuardProps {
  children: ReactElement
}

export const RequireAuth = ({ children }: GuardProps) => {
  const { isAuthenticated, isLoading } = useAuth0()
  const location = useLocation()

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export const RequireAdmin = ({ children }: GuardProps) => {
  const { isAuthenticated, isLoading, user } = useAuth0()
  const location = useLocation()

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!userHasRole(user, Roles.Admin)) {
    return <Navigate to="/login" state={{ from: location, unauthorized: true }} replace />
  }

  return children
}
