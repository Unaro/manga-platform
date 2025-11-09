"use client";

import Link from "next/link";
import Image from "next/image";
import type { WorkSummary } from "../schemas/work.schema";

interface WorkCardProps {
  work: WorkSummary;
}

export function WorkCard({ work }: WorkCardProps) {
  return (
    <Link 
      href={`/catalog/${work.slug}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {work.coverUrl ? (
          <Image
            src={work.coverUrl}
            alt={work.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Cover
          </div>
        )}
        <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur">
          {work.type.toUpperCase()}
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 font-semibold text-gray-900 dark:text-white">
          {work.title}
        </h3>

        <div className="flex items-center justify-between text-sm">
          <span className={`rounded px-2 py-1 text-xs font-medium ${
            work.status === "ongoing" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
            work.status === "completed" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
          }`}>
            {work.status}
          </span>

          {work.statistics && work.statistics.averageRating > 0 && (
            <div className="flex items-center gap-1 text-yellow-500">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium">
                {work.statistics.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
