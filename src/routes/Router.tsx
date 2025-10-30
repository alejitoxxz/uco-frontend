import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Auth0ProviderWithNavigate from '../auth/Auth0ProviderWithNavigate'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import NotAuthorized from '../pages/NotAuthorized'
import Register from '../pages/Register'
import UsersListPage from '../pages/users/UsersListPage'
import UserCreatePage from '../pages/users/UserCreatePage'
import { RequireAdmin, RequireAuth } from './RoleGuard'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'not-authorized',
        element: <NotAuthorized />,
      },
      {
        path: 'dashboard',
        element: (
          <RequireAuth>
            <RequireAdmin>
              <Dashboard />
            </RequireAdmin>
          </RequireAuth>
        ),
      },
      {
        path: 'users',
        element: (
          <RequireAuth>
            <RequireAdmin>
              <UsersListPage />
            </RequireAdmin>
          </RequireAuth>
        ),
      },
      {
        path: 'users/new',
        element: (
          <RequireAuth>
            <RequireAdmin>
              <UserCreatePage />
            </RequireAdmin>
          </RequireAuth>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])

const AppRouter = () => <RouterProvider router={router} />

export default AppRouter
