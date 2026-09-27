"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data-store";
import { Book, BorrowRecord, UserProfile } from "@/lib/types";
import { Download, Printer, BarChart3, PieChart, Users, BookOpen } from "lucide-react";

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

  const categoriesMap: Record<string, number> = {};
  books.forEach((b) => {
    categoriesMap[b.category] = (categoriesMap[b.category] || 0) + b.total_copies;
  });

  const categoriesList = Object.entries(categoriesMap).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / (totalCopies || 1)) * 100),
  }));

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

  return (
    <div className="space-y-5">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{books.length}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Total Catalog Titles</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-blue-600">
            {Math.round(((totalCopies - availableCopies) / (totalCopies || 1)) * 100)}%
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Stock Utilization Rate</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-amber-600">{activeBorrows}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Active Loan Count</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{members.length}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Registered Members</p>
        </div>
      </div>

      {/* Action Buttons Header */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Reports & Export Options</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCirculationCSV}
            className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all"
          >
            Print
          </button>
        </div>
      </div>

      {/* Visual Charts & Role Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Catalog Volume by Category</h3>

          <div className="space-y-3">
            {categoriesList.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700 font-medium">
                  <span>{cat.name}</span>
                  <span className="text-slate-500">{cat.count} Copies ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.max(5, cat.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Role Breakdown */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">User Roles Breakdown</h3>

          <div className="grid grid-cols-2 gap-3">
            {(["STUDENT", "FACULTY", "LIBRARIAN", "ADMIN", "COORDINATOR"] as const).map((role) => {
              const count = members.filter((m) => m.role === role).length;
              return (
                <div key={role} className="p-3 rounded bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold">{role}</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
