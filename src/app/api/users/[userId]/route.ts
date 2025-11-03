import { NextRequest, NextResponse } from 'next/server';
import { SupabaseUserRepository } from '@/modules/users/repositories/SupabaseUserRepository';

interface Context {
  params: {
    userId: string;
  };
}

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { userId } = params;
    
    // Валидация UUID
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID format' }, { status: 400 });
    }

    const repository = new SupabaseUserRepository();
    const user = await repository.findById(userId);
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (e: unknown) {
    const err = e as { message?: string; status?: number; stack?: string };
    if (process.env.NODE_ENV !== 'production') {
      console.error('[API /users/:id] error', { message: err.message, status: err.status, stack: err.stack });
    }
    return NextResponse.json(
      { success: false, error: err.message ?? 'Internal Server Error' },
      { status: err.status ?? 500 }
    );
  }
}
