import type { User } from '@auth0/auth0-react'

export enum Roles {
  Admin = 'admin',
  Manager = 'manager',
  Viewer = 'viewer',
}

const DEFAULT_NAMESPACE = 'https://example.com/roles'

const getRolesNamespace = () => import.meta.env.VITE_AUTH0_ROLES_NAMESPACE ?? DEFAULT_NAMESPACE

export const getUserRoles = (user?: User | null): string[] => {
  if (!user) {
    return []
  }

  const namespace = getRolesNamespace()
  const rolesClaim = user[namespace]

  if (Array.isArray(rolesClaim)) {
    return rolesClaim.filter((role): role is string => typeof role === 'string')
  }

  if (typeof rolesClaim === 'string') {
    return rolesClaim.split(',').map((role) => role.trim())
  }

  return []
}

export const userHasRole = (user: User | null | undefined, allowedRoles: string | string[]): boolean => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  const userRoles = getUserRoles(user)
  return roles.some((role) => userRoles.includes(role))
}
