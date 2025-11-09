"use client";

import { WorkCard } from "./work-card";
import type { WorkSummary } from "../schemas/work.schema";

interface WorkListProps {
  works: WorkSummary[];
  loading?: boolean;
  error?: string | null;
}

export function WorkList({ works, loading = false, error = null }: WorkListProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
        <p className="font-medium">Error loading works</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-800" />
            <div className="p-4">
              <div className="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (works.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">No works found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {works.map((work) => (
        <WorkCard key={work.id} work={work} />
      ))}
    </div>
  );
}
