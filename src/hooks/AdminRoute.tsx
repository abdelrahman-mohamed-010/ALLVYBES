import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';
import { VybesLoader } from '../components/UI/VybesLoader';

interface AdminRouteProps {
  requiredRole?: 'admin' | 'super_admin';
  fallbackPath?: string;
}

export function AdminRoute({ 
  requiredRole = 'admin', 
  fallbackPath = '/' 
}: AdminRouteProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return <VybesLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to={fallbackPath} replace />;
  }

  // For future role-based access control
  if (requiredRole === 'super_admin' && user?.isAdmin) {
    // Add super admin check here when implemented
    // For now, all admins can access
  }

  return <Outlet />;
}