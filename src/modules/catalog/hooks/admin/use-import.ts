"use client";

import { useMutation } from "@tanstack/react-query";

export function useTestAdapter() {
  return useMutation({
    mutationFn: async ({ sourceId, query }: { sourceId: string; query?: string }) => {
      const response = await fetch("/api/catalog/admin/import/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId, query })
      });
      if (!response.ok) throw new Error("Adapter test failed");
      return response.json();
    }
  });
}

export function useImportWork() {
  return useMutation({
    mutationFn: async ({ sourceId, externalId }: { sourceId: string; externalId: string }) => {
      const response = await fetch("/api/catalog/admin/import/work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId, externalId })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Import failed");
      }
      return response.json();
    }
  });
}
