import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/catalog"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Catalog Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage works, sources, and import data from external APIs
          </p>
        </Link>

        <div className="block rounded-lg border border-gray-200 bg-white p-6 opacity-50 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Users (Coming Soon)
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            User management, roles, and permissions
          </p>
        </div>

        <div className="block rounded-lg border border-gray-200 bg-white p-6 opacity-50 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Analytics (Coming Soon)
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Platform statistics and insights
          </p>
        </div>
      </div>
    </div>
  );
}
