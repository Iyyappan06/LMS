"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const res = await login(usernameOrEmail, password);
    setLoading(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Login failed");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!resetEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setResetLoading(true);

    if (supabase) {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim(),
        {
          redirectTo: `${window.location.origin}/login`,
        }
      );

      setResetLoading(false);

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(
          "Password reset link has been sent to your email. Please check your inbox and spam folder."
        );
        setResetEmail("");
      }
    } else {
      setResetLoading(false);
      setError(
        "Password reset requires Supabase configuration. Please contact your system administrator."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-lg shadow-md border border-slate-200/80 p-8">
        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Library Management System
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {showForgotPassword
              ? "Reset your password"
              : "Sign in to your account"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-xs text-red-600 font-medium text-center">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-4 p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium text-center">
            {success}
          </div>
        )}

        {/* =================== LOGIN FORM =================== */}
        {!showForgotPassword && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 text-slate-800 font-medium transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 text-slate-800 transition-all"
                placeholder="Enter your password"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setError(null);
                  setSuccess(null);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-md transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        )}

        {/* =================== FORGOT PASSWORD FORM =================== */}
        {showForgotPassword && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 text-slate-800 font-medium transition-all"
                placeholder="Enter your registered email"
              />
              <p className="text-[10px] text-slate-400 mt-1.5">
                We&apos;ll send a password reset link to this email address.
              </p>
            </div>

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-md transition-colors shadow-sm disabled:opacity-50"
            >
              {resetLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setError(null);
                setSuccess(null);
              }}
              className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 font-semibold transition-colors"
            >
              ← Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
