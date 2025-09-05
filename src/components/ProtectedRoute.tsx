import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  clientOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false, clientOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isClient } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (clientOnly && !isClient) {
    return <Navigate to="/" replace />;
  }

  // Redirect clients to client dashboard, employees/admins to main dashboard
  if (window.location.pathname === '/' && isClient) {
    return <Navigate to="/client" replace />;
  }
  
  if (window.location.pathname === '/' && !isClient) {
    return <>{children}</>;
  }

  return <>{children}</>;
}