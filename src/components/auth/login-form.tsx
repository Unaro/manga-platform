"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { LoginInput } from "@/modules/users/schemas/user.schema";
import { useLogin } from "@/modules/users/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Кастомная схема для формы логина
const LoginFormSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormInput = z.infer<typeof LoginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const [identifierType, setIdentifierType] = useState<"email" | "username">("email");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(LoginFormSchema),
  });

  // Определяем тип идентификатора (email или username)
  const identifier = watch("identifier");
  const isEmail = identifier?.includes("@");

  const onSubmit = async (data: LoginFormInput) => {
    try {
      // Преобразуем данные формы в LoginInput
      const loginData: LoginInput = {
        password: data.password,
        ...(isEmail ? { email: data.identifier } : { username: data.identifier }),
      };

      await login.mutateAsync(loginData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
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
          onChange={(e) => {
            register("identifier").onChange(e);
            setIdentifierType(e.target.value.includes("@") ? "email" : "username");
          }}
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
        />
        {errors.password && (
          <p className="text-sm text-red-600 animate-in">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || login.isPending}
        className="btn btn-primary w-full h-10"
      >
        {isSubmitting || login.isPending ? (
          <>
            <span className="spinner mr-2" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      {login.error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 animate-in">
          <p className="text-sm text-red-600 text-center">{login.error.message}</p>
        </div>
      )}
    </form>
  );
}
