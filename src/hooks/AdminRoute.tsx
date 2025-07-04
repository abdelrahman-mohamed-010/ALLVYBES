import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';
import { VybesLoader } from '../components/UI/VybesLoader';
import { AdminPermission } from '../types/auth';

interface AdminRouteProps {
  requiredPermission?: AdminPermission;
  fallbackPath?: string;
}

export function AdminRoute({ 
  requiredPermission,
  fallbackPath = '/' 
}: AdminRouteProps) {
  const { user, loading, isAuthenticated, isAdmin, hasPermission } = useAuth();

  if (loading) {
    return <VybesLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check specific permission if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
}