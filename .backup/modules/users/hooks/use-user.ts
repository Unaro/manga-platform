import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, UserProfileUpdate } from "../schemas/user.schema";
import type { ApiResponse } from "@/lib/api/error-handler";

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async (): Promise<User> => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data: ApiResponse<User> = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || "Failed to update profile");
      }

      return data.data!;
    },
    onSuccess: (user) => {
      // Обновить кэш
      queryClient.setQueryData(["user", id], user);
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });
}