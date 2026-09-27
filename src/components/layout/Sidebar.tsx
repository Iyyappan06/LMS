"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  ArrowRightLeft,
  Users,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  FilePlus,
  GraduationCap,
  DollarSign,
  BarChart3,
  ClipboardCheck,
  Settings,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const {
    currentUser,
    switchRole,
    canManageBooks,
    canIssueReturn,
    canManageMembers,
    isAdmin,
    isLibrarian,
    isFaculty,
    isStudent,
    isCoordinator,
  } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      label: "Book Catalog",
      href: "/books",
      icon: BookOpen,
      show: true,
    },
    {
      label: "Circulation Desk",
      href: "/circulation",
      icon: ArrowRightLeft,
      show: canIssueReturn || isFaculty || isStudent,
    },
    {
      label: "Member Directory",
      href: "/members",
      icon: Users,
      show: canManageMembers,
    },
    {
      label: "Acquisition Requests",
      href: "/requests",
      icon: FilePlus,
      show: isFaculty || isLibrarian || isAdmin,
    },
    {
      label: "Department Resources",
      href: "/department",
      icon: GraduationCap,
      show: isCoordinator || isAdmin || isLibrarian || isFaculty,
    },
    {
      label: "Fine & Overdues",
      href: "/fines",
      icon: DollarSign,
      show: true,
    },
    {
      label: "Reports & Analytics",
      href: "/reports",
      icon: BarChart3,
      show: isAdmin || isLibrarian || isCoordinator,
    },
    {
      label: "Inventory & Audits",
      href: "/inventory",
      icon: ClipboardCheck,
      show: isAdmin || isLibrarian,
    },
    {
      label: "System Settings",
      href: "/settings",
      icon: Settings,
      show: isAdmin || isLibrarian,
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl transition-all"
        aria-label="Toggle Navigation"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 glass-panel border-r border-white/10 z-40 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight">Apex LMS</span>
              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Core v1-6
              </span>
            </div>
            <p className="text-xs text-slate-400">Next.js + Supabase</p>
          </div>
        </div>

        {/* Current Active Role Badge */}
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Active Role</p>
              <p className="text-xs font-bold text-white tracking-wide">{currentUser.role}</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
        </nav>

        {/* Quick Role Switcher in Sidebar Footer */}
        <div className="p-3 border-t border-white/10 bg-slate-950/40">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 px-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>1-Click Role Switcher</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {(["ADMIN", "LIBRARIAN", "FACULTY", "STUDENT", "COORDINATOR"] as const).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`px-2 py-1.5 text-[11px] font-semibold rounded-lg border transition-all text-left truncate ${
                  currentUser.role === r
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow"
                    : "bg-slate-900/60 text-slate-400 border-white/5 hover:text-white hover:bg-slate-800"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
