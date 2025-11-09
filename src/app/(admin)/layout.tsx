import Link from "next/link";
import { AdminNotifications } from "@/components/admin-notifications";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                Manga Platform
              </Link>
              <div className="flex gap-4">
                <Link
                  href="/admin"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/catalog"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Catalog
                </Link>
              </div>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <AdminNotifications />
    </div>
  );
}
