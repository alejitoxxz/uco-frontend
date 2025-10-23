import { Navigate, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { userHasRole } from '../auth/roles'
import Loading from '../components/Loading'

interface RoleGuardProps {
  allowedRoles: string[]
  children: JSX.Element
}

const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const { user, isLoading } = useAuth0()
  const location = useLocation()

  if (isLoading) {
    return <Loading />
  }

  if (!userHasRole(user, allowedRoles)) {
    return <Navigate to="/not-authorized" replace state={{ from: location }} />
  }

  return children
}

export default RoleGuard
