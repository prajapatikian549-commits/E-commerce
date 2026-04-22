import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { isTokenExpired } from '@/auth/jwt';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token || !user || isTokenExpired(token)) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    );
  }

  return <>{children}</>;
}
