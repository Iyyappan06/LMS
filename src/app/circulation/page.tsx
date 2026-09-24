"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import { Book, BorrowRecord, UserProfile } from "@/lib/types";
import { formatDate, calculateDaysRemaining } from "@/lib/utils";
import {
  ArrowRightLeft,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle,
  Download,
  BookOpen,
  UserCheck,
  Calendar,
  Sparkles,
  Layers,
} from "lucide-react";

export default function CirculationPage() {
  const { currentUser, canIssueReturn, isStudent, isFaculty } = useAuth();
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "ISSUE" | "HISTORY">("ACTIVE");
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Issue Form State
  const [issueBookId, setIssueBookId] = useState("");
  const [issueUserId, setIssueUserId] = useState("");
  const [issueRemarks, setIssueRemarks] = useState("");

  const loadData = () => {
    setBorrows(DataStore.getBorrows());
    setBooks(DataStore.getBooks());
    setProfiles(DataStore.getProfiles());
  };

  useEffect(() => {
    loadData();
    const handleChange = () => loadData();
    window.addEventListener("lms_data_change", handleChange);
    return () => window.removeEventListener("lms_data_change", handleChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleReturn = (borrowId: string) => {
    const res = DataStore.returnBook(borrowId);
    if (res.success) {
      showToast(res.message);
    } else {
      alert(res.message);
    }
  };

  const handleRenew = (borrowId: string) => {
    const res = DataStore.renewBook(borrowId);
    if (res.success) {
      showToast(res.message);
    } else {
      alert(res.message);
    }
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueBookId || !issueUserId) {
      alert("Please select both a Book and a Member.");
      return;
    }
    const res = DataStore.issueBook(issueUserId, issueBookId, issueRemarks);
    if (res.success) {
      showToast(res.message);
      setIssueBookId("");
      setIssueUserId("");
      setIssueRemarks("");
      setActiveTab("ACTIVE");
    } else {
      alert(res.message);
    }
  };

  const exportCSV = () => {
    const headers = ["Loan ID", "Member Name", "Email", "Book Title", "ISBN", "Issue Date", "Due Date", "Return Date", "Renewals", "Status"];
    const rows = borrows.map((b) => [
      b.id,
      `"${b.user?.full_name || ""}"`,
      b.user?.email || "",
      `"${b.book?.title || ""}"`,
      b.book?.isbn || "",
      b.issue_date,
      b.due_date,
      b.return_date || "—",
      b.renewal_count,
      b.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lms_circulation_audit_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered lists
  const filteredBorrows = borrows.filter((b) => {
    const matchesQuery =
      (b.book?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.user?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.book?.isbn || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (isStudent || isFaculty) {
      return matchesQuery && b.user_id === currentUser.id;
    }
    return matchesQuery;
  });

  const activeLoans = filteredBorrows.filter((b) => b.status === "ACTIVE" || b.status === "OVERDUE");
  const historyLoans = filteredBorrows.filter((b) => b.status === "RETURNED" || activeTab === "HISTORY");

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-medium shadow-2xl flex items-center gap-3 border border-indigo-400/40 animate-slide-up">
            <CheckCircle2 className="w-5 h-5 text-indigo-200" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <ArrowRightLeft className="w-6 h-6 text-indigo-400" />
              <span>Circulation & Loan Management</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Issue books, process returns, renew loan terms, and view complete audit history logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab("ACTIVE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "ACTIVE"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Active Loans ({activeLoans.length})</span>
          </button>

          {canIssueReturn && (
            <button
              onClick={() => setActiveTab("ISSUE")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "ISSUE"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-slate-900/60 text-slate-400 hover:text-white"
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Issue New Loan</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("HISTORY")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "HISTORY"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Complete Loan History ({borrows.length})</span>
          </button>
        </div>

        {/* Tab 1: Active Loans */}
        {activeTab === "ACTIVE" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by book title, borrower name, or ISBN..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {activeLoans.length === 0 ? (
              <div className="glass-panel p-10 rounded-2xl text-center border border-white/10">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white">No active borrowings found</h3>
                <p className="text-xs text-slate-400 mt-1">All checked-out books are currently returned or no match exists.</p>
              </div>
            ) : (
              <div className="overflow-x-auto glass-panel rounded-2xl border border-white/10">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-white/10">
                    <tr>
                      <th className="p-3.5">Book Title & Author</th>
                      <th className="p-3.5">Borrower</th>
                      <th className="p-3.5">Issued Date</th>
                      <th className="p-3.5">Due Date & Status</th>
                      <th className="p-3.5">Renewals</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeLoans.map((loan) => {
                      const { days, isOverdue } = calculateDaysRemaining(loan.due_date);
                      return (
                        <tr key={loan.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5">
                            <p className="font-bold text-white">{loan.book?.title || "Unknown Book"}</p>
                            <p className="text-[11px] text-slate-400 font-mono">ISBN: {loan.book?.isbn || "—"}</p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-semibold text-white">{loan.user?.full_name || "Unknown Member"}</p>
                            <p className="text-[11px] text-indigo-300">{loan.user?.role} • {loan.user?.department}</p>
                          </td>
                          <td className="p-3.5 text-slate-400">{formatDate(loan.issue_date)}</td>
                          <td className="p-3.5">
                            <p className="font-medium text-white">{formatDate(loan.due_date)}</p>
                            <span
                              className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isOverdue
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              }`}
                            >
                              {isOverdue ? `Overdue by ${days}d` : `${days} days left`}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-slate-300 font-mono">{loan.renewal_count} / 2</span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleRenew(loan.id)}
                                title="Renew loan term"
                                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 font-semibold text-[11px] flex items-center gap-1 transition-all"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Renew</span>
                              </button>
                              {canIssueReturn && (
                                <button
                                  onClick={() => handleReturn(loan.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-md"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Return Book</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Issue Book Desk */}
        {activeTab === "ISSUE" && canIssueReturn && (
          <div className="glass-panel p-6 rounded-3xl border border-white/10 max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
              <span>Circulation Desk — Issue Book</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Validate available copies and member quotas before checkout.
            </p>

            <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Select Book from Catalog *</label>
                <select
                  required
                  value={issueBookId}
                  onChange={(e) => setIssueBookId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose Book (Showing Available Titles) --</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.available_copies <= 0}>
                      {b.title} — {b.available_copies > 0 ? `(${b.available_copies} copies available)` : `(Out of Stock)`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Select Borrower (Student / Faculty) *</label>
                <select
                  required
                  value={issueUserId}
                  onChange={(e) => setIssueUserId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose Member Profile --</option>
                  {profiles.map((p) => {
                    const activeCount = borrows.filter((b) => b.user_id === p.id && b.status !== "RETURNED").length;
                    return (
                      <option key={p.id} value={p.id}>
                        {p.full_name} ({p.role} - {p.department}) [Loans: {activeCount}/{p.max_books_allowed}]
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Remarks / Course Reference</label>
                <input
                  type="text"
                  value={issueRemarks}
                  onChange={(e) => setIssueRemarks(e.target.value)}
                  placeholder="e.g. Reference text for Semester 5 project"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("ACTIVE")}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Process Checkout
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Complete Loan History */}
        {activeTab === "HISTORY" && (
          <div className="space-y-4">
            <div className="overflow-x-auto glass-panel rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-white/10">
                  <tr>
                    <th className="p-3.5">Book Details</th>
                    <th className="p-3.5">Member</th>
                    <th className="p-3.5">Issued Date</th>
                    <th className="p-3.5">Due Date</th>
                    <th className="p-3.5">Returned Date</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBorrows.map((loan) => (
                    <tr key={loan.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-white">{loan.book?.title || "Unknown Book"}</p>
                        <p className="text-[11px] text-slate-400 font-mono">ISBN: {loan.book?.isbn || "—"}</p>
                      </td>
                      <td className="p-3.5">
                        <p className="font-semibold text-white">{loan.user?.full_name || "Unknown Member"}</p>
                        <p className="text-[11px] text-slate-400">{loan.user?.role}</p>
                      </td>
                      <td className="p-3.5 text-slate-400">{formatDate(loan.issue_date)}</td>
                      <td className="p-3.5 text-slate-400">{formatDate(loan.due_date)}</td>
                      <td className="p-3.5 font-medium text-slate-300">{formatDate(loan.return_date)}</td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            loan.status === "RETURNED"
                              ? "bg-slate-800 text-slate-300 border border-white/10"
                              : loan.status === "OVERDUE"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
