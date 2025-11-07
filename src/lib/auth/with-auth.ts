import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractToken, type JwtPayload } from "./verify-token";
import { type ApiResponse } from "@/lib/api/error-handler";

export interface AuthenticatedRequest extends NextRequest {
  user: JwtPayload;
}

/**
 * Higher-order function для защиты API routes
 */
export function withAuth<T = unknown>(
  handler: (
    request: AuthenticatedRequest,
    context: any
  ) => Promise<NextResponse<ApiResponse<T>>>
) {
  return async (
    request: NextRequest,
    context: any
  ): Promise<NextResponse<ApiResponse<T | unknown>>> => {
    try {
      const authHeader = request.headers.get("authorization");
      const token = extractToken(authHeader);

      if (!token) {
        const error = new Error("No token provided");
        (error as any).status = 401;
        throw error;
      }

      const user = verifyToken(token);

      // Добавляем user к request
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = user;

      return await handler(authenticatedRequest, context);
    } catch (error) {
      // Создаем правильный error response
      const errorResponse: ApiResponse<unknown> = {
        error: {
          code: (error as any).code || "AUTH_ERROR",
          message: error instanceof Error ? error.message : "Authentication failed",
        },
        metadata: {
          timestamp: new Date(),
          requestId: crypto.randomUUID(),
        },
      };

      const status = (error as any).status || 401;
      return NextResponse.json(errorResponse, { status }) as NextResponse<ApiResponse<T | unknown>>;
    }
  };
}

/**
 * Проверяет роль пользователя
 */
export function requireRole(allowedRoles: string[]) {
  return (user: JwtPayload) => {
    if (!allowedRoles.includes(user.role)) {
      const error = new Error("Insufficient permissions");
      (error as any).status = 403;
      throw error;
    }
  };
}
