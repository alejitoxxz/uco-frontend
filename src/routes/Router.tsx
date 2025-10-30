import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotAuthorized from '../pages/NotAuthorized';
import Dashboard from '../pages/Dashboard';
import UsersListPage from '../pages/users/UsersListPage';
import UserCreatePage from '../pages/users/UserCreatePage';
import { RequireAuth, RequireAdmin } from './RoleGuard';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/not-authorized', element: <NotAuthorized /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <RequireAdmin />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/users', element: <UsersListPage /> },
          { path: '/users/new', element: <UserCreatePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Home /> },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;
