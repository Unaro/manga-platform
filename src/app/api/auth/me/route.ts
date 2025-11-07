import { NextResponse } from "next/server";
import { UserService } from "@/modules/users/services/user.service";
import { SupabaseUserRepository } from "@/modules/users/repositories/user.repository";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { eventBus } from "@/lib/events/event-bus";
import { type ApiResponse } from "@/lib/api/error-handler";
import { withAuth, type AuthenticatedRequest } from "@/lib/auth/with-auth";

/**
 * GET /api/auth/me
 * Получить информацию о текущем пользователе
 */
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const supabase = createServerSupabaseClient();
  const userRepo = new SupabaseUserRepository(supabase);
  const userService = new UserService(userRepo, eventBus);

  const user = await userService.getUserById(request.user.sub);

  const response: ApiResponse<typeof user> = {
    data: user,
    metadata: {
      timestamp: new Date(),
      requestId: crypto.randomUUID(),
    },
  };

  return NextResponse.json(response);
});
