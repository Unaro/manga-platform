"use client";

import { useState } from "react";

type MetadataType = "authors" | "genres" | "tags";

export default function MetadataPage() {
  const [activeTab, setActiveTab] = useState<MetadataType>("authors");

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Metadata Management
      </h1>

      <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("authors")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "authors"
              ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Authors
        </button>
        <button
          onClick={() => setActiveTab("genres")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "genres"
              ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Genres
        </button>
        <button
          onClick={() => setActiveTab("tags")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "tags"
              ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Tags
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        {activeTab === "authors" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Authors
              </h2>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                + Add Author
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Author management interface coming soon...
            </p>
          </div>
        )}

        {activeTab === "genres" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Genres
              </h2>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                + Add Genre
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Genre management interface coming soon...
            </p>
          </div>
        )}

        {activeTab === "tags" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Tags
              </h2>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                + Add Tag
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Tag management interface coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
