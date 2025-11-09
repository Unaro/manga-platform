import { create } from "zustand";

type NotificationType = "success" | "error" | "warning" | "info";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
};

type NotificationsState = {
  notifications: Notification[];
  add: (notification: Omit<Notification, "id">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useNotifications = create<NotificationsState>((set) => ({
  notifications: [],
  add: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: crypto.randomUUID(),
        },
      ],
    })),
  remove: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clear: () => set({ notifications: [] }),
}));
