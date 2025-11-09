"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const RegisterFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormInput = z.infer<typeof RegisterFormSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const onSubmit = async (data: RegisterFormInput) => {
    setError(null);
    
    try {
      // Шаг 1: Регистрация через Supabase Auth
      // Пароль автоматически хэшируется и сохраняется в auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      // Шаг 2: Создаём профиль в public.users
      // Пароль НЕ передаём - он уже в auth.users
      if (authData.user) {
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            email: data.email,
            username: data.username,
            role: "user",
            email_verified: false,
            is_active: true,
          });

        if (insertError) {
          throw insertError;
        }
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="input"
          placeholder="your@email.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-red-600 animate-in">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="label">
          Username
        </label>
        <input
          id="username"
          type="text"
          {...register("username")}
          className="input"
          placeholder="username"
          disabled={isSubmitting}
        />
        {errors.username && (
          <p className="text-sm text-red-600 animate-in">{errors.username.message}</p>
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
          placeholder="password"
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="text-sm text-red-600 animate-in">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="label">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          className="input"
          placeholder="password"
          disabled={isSubmitting}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 animate-in">{errors.confirmPassword.message}</p>
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
            Creating account...
          </>
        ) : (
          "Create Account"
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
