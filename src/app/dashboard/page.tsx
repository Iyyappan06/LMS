"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import { Book, BorrowRecord } from "@/lib/types";
import {
  BookOpen,
  ArrowRightLeft,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Building2,
} from "lucide-react";

export default function DashboardPage() {
  const { currentUser, isStudent, isFaculty } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);

  const loadData = () => {
    setBooks(DataStore.getBooks());
    setBorrows(DataStore.getBorrows());
  };

  useEffect(() => {
    loadData();
    const handleDataChange = () => loadData();
    window.addEventListener("lms_data_change", handleDataChange);
    return () => window.removeEventListener("lms_data_change", handleDataChange);
  }, []);

  const totalTitles = books.length;
  const totalCopies = books.reduce((acc, b) => acc + b.total_copies, 0);
  const availableCopies = books.reduce((acc, b) => acc + b.available_copies, 0);

  const myBorrows = borrows.filter((b) => b.user_id === currentUser.id);
  const myActiveBorrows = myBorrows.filter((b) => b.status === "ACTIVE" || b.status === "OVERDUE");
  const slotsRemaining = Math.max(0, currentUser.max_books_allowed - myActiveBorrows.length);

  const availableBooks = books.filter((b) => b.available_copies > 0).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
              {currentUser.role}
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Department: {currentUser.department || "Computer Science"}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome, {currentUser.full_name}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            View your borrowed books and search the catalog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/books"
            className="px-3.5 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
          >
            Catalog
          </Link>
          <Link
            href="/circulation"
            className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            My Loans
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{totalTitles}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Book Titles</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{totalCopies}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Total Copies</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{availableCopies}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Available Copies</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{myActiveBorrows.length}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Active Loans</p>
        </div>
      </div>

      {/* Currently Borrowed Books Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Currently Borrowed Books</h3>
            <p className="text-xs text-slate-500">
              Active: {myActiveBorrows.length} / {currentUser.max_books_allowed} limit ({slotsRemaining} slots remaining)
            </p>
          </div>
          <Link
            href="/circulation"
            className="px-3 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all"
          >
            View All
          </Link>
        </div>

        {myActiveBorrows.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-800">No active borrowed books</p>
            <p className="text-xs text-slate-500">You have no active loans at this time.</p>
            <Link
              href="/books"
              className="inline-block px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <th className="p-3">Book Details</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myActiveBorrows.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-semibold text-slate-900">{b.book?.title}</td>
                    <td className="p-3 text-slate-500">{b.issue_date}</td>
                    <td className="p-3 text-slate-500">{b.due_date}</td>
                    <td className="p-3 font-bold text-amber-600">{b.status}</td>
                    <td className="p-3 text-right">
                      <Link
                        href="/circulation"
                        className="px-2.5 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Available Books Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Available Books</h3>
          <Link
            href="/books"
            className="px-3 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <th className="p-3">ISBN</th>
                <th className="p-3">Title</th>
                <th className="p-3">Author</th>
                <th className="p-3">Category</th>
                <th className="p-3">Available Copies</th>
                <th className="p-3">Shelf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {availableBooks.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50/80">
                  <td className="p-3 text-slate-500 font-mono">{book.isbn}</td>
                  <td className="p-3 font-bold text-slate-900">{book.title}</td>
                  <td className="p-3 text-slate-600">{book.author}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                      {book.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                      {book.available_copies} / {book.total_copies}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{book.shelf_location || "Shelf A-01"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
