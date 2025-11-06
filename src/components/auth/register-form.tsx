"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterInputSchema, type RegisterInput } from "@/modules/users/schemas/user.schema";
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...registerField("email")}
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          type="text"
          {...registerField("username")}
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...registerField("password")}
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="displayName" className="block text-sm font-medium">
          Display Name (optional)
        </label>
        <input
          id="displayName"
          type="text"
          {...registerField("displayName")}
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || register.isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting || register.isPending ? "Registering..." : "Register"}
      </button>

      {register.error && (
        <p className="text-sm text-red-600">
          {register.error.message}
        </p>
      )}
    </form>
  );
}