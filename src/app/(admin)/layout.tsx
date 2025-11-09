"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCurrentUser } from "@/modules/users/hooks/use-user";
import { Notifications } from "@/components/notifications";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  // Проверка прав доступа: только админы
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner w-8 h-8 mb-4 mx-auto" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

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
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.username} (Admin)
              </span>
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Back to site
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <Notifications />
    </div>
  );
}