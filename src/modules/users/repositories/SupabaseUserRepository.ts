import { supabase } from '@/shared/database/supabaseClient';
import type { Database } from '@/shared/database/types';
import { User, UserPreferences, UserStats } from '../types';
import { UserRepository } from './UserRepository';

type UserRow = Database['public']['Tables']['users']['Row'];

type AuthUser = User & { passwordHash: string };

export class SupabaseUserRepository implements UserRepository {
  private table = 'users';

  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from(this.table).select('*').eq('id', id).single<UserRow>();
    if (error) return null;
    return this.mapRowToDomain(data);
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const { data, error } = await supabase.from(this.table).select('*').eq('email', email).single<UserRow>();
    if (error) return null;
    const user = this.mapRowToDomain(data);
    return { ...user, passwordHash: data.password };
  }

  async findByUsername(username: string): Promise<AuthUser | null> {
    const { data, error } = await supabase.from(this.table).select('*').eq('username', username).single<UserRow>();
    if (error) return null;
    const user = this.mapRowToDomain(data);
    return { ...user, passwordHash: data.password };
  }

  async create(data: { email: string; username: string; password: string; displayName?: string }): Promise<User> {
    const insert: Database['public']['Tables']['users']['Insert'] = {
      email: data.email,
      username: data.username,
      display_name: data.displayName ?? null,
      avatar: null,
      role: 'user',
      bio: null,
      website: null,
      location: null,
      birth_date: null,
      preferences: this.defaultPreferences(),
      stats: this.defaultStats(),
      is_active: true,
      email_verified: false,
      last_active_at: null,
      password: data.password,
    };

    const { data: row, error } = await supabase.from(this.table).insert(insert).select('*').single<UserRow>();
    if (error) throw error;
    return this.mapRowToDomain(row);
  }

  async update(id: string, data: Partial<Pick<User, 'displayName' | 'bio' | 'website' | 'location' | 'birthDate' | 'preferences'>>): Promise<User> {
    const update: Database['public']['Tables']['users']['Update'] = {
      display_name: data.displayName ?? null,
      bio: data.bio ?? null,
      website: data.website ?? null,
      location: data.location ?? null,
      birth_date: data.birthDate ? data.birthDate.toISOString() : null,
      preferences: data.preferences ?? undefined,
    };

    const { data: row, error } = await supabase.from(this.table).update(update).eq('id', id).select('*').single<UserRow>();
    if (error) throw error;
    return this.mapRowToDomain(row);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw error;
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const { count } = await supabase.from(this.table).select('*', { count: 'exact', head: true }).eq('email', email);
    return (count ?? 0) > 0;
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const { count } = await supabase.from(this.table).select('*', { count: 'exact', head: true }).eq('username', username);
    return (count ?? 0) > 0;
  }

  private mapRowToDomain(row: UserRow): User {
    return {
      id: row.id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      email: row.email,
      username: row.username,
      displayName: row.display_name,
      avatar: row.avatar,
      role: row.role,
      bio: row.bio,
      website: row.website,
      location: row.location,
      birthDate: row.birth_date ? new Date(row.birth_date) : null,
      preferences: this.parsePreferences(row.preferences),
      stats: this.parseStats(row.stats),
      isActive: row.is_active,
      emailVerified: row.email_verified,
      lastActiveAt: row.last_active_at ? new Date(row.last_active_at) : null,
    };
  }

  private defaultPreferences(): UserPreferences {
    return {
      language: 'ru',
      timezone: 'UTC',
      theme: 'auto',
      compactMode: false,
      profilePublic: true,
      showEmail: false,
      showStats: true,
      notifications: {
        email: true,
        browser: true,
        extension: false,
        newChapters: true,
        cardReceived: true,
        achievements: true,
        tradeRequests: true,
        auctionUpdates: true,
      },
    };
  }

  private defaultStats(): UserStats {
    return {
      totalWorksRead: 0,
      totalChaptersRead: 0,
      totalReadingTime: 0,
      averageRating: 0,
      level: 1,
      experience: 0,
      currency: 0,
      totalCards: 0,
      uniqueCards: 0,
      rareCards: 0,
      achievementsUnlocked: 0,
      tradesCompleted: 0,
      auctionsWon: 0,
    };
  }

  private parsePreferences(raw: UserRow['preferences']): UserPreferences {
    // raw уже тип UserPreferences (строгий), но защищаемся от возможных рассинхронизаций
    const base = this.defaultPreferences();
    const obj = (raw ?? base) as Partial<UserPreferences>;
    return {
      language: obj.language ?? base.language,
      timezone: obj.timezone ?? base.timezone,
      theme: obj.theme ?? base.theme,
      compactMode: obj.compactMode ?? base.compactMode,
      profilePublic: obj.profilePublic ?? base.profilePublic,
      showEmail: obj.showEmail ?? base.showEmail,
      showStats: obj.showStats ?? base.showStats,
      notifications: { ...base.notifications, ...(obj.notifications ?? {}) },
    };
  }

  private parseStats(raw: UserRow['stats']): UserStats {
    const base = this.defaultStats();
    const obj = (raw ?? base) as Partial<UserStats>;
    return {
      totalWorksRead: obj.totalWorksRead ?? base.totalWorksRead,
      totalChaptersRead: obj.totalChaptersRead ?? base.totalChaptersRead,
      totalReadingTime: obj.totalReadingTime ?? base.totalReadingTime,
      averageRating: obj.averageRating ?? base.averageRating,
      level: obj.level ?? base.level,
      experience: obj.experience ?? base.experience,
      currency: obj.currency ?? base.currency,
      totalCards: obj.totalCards ?? base.totalCards,
      uniqueCards: obj.uniqueCards ?? base.uniqueCards,
      rareCards: obj.rareCards ?? base.rareCards,
      achievementsUnlocked: obj.achievementsUnlocked ?? base.achievementsUnlocked,
      tradesCompleted: obj.tradesCompleted ?? base.tradesCompleted,
      auctionsWon: obj.auctionsWon ?? base.auctionsWon,
    };
  }
}
