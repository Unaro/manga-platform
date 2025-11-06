"use client";

import { useCurrentUser } from "@/modules/users/hooks/use-user";
import { useLogout } from "@/modules/users/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: user, isLoading, error } = useCurrentUser();
  const logout = useLogout();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Исправление hydration - ждем монтирования на клиенте
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && (error || !user)) {
      router.push("/auth/login");
    }
  }, [mounted, isLoading, error, user, router]);

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.push("/");
  };

  // Не рендерим ничего пока не смонтировано (избегаем hydration mismatch)
  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner w-8 h-8 mb-4 mx-auto" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user.displayName || user.username}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-destructive"
            disabled={logout.isPending}
          >
            {logout.isPending ? (
              <>
                <span className="spinner mr-2" />
                Logging out...
              </>
            ) : (
              "Logout"
            )}
          </button>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-lg font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Username</p>
              <p className="text-lg font-medium text-gray-900">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Role</p>
              <p className="text-lg font-medium text-gray-900 capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Account Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Statistics</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Level</p>
                  <p className="text-3xl font-bold">{user.stats.level}</p>
                </div>
                <div className="text-4xl">Level</div>
              </div>
              <div className="mt-2">
                <div className="bg-blue-400/30 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${(user.stats.experience % 100)}%` }}
                  />
                </div>
                <p className="text-xs text-blue-100 mt-1">
                  {user.stats.experience} XP
                </p>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Works Read</p>
                  <p className="text-3xl font-bold">{user.stats.totalWorksRead}</p>
                </div>
                <div className="text-4xl">Books</div>
              </div>
              <p className="text-xs text-purple-100 mt-2">
                {user.stats.totalChaptersRead} chapters
              </p>
            </div>

            <div className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Cards</p>
                  <p className="text-3xl font-bold">{user.stats.totalCards}</p>
                </div>
                <div className="text-4xl">Cards</div>
              </div>
              <p className="text-xs text-pink-100 mt-2">
                {user.stats.uniqueCards} unique, {user.stats.rareCards} rare
              </p>
            </div>

            <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Achievements</p>
                  <p className="text-3xl font-bold">{user.stats.achievementsUnlocked}</p>
                </div>
                <div className="text-4xl">Trophy</div>
              </div>
              <p className="text-xs text-amber-100 mt-2">
                Keep collecting!
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Total Reading Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(user.stats.totalReadingTime / 60)}h
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Trades Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.stats.tradesCompleted}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Auctions Won</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.stats.auctionsWon}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
