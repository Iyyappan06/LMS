"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import { Book, BorrowRecord, UserProfile } from "@/lib/types";
import { formatDate, calculateDaysRemaining } from "@/lib/utils";
import Link from "next/link";
import {
  BookOpen,
  ArrowRightLeft,
  Users,
  AlertCircle,
  Clock,
  Sparkles,
  TrendingUp,
  BookmarkCheck,
  CheckCircle2,
  ChevronRight,
  Plus,
  BookMarked,
} from "lucide-react";

export default function DashboardPage() {
  const { currentUser, isStudent, isFaculty, canManageBooks, canIssueReturn, canRequestBooks } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    setBooks(DataStore.getBooks());
    setBorrows(DataStore.getBorrows());
    setProfiles(DataStore.getProfiles());

    const handleChange = () => {
      setBooks(DataStore.getBooks());
      setBorrows(DataStore.getBorrows());
      setProfiles(DataStore.getProfiles());
    };

    window.addEventListener("lms_data_change", handleChange);
    return () => window.removeEventListener("lms_data_change", handleChange);
  }, []);

  const totalTitles = books.length;
  const totalCopies = books.reduce((acc, b) => acc + b.total_copies, 0);
  const availableCopies = books.reduce((acc, b) => acc + b.available_copies, 0);
  const activeLoans = borrows.filter((b) => b.status === "ACTIVE" || b.status === "OVERDUE");
  const overdueLoans = borrows.filter((b) => b.status === "OVERDUE");
  
  // User's own borrowings
  const myBorrows = borrows.filter((b) => b.user_id === currentUser.id && b.status !== "RETURNED");
  const myHistory = borrows.filter((b) => b.user_id === currentUser.id);

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next.js 15 & Supabase Powered</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {currentUser.full_name} 👋
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                {isStudent || isFaculty
                  ? `You have ${myBorrows.length} active book loan(s). Your quota allows up to ${currentUser.max_books_allowed} simultaneous borrowings.`
                  : `Overview of university library operations, live circulation traffic, and catalog availability.`}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2.5">
              {canIssueReturn && (
                <Link
                  href="/circulation"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Issue / Return</span>
                </Link>
              )}
              {canManageBooks && (
                <Link
                  href="/books?new=true"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4 text-indigo-400" />
                  <span>Add New Book</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* High-Level Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Book Titles</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-white">{totalTitles}</p>
            <p className="text-[11px] text-slate-400 mt-1">{totalCopies} total catalog copies</p>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Available Stock</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400">{availableCopies}</p>
            <p className="text-[11px] text-slate-400 mt-1">Ready on shelf for checkout</p>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Loans</span>
              <ArrowRightLeft className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-blue-400">{activeLoans.length}</p>
            <p className="text-[11px] text-slate-400 mt-1">Currently with members</p>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Overdue Alerts</span>
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-black text-rose-400">{overdueLoans.length}</p>
            <p className="text-[11px] text-rose-300/80 mt-1">Pending return deadline</p>
          </div>
        </div>

        {/* User-specific Active Loans (For Student/Faculty) */}
        {(isStudent || isFaculty) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-indigo-400" />
                <span>My Active Book Borrowings</span>
              </h2>
              <Link href="/circulation" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                <span>View Full History</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {myBorrows.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center">
                <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-300 font-semibold">No active borrowings right now</p>
                <p className="text-xs text-slate-500 mt-1">Explore the catalog and reserve or borrow books for your courses.</p>
                <Link
                  href="/books"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Browse Books Catalog</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myBorrows.map((loan) => {
                  const { days, isOverdue } = calculateDaysRemaining(loan.due_date);
                  return (
                    <div key={loan.id} className="glass-card p-5 rounded-2xl flex items-start justify-between gap-4 border border-white/10">
                      <div className="space-y-1 flex-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOverdue
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}>
                          {isOverdue ? `Overdue by ${days} day(s)` : `${days} days remaining`}
                        </span>
                        <h3 className="font-bold text-sm text-white line-clamp-1">{loan.book?.title}</h3>
                        <p className="text-xs text-slate-400">{loan.book?.author}</p>
                        <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-4">
                          <span>Issued: {formatDate(loan.issue_date)}</span>
                          <span className="font-semibold text-slate-300">Due: {formatDate(loan.due_date)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 border border-white/10 font-mono">
                          Shelf: {loan.book?.shelf_location || "A-1"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Featured / Most In-Demand Books */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span>Featured Library Titles</span>
              </h2>
              <p className="text-xs text-slate-400">Highlighted textbooks and academic references</p>
            </div>
            <Link href="/books" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
              <span>Explore All Catalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {books.slice(0, 4).map((book) => (
              <div key={book.id} className="glass-card rounded-2xl overflow-hidden flex flex-col group">
                <div className="h-40 relative bg-slate-900 overflow-hidden">
                  <img
                    src={book.cover_image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border ${
                        book.available_copies > 0
                          ? "bg-emerald-500/80 text-white border-emerald-400/40"
                          : "bg-rose-500/80 text-white border-rose-400/40"
                      }`}
                    >
                      {book.available_copies > 0 ? `${book.available_copies} Available` : "Checked Out"}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">{book.category}</span>
                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{book.author}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-[11px]">{book.isbn}</span>
                    <Link
                      href={`/books`}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Search(props: any) {
  return <BookOpen {...props} />;
}
