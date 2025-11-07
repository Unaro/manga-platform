import { z } from 'zod';

/** DTO входа для регистрации пользователя. */
export const RegisterInputSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8).max(128),
  displayName: z.string().max(100).nullable().optional(),
});
export type RegisterInputDTO = z.infer<typeof RegisterInputSchema>;

/** DTO входа для логина пользователя. */
export const LoginInputSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(8).max(128),
}).refine(d => d.email || d.username, { message: 'Either email or username must be provided' });
export type LoginInputDTO = z.infer<typeof LoginInputSchema>;

/** DTO обновления профиля пользователя. */
export const UserProfileUpdateSchema = z.object({
  displayName: z.string().max(100).nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
  website: z.string().url().max(255).nullable().optional(),
  location: z.string().max(100).nullable().optional(),
  birthDate: z.coerce.date().nullable().optional(),
});
export type UserProfileUpdateDTO = z.infer<typeof UserProfileUpdateSchema>;
