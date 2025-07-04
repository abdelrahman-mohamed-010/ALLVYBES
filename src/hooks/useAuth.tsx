import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const { user, loading, initialized, setUser, setLoading, checkAuth } = useAuthStore();

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
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [initialized, checkAuth, setUser, setLoading]);

  return {
    user,
    loading: loading || !initialized,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    isArtist: user?.isArtist || false,
    signOut: useAuthStore.getState().signOut,
    updateProfile: useAuthStore.getState().updateUserProfile,
  };
}