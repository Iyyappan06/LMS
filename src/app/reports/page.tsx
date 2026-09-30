"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data-store";
import { Book, BorrowRecord, UserProfile } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { Download, Printer, BarChart3, PieChart, Users, BookOpen, GraduationCap } from "lucide-react";

export default function ReportsAnalyticsPage() {
  const { currentUser, isCoordinator } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [members, setMembers] = useState<UserProfile[]>([]);

  const deptFilter = isCoordinator ? currentUser?.department || "Computer Science & Engineering" : null;

  useEffect(() => {
    setBooks(DataStore.getBooks());
    setBorrows(DataStore.getBorrows());
    setMembers(DataStore.getProfiles());
  }, []);

  const displayMembers = deptFilter
    ? members.filter((m) => m.department?.toLowerCase() === deptFilter.toLowerCase())
    : members;

  const displayBorrows = deptFilter
    ? borrows.filter((b) => b.user?.department?.toLowerCase() === deptFilter.toLowerCase())
    : borrows;

  const totalCopies = books.reduce((acc, b) => acc + b.total_copies, 0);
  const availableCopies = books.reduce((acc, b) => acc + b.available_copies, 0);
  const activeBorrows = displayBorrows.filter((b) => b.status === "ACTIVE").length;

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
    const headers = ["Loan ID", "User Name", "Department", "User Role", "Book Title", "Issue Date", "Due Date", "Status"];
    const rows = displayBorrows.map((b) => [
      b.id,
      `"${b.user?.full_name || 'Member'}"`,
      `"${b.user?.department || deptFilter || 'General'}"`,
      b.user?.role || "STUDENT",
      `"${b.book?.title || 'Book'}"`,
      b.issue_date,
      b.due_date,
      b.status,
    ]);

    const filename = deptFilter
      ? `LMS_${deptFilter.replace(/[^a-zA-Z0-9]/g, "_")}_Department_Report_${new Date().toISOString().split("T")[0]}.csv`
      : `LMS_Circulation_Report_${new Date().toISOString().split("T")[0]}.csv`;

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Department Scope Banner for Coordinator */}
      {isCoordinator && deptFilter && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-700/50 rounded-lg border border-blue-400/30">
              <GraduationCap className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-blue-200 font-bold">Department Scope</p>
              <h1 className="text-lg font-bold">{deptFilter} Reports & Analytics</h1>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-800/80 text-blue-100 text-xs font-semibold rounded-full border border-blue-600/40">
            Coordinator Report
          </span>
        </div>
      )}

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
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {isCoordinator ? "Active Dept Loans" : "Active Loan Count"}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{displayMembers.length}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {isCoordinator ? "Dept Members Registered" : "Registered Members"}
          </p>
        </div>
      </div>

      {/* Action Buttons Header */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {isCoordinator ? `${deptFilter} - Export Department Report` : "Reports & Export Options"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isCoordinator ? "Generate and download circulation records for your department" : "Export full system circulation and member metrics"}
          </p>
        </div>

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
          <h3 className="text-sm font-bold text-slate-900">
            {isCoordinator ? `${deptFilter} Member Roles` : "User Roles Breakdown"}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {(["STUDENT", "FACULTY", "LIBRARIAN", "ADMIN", "COORDINATOR"] as const).map((role) => {
              const count = displayMembers.filter((m) => m.role === role).length;
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
