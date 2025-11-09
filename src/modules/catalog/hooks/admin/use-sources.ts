"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Source } from "../../schemas/source.schema";

interface CreateSourceInput {
  name: string;
  slug: string;
  baseUrl: string;
  apiUrl?: string;
  type: "api" | "scraper" | "manual";
  isActive?: boolean;
  config?: Record<string, any>;
}

export function useSources() {
  return useQuery<{ sources: Source[] }>({
    queryKey: ["admin", "sources"],
    queryFn: async () => {
      const response = await fetch("/api/catalog/admin/sources");
      if (!response.ok) throw new Error("Failed to fetch sources");
      return response.json();
    }
  });
}

export function useCreateSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSourceInput) => {
      const response = await fetch("/api/catalog/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to create source");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sources"] });
    }
  });
}

export function useUpdateSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateSourceInput> }) => {
      const response = await fetch(`/api/catalog/admin/sources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to update source");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sources"] });
    }
  });
}

export function useDeleteSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/catalog/admin/sources/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete source");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sources"] });
    }
  });
}
