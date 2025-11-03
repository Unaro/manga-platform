import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { UserService } from '../../services/UserService';
import { SupabaseUserRepository } from '../../repositories/SupabaseUserRepository';

const RegisterSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8).max(128),
  displayName: z.string().max(100).nullable().optional(),
});

const LoginSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(8).max(128),
}).refine(d => d.email || d.username, { message: 'Either email or username must be provided' });

function ok<T>(data: T, status = 200) { return NextResponse.json({ success: true, data }, { status }); }
function fail(message: string, status = 400) { return NextResponse.json({ success: false, error: message }, { status }); }

const service = new UserService(new SupabaseUserRepository());

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  try {
    if (url.pathname.endsWith('/register')) {
      const body = await req.json();
      const parsed = RegisterSchema.safeParse(body);
      if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? 'Validation error', 400);

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

      const loginInput = {
        password: parsed.data.password,
        ...(parsed.data.email !== undefined && { email: parsed.data.email }),
        ...(parsed.data.username !== undefined && { username: parsed.data.username }),
      } as const;

      const result = await service.login(loginInput);
      return ok(result, 200);
    }

    return fail('Not Found', 404);
  } catch (e: unknown) {
    const err = e as { message?: string; status?: number };
    return fail(err.message ?? 'Internal Server Error', err.status ?? 500);
  }
}
