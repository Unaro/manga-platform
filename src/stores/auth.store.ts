import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * AuthStore — централизованное хранилище авторизации
 * Следует принципам:
 * - exactOptionalPropertyTypes: не присваиваем undefined опциональным полям напрямую
 * - Type-first: строгая типизация
 * - Client state management через Zustand
 */
type User = {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  role: string;
};

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User;
  token?: string;
  setUser: (user: User, token: string) => void;
  clear: () => void;
  initialize: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      // НЕ указываем user и token в начальном состоянии (exactOptionalPropertyTypes)
      setUser: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        }),
      clear: () =>
        set((state) => {
          // Удаляем опциональные поля, не присваивая undefined
          const { user, token, ...rest } = state as any;
          return {
            ...rest,
            isAuthenticated: false,
            isLoading: false
          };
        }),
      initialize: () =>
        set((state) => ({
          ...state,
          isLoading: false
        })),
    }),
    {
      name: "auth-storage",
      // После hydration вызываем initialize
      onRehydrateStorage: () => (state) => {
        state?.initialize();
      },
    }
  )
);
