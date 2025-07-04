import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, metadata: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email);
  },

  getCurrentUser: async () => {
    return await supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: any, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Profile helpers
export const profiles = {
  getProfile: async (userId: string) => {
    return await supabase
      .from('profiles')
      .select(`
        *,
        user_roles(role, is_active),
        admin_permissions(permission, is_active)
      `)
      .eq('user_id', userId)
      .single();
  },

  updateProfile: async (userId: string, updates: any) => {
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId);
  },

  getAllProfiles: async () => {
    return await supabase
      .from('profiles')
      .select(`
        *,
        user_roles(role, is_active)
      `)
      .order('created_at', { ascending: false });
  }
};

// Role helpers
export const roles = {
  getUserRoles: async (userId: string) => {
    return await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);
  },

  assignRole: async (userId: string, role: string) => {
    return await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role,
        assigned_by: (await supabase.auth.getUser()).data.user?.id,
        is_active: true
      });
  },

  removeRole: async (userId: string, role: string) => {
    return await supabase
      .from('user_roles')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('role', role);
  }
};

// Permission helpers
export const permissions = {
  getUserPermissions: async (userId: string) => {
    return await supabase
      .from('admin_permissions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);
  },

  grantPermission: async (userId: string, permission: string) => {
    return await supabase
      .from('admin_permissions')
      .upsert({
        user_id: userId,
        permission,
        granted_by: (await supabase.auth.getUser()).data.user?.id,
        is_active: true
      });
  },

  revokePermission: async (userId: string, permission: string) => {
    return await supabase
      .from('admin_permissions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('permission', permission);
  }
};