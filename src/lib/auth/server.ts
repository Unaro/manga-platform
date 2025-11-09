import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { UserRole, Permission } from "./permissions";
import { hasPermission, hasAllPermissions } from "./permissions";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthResult {
  user: AuthenticatedUser;
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
}

export async function getAuthUser(request: NextRequest): Promise<AuthResult | NextResponse> {
  const supabase = await createServerSupabaseClient();
  
  // Supabase автоматически читает session из cookies
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "User profile not found" }, { status: 401 });
  }

  const authenticatedUser: AuthenticatedUser = {
    id: user.id,
    email: user.email!,
    role: profile.role
  };

  return { user: authenticatedUser, supabase };
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
