import { NextRequest, NextResponse } from "next/server";
import { withAuth, withPermission } from "@/lib/auth/with-auth";

/**
 * GET /api/users/:id
 * Получение публичного профиля пользователя
 */
export const GET = withAuth(async (request, context, { supabase }) => {
  try {
    const { id } = context.params;

    const { data: profile, error } = await supabase
      .from("users")
      .select("id, username, display_name, avatar, bio, created_at")
      .eq("id", id)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: profile });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/users/:id
 * Обновление профиля пользователя
 */
export const PUT = withPermission("users:write", async (request, context, { user, supabase }) => {
  try {
    const { id } = context.params;

    // Users can only edit their own profile unless they have users:write permission
    if (user.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    
    const { data, error } = await supabase
      .from("users")
      .update({
        display_name: body.displayName,
        bio: body.bio,
        avatar: body.avatar,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ user: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/users/:id
 * Удаление пользователя (только для администраторов)
 */
export const DELETE = withPermission("users:delete", async (request, context, { supabase }) => {
  try {
    const { id } = context.params;

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
});
