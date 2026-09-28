"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import { Book, ConditionStatus, InventoryAudit } from "@/lib/types";
import { Plus, Search, Filter } from "lucide-react";

export default function InventoryAuditsPage() {
  const { currentUser, isAdmin, isLibrarian } = useAuth();
  const [audits, setAudits] = useState<InventoryAudit[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    book_id: "",
    condition_status: "DAMAGED" as ConditionStatus,
    notes: "",
    copies_affected: 1,
  });

  const loadData = () => {
    setAudits(DataStore.getAudits());
    setBooks(DataStore.getBooks());
  };

  useEffect(() => {
    loadData();
    const handleDataChange = () => loadData();
    window.addEventListener("lms_data_change", handleDataChange);
    return () => window.removeEventListener("lms_data_change", handleDataChange);
  }, []);

  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const book = books.find((b) => b.id === formData.book_id);
    if (!book) {
      alert("Please select a valid book.");
      return;
    }

    DataStore.saveAudit({
      book_id: book.id,
      book_title: book.title,
      isbn: book.isbn,
      condition_status: formData.condition_status,
      notes: formData.notes || "Standard physical condition audit log.",
      copies_affected: formData.copies_affected,
      audited_by: `${currentUser?.full_name || "Librarian"} (${currentUser?.role || "LIBRARIAN"})`,
    });

    setIsModalOpen(false);
    setFormData({
      book_id: "",
      condition_status: "DAMAGED",
      notes: "",
      copies_affected: 1,
    });
    loadData();
  };

  const filteredAudits = audits.filter((a) => {
    const matchesSearch =
      a.book_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.isbn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || a.condition_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-amber-600">
            {audits.filter((a) => a.condition_status === "DAMAGED").reduce((acc, a) => acc + a.copies_affected, 0)}
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Damaged Copies</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-rose-600">
            {audits.filter((a) => a.condition_status === "LOST").reduce((acc, a) => acc + a.copies_affected, 0)}
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Reported Lost Copies</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-purple-600">
            {audits.filter((a) => a.condition_status === "WEEDING").reduce((acc, a) => acc + a.copies_affected, 0)}
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Weeded / Decommissioned</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{audits.length}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Total Audit Logs</p>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2.5 w-full">
          <input
            type="text"
            placeholder="Search book title, ISBN, auditor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 rounded border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 bg-white"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 text-xs focus:outline-none focus:border-blue-600 bg-white"
          >
            <option value="ALL">All Conditions</option>
            <option value="GOOD">Good</option>
            <option value="DAMAGED">Damaged</option>
            <option value="LOST">Lost</option>
            <option value="WEEDING">Weeding</option>
          </select>
        </div>

        {(isAdmin || isLibrarian) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all ml-auto md:ml-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Audit</span>
          </button>
        )}
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <th className="p-3">BOOK TITLE & ISBN</th>
                <th className="p-3">CONDITION STATUS</th>
                <th className="p-3">COPIES AFFECTED</th>
                <th className="p-3">AUDIT NOTES</th>
                <th className="p-3">AUDITED BY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAudits.map((audit) => (
                <tr key={audit.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{audit.book_title}</div>
                    <div className="text-[11px] text-slate-500">ISBN: {audit.isbn}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                        audit.condition_status === "GOOD"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : audit.condition_status === "DAMAGED"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : audit.condition_status === "LOST"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {audit.condition_status}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-900">{audit.copies_affected} Copy(ies)</td>
                  <td className="p-3 text-slate-600 italic">"{audit.notes}"</td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-900">{audit.audited_by}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(audit.audited_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-lg border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">
              Log Condition Audit
            </h3>

            <form onSubmit={handleCreateAudit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Book *</label>
                <select
                  required
                  value={formData.book_id}
                  onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600 bg-white"
                >
                  <option value="">-- Choose Book --</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.isbn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Condition Status</label>
                  <select
                    value={formData.condition_status}
                    onChange={(e) => setFormData({ ...formData, condition_status: e.target.value as ConditionStatus })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600 bg-white"
                  >
                    <option value="GOOD">Good Condition</option>
                    <option value="DAMAGED">Damaged</option>
                    <option value="LOST">Lost / Missing</option>
                    <option value="WEEDING">Weeding</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Copies Affected</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.copies_affected}
                    onChange={(e) => setFormData({ ...formData, copies_affected: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inspection Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                >
                  Save Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
