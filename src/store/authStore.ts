import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '../types/auth';
import { supabase } from '../lib/supabaseClient';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  
  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUserProfile: (updates: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      initialized: false,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),

      signOut: async () => {
        set({ loading: true });
        await supabase.auth.signOut();
        set({ user: null, loading: false });
      },

      checkAuth: async () => {
        try {
          set({ loading: true });
          const { data: { user }, error } = await supabase.auth.getUser();
          
          if (error) {
            console.error('Auth error:', error);
            set({ user: null, loading: false, initialized: true });
            return;
          }

          if (user) {
            // Fetch user profile from your profiles table
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', user.id)
              .single();

            if (profileError) {
              console.error('Profile fetch error:', profileError);
              // Create a basic user object if profile doesn't exist
              const authUser: AuthUser = {
                id: user.id,
                email: user.email,
                artistName: user.user_metadata?.artistName || '',
                isAdmin: user.user_metadata?.isAdmin || false,
                isArtist: !user.user_metadata?.isAdmin,
                profileComplete: false,
                createdAt: new Date(user.created_at),
              };
              set({ user: authUser, loading: false, initialized: true });
            } else {
              // Use profile data
              const authUser: AuthUser = {
                id: user.id,
                email: user.email,
                artistName: profile.artist_name || user.user_metadata?.artistName || '',
                isAdmin: profile.is_admin || false,
                isArtist: !profile.is_admin,
                profileComplete: profile.profile_complete || false,
                createdAt: new Date(profile.created_at),
                updatedAt: profile.updated_at ? new Date(profile.updated_at) : undefined,
              };
              set({ user: authUser, loading: false, initialized: true });
            }
          } else {
            set({ user: null, loading: false, initialized: true });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ user: null, loading: false, initialized: true });
        }
      },

      updateUserProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);