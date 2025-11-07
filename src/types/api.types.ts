import type { z } from "zod";

export interface ApiResult<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    timestamp: Date;
    requestId: string;
  };
}

export type ApiResponse<T> = Promise<ApiResult<T>>;

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}