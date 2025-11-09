"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { WorkForm } from "@/modules/catalog/components/admin/work-form";
import type { Work } from "@/modules/catalog/schemas/work.schema";

export default function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data, isLoading, error } = useQuery<{ work: Work }>({
    queryKey: ["admin", "work", id],
    queryFn: async () => {
      const response = await fetch(`/api/catalog/admin/works/${id}`);
      if (!response.ok) throw new Error("Failed to fetch work");
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400">
        Loading work...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
        <p className="font-medium">Error loading work</p>
        <p className="text-sm">{error?.message || "Work not found"}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Edit Work
      </h1>
      <WorkForm work={data.work} mode="edit" />
    </div>
  );
}
