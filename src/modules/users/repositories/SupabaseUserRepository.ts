import { supabase } from '@/shared/database/supabaseClient';
import type { Database } from '@/shared/database/types';
import { User, RegisterInput, UserProfileUpdate } from '../types';
import { UserRepository } from './UserRepository';

// Тип строки users
type UserRow = Database['public']['Tables']['users']['Row'];

// Тип для аутентификации: доменная модель + хеш пароля
export type AuthUser = User & { passwordHash: string };

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

  async create(data: RegisterInput & { hashedPassword: string }): Promise<User> {
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
      preferences: {},
      stats: {},
      is_active: true,
      email_verified: false,
      last_active_at: null,
      password: data.hashedPassword,
    };

    const { data: row, error } = await supabase.from(this.table).insert(insert).select('*').single<UserRow>();
    if (error) throw error;
    return this.mapRowToDomain(row);
  }

  async update(id: string, data: UserProfileUpdate): Promise<User> {
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
      preferences: (row.preferences as Record<string, unknown>) ?? {},
      stats: (row.stats as Record<string, unknown>) ?? {},
      isActive: row.is_active,
      emailVerified: row.email_verified,
      lastActiveAt: row.last_active_at ? new Date(row.last_active_at) : null,
    };
  }
}
