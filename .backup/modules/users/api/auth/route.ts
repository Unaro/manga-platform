import { type NextRequest, NextResponse } from 'next/server';
import { RegisterInputSchema, LoginInputSchema } from '../../api/dto';
import { UserService } from '../../services/UserService';
import { SupabaseUserRepository } from '../../repositories/SupabaseUserRepository';

function ok<T>(data: T, status = 200) { return NextResponse.json({ success: true, data }, { status }); }
function fail(message: string, status = 400) { return NextResponse.json({ success: false, error: message }, { status }); }

const service = new UserService(new SupabaseUserRepository());

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  try {
    if (url.pathname.endsWith('/register')) {
      const body = await req.json();
      const parsed = RegisterInputSchema.safeParse(body);
      if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? 'Validation error', 400);

      const input = parsed.data;
      const registerInput = {
        email: input.email,
        username: input.username,
        password: input.password,
        ...(input.displayName !== null && input.displayName !== undefined && { displayName: input.displayName }),
      } as const;

      const result = await service.register(registerInput);
      return ok(result, 201);
    }

    if (url.pathname.endsWith('/login')) {
      const body = await req.json();
      const parsed = LoginInputSchema.safeParse(body);
      if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? 'Validation error', 400);

      const input = parsed.data;
      const loginInput = {
        password: input.password,
        ...(input.email !== undefined && { email: input.email }),
        ...(input.username !== undefined && { username: input.username }),
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
