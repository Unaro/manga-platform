import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { UserService } from '@/modules/users/services/UserService';
import { SupabaseUserRepository } from '@/modules/users/repositories/SupabaseUserRepository';
import { InMemoryEventBus } from '@/modules/users/events';

const loginSchema = z
  .object({
    email: z.string().email().optional(),
    username: z.string().min(3).optional(),
    password: z.string().min(6),
  })
  .refine((d) => d.email || d.username, {
    message: 'Either email or username is required',
    path: ['email'],
  });

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = loginSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const service = new UserService(new SupabaseUserRepository(), new InMemoryEventBus());
    const result = await service.login(parsed.data);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (e: unknown) {
    const err = e as { message?: string; status?: number; stack?: string };
    if (process.env.NODE_ENV !== 'production') {
      console.error('[API /auth/login] error', { message: err.message, status: err.status, stack: err.stack });
    }
    return NextResponse.json(
      { success: false, error: err.message ?? 'Internal Server Error' },
      { status: err.status ?? 500 }
    );
  }
}
