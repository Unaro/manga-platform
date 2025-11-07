"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterInputSchema,
  type RegisterInput,
} from "@/modules/users/schemas/user.schema";
import { useRegister } from "@/modules/users/hooks/use-auth";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const register = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterInputSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await register.mutateAsync(data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
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
          {...registerField("email")}
          className="input"
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive animate-in">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="label">
          Username
        </label>
        <input
          id="username"
          type="text"
          {...registerField("username")}
          className="input"
          placeholder="username"
        />
        {errors.username && (
          <p className="text-sm text-destructive animate-in">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...registerField("password")}
          className="input"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-sm text-destructive animate-in">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="displayName" className="label">
          Display Name <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="displayName"
          type="text"
          {...registerField("displayName")}
          className="input"
          placeholder="Your Name"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || register.isPending}
        className="btn btn-primary w-full h-10"
      >
        {isSubmitting || register.isPending ? (
          <>
            <span className="spinner mr-2" />
            Registering...
          </>
        ) : (
          "Register"
        )}
      </button>

      {register.error && (
        <div className="rounded-md bg-destructive/10 p-3 animate-in">
          <p className="text-sm text-destructive text-center">{register.error.message}</p>
        </div>
      )}
    </form>
  );
}
