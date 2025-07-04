import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { UserRole, AdminPermission } from '../types/auth';

export function useAuth() {
  const { 
    user, 
    loading, 
    initialized, 
    setUser, 
    setLoading, 
    checkAuth,
    updateUserProfile,
    hasRole,
    hasPermission,
    isAdmin,
    isArtist
  } = useAuthStore();

  useEffect(() => {
    // Initial auth check
    if (!initialized) {
      checkAuth();
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await checkAuth();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Optionally refresh user data on token refresh
          await checkAuth();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [initialized, checkAuth, setUser, setLoading]);

  return {
    // User data
    user,
    loading: loading || !initialized,
    isAuthenticated: !!user,
    
    // Role checks
    isAdmin: isAdmin(),
    isArtist: isArtist(),
    hasRole: (role: UserRole) => hasRole(role),
    hasPermission: (permission: AdminPermission) => hasPermission(permission),
    
    // Actions
    signOut: useAuthStore.getState().signOut,
    updateProfile: updateUserProfile,
    
    // Convenience checks
    canManageEvents: hasPermission('manage_events'),
    canManageUsers: hasPermission('manage_users'),
    canViewAnalytics: hasPermission('view_analytics'),
    canModerateContent: hasPermission('moderate_content'),
    isSystemAdmin: hasPermission('system_admin'),
  };
}