import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, UserProfileUpdate } from "../schemas/user.schema";
import type { ApiResponse } from "@/lib/api/error-handler";
import { createClient } from "@/lib/supabase/client";

export function useUser(id: string | null | undefined) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async (): Promise<User> => {
      if (!id) throw new Error("User ID is required");

      const response = await fetch(`/api/users/${id}`);
      const data: ApiResponse<User> = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || "Failed to fetch user");
      }

      return data.data!;
    },
    enabled: !!id,
  });
}

export function useUpdateProfile(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UserProfileUpdate): Promise<User> => {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const data: ApiResponse<User> = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || "Failed to update profile");
      }

      return data.data!;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["user", id], user);
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}

/**
 * Hook для получения текущего авторизованного пользователя
 * Использует Supabase session как источник истины
 */
export function useCurrentUser() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async (): Promise<User | null> => {
      // Проверяем сессию через Supabase
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return null;
      }

      // Получаем полные данные пользователя из API
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (!response.ok || !data.user) {
        return null;
      }

      return data.user;
    },
    retry: false,
  });
}
