export interface AuthUser {
  id: string;
  email?: string;
  artistName: string;
  isAdmin: boolean;
  isArtist: boolean;
  profileComplete: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  artistName: string;
  bio?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  phone?: string;
  emergencyContact?: string;
  profileImage?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminProfile {
  id: string;
  userId: string;
  organizationName: string;
  role: 'super_admin' | 'event_admin' | 'moderator';
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'artist' | 'admin' | 'super_admin';