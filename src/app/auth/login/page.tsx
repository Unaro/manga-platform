"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

/**
 * LoginPage — упрощенная версия
 * Проверка авторизации происходит после hard redirect на /dashboard
 * Не нужно проверять isAuthenticated здесь, т.к. после login делаем window.location.href
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">
            Login to your Manga Platform account
          </p>
        </div>

        <div className="card">
          <LoginForm />
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
              Create one now
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            You can login with either your email or username
          </p>
        </div>
      </div>
    </main>
  );
}
