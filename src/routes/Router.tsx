import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import NotAuthorized from '../pages/NotAuthorized'
import ProtectedRoute from './ProtectedRoute'
import RoleGuard from './RoleGuard'
import { Roles } from '../auth/roles'

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={[Roles.Admin, Roles.Manager]}>
            <Dashboard />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route path="/not-authorized" element={<NotAuthorized />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRouter
