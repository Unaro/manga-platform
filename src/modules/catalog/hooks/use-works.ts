"use client";

import { useQuery } from "@tanstack/react-query";
import type { WorkSummary } from "../schemas/work.schema";

interface UseWorksParams {
  page?: number;
  limit?: number;
  type?: "manga" | "manhwa" | "manhua";
  status?: "upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled";
  sort?: "createdAt" | "updatedAt" | "title" | "rating";
  order?: "asc" | "desc";
}

interface WorksResponse {
  works: WorkSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useWorks(params: UseWorksParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.type) queryParams.set("type", params.type);
  if (params.status) queryParams.set("status", params.status);
  if (params.sort) queryParams.set("sort", params.sort);
  if (params.order) queryParams.set("order", params.order);

  return useQuery<WorksResponse>({
    queryKey: ["works", params],
    queryFn: async () => {
      const response = await fetch(`/api/catalog/works?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch works");
      return response.json();
    }
  });
}
