"use client";

import { useEffect } from "react";
import { useNotifications } from "@/stores/notifications.store";

export function Notifications() {
  const { notifications, remove } = useNotifications();

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    notifications.forEach((notification) => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          remove(notification.id);
        }, notification.duration);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [notifications, remove]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-full max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-lg border p-4 shadow-lg animate-in slide-in-from-right ${
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : notification.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : notification.type === "warning"
              ? "bg-yellow-50 border-yellow-200 text-yellow-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold">{notification.title}</p>
              {notification.message && (
                <p className="mt-1 text-sm opacity-90">{notification.message}</p>
              )}
            </div>
            <button
              onClick={() => remove(notification.id)}
              className="ml-4 text-current opacity-50 hover:opacity-100"
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
