import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/modules/users/services/user.service";
import { SupabaseUserRepository } from "@/modules/users/repositories/user.repository";
import { UserProfileUpdateSchema } from "@/modules/users/schemas/user.schema";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { eventBus } from "@/lib/events/event-bus";
import { handleApiError, type ApiResponse } from "@/lib/api/error-handler";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const supabase = createServerSupabaseClient();
    const userRepo = new SupabaseUserRepository(supabase);
    const userService = new UserService(userRepo, eventBus);

    const user = await userService.getUserById(id);

    const response: ApiResponse<typeof user> = {
      data: user,
      metadata: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const input = UserProfileUpdateSchema.parse(body);

    const supabase = createServerSupabaseClient();
    const userRepo = new SupabaseUserRepository(supabase);
    const userService = new UserService(userRepo, eventBus);

    const user = await userService.updateProfile(id, input);

    const response: ApiResponse<typeof user> = {
      data: user,
      metadata: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}