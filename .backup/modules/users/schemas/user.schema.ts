import { z } from "zod";

// Base schemas
export const UserRoleSchema = z.enum(["user", "moderator", "admin"]);

export const NotificationSettingsSchema = z.object({
  email: z.boolean(),
  browser: z.boolean(),
  extension: z.boolean(),
  newChapters: z.boolean(),
  cardReceived: z.boolean(),
  achievements: z.boolean(),
  tradeRequests: z.boolean(),
  auctionUpdates: z.boolean(),
});

export const UserPreferencesSchema = z.object({
  language: z.string(),
  timezone: z.string(),
  theme: z.enum(["light", "dark", "auto"]),
  compactMode: z.boolean(),
  profilePublic: z.boolean(),
  showEmail: z.boolean(),
  showStats: z.boolean(),
  notifications: NotificationSettingsSchema,
});

export const UserStatsSchema = z.object({
  totalWorksRead: z.number(),
  totalChaptersRead: z.number(),
  totalReadingTime: z.number(),
  averageRating: z.number(),
  level: z.number(),
  experience: z.number(),
  currency: z.number(),
  totalCards: z.number(),
  uniqueCards: z.number(),
  rareCards: z.number(),
  achievementsUnlocked: z.number(),
  tradesCompleted: z.number(),
  auctionsWon: z.number(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(50),
  displayName: z.string().nullable(),
  avatar: z.string().url().nullable(),
  role: UserRoleSchema,
  bio: z.string().nullable(),
  website: z.string().url().nullable(),
  location: z.string().nullable(),
  birthDate: z.date().nullable(),
  preferences: UserPreferencesSchema,
  stats: UserStatsSchema,
  isActive: z.boolean(),
  emailVerified: z.boolean(),
  lastActiveAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Export types
export type UserRole = z.infer<typeof UserRoleSchema>;
export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type UserStats = z.infer<typeof UserStatsSchema>;
export type User = z.infer<typeof UserSchema>;

// DTO schemas (moved from api/dto.ts)
export const RegisterInputSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8).max(128),
  displayName: z.string().max(100).nullable().optional(),
});

export const LoginInputSchema = z
  .object({
    email: z.string().email().optional(),
    username: z.string().min(3).max(50).optional(),
    password: z.string().min(8).max(128),
  })
  .refine((d) => d.email || d.username, {
    message: "Either email or username must be provided",
  });

export const UserProfileUpdateSchema = z.object({
  displayName: z.string().max(100).nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
  website: z.string().url().max(255).nullable().optional(),
  location: z.string().max(100).nullable().optional(),
  birthDate: z.coerce.date().nullable().optional(),
  preferences: UserPreferencesSchema.partial().optional(),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;