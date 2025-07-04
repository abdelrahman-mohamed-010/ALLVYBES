import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, UserRole, AdminPermission, ProfileUpdateData } from '../types/auth';
import { supabase, auth, profiles } from '../lib/supabase';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  
  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUserProfile: (updates: ProfileUpdateData) => Promise<void>;
  
  // Role & Permission helpers
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: AdminPermission) => boolean;
  isAdmin: () => boolean;
  isArtist: () => boolean;
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
        await auth.signOut();
        set({ user: null, loading: false });
      },

      checkAuth: async () => {
        try {
          set({ loading: true });
          const { data: { user }, error } = await auth.getCurrentUser();
          
          if (error) {
            console.error('Auth error:', error);
            set({ user: null, loading: false, initialized: true });
            return;
          }

          if (user) {
            // Fetch complete user profile with roles and permissions
            const { data: profile, error: profileError } = await profiles.getProfile(user.id);

            if (profileError) {
              console.error('Profile fetch error:', profileError);
              set({ user: null, loading: false, initialized: true });
              return;
            }

            if (profile) {
              // Transform database profile to AuthUser
              const authUser: AuthUser = {
                id: user.id,
                email: user.email,
                artistName: profile.artist_name,
                bio: profile.bio || undefined,
                instagram: profile.instagram || undefined,
                tiktok: profile.tiktok || undefined,
                youtube: profile.youtube || undefined,
                twitter: profile.twitter || undefined,
                phone: profile.phone || undefined,
                emergencyContact: profile.emergency_contact || undefined,
                profileImage: profile.profile_image || undefined,
                isAdmin: profile.is_admin,
                isArtist: !profile.is_admin,
                isVerified: profile.is_verified,
                profileComplete: profile.profile_complete,
                roles: profile.user_roles?.filter(r => r.is_active).map(r => r.role) || [],
                permissions: profile.admin_permissions?.filter(p => p.is_active).map(p => p.permission) || [],
                createdAt: new Date(profile.created_at),
                updatedAt: profile.updated_at ? new Date(profile.updated_at) : undefined,
              };
              
              set({ user: authUser, loading: false, initialized: true });
            } else {
              set({ user: null, loading: false, initialized: true });
            }
          } else {
            set({ user: null, loading: false, initialized: true });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ user: null, loading: false, initialized: true });
        }
      },

      updateUserProfile: async (updates: ProfileUpdateData) => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
          // Update in database
          const { error } = await profiles.updateProfile(currentUser.id, {
            artist_name: updates.artistName,
            bio: updates.bio,
            instagram: updates.instagram,
            tiktok: updates.tiktok,
            youtube: updates.youtube,
            twitter: updates.twitter,
            phone: updates.phone,
            emergency_contact: updates.emergencyContact,
            profile_image: updates.profileImage,
            profile_complete: updates.profileComplete,
          });

          if (error) {
            throw error;
          }

          // Update local state
          set({ 
            user: { 
              ...currentUser, 
              ...updates,
              emergencyContact: updates.emergencyContact,
              profileImage: updates.profileImage,
              profileComplete: updates.profileComplete ?? currentUser.profileComplete,
              updatedAt: new Date()
            } 
          });
        } catch (error) {
          console.error('Profile update failed:', error);
          throw error;
        }
      },

      // Helper methods
      hasRole: (role: UserRole) => {
        const user = get().user;
        return user?.roles.includes(role) || false;
      },

      hasPermission: (permission: AdminPermission) => {
        const user = get().user;
        return user?.permissions.includes(permission) || false;
      },

      isAdmin: () => {
        const user = get().user;
        return user?.isAdmin || user?.roles.includes('admin') || user?.roles.includes('super_admin') || false;
      },

      isArtist: () => {
        const user = get().user;
        return user?.isArtist || user?.roles.includes('artist') || false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);