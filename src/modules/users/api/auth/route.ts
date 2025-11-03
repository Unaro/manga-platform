import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { UserService } from '../../services/UserService';
import { SupabaseUserRepository } from '../../repositories/SupabaseUserRepository';

/** Валидация регистрации с учётом exactOptionalPropertyTypes. */
const RegisterSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8).max(128),
  // ВАЖНО: делаем поле nullable, чтобы не было undefined при отсутствии
  displayName: z.string().max(100).nullable().optional(),
});

/** Валидация логина (email ИЛИ username) + пароль. */
const LoginSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(8).max(128),
}).refine(d => d.email || d.username, { message: 'Either email or username must be provided' });

function ok<T>(data: T, status = 200) { return NextResponse.json({ success: true, data }, { status }); }
function fail(message: string, status = 400) { return NextResponse.json({ success: false, error: message }, { status }); }

const service = new UserService(new SupabaseUserRepository());

/**
 * Универсальный POST обработчик для /api/auth/{register|login}
 * Разбирает pathname и вызывает соответствующий use-case.
 */
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  try {
    if (url.pathname.endsWith('/register')) {
      const body = await req.json();
      const parsed = RegisterSchema.safeParse(body);
      if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? 'Validation error', 400);

      // Преобразуем nullable displayName в корректный RegisterInput без undefined
      const registerInput = {
        email: parsed.data.email,
        username: parsed.data.username,
        password: parsed.data.password,
        ...(parsed.data.displayName !== null && parsed.data.displayName !== undefined && { displayName: parsed.data.displayName }),
      } as const;

      const result = await service.register(registerInput);
      return ok(result, 201);
    }

    if (url.pathname.endsWith('/login')) {
      const body = await req.json();
      const parsed = LoginSchema.safeParse(body);
      if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? 'Validation error', 400);
      const result = await service.login(parsed.data);
      return ok(result, 200);
    }

    return fail('Not Found', 404);
  } catch (e: unknown) {
    // Нормализация ошибок с unknown: приводим к ожидаемому формату
    const err = e as { message?: string; status?: number };
    return fail(err.message ?? 'Internal Server Error', err.status ?? 500);
  }
}
