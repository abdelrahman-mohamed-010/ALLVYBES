export interface AuthUser {
  id: string;
  email?: string;
  artistName: string;
  bio?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  phone?: string;
  emergencyContact?: string;
  profileImage?: string;
  isAdmin: boolean;
  isArtist: boolean;
  isVerified: boolean;
  profileComplete: boolean;
  roles: UserRole[];
  permissions: AdminPermission[];
  createdAt: Date;
  updatedAt?: Date;
}

export type UserRole = 'artist' | 'admin' | 'super_admin';

export type AdminPermission = 
  | 'manage_events'
  | 'manage_users' 
  | 'view_analytics'
  | 'moderate_content'
  | 'system_admin';

export interface SignUpData {
  email: string;
  password: string;
  artistName: string;
  accountType: 'artist' | 'admin';
}

export interface ProfileUpdateData {
  artistName?: string;
  bio?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  phone?: string;
  emergencyContact?: string;
  profileImage?: string;
  profileComplete?: boolean;
}