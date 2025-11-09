"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateWorkInput {
  title: string;
  slug: string;
  description?: string;
  type: "manga" | "manhwa" | "manhua";
  status: "upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled";
  coverUrl?: string;
  alternativeTitles?: {
    english?: string;
    romaji?: string;
    native?: string;
  };
}

export function useCreateWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWorkInput) => {
      const response = await fetch("/api/catalog/admin/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create work");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["works"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "works"] });
    }
  });
}

export function useUpdateWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateWorkInput> }) => {
      const response = await fetch(`/api/catalog/admin/works/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update work");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["works"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "work", variables.id] });
    }
  });
}

export function useDeleteWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/catalog/admin/works/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete work");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["works"] });
    }
  });
}
