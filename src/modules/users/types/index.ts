// User module types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  website?: string;
  location?: string;
  birthDate?: Date;
  preferences: UserPreferences;
  stats: UserStats;
  isActive: boolean;
  emailVerified: boolean;
  lastActiveAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'user' | 'moderator' | 'admin';

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  compactMode: boolean;
  profilePublic: boolean;
  showEmail: boolean;
  showStats: boolean;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  browser: boolean;
  extension: boolean;
  newChapters: boolean;
  cardReceived: boolean;
  achievements: boolean;
  tradeRequests: boolean;
  auctionUpdates: boolean;
}

export interface UserStats {
  totalWorksRead: number;
  totalChaptersRead: number;
  totalReadingTime: number;
  averageRating: number;
  level: number;
  experience: number;
  currency: number;
  totalCards: number;
  uniqueCards: number;
  rareCards: number;
  achievementsUnlocked: number;
  tradesCompleted: number;
  auctionsWon: number;
}

// API Types
export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export interface LoginInput {
  email?: string;
  username?: string;
  password: string;
}

export interface UserProfileUpdate {
  displayName?: string;
  bio?: string;
  website?: string;
  location?: string;
  birthDate?: Date;
  preferences?: Partial<UserPreferences>;
}

// Events
export interface UserRegisteredEvent {
  type: 'user.registered';
  userId: string;
  email: string;
  username: string;
  timestamp: Date;
}

export interface UserProfileUpdatedEvent {
  type: 'user.profile.updated';
  userId: string;
  changes: Record<string, unknown>;
  timestamp: Date;
}
