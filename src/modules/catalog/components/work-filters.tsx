"use client";

import { useCallback } from "react";

interface WorkFiltersProps {
  type?: "manga" | "manhwa" | "manhua";
  status?: "upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled";
  onTypeChange: (type: "manga" | "manhwa" | "manhua" | undefined) => void;
  onStatusChange: (status: "upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled" | undefined) => void;
}

export function WorkFilters({ type, status, onTypeChange, onStatusChange }: WorkFiltersProps) {
  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onTypeChange(value === "all" ? undefined : value as "manga" | "manhwa" | "manhua");
  }, [onTypeChange]);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onStatusChange(value === "all" ? undefined : value as "upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled");
  }, [onStatusChange]);

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Type
        </label>
        <select
          id="type"
          value={type || "all"}
          onChange={handleTypeChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="all">All Types</option>
          <option value="manga">Manga</option>
          <option value="manhwa">Manhwa</option>
          <option value="manhua">Manhua</option>
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <select
          id="status"
          value={status || "all"}
          onChange={handleStatusChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="hiatus">Hiatus</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}
