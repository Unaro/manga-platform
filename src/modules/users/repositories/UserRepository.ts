import type { User } from '../types';

/** Контракт репозитория пользователей (доменный уровень). */
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<(User & { passwordHash: string }) | null>;
  findByUsername(username: string): Promise<(User & { passwordHash: string }) | null>;
  create(data: { email: string; username: string; password: string; displayName?: string }): Promise<User>;
  update(id: string, data: Partial<Pick<User, 'displayName' | 'bio' | 'website' | 'location' | 'birthDate' | 'preferences'>>): Promise<User>;
  delete(id: string): Promise<void>;
  isEmailTaken(email: string): Promise<boolean>;
  isUsernameTaken(username: string): Promise<boolean>;
}
