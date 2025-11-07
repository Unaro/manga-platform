import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  RegisterInput,
  LoginInput,
  User,
} from "../schemas/user.schema";
import type { ApiResponse } from "@/lib/api/error-handler";

interface AuthResponse {
  user: User;
  token: string;
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RegisterInput): Promise<AuthResponse> => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data: ApiResponse<AuthResponse> = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || "Registration failed");
      }

      return data.data!;
    },
    onSuccess: (data) => {
      // Сохранить токен
      localStorage.setItem("token", data.token);
      
      // Инвалидировать кэш пользователя
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LoginInput): Promise<AuthResponse> => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data: ApiResponse<AuthResponse> = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || "Login failed");
      }

      return data.data!;
    },
    onSuccess: (data) => {
      // Сохранить токен
      localStorage.setItem("token", data.token);
      
      // Инвалидировать кэш пользователя
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}