import * as React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, useLocation } from 'react-router-dom'
import Loading from '../components/Loading'
import { ROLES_CLAIM } from '../auth/roles'

interface RoleGuardProps {
  allowed: string[]
  children: JSX.Element
}

const RoleGuard = ({ allowed, children }: RoleGuardProps) => {
  const { isLoading, isAuthenticated, getIdTokenClaims } = useAuth0()
  const location = useLocation()
  const [hasAccess, setHasAccess] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    let alive = true

    setHasAccess(null)

    ;(async () => {
      if (isLoading) {
        return
      }

      if (!isAuthenticated) {
        if (alive) {
          setHasAccess(false)
        }
        return
      }

      try {
        const claims = await getIdTokenClaims()
        const claimValue = claims?.[ROLES_CLAIM]
        const roles = Array.isArray(claimValue)
          ? claimValue.filter((role): role is string => typeof role === 'string')
          : typeof claimValue === 'string'
          ? [claimValue]
          : []

        if (alive) {
          setHasAccess(allowed.some((role) => roles.includes(role)))
        }
      } catch (error) {
        console.error('Unable to retrieve ID token claims', error)
        if (alive) {
          setHasAccess(false)
        }
      }
    })()

    return () => {
      alive = false
    }
  }, [allowed, getIdTokenClaims, isAuthenticated, isLoading])

  if (isLoading || hasAccess === null) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!hasAccess) {
    return <Navigate to="/login" state={{ unauthorized: true, from: location }} replace />
  }

  return children
}

export default RoleGuard
