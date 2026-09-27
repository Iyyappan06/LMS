"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import { Book, ConditionStatus, InventoryAudit } from "@/lib/types";
import {
  ClipboardCheck,
  AlertOctagon,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  BookOpen,
  FileText,
} from "lucide-react";

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
      alert("Please select a valid book from the catalog.");
      return;
    }

    DataStore.saveAudit({
      book_id: book.id,
      book_title: book.title,
      isbn: book.isbn,
      condition_status: formData.condition_status,
      notes: formData.notes || "Standard physical condition audit log.",
      copies_affected: formData.copies_affected,
      audited_by: `${currentUser.full_name} (${currentUser.role})`,
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
      a.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.audited_by.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || a.condition_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDamaged = audits
    .filter((a) => a.condition_status === "DAMAGED")
    .reduce((acc, a) => acc + a.copies_affected, 0);

  const totalLost = audits
    .filter((a) => a.condition_status === "LOST")
    .reduce((acc, a) => acc + a.copies_affected, 0);

  const totalWeeding = audits
    .filter((a) => a.condition_status === "WEEDING")
    .reduce((acc, a) => acc + a.copies_affected, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <ClipboardCheck className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Inventory & Condition Audits</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Physical inventory audits, tracking damaged or missing books, and decommissioning weeded stock.
          </p>
        </div>
        {(isAdmin || isLibrarian) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-lg shadow-teal-600/30 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Log Condition Audit
          </button>
        )}
      </div>

      {/* Audit Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Damaged Books</p>
            <p className="text-2xl font-bold text-amber-300">{totalDamaged}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Reported Lost Copies</p>
            <p className="text-2xl font-bold text-rose-300">{totalLost}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Decommissioned / Weeded</p>
            <p className="text-2xl font-bold text-purple-300">{totalWeeding}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Audits Logged</p>
            <p className="text-2xl font-bold text-teal-300">{audits.length}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search book title, ISBN, auditor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-1.5">
            {["ALL", "GOOD", "DAMAGED", "LOST", "WEEDING"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  statusFilter === st
                    ? "bg-teal-600 text-white border-teal-500"
                    : "bg-slate-900/60 text-slate-400 border-white/10 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/80 text-slate-400 text-xs uppercase font-semibold tracking-wider">
                <th className="p-4">Book Title & ISBN</th>
                <th className="p-4">Condition Status</th>
                <th className="p-4">Copies Affected</th>
                <th className="p-4">Audit Notes</th>
                <th className="p-4">Audited By & Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredAudits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No inventory audit records found.
                  </td>
                </tr>
              ) : (
                filteredAudits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{audit.book_title}</div>
                      <div className="text-xs text-slate-400">ISBN: {audit.isbn}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                          audit.condition_status === "GOOD"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : audit.condition_status === "DAMAGED"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : audit.condition_status === "LOST"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                            : "bg-purple-500/20 text-purple-300 border-purple-500/40"
                        }`}
                      >
                        {audit.condition_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-white">{audit.copies_affected} Copy(ies)</span>
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-slate-300 italic line-clamp-2">"{audit.notes}"</p>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-semibold text-white">{audit.audited_by}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(audit.audited_at).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Audit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-teal-400" />
              Log Inventory Condition Audit
            </h2>

            <form onSubmit={handleCreateAudit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Book from Catalog *</label>
                <select
                  required
                  value={formData.book_id}
                  onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-teal-500"
                >
                  <option value="">-- Choose Book --</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.isbn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Condition Status</label>
                  <select
                    value={formData.condition_status}
                    onChange={(e) => setFormData({ ...formData, condition_status: e.target.value as ConditionStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-teal-500"
                  >
                    <option value="GOOD">GOOD Condition</option>
                    <option value="DAMAGED">DAMAGED (Needs Repair)</option>
                    <option value="LOST">LOST / Missing</option>
                    <option value="WEEDING">WEEDING (Decommission)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Copies Affected</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.copies_affected}
                    onChange={(e) => setFormData({ ...formData, copies_affected: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Audit Notes & Inspection Findings</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Record shelf location, exact damage details or missing copy notes..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-lg shadow-teal-600/30"
                >
                  Log Audit Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
