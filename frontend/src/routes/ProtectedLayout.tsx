import { Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';

function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem('auth_token'));
}

export function ProtectedLayout() {
  if (!isAuthenticated()) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
