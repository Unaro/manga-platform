import { supabase } from '@/shared/database/supabaseClient';
import { User, RegisterInput, UserProfileUpdate } from '../types';
import { UserRepository } from './UserRepository';

export class SupabaseUserRepository implements UserRepository {
  private table = 'users';

  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from(this.table).select('*').eq('id', id).single();
    if (error) return null;
    return this.mapRowToDomain(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase.from(this.table).select('*').eq('email', email).single();
    if (error) return null;
    return this.mapRowToDomain(data);
  }

  async findByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase.from(this.table).select('*').eq('username', username).single();
    if (error) return null;
    return this.mapRowToDomain(data);
  }

  async create(data: RegisterInput & { hashedPassword: string }): Promise<User> {
    const insert = {
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
      password: data.hashedPassword,
    } as const;

    const { data: row, error } = await supabase.from(this.table).insert(insert).select('*').single();
    if (error) throw error;
    return this.mapRowToDomain(row);
  }

  async update(id: string, data: Partial<UserProfileUpdate>): Promise<User> {
    const update = {
      display_name: data.displayName,
      bio: data.bio,
      website: data.website,
      location: data.location,
      birth_date: data.birthDate ?? null,
      preferences: data.preferences ?? undefined,
    };
    const { data: row, error } = await supabase.from(this.table).update(update).eq('id', id).select('*').single();
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

  private mapRowToDomain(row: any): User {
    return {
      id: row.id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      email: row.email,
      username: row.username,
      displayName: row.display_name ?? undefined,
      avatar: row.avatar ?? undefined,
      role: row.role,
      bio: row.bio ?? undefined,
      website: row.website ?? undefined,
      location: row.location ?? undefined,
      birthDate: row.birth_date ? new Date(row.birth_date) : undefined,
      preferences: row.preferences ?? {},
      stats: row.stats ?? {},
      isActive: row.is_active,
      emailVerified: row.email_verified,
      lastActiveAt: row.last_active_at ? new Date(row.last_active_at) : undefined,
    };
  }
}
