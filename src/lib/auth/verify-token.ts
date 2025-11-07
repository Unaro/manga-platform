import jwt from "jsonwebtoken";

export interface JwtPayload {
  sub: string; // user id
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Верифицирует JWT токен и возвращает payload
 */
export function verifyToken(token: string): JwtPayload {
  try {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const payload = jwt.verify(token, secret) as JwtPayload;
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const err = new Error("Token has expired");
      (err as any).status = 401;
      (err as any).code = "TOKEN_EXPIRED";
      throw err;
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      const err = new Error("Invalid token");
      (err as any).status = 401;
      (err as any).code = "INVALID_TOKEN";
      throw err;
    }
    
    throw error;
  }
}

/**
 * Извлекает токен из Authorization header
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  
  // Явно возвращаем string | null вместо string | undefined
  const token = parts[1];
  return token ?? null;
}
