"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import { Book, BorrowRecord, UserProfile } from "@/lib/types";
import {
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  Plus,
  BookOpen,
  UserCheck,
} from "lucide-react";

export default function CirculationPage() {
  const { currentUser, isStudent, isFaculty, canIssueReturn } = useAuth();
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<UserProfile[]>([]);

  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [remarksInput, setRemarksInput] = useState("");

  const loadData = () => {
    setBorrows(DataStore.getBorrows());
    setBooks(DataStore.getBooks());
    setMembers(DataStore.getProfiles());
  };

  useEffect(() => {
    loadData();
    const handleDataChange = () => loadData();
    window.addEventListener("lms_data_change", handleDataChange);
    return () => window.removeEventListener("lms_data_change", handleDataChange);
  }, []);

  // Filter for student/faculty view vs librarian view
  const userBorrows = isStudent || isFaculty
    ? borrows.filter((b) => b.user_id === currentUser.id)
    : borrows;

  const activeBorrowsCount = userBorrows.filter((b) => b.status === "ACTIVE" || b.status === "OVERDUE").length;
  const availableSlots = Math.max(0, currentUser.max_books_allowed - activeBorrowsCount);

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedBookId) {
      alert("Please select both a member and a book.");
      return;
    }

    const res = DataStore.issueBook(selectedUserId, selectedBookId, remarksInput);
    alert(res.message);
    if (res.success) {
      setIssueModalOpen(false);
      setSelectedUserId("");
      setSelectedBookId("");
      setRemarksInput("");
      loadData();
    }
  };

  const handleReturn = (borrowId: string) => {
    if (confirm("Confirm return of this book?")) {
      const res = DataStore.returnBook(borrowId);
      alert(res.message);
      loadData();
    }
  };

  const handleRenew = (borrowId: string) => {
    const res = DataStore.renewBook(borrowId);
    alert(res.message);
    loadData();
  };

  return (
    <div className="space-y-5">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{activeBorrowsCount} / {currentUser.max_books_allowed}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Active Borrowed Books</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{availableSlots}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Available Slots</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{userBorrows.length}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Total History Records</p>
        </div>
      </div>

      {/* Circulation / History Table Container */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Borrowing History</h3>

          <div className="flex items-center gap-2">
            {canIssueReturn && (
              <button
                onClick={() => setIssueModalOpen(true)}
                className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                + Issue Book
              </button>
            )}
            <Link
              href="/books"
              className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Browse Catalog
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <th className="p-3">BOOK DETAILS</th>
                {canIssueReturn && <th className="p-3">MEMBER</th>}
                <th className="p-3">ISSUE DATE</th>
                <th className="p-3">DUE DATE</th>
                <th className="p-3">RETURN DATE</th>
                <th className="p-3">RENEWALS</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {userBorrows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No borrowing records found.
                  </td>
                </tr>
              ) : (
                userBorrows.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-xs">{b.book?.title}</div>
                      <div className="text-[11px] text-slate-500">
                        Author: {b.book?.author} | ISBN: {b.book?.isbn}
                      </div>
                    </td>
                    {canIssueReturn && (
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{b.user?.full_name}</div>
                        <div className="text-[11px] text-slate-500">{b.user?.role}</div>
                      </td>
                    )}
                    <td className="p-3 text-slate-600 font-mono">{b.issue_date}</td>
                    <td className="p-3 text-slate-600 font-mono">{b.due_date}</td>
                    <td className="p-3 text-slate-600 font-mono">{b.return_date || "-"}</td>
                    <td className="p-3 text-slate-600">{b.renewal_count} / 2</td>
                    <td className="p-3">
                      {b.status === "RETURNED" ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase">
                          RETURNED
                        </span>
                      ) : b.status === "OVERDUE" ? (
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase">
                          OVERDUE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {b.status === "ACTIVE" || b.status === "OVERDUE" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRenew(b.id)}
                            className="px-2 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-xs"
                          >
                            Renew
                          </button>
                          <button
                            onClick={() => handleReturn(b.id)}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm"
                          >
                            Return
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Book Modal */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-lg border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">
              Issue Book to Member
            </h3>

            <form onSubmit={handleIssueSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Member *</label>
                <select
                  required
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600 bg-white"
                >
                  <option value="">-- Select Member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.role} - {m.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Book *</label>
                <select
                  required
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600 bg-white"
                >
                  <option value="">-- Select Available Book --</option>
                  {books.filter((b) => b.available_copies > 0).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.available_copies} available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks (Optional)</label>
                <input
                  type="text"
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  placeholder="Standard checkout"
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                >
                  Issue Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
