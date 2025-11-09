"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/stores/auth.store";

const LoginFormSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormInput = z.infer<typeof LoginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const setUser = useAuth((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(LoginFormSchema),
  });

  const identifier = watch("identifier");
  const isEmail = identifier?.includes("@");

  const onSubmit = async (data: LoginFormInput) => {
    setError(null);
    
    try {
      const payload = {
        password: data.password,
        ...(isEmail ? { email: data.identifier } : { username: data.identifier }),
      };

      // Шаг 1: Вызываем API логина
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Login failed");
      }

      const result = await response.json();
      
      // Шаг 2: Сохраняем в store
      setUser(result.data.user, result.data.session?.access_token);
      
      // Шаг 3: КРИТИЧНО - делаем hard redirect для синхронизации cookies
      // Это гарантирует, что server-side получит актуальные cookies
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="identifier" className="label">
          Email or Username
        </label>
        <input
          id="identifier"
          type="text"
          {...register("identifier")}
          className="input"
          placeholder="your@email.com or username"
          disabled={isSubmitting}
        />
        {errors.identifier && (
          <p className="text-sm text-red-600 animate-in">{errors.identifier.message}</p>
        )}
        {identifier && (
          <p className="text-xs text-gray-500">
            Logging in with: {isEmail ? "Email" : "Username"}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="input"
          placeholder="••••••••"
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="text-sm text-red-600 animate-in">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full h-10"
      >
        {isSubmitting ? (
          <>
            <span className="spinner mr-2" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 animate-in">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}
    </form>
  );
}
