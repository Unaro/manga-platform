"use client";

import { WorkForm } from "@/modules/catalog/components/admin/work-form";

export default function CreateWorkPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Create New Work
      </h1>
      <WorkForm mode="create" />
    </div>
  );
}
