// Users Repository Interface
import { User, RegisterInput, UserProfileUpdate } from '../types';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(data: RegisterInput & { hashedPassword: string }): Promise<User>;
  update(id: string, data: Partial<UserProfileUpdate>): Promise<User>;
  delete(id: string): Promise<void>;
  isEmailTaken(email: string): Promise<boolean>;
  isUsernameTaken(username: string): Promise<boolean>;
}

// Supabase Implementation placeholder
export class SupabaseUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    throw new Error('Not implemented yet');
  }

  async findByEmail(email: string): Promise<User | null> {
    throw new Error('Not implemented yet');
  }

  async findByUsername(username: string): Promise<User | null> {
    throw new Error('Not implemented yet');
  }

  async create(data: RegisterInput & { hashedPassword: string }): Promise<User> {
    throw new Error('Not implemented yet');
  }

  async update(id: string, data: Partial<UserProfileUpdate>): Promise<User> {
    throw new Error('Not implemented yet');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Not implemented yet');
  }

  async isEmailTaken(email: string): Promise<boolean> {
    throw new Error('Not implemented yet');
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    throw new Error('Not implemented yet');
  }
}
