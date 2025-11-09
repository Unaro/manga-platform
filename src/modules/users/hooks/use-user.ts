import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, UserProfileUpdate } from "../schemas/user.schema";
import type { ApiResponse } from "@/lib/api/error-handler";

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
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
 * Возвращает null, если не авторизован
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async (): Promise<User | null> => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        return null; // Пользователь не авторизован
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: ApiResponse<User> = await response.json();

      if (!response.ok || data.error || !data.user) {
        return null; // Нет объекта user
      }

      return data.user;
    },
    retry: false, // Не повторять при 401
  });
}
