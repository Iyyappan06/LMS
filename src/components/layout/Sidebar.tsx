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
  Menu,
  X,
  FilePlus,
  GraduationCap,
  DollarSign,
  BarChart3,
  ClipboardCheck,
  Settings,
  Sparkles,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const {
    currentUser,
    switchRole,
    canManageMembers,
    isAdmin,
    isLibrarian,
    isFaculty,
    isStudent,
    isCoordinator,
  } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navGroups = [
    {
      title: "MAIN",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          show: true,
        },
      ],
    },
    {
      title: "BOOKS",
      items: [
        {
          label: "Book Catalog",
          href: "/books",
          icon: BookOpen,
          show: true,
        },
      ],
    },
    {
      title: "MY LOANS & CIRCULATION",
      items: [
        {
          label: isStudent || isFaculty ? "My Borrowed Books" : "Circulation Desk",
          href: "/circulation",
          icon: ArrowRightLeft,
          show: true,
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
      ],
    },
    {
      title: "ADMIN & SYSTEM",
      items: [
        {
          label: "Member Directory",
          href: "/members",
          icon: Users,
          show: canManageMembers,
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
      ],
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl transition-all"
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
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0B132A] z-40 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md">
            LMS
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-tight leading-tight">Library System</h1>
            <p className="text-[11px] text-slate-400">Portal</p>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) => item.show);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-1">
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {group.title}
                </p>
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4 opacity-90" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User Profile & Demo Switcher Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#070D1E]">
          <div className="flex items-center gap-2.5 px-2 py-1.5 mb-2">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
              {currentUser.full_name.charAt(0)}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-white truncate leading-tight">{currentUser.full_name}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">{currentUser.role}</p>
            </div>
          </div>

          {/* Quick Role Switcher */}
          <div className="space-y-1 pt-1 border-t border-slate-800">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 px-1 mb-1 font-semibold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Switch Demo Role:</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {(["ADMIN", "LIBRARIAN", "FACULTY", "STUDENT", "COORDINATOR"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`px-2 py-1 text-[10px] font-bold rounded transition-all text-center truncate ${
                    currentUser.role === r
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/50"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
