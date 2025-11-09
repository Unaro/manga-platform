"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const LoginFormSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormInput = z.infer<typeof LoginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

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
      // Если это email - логинимся через Supabase Auth напрямую
      if (isEmail) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: data.identifier,
          password: data.password,
        });

        if (authError) {
          throw authError;
        }
      } else {
        // Если это username - сначала находим email по username
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("email")
          .eq("username", data.identifier)
          .single();

        if (userError || !userData) {
          throw new Error("User not found");
        }

        // Теперь логинимся через email
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: data.password,
        });

        if (authError) {
          throw authError;
        }
      }

      router.push("/dashboard");
      router.refresh();
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
          placeholder="password"
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
