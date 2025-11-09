"use client";

import { useAdminNotifications, useAdminUIStore } from "@/stores/admin-ui.store";

export function AdminNotifications() {
  const notifications = useAdminNotifications();
  const removeNotification = useAdminUIStore((state) => state.removeNotification);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 rounded-lg p-4 shadow-lg ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : notification.type === "error"
              ? "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              : "bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
          }`}
        >
          <span className="flex-1 text-sm font-medium">{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
