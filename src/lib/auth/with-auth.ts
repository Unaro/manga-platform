import { NextRequest, NextResponse } from "next/server";
import type { AuthResult } from "./server";
import { requireAuth, requirePermission, requirePermissions } from "./server";
import type { Permission } from "./permissions";

export type AuthenticatedRequest = NextRequest & {
  auth: AuthResult;
};

type RouteHandler = (
  request: NextRequest,
  context: { params: Promise<any> },
  auth: AuthResult
) => Promise<NextResponse>;

export function withAuth(handler: RouteHandler) {
  return async (request: NextRequest, context: { params: Promise<any> }) => {
    const authResult = await requireAuth(request);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    return handler(request, context, authResult);
  };
}

export function withPermission(permission: Permission, handler: RouteHandler) {
  return async (request: NextRequest, context: { params: Promise<any> }) => {
    const authResult = await requirePermission(request, permission);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    return handler(request, context, authResult);
  };
}

export function withPermissions(permissions: Permission[], handler: RouteHandler) {
  return async (request: NextRequest, context: { params: Promise<any> }) => {
    const authResult = await requirePermissions(request, permissions);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    return handler(request, context, authResult);
  };
}
