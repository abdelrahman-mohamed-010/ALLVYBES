export interface User {
  id: string;
  artistName: string;
  profileImage?: string;
  bio?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  twitchEmbed?: string;
  phone?: string;
  email?: string;
  emergencyContact?: string;
  isAdmin?: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  date: Date;
  endDate?: Date;
  location: string;
  venue?: string;
  qrId: string;
  isActive: boolean;
  isLive: boolean;
  capacity?: number;
  checkedInCount: number;
  image?: string;
  tags: string[];
  price?: number;
  createdAt: Date;
}

export interface CheckIn {
  id: string;
  userId: string;
  eventId: string;
  timestamp: Date;
  guestCount: number;
  songCount: number;
  isComplete: boolean;
  isStar: boolean;
  performed: boolean;
  specialEffects: boolean;
  otherContent?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'performance' | 'message' | 'system';
}

export interface Platform {
  id: string;
  name: string;
  logo?: string;
  description: string;
  instagram?: string;
  website?: string;
  contactEmail?: string;
  featured: boolean;
}

export type UserRole = 'artist' | 'admin';
export type CheckInStatus = 'incomplete' | 'complete' | 'star' | 'performed';