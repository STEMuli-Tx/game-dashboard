import { lazy, Suspense, useContext } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import { AuthContext } from 'src/context/authContext';
import ProtectedRoute from 'src/routes/components/protected-route';
import PublicRoute from 'src/routes/components/public-route';

import DashboardLayout from 'src/layouts/dashboard';

export const DashboardPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const InventoryPage = lazy(() => import('src/pages/inventory'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const LearningManagementPage = lazy(() => import('src/pages/learning-management'));
export const AccountManagementPage = lazy(() => import('src/pages/account-management'));
export const UserManagementPage = lazy(() => import('src/pages/user-management'));
export const CreateUserPage = lazy(() => import('src/pages/create-user'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

export default function Router() {
  const { user } = useContext(AuthContext);

  const getDefaultRoute = () => {
    if (user?.userType === 'student') {
      return <DashboardPage />;
    } else if (user?.userType === 'teacher') {
      return <UserManagementPage />;
    } else {
      return <Navigate to="/login" replace />;
    }
  };

  const routes = useRoutes([
    {
      element: (
        <ProtectedRoute isLoggedIn={user ? true : false}>
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { path: '/', element: getDefaultRoute() },
        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'user-management', element: <UserManagementPage /> },
        { path: 'account-management/:id/create-user', element: <CreateUserPage /> },
      ],
    },
    {
      path: 'login',
      element: (
        <PublicRoute>
          <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
          </Suspense>
        </PublicRoute>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
