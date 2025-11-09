import Link from "next/link";

export default function AdminCatalogPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Catalog Management
        </h1>
        <Link
          href="/catalog"
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          View Public Catalog →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/admin/catalog/works"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage manga, manhwa, and manhua entries
          </p>
        </Link>

        <Link
          href="/admin/catalog/sources"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Sources
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configure external data sources and adapters
          </p>
        </Link>

        <Link
          href="/admin/catalog/import"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Import
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Import works from external sources
          </p>
        </Link>

        <Link
          href="/admin/catalog/metadata"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Metadata
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage authors, genres, and tags
          </p>
        </Link>
      </div>
    </div>
  );
}
