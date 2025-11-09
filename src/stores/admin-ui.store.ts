"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AdminUIState {
  // Sidebar
  sidebarCollapsed: boolean;
  activeSection: string | null;
  
  // Modals
  modals: {
    createSource: boolean;
    deleteConfirm: boolean;
    importProgress: boolean;
  };
  
  // Import state (UI-only, не сами данные)
  importQueue: {
    id: string;
    status: "pending" | "processing" | "completed" | "failed";
    progress: number;
  }[];
  
  // Notifications (временные UI уведомления)
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
  }>;
}

interface AdminUIActions {
  toggleSidebar: () => void;
  setActiveSection: (section: string | null) => void;
  
  openModal: (modal: keyof AdminUIState["modals"]) => void;
  closeModal: (modal: keyof AdminUIState["modals"]) => void;
  
  addToImportQueue: (item: AdminUIState["importQueue"][0]) => void;
  updateImportStatus: (id: string, status: AdminUIState["importQueue"][0]["status"], progress: number) => void;
  removeFromImportQueue: (id: string) => void;
  
  addNotification: (notification: Omit<AdminUIState["notifications"][0], "id">) => void;
  removeNotification: (id: string) => void;
}

export const useAdminUIStore = create<AdminUIState & AdminUIActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        sidebarCollapsed: false,
        activeSection: null,
        modals: {
          createSource: false,
          deleteConfirm: false,
          importProgress: false
        },
        importQueue: [],
        notifications: [],

        // Actions
        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

        setActiveSection: (section) => set({ activeSection: section }),

        openModal: (modal) =>
          set((state) => ({
            modals: { ...state.modals, [modal]: true }
          })),

        closeModal: (modal) =>
          set((state) => ({
            modals: { ...state.modals, [modal]: false }
          })),

        addToImportQueue: (item) =>
          set((state) => ({
            importQueue: [...state.importQueue, item]
          })),

        updateImportStatus: (id, status, progress) =>
          set((state) => ({
            importQueue: state.importQueue.map((item) =>
              item.id === id ? { ...item, status, progress } : item
            )
          })),

        removeFromImportQueue: (id) =>
          set((state) => ({
            importQueue: state.importQueue.filter((item) => item.id !== id)
          })),

        addNotification: (notification) =>
          set((state) => {
            const id = crypto.randomUUID();
            const newNotification = { ...notification, id };
            
            setTimeout(() => {
              get().removeNotification(id);
            }, 5000);

            return {
              notifications: [...state.notifications, newNotification]
            };
          }),

        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id)
          }))
      }),
      {
        name: "admin-ui-store",
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed
        })
      }
    ),
    { name: "AdminUIStore" }
  )
);

// Selectors
export const useAdminSidebar = () =>
  useAdminUIStore((state) => ({
    collapsed: state.sidebarCollapsed,
    activeSection: state.activeSection
  }));

export const useAdminModals = () =>
  useAdminUIStore((state) => state.modals);

export const useImportQueue = () =>
  useAdminUIStore((state) => state.importQueue);

export const useAdminNotifications = () =>
  useAdminUIStore((state) => state.notifications);
