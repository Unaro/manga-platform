"use client";

import { useQuery } from "@tanstack/react-query";
import type { WorkWithRelations } from "../schemas/work.schema";

interface WorkResponse {
  work: WorkWithRelations;
  statistics: {
    viewCount: number;
    ratingCount: number;
    averageRating: number;
    bookmarkCount: number;
    chapterCount: number;
  };
}

export function useWork(slug: string) {
  return useQuery<WorkResponse>({
    queryKey: ["work", slug],
    queryFn: async () => {
      const response = await fetch(`/api/catalog/works/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch work");
      return response.json();
    },
    enabled: !!slug
  });
}
