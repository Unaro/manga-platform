import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  metadata?: {
    timestamp: Date;
    requestId: string;
  };
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error("[API Error]", error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input data",
          details: error.errors,
        },
        metadata: {
          timestamp: new Date(),
          requestId: crypto.randomUUID(),
        },
      },
      { status: 400 }
    );
  }

  if (error instanceof Error && "status" in error) {
    const status = (error as any).status || 500;
    return NextResponse.json(
      {
        error: {
          code: error.name || "ERROR",
          message: error.message,
        },
        metadata: {
          timestamp: new Date(),
          requestId: crypto.randomUUID(),
        },
      },
      { status }
    );
  }

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      metadata: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
      },
    },
    { status: 500 }
  );
}