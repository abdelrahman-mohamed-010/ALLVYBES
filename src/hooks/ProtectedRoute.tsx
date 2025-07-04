import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { VybesLoader } from '../components/UI/VybesLoader';

interface ProtectedRouteProps {
  requireAuth?: boolean;
  redirectTo?: string;
  requireProfileComplete?: boolean;
}

export function ProtectedRoute({ 
  requireAuth = true, 
  redirectTo = '/login',
  requireProfileComplete = true
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Show loader after a brief delay to avoid flashing
    const timer = setTimeout(() => {
      if (loading) setShowLoader(true);
    }, 200);

    return () => {
      clearTimeout(timer);
      setShowLoader(false);
    };
  }, [loading]);

  // Still loading
  if (loading) {
    return showLoader ? <VybesLoader /> : null;
  }

  // Require authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // User is authenticated but profile is incomplete
  if (
    isAuthenticated && 
    user && 
    requireProfileComplete &&
    !user.profileComplete && 
    location.pathname !== '/profile/setup'
  ) {
    return <Navigate to="/profile/setup" replace />;
  }

  return <Outlet />;
}