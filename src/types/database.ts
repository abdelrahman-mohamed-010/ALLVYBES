export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          artist_name: string;
          bio: string | null;
          instagram: string | null;
          tiktok: string | null;
          youtube: string | null;
          twitter: string | null;
          phone: string | null;
          emergency_contact: string | null;
          profile_image: string | null;
          is_admin: boolean;
          is_verified: boolean;
          profile_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          artist_name: string;
          bio?: string | null;
          instagram?: string | null;
          tiktok?: string | null;
          youtube?: string | null;
          twitter?: string | null;
          phone?: string | null;
          emergency_contact?: string | null;
          profile_image?: string | null;
          is_admin?: boolean;
          is_verified?: boolean;
          profile_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          artist_name?: string;
          bio?: string | null;
          instagram?: string | null;
          tiktok?: string | null;
          youtube?: string | null;
          twitter?: string | null;
          phone?: string | null;
          emergency_contact?: string | null;
          profile_image?: string | null;
          is_admin?: boolean;
          is_verified?: boolean;
          profile_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: 'artist' | 'admin' | 'super_admin';
          assigned_by: string | null;
          assigned_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: 'artist' | 'admin' | 'super_admin';
          assigned_by?: string | null;
          assigned_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'artist' | 'admin' | 'super_admin';
          assigned_by?: string | null;
          assigned_at?: string;
          is_active?: boolean;
        };
      };
      admin_permissions: {
        Row: {
          id: string;
          user_id: string;
          permission: 'manage_events' | 'manage_users' | 'view_analytics' | 'moderate_content' | 'system_admin';
          granted_by: string | null;
          granted_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          permission: 'manage_events' | 'manage_users' | 'view_analytics' | 'moderate_content' | 'system_admin';
          granted_by?: string | null;
          granted_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          permission?: 'manage_events' | 'manage_users' | 'view_analytics' | 'moderate_content' | 'system_admin';
          granted_by?: string | null;
          granted_at?: string;
          is_active?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: {
          user_uuid?: string;
        };
        Returns: boolean;
      };
      has_permission: {
        Args: {
          permission_name: 'manage_events' | 'manage_users' | 'view_analytics' | 'moderate_content' | 'system_admin';
          user_uuid?: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: 'artist' | 'admin' | 'super_admin';
      admin_permission: 'manage_events' | 'manage_users' | 'view_analytics' | 'moderate_content' | 'system_admin';
    };
  };
}