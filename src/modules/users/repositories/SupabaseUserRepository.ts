import { supabase } from '@/shared/database/supabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/shared/database/generated.types';
import { User, UserPreferences, UserStats } from '../types';
import { UserRepository } from './UserRepository';

type UserRow = Tables<'users'>;
type UserInsert = TablesInsert<'users'>;
type UserUpdate = TablesUpdate<'users'>;

/** Пользователь с хешем пароля для аутентификации. */
type AuthUser = User & { passwordHash: string };

export class SupabaseUserRepository implements UserRepository {
  private table = 'users' as const;

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
    const insert: UserInsert = {
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
    const update: UserUpdate = {
      display_name: data.displayName ?? null,
      bio: data.bio ?? null,
      website: data.website ?? null,
      location: data.location ?? null,
      birth_date: data.birthDate ? data.birthDate.toISOString() : null,
      ...(data.preferences !== undefined && { preferences: data.preferences }),
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

  /** Возвращает настройки пользователя по умолчанию. */
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

  /** Возвращает статистику пользователя по умолчанию. */
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

  /** Парсит JSONB preferences из БД в строгий доменный тип UserPreferences. */
  private parsePreferences(raw: unknown): UserPreferences {
    const base = this.defaultPreferences();
    if (!raw || typeof raw !== 'object') return base;
    
    const obj = raw as Record<string, unknown>;
    return {
      language: typeof obj.language === 'string' ? obj.language : base.language,
      timezone: typeof obj.timezone === 'string' ? obj.timezone : base.timezone,
      theme: (obj.theme === 'light' || obj.theme === 'dark' || obj.theme === 'auto') ? obj.theme : base.theme,
      compactMode: typeof obj.compactMode === 'boolean' ? obj.compactMode : base.compactMode,
      profilePublic: typeof obj.profilePublic === 'boolean' ? obj.profilePublic : base.profilePublic,
      showEmail: typeof obj.showEmail === 'boolean' ? obj.showEmail : base.showEmail,
      showStats: typeof obj.showStats === 'boolean' ? obj.showStats : base.showStats,
      notifications: {
        ...base.notifications,
        ...(typeof obj.notifications === 'object' && obj.notifications
          ? this.parseNotificationSettings(obj.notifications as Record<string, unknown>, base.notifications)
          : {}),
      },
    };
  }

  /** Парсит JSONB stats из БД в строгий доменный тип UserStats. */
  private parseStats(raw: unknown): UserStats {
    const base = this.defaultStats();
    if (!raw || typeof raw !== 'object') return base;
    
    const obj = raw as Record<string, unknown>;
    const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
    
    return {
      totalWorksRead: num(obj.totalWorksRead, base.totalWorksRead),
      totalChaptersRead: num(obj.totalChaptersRead, base.totalChaptersRead),
      totalReadingTime: num(obj.totalReadingTime, base.totalReadingTime),
      averageRating: num(obj.averageRating, base.averageRating),
      level: num(obj.level, base.level),
      experience: num(obj.experience, base.experience),
      currency: num(obj.currency, base.currency),
      totalCards: num(obj.totalCards, base.totalCards),
      uniqueCards: num(obj.uniqueCards, base.uniqueCards),
      rareCards: num(obj.rareCards, base.rareCards),
      achievementsUnlocked: num(obj.achievementsUnlocked, base.achievementsUnlocked),
      tradesCompleted: num(obj.tradesCompleted, base.tradesCompleted),
      auctionsWon: num(obj.auctionsWon, base.auctionsWon),
    };
  }

  /** Парсит настройки уведомлений из JSONB. */
  private parseNotificationSettings(obj: Record<string, unknown>, base: UserPreferences['notifications']): UserPreferences['notifications'] {
    const bool = (v: unknown, d: boolean) => (typeof v === 'boolean' ? v : d);
    return {
      email: bool(obj.email, base.email),
      browser: bool(obj.browser, base.browser),
      extension: bool(obj.extension, base.extension),
      newChapters: bool(obj.newChapters, base.newChapters),
      cardReceived: bool(obj.cardReceived, base.cardReceived),
      achievements: bool(obj.achievements, base.achievements),
      tradeRequests: bool(obj.tradeRequests, base.tradeRequests),
      auctionUpdates: bool(obj.auctionUpdates, base.auctionUpdates),
    };
  }
}
