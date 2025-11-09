"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useWorks } from "@/modules/catalog/hooks";
import { WorkList, WorkFilters } from "@/modules/catalog/components";

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const type = searchParams.get("type") as "manga" | "manhwa" | "manhua" || undefined;
  const status = searchParams.get("status") as "upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled" || undefined;

  const { data, isLoading, error } = useWorks({
    page,
    limit: 20,
    ...(type && { type }),
    ...(status && { status }),
    sort: "createdAt",
    order: "desc"
  });

  const updateFilters = (params: { type?: string | undefined; status?: string | undefined; page?: number | undefined }) => {
    const current = new URLSearchParams(searchParams.toString());
    
    if (params.type !== undefined) {
      if (params.type) current.set("type", params.type);
      else current.delete("type");
      current.set("page", "1");
    }
    
    if (params.status !== undefined) {
      if (params.status) current.set("status", params.status);
      else current.delete("status");
      current.set("page", "1");
    }
    
    if (params.page !== undefined && params.page) {
      current.set("page", params.page.toString());
    }

    router.push(`/catalog?${current.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Catalog
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse manga, manhwa, and manhua
        </p>
      </div>

      <div className="mb-6">
        <WorkFilters
          {...(type && { type })}
          {...(status && { status })}
          onTypeChange={(t) => updateFilters({ type: t })}
          onStatusChange={(s) => updateFilters({ status: s })}
        />
      </div>

      <WorkList
        works={data?.works ?? []}
        loading={isLoading}
        error={error?.message ?? null}
      />

      {data && data.pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => updateFilters({ page: Math.max(1, page - 1) })}
            disabled={page === 1}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {page} of {data.pagination.totalPages}
          </span>
          
          <button
            onClick={() => updateFilters({ page: Math.min(data.pagination.totalPages, page + 1) })}
            disabled={page >= data.pagination.totalPages}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
