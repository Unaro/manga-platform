import { NextRequest, NextResponse } from "next/server";
import { RegisterInputSchema } from "@/modules/users/schemas/user.schema";
import { UserService } from "@/modules/users/services/user.service";
import { SupabaseUserRepository } from "@/modules/users/repositories/user.repository";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { eventBus } from "@/lib/events/event-bus";
import { handleApiError, type ApiResponse } from "@/lib/api/error-handler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = RegisterInputSchema.parse(body);

    const supabase = createServerSupabaseClient();
    const userRepo = new SupabaseUserRepository(supabase);
    const userService = new UserService(userRepo, eventBus);

    const result = await userService.register(input);

    const response: ApiResponse<typeof result> = {
      data: result,
      metadata: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
