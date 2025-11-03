import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { UserService } from '../../services/UserService';
import { SupabaseUserRepository } from '../../repositories/SupabaseUserRepository';

const RegisterSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8).max(128),
  displayName: z.string().max(100).optional(),
});

const LoginSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(8).max(128),
}).refine(data => data.email || data.username, { message: 'Either email or username must be provided' });

function success<T>(data: T, status = 200) { return NextResponse.json({ success: true, data }, { status }); }
function failure(message: string, status = 400) { return NextResponse.json({ success: false, error: message }, { status }); }

const service = new UserService(new SupabaseUserRepository());

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  try {
    if (pathname.endsWith('/register')) {
      const body = await req.json();
      const parsed = RegisterSchema.safeParse(body);
      if (!parsed.success) return failure(parsed.error.errors[0]?.message ?? 'Validation error', 400);
      const result = await service.register(parsed.data);
      return success(result, 201);
    }

    if (pathname.endsWith('/login')) {
      const body = await req.json();
      const parsed = LoginSchema.safeParse(body);
      if (!parsed.success) return failure(parsed.error.errors[0]?.message ?? 'Validation error', 400);
      const result = await service.login(parsed.data);
      return success(result, 200);
    }

    return failure('Not Found', 404);
  } catch (e: unknown) {
    const err = e as { message: string; status?: number };
    return failure(err.message || 'Internal Server Error', err.status ?? 500);
  }
}
