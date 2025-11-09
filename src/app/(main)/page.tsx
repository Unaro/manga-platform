import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
          Manga Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Your gateway to manga, manhwa, and manhua
        </p>
      </div>

      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          For Readers
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/catalog"
            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Browse Catalog
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Explore thousands of manga, manhwa, and manhua
            </p>
          </Link>

          <div className="block rounded-lg border border-gray-200 bg-white p-6 opacity-50 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              My Library (Soon)
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track your reading progress and bookmarks
            </p>
          </div>

          <div className="block rounded-lg border border-gray-200 bg-white p-6 opacity-50 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Collections (Soon)
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Build your card collection and compete
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          For Administrators
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/admin"
            className="block rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-blue-900/20"
          >
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              ⚙️ Admin Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage catalog, users, and platform settings
            </p>
          </Link>

          <Link
            href="/admin/catalog"
            className="block rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-blue-900/20"
          >
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Catalog Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Direct access to works, sources, and import tools
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
