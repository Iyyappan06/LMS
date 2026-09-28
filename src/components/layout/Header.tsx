"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import {
  Search,
  RefreshCw,
  User,
  CheckCircle2,
  BookOpen,
  LogOut,
} from "lucide-react";
import Link from "next/link";

export function Header() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  const [userDropdown, setUserDropdown] = useState(false);

  // Dynamic Page Titles matching screenshots
  const getPageDetails = () => {
    switch (pathname) {
      case "/dashboard":
        return { title: "Dashboard", subtitle: "Library system metrics and overview" };
      case "/books":
        return { title: "Book Catalog", subtitle: "Browse and manage the library book inventory" };
      case "/circulation":
        return {
          title: currentUser?.role === "STUDENT" || currentUser?.role === "FACULTY" ? "My Borrowed Books" : "Circulation Desk",
          subtitle: currentUser?.role === "STUDENT" || currentUser?.role === "FACULTY" ? "Track your current loans and borrowing history" : "Manage member book issuing, returns, and loan renewals",
        };
      case "/members":
        return { title: "Member Directory", subtitle: "Manage library user accounts, roles, and borrowing limits" };
      case "/requests":
        return { title: "Book Acquisition Requests", subtitle: "Faculty recommendations for new book procurement" };
      case "/department":
        return { title: "Department Resources", subtitle: "Course textbook alignment and curriculum recommendations" };
      case "/fines":
        return { title: "Fine & Overdue Management", subtitle: "Track overdue book loans, late penalties, and fee settlements" };
      case "/reports":
        return { title: "Reports & Analytics", subtitle: "System performance metrics, statistics, and CSV export" };
      case "/inventory":
        return { title: "Inventory & Condition Audits", subtitle: "Shelf audit logs, damaged/lost books tracking" };
      case "/settings":
        return { title: "System Administration & Settings", subtitle: "Global library circulation policies and fine schedules" };
      default:
        return { title: "Library Portal", subtitle: "University Library Management System" };
    }
  };

  const pageInfo = getPageDetails();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{pageInfo.title}</h1>
        <p className="text-xs text-slate-500 font-medium">{pageInfo.subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Catalog Quick Action */}
        <Link
          href="/books"
          className="px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span>Search Catalog</span>
        </Link>

        {/* Reset Demo Data */}
        <button
          onClick={() => {
            if (confirm("Reset local database back to initial seed data?")) {
              DataStore.resetAllData();
            }
          }}
          title="Reset database"
          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 border border-slate-200 transition-all text-xs flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset</span>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          {currentUser ? (
            <>
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 p-1 pl-2.5 rounded-md border border-slate-200 hover:border-blue-500 bg-white shadow-sm transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.full_name}</p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase">{currentUser.role}</p>
                </div>
                <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  {currentUser.full_name?.charAt(0) || "U"}
                </div>
              </button>

              {userDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg p-2 z-50 border border-slate-200 shadow-xl"
                  onMouseLeave={() => setUserDropdown(false)}
                >
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.full_name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                      <span>Quota Limit:</span>
                      <span className="font-bold text-blue-600">{currentUser.max_books_allowed} Books</span>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                        setUserDropdown(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-all"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
