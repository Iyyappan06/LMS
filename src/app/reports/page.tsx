"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data-store";
import { Book, BorrowRecord, UserProfile } from "@/lib/types";
import {
  BarChart3,
  Download,
  Printer,
  PieChart,
  TrendingUp,
  BookOpen,
  Users,
  ArrowRightLeft,
  FileSpreadsheet,
} from "lucide-react";

export default function ReportsAnalyticsPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [members, setMembers] = useState<UserProfile[]>([]);

  useEffect(() => {
    setBooks(DataStore.getBooks());
    setBorrows(DataStore.getBorrows());
    setMembers(DataStore.getProfiles());
  }, []);

  const totalCopies = books.reduce((acc, b) => acc + b.total_copies, 0);
  const availableCopies = books.reduce((acc, b) => acc + b.available_copies, 0);
  const activeBorrows = borrows.filter((b) => b.status === "ACTIVE").length;
  const overdueBorrows = borrows.filter((b) => b.status === "OVERDUE").length;

  // Category Distribution Computation
  const categoriesMap: Record<string, number> = {};
  books.forEach((b) => {
    categoriesMap[b.category] = (categoriesMap[b.category] || 0) + b.total_copies;
  });

  const categoriesList = Object.entries(categoriesMap).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / (totalCopies || 1)) * 100),
  }));

  // Export to CSV Function
  const exportCirculationCSV = () => {
    const headers = ["Loan ID", "User Name", "User Role", "Book Title", "Issue Date", "Due Date", "Status"];
    const rows = borrows.map((b) => [
      b.id,
      `"${b.user?.full_name || 'Member'}"`,
      b.user?.role || "STUDENT",
      `"${b.book?.title || 'Book'}"`,
      b.issue_date,
      b.due_date,
      b.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LMS_Circulation_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <BarChart3 className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Analytics & Report Generation</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            System performance metrics, category breakdowns, circulation statistics, and CSV data export.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCirculationCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-white/10 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Catalog Titles</p>
            <p className="text-2xl font-bold text-white">{books.length}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Stock Utilization Rate</p>
            <p className="text-2xl font-bold text-emerald-300">
              {Math.round(((totalCopies - availableCopies) / (totalCopies || 1)) * 100)}%
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Active Loan Count</p>
            <p className="text-2xl font-bold text-amber-300">{activeBorrows}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Registered Members</p>
            <p className="text-2xl font-bold text-purple-300">{members.length}</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-sky-400" />
            Catalog Volume by Category
          </h2>

          <div className="space-y-3">
            {categoriesList.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-semibold">{cat.name}</span>
                  <span className="text-slate-400">{cat.count} Copies ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                    style={{ width: `${Math.max(5, cat.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Role Analytics */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            User Roles & Distribution
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {(["STUDENT", "FACULTY", "LIBRARIAN", "ADMIN", "COORDINATOR"] as const).map((role) => {
              const count = members.filter((m) => m.role === role).length;
              return (
                <div key={role} className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                  <p className="text-xs text-slate-400 font-semibold">{role}</p>
                  <p className="text-xl font-bold text-white">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Circulation Log Summary Table */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            Master Circulation Summary Log
          </h2>
          <span className="text-xs text-slate-400">{borrows.length} Total Circulation Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/80 text-slate-400 text-xs uppercase font-semibold">
                <th className="p-3">Borrower</th>
                <th className="p-3">Book Title</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 text-xs">
              {borrows.slice(0, 5).map((b) => (
                <tr key={b.id} className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">{b.user?.full_name || "Member"}</td>
                  <td className="p-3">{b.book?.title || "Book"}</td>
                  <td className="p-3 text-slate-400">{b.issue_date}</td>
                  <td className="p-3 text-slate-400">{b.due_date}</td>
                  <td className="p-3 font-bold">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
