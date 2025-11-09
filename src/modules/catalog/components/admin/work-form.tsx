"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminUIStore } from "@/stores/admin-ui.store";
import { useCreateWork, useUpdateWork } from "@/modules/catalog/hooks/admin";
import type { Work } from "../../schemas/work.schema";

interface WorkFormProps {
  work?: Work;
  mode: "create" | "edit";
}

export function WorkForm({ work, mode }: WorkFormProps) {
  const router = useRouter();
  const addNotification = useAdminUIStore((state) => state.addNotification);
  
  const createWork = useCreateWork();
  const updateWork = useUpdateWork();

  const [formData, setFormData] = useState({
    title: work?.title || "",
    slug: work?.slug || "",
    description: work?.description || "",
    type: work?.type || ("manga" as "manga" | "manhwa" | "manhua"),
    status: work?.status || ("upcoming" as "upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled"),
    coverUrl: work?.coverUrl || "",
    alternativeTitles: {
      english: work?.alternativeTitles?.english || "",
      romaji: work?.alternativeTitles?.romaji || "",
      native: work?.alternativeTitles?.native || ""
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: any = {
        title: formData.title,
        slug: formData.slug,
        type: formData.type,
        status: formData.status
      };

      if (formData.description) payload.description = formData.description;
      if (formData.coverUrl) payload.coverUrl = formData.coverUrl;
      
      const altTitles: any = {};
      if (formData.alternativeTitles.english) altTitles.english = formData.alternativeTitles.english;
      if (formData.alternativeTitles.romaji) altTitles.romaji = formData.alternativeTitles.romaji;
      if (formData.alternativeTitles.native) altTitles.native = formData.alternativeTitles.native;
      
      if (Object.keys(altTitles).length > 0) {
        payload.alternativeTitles = altTitles;
      }

      if (mode === "create") {
        await createWork.mutateAsync(payload);
        addNotification({
          type: "success",
          message: "Work created successfully!"
        });
      } else if (work) {
        await updateWork.mutateAsync({ id: work.id, data: payload });
        addNotification({
          type: "success",
          message: "Work updated successfully!"
        });
      }

      router.push("/admin/catalog/works");
    } catch (error: any) {
      addNotification({
        type: "error",
        message: error.message || "Failed to save work"
      });
    }
  };

  const isSubmitting = createWork.isPending || updateWork.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Basic Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm dark:border-gray-700 dark:bg-gray-800"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="manga">Manga</option>
                <option value="manhwa">Manhwa</option>
                <option value="manhua">Manhua</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="hiatus">Hiatus</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cover URL
            </label>
            <input
              type="url"
              value={formData.coverUrl}
              onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Alternative Titles
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              English Title
            </label>
            <input
              type="text"
              value={formData.alternativeTitles.english}
              onChange={(e) => setFormData({ 
                ...formData, 
                alternativeTitles: { ...formData.alternativeTitles, english: e.target.value }
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Romaji Title
            </label>
            <input
              type="text"
              value={formData.alternativeTitles.romaji}
              onChange={(e) => setFormData({ 
                ...formData, 
                alternativeTitles: { ...formData.alternativeTitles, romaji: e.target.value }
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Native Title
            </label>
            <input
              type="text"
              value={formData.alternativeTitles.native}
              onChange={(e) => setFormData({ 
                ...formData, 
                alternativeTitles: { ...formData.alternativeTitles, native: e.target.value }
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create Work" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
