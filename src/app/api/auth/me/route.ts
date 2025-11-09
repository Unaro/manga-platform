import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/with-auth";

/**
 * GET /api/auth/me — всегда возвращает { user: ... } или { user: null }
 */
export const GET = withAuth(async (request, context, { user, supabase }) => {
  try {
    const { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      // Возвращаем пустой объект, а не undefined
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ 
      user: {
        id: profile.id,
        email: profile.email,
        username: profile.username,
        displayName: profile.display_name,
        avatar: profile.avatar,
        role: profile.role,
        createdAt: profile.created_at
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { user: null, error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
});
