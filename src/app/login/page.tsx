"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [usernameOrEmail, setUsernameOrEmail] = useState("admin@lms.com");
  const [password, setPassword] = useState("••••••••••••");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(usernameOrEmail, password);
    setLoading(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Login failed");
    }
  };

  const handleAutofill = (role: string, email: string) => {
    setUsernameOrEmail(email);
    setPassword("••••••••••••");
    setError(null);
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
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-xs text-red-600 font-medium text-center">
            {error}
          </div>
        )}

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
              className="w-full px-3 py-2 text-sm bg-[#eef4ff] border border-blue-600 rounded-md focus:outline-none text-slate-800 font-medium transition-all"
              placeholder="Username or Email"
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
              className="w-full px-3 py-2 text-sm bg-[#eef4ff] border border-slate-200 rounded-md focus:outline-none focus:border-blue-600 text-slate-800 transition-all"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-md transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Demo Accounts Box */}
        <div className="mt-6 p-3.5 bg-[#f8fafc] border border-slate-200 rounded-md">
          <p className="text-[10px] font-bold text-slate-500 tracking-wider mb-2.5 uppercase">
            Demo Accounts (Click to autofill):
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleAutofill("Admin", "admin@lms.com")}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleAutofill("Librarian", "librarian@lms.com")}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
            >
              Librarian
            </button>
            <button
              type="button"
              onClick={() => handleAutofill("Faculty", "faculty@lms.com")}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => handleAutofill("Coordinator", "coordinator@lms.com")}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
            >
              Coordinator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
