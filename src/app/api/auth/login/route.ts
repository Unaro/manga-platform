import { NextRequest, NextResponse } from "next/server";
import { LoginInputSchema } from "@/modules/users/schemas/user.schema";
import { UserService } from "@/modules/users/services/user.service";
import { SupabaseUserRepository } from "@/modules/users/repositories/user.repository";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { eventBus } from "@/lib/events/event-bus";
import { handleApiError, type ApiResponse } from "@/lib/api/error-handler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = LoginInputSchema.parse(body);

    const supabase = await createServerSupabaseClient();
    const userRepo = new SupabaseUserRepository(supabase);
    const userService = new UserService(userRepo, eventBus);

    const result = await userService.login(input);

    const response = NextResponse.json({
      data: result,
      metadata: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
      },
    });

    // Устанавливаем httpOnly cookie с JWT
    response.cookies.set("token", result.token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
