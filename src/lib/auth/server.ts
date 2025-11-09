import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { UserRole, Permission } from "./permissions";
import { hasPermission, hasAllPermissions } from "./permissions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  username: string;
}

export interface AuthResult {
  user: AuthenticatedUser;
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
}

export async function getAuthUser(request: NextRequest): Promise<AuthResult | NextResponse> {
  // Парсим JWT из cookie "token"
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    // Можно также создать Supabase client, если нужно для запроса данных
    const supabase = await createServerSupabaseClient();
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role, username")
      .eq("id", payload.sub)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 401 });
    }

    const authenticatedUser: AuthenticatedUser = {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      role: profile.role
    };

    return { user: authenticatedUser, supabase };
  } catch (error) {
    return NextResponse.json({ error: "Invalid auth token" }, { status: 401 });
  }
}

export async function requireAuth(request: NextRequest) {
  return getAuthUser(request);
}

export async function requirePermission(
  request: NextRequest, 
  permission: Permission
) {
  const result = await getAuthUser(request);
  
  if (result instanceof NextResponse) {
    return result;
  }

  const { user, supabase } = result;

  if (!hasPermission(user.role, permission)) {
    return NextResponse.json(
      { 
        error: "Forbidden", 
        message: `Permission '${permission}' required`,
        current_role: user.role
      }, 
      { status: 403 }
    );
  }

  return { user, supabase };
}

export async function requirePermissions(
  request: NextRequest, 
  permissions: Permission[]
) {
  const result = await getAuthUser(request);
  
  if (result instanceof NextResponse) {
    return result;
  }

  const { user, supabase } = result;

  if (!hasAllPermissions(user.role, permissions)) {
    return NextResponse.json(
      { 
        error: "Forbidden", 
        message: `Permissions required: ${permissions.join(", ")}`,
        current_role: user.role
      }, 
      { status: 403 }
    );
  }

  return { user, supabase };
}

// Backward compatibility
export async function requireAdmin(request: NextRequest) {
  return requirePermission(request, "users:write");
}

export async function requireRole(request: NextRequest, allowedRoles: UserRole[]) {
  const result = await getAuthUser(request);
  
  if (result instanceof NextResponse) {
    return result;
  }

  const { user, supabase } = result;

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { 
        error: "Forbidden", 
        message: "Insufficient permissions",
        required_roles: allowedRoles,
        current_role: user.role
      }, 
      { status: 403 }
    );
  }

  return { user, supabase };
}
