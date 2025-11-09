"use client";

import { useState } from "react";
import { useSources, useCreateSource, useDeleteSource } from "@/modules/catalog/hooks/admin";

export default function SourcesPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    baseUrl: "",
    apiUrl: "",
    type: "api" as "api" | "scraper" | "manual"
  });

  const { data, isLoading } = useSources();
  const createSource = useCreateSource();
  const deleteSource = useDeleteSource();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSource.mutateAsync(formData);
      setFormData({ name: "", slug: "", baseUrl: "", apiUrl: "", type: "api" });
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this source?")) return;
    try {
      await deleteSource.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sources Management
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ Add Source"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Add New Source
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Base URL
              </label>
              <input
                type="url"
                value={formData.baseUrl}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                API URL (optional)
              </label>
              <input
                type="url"
                value={formData.apiUrl}
                onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="api">API</option>
                <option value="scraper">Scraper</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={createSource.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {createSource.isPending ? "Creating..." : "Create Source"}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-4">
          {data?.sources.map((source) => (
            <div
              key={source.id}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {source.name}
                    </h3>
                    <span className={`rounded px-2 py-1 text-xs font-medium ${
                      source.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {source.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {source.type}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>Slug: <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">{source.slug}</code></p>
                    <p>Base URL: <a href={source.baseUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">{source.baseUrl}</a></p>
                    {source.apiUrl && (
                      <p>API URL: <a href={source.apiUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">{source.apiUrl}</a></p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(source.id)}
                  disabled={deleteSource.isPending}
                  className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
