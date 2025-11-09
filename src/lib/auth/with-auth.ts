import { type NextRequest, NextResponse } from "next/server";
import type { AuthResult } from "./server";
import { requireAuth, requirePermission, requirePermissions } from "./server";
import type { Permission } from "./permissions";

export type AuthenticatedRequest = NextRequest & {
  auth: AuthResult;
};

/**
 * Route handler с аутентификацией
 * context.params теперь обычный объект (не Promise)
 */
type RouteHandler = (
  request: NextRequest,
  context: { params: any },
  auth: AuthResult
) => Promise<NextResponse>;

/**
 * HOC для защиты route через аутентификацию
 */
export function withAuth(handler: RouteHandler) {
  return async (request: NextRequest, context: { params: any }) => {
    const authResult = await requireAuth(request);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    return handler(request, context, authResult);
  };
}

/**
 * HOC для защиты route через конкретное разрешение
 */
export function withPermission(permission: Permission, handler: RouteHandler) {
  return async (request: NextRequest, context: { params: any }) => {
    const authResult = await requirePermission(request, permission);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    return handler(request, context, authResult);
  };
}

/**
 * HOC для защиты route через множественные разрешения
 */
export function withPermissions(permissions: Permission[], handler: RouteHandler) {
  return async (request: NextRequest, context: { params: any }) => {
    const authResult = await requirePermissions(request, permissions);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    return handler(request, context, authResult);
  };
}
