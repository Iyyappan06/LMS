"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import {
  Bell,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  User,
  Database,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export function Header() {
  const { currentUser, switchRole, allProfiles, setCurrentUser } = useAuth();
  const [userDropdown, setUserDropdown] = useState(false);
  const [resetModal, setResetModal] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-white/10 px-6 flex items-center justify-between">
      {/* Search / Context */}
      <div className="flex items-center gap-3">
        <Link
          href="/books"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick search catalog (Ctrl + K)...</span>
        </Link>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
          🏛️ {currentUser.department || "Central University"}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={() => {
            if (confirm("Reset local database to initial demo state?")) {
              DataStore.resetAllData();
            }
          }}
          title="Reset database to initial seed data"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>

        {/* User Profile / Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserDropdown(!userDropdown)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white leading-tight">{currentUser.full_name}</p>
              <p className="text-[10px] text-indigo-400 uppercase font-bold">{currentUser.role}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {currentUser.full_name.charAt(0)}
            </div>
          </button>

          {userDropdown && (
            <div
              className="absolute right-0 mt-2 w-72 glass-dropdown rounded-2xl p-2 z-50 animate-slide-up border border-white/10 shadow-2xl"
              onMouseLeave={() => setUserDropdown(false)}
            >
              <div className="p-3 border-b border-white/10">
                <p className="text-xs font-bold text-white">{currentUser.full_name}</p>
                <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Quota Limit:</span>
                  <span className="font-semibold text-indigo-300">{currentUser.max_books_allowed} Books</span>
                </div>
              </div>

              <div className="p-2">
                <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Switch Account Profile</p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {allProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setCurrentUser(p);
                        setUserDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                        p.id === currentUser.id
                          ? "bg-indigo-600/30 text-indigo-200 border border-indigo-500/30"
                          : "hover:bg-white/5 text-slate-300"
                      }`}
                    >
                      <div className="truncate">
                        <p className="font-medium text-white truncate">{p.full_name}</p>
                        <p className="text-[10px] text-slate-400">{p.email}</p>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10 font-bold">
                        {p.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
