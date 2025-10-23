import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import NotAuthorized from '../pages/NotAuthorized'
import RoleGuard from './RoleGuard'
import { Roles } from '../auth/roles'

const ADMIN_ROLES = [Roles.Admin, Roles.Manager]

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route
      path="/dashboard"
      element={
        <RoleGuard allowed={ADMIN_ROLES}>
          <Dashboard />
        </RoleGuard>
      }
    />
    <Route path="/not-authorized" element={<NotAuthorized />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRouter
