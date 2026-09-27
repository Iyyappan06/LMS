"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import { BookRequest, BookRequestPriority, BookRequestStatus } from "@/lib/types";
import {
  FilePlus,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  Clock,
  Search,
  Filter,
  AlertCircle,
  Sparkles,
  DollarSign,
  Building2,
  BookOpen,
} from "lucide-react";

export default function FacultyRequestsPage() {
  const { currentUser, isFaculty, isLibrarian, isAdmin } = useAuth();
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for new Request
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    reason: "",
    department: currentUser.department || "Computer Science & Engineering",
    estimated_cost: 49.99,
    priority: "MEDIUM" as BookRequestPriority,
  });

  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<BookRequest | null>(null);
  const [targetStatus, setTargetStatus] = useState<BookRequestStatus>("APPROVED");
  const [adminNotesInput, setAdminNotesInput] = useState("");

  const loadRequests = () => {
    setRequests(DataStore.getRequests());
  };

  useEffect(() => {
    loadRequests();
    const handleDataChange = () => loadRequests();
    window.addEventListener("lms_data_change", handleDataChange);
    return () => window.removeEventListener("lms_data_change", handleDataChange);
  }, []);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.reason) {
      alert("Please fill in all required fields (Title, Author, Reason).");
      return;
    }

    DataStore.saveRequest({
      faculty_id: currentUser.id,
      faculty_name: currentUser.full_name,
      faculty_email: currentUser.email,
      title: formData.title,
      author: formData.author,
      publisher: formData.publisher,
      isbn: formData.isbn,
      reason: formData.reason,
      department: formData.department,
      estimated_cost: Number(formData.estimated_cost),
      priority: formData.priority,
    });

    setIsModalOpen(false);
    setFormData({
      title: "",
      author: "",
      publisher: "",
      isbn: "",
      reason: "",
      department: currentUser.department || "Computer Science & Engineering",
      estimated_cost: 49.99,
      priority: "MEDIUM",
    });
    loadRequests();
  };

  const handleOpenStatusModal = (req: BookRequest, status: BookRequestStatus) => {
    setSelectedReq(req);
    setTargetStatus(status);
    setAdminNotesInput(req.admin_notes || "");
    setNotesModalOpen(true);
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    DataStore.updateRequestStatus(selectedReq.id, targetStatus, adminNotesInput);
    setNotesModalOpen(false);
    setSelectedReq(null);
    loadRequests();
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.faculty_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCostApproved = requests
    .filter((r) => r.status === "APPROVED" || r.status === "ORDERED")
    .reduce((acc, r) => acc + r.estimated_cost, 0);

  const getPriorityBadge = (priority: BookRequestPriority) => {
    switch (priority) {
      case "URGENT":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "HIGH":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "MEDIUM":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/40";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  const getStatusBadge = (status: BookRequestStatus) => {
    switch (status) {
      case "APPROVED":
        return { icon: CheckCircle2, cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
      case "ORDERED":
        return { icon: ShoppingCart, cls: "bg-sky-500/20 text-sky-300 border-sky-500/40" };
      case "REJECTED":
        return { icon: XCircle, cls: "bg-rose-500/20 text-rose-300 border-rose-500/40" };
      default:
        return { icon: Clock, cls: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FilePlus className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Faculty Book Acquisition Requests</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Submit request recommendations for new academic research titles, course materials, and library procurement.
          </p>
        </div>
        {(isFaculty || isAdmin || isLibrarian) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Submit New Request
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Requests</p>
            <p className="text-2xl font-bold text-white">{requests.length}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Pending Review</p>
            <p className="text-2xl font-bold text-amber-300">
              {requests.filter((r) => r.status === "PENDING").length}
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Approved / Ordered</p>
            <p className="text-2xl font-bold text-emerald-300">
              {requests.filter((r) => r.status === "APPROVED" || r.status === "ORDERED").length}
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Est. Approved Budget</p>
            <p className="text-2xl font-bold text-sky-300">${totalCostApproved.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search request title, author, requester..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["ALL", "PENDING", "APPROVED", "ORDERED", "REJECTED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  statusFilter === st
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : "bg-slate-900/60 text-slate-400 border-white/10 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/80 text-slate-400 text-xs uppercase font-semibold tracking-wider">
                <th className="p-4">Book Title & Details</th>
                <th className="p-4">Requester & Dept</th>
                <th className="p-4">Priority & Cost</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No acquisition requests found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const statusInfo = getStatusBadge(req.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={req.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-base">{req.title}</div>
                        <div className="text-xs text-slate-400">
                          by <span className="text-slate-300">{req.author}</span>
                          {req.publisher && ` • ${req.publisher}`}
                          {req.isbn && ` (ISBN: ${req.isbn})`}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 italic line-clamp-1">"{req.reason}"</p>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{req.faculty_name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-indigo-400" />
                          {req.department}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadge(req.priority)}`}>
                          {req.priority}
                        </span>
                        <div className="text-sm font-bold text-emerald-400 mt-1">
                          ${req.estimated_cost.toFixed(2)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${statusInfo.cls}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {req.status}
                        </span>
                        {req.admin_notes && (
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1" title={req.admin_notes}>
                            Note: {req.admin_notes}
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {(isAdmin || isLibrarian) ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {req.status !== "APPROVED" && (
                              <button
                                onClick={() => handleOpenStatusModal(req, "APPROVED")}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-semibold"
                              >
                                Approve
                              </button>
                            )}
                            {req.status !== "ORDERED" && req.status === "APPROVED" && (
                              <button
                                onClick={() => handleOpenStatusModal(req, "ORDERED")}
                                className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30 text-xs font-semibold"
                              >
                                Mark Ordered
                              </button>
                            )}
                            {req.status !== "REJECTED" && (
                              <button
                                onClick={() => handleOpenStatusModal(req, "REJECTED")}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-semibold"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Faculty Request</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FilePlus className="w-5 h-5 text-indigo-400" />
              Submit Book Acquisition Request
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Designing Data-Intensive Applications"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Author(s) *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. Martin Kleppmann"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    placeholder="e.g. O'Reilly"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="978-XXXXX"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Est. Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.estimated_cost}
                    onChange={(e) => setFormData({ ...formData, estimated_cost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as BookRequestPriority })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Course Requirement *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Specify why this book is recommended for purchase (e.g., Course textbook for CS401, research reference)..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Review / Status Update Modal */}
      {notesModalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-400" />
              Update Status: <span className="text-indigo-300">{targetStatus}</span>
            </h3>

            <p className="text-xs text-slate-300">
              Updating status for request: <strong className="text-white">{selectedReq.title}</strong>
            </p>

            <form onSubmit={handleStatusSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reviewer Notes / Budget remarks (Optional)
                </label>
                <textarea
                  rows={3}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="e.g. Approved under Q2 Library Acquisition Budget..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNotesModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 text-xs"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
