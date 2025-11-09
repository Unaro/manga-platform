"use client";

import { useState } from "react";
import Link from "next/link";
import { useWorks } from "@/modules/catalog/hooks";

export default function AdminWorksPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<"manga" | "manhwa" | "manhua" | undefined>();
  const [status, setStatus] = useState<"upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled" | undefined>();

  const { data, isLoading } = useWorks({
    page,
    limit: 20,
    ...(type && { type }),
    ...(status && { status }),
    sort: "createdAt",
    order: "desc"
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Works Management
        </h1>
        <Link
          href="/admin/catalog/works/create"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create Work
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <select
          value={type || "all"}
          onChange={(e) => {
            const value = e.target.value;
            setType(value === "all" ? undefined : value as any);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <option value="all">All Types</option>
          <option value="manga">Manga</option>
          <option value="manhwa">Manhwa</option>
          <option value="manhua">Manhua</option>
        </select>

        <select
          value={status || "all"}
          onChange={(e) => {
            const value = e.target.value;
            setStatus(value === "all" ? undefined : value as any);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <option value="all">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="hiatus">Hiatus</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>
      ) : (
        <>
          <div className="space-y-4">
            {data?.works.map((work) => (
              <div
                key={work.id}
                className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <Link
                        href={`/catalog/${work.slug}`}
                        className="text-xl font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                      >
                        {work.title}
                      </Link>
                      <span className={`rounded px-2 py-1 text-xs font-medium ${
                        work.status === "ongoing"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : work.status === "completed"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {work.status}
                      </span>
                      <span className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                        {work.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Slug: <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">{work.slug}</code></p>
                      {work.statistics && (
                        <p className="mt-1">
                          Rating: {work.statistics.averageRating.toFixed(1)} ({work.statistics.ratingCount} votes)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/catalog/works/${work.id}/edit`}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/catalog/${work.slug}`}
                      target="_blank"
                      className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data && data.pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {page} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page >= data.pagination.totalPages}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
