// User module types (Variant A: explicit nulls for empty values)
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;  // explicit null instead of undefined
  avatar: string | null;
  role: UserRole;
  bio: string | null;
  website: string | null;
  location: string | null;
  birthDate: Date | null;
  preferences: UserPreferences; // keep as object
  stats: UserStats;             // keep as object
  isActive: boolean;
  emailVerified: boolean;
  lastActiveAt: Date | null;
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

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  displayName?: string; // optional, but never undefined at use sites
}

export interface LoginInput {
  password: string;
  email?: string;    // optional keys will be conditionally added (no undefined)
  username?: string;
}

export interface UserProfileUpdate {
  displayName?: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  birthDate?: Date | null;
  preferences?: Partial<UserPreferences>;
}

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
