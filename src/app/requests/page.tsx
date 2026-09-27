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
  Plus,
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

  return (
    <div className="space-y-5">
      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{requests.length}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Total Requests</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-amber-600">
            {requests.filter((r) => r.status === "PENDING").length}
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Pending Review</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-emerald-600">
            {requests.filter((r) => r.status === "APPROVED" || r.status === "ORDERED").length}
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Approved / Ordered</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-blue-600">₹{totalCostApproved.toFixed(2)}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Approved Budget</p>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2.5 w-full">
          <input
            type="text"
            placeholder="Search request title, author, requester..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 rounded border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 bg-white"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 text-xs focus:outline-none focus:border-blue-600 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="ORDERED">Ordered</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {(isFaculty || isAdmin || isLibrarian) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all ml-auto md:ml-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Request</span>
          </button>
        )}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <th className="p-3">BOOK TITLE & DETAILS</th>
                <th className="p-3">REQUESTER & DEPT</th>
                <th className="p-3">PRIORITY & COST</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No acquisition requests found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-xs">{req.title}</div>
                      <div className="text-[11px] text-slate-500">
                        by {req.author} {req.publisher && `• ${req.publisher}`} {req.isbn && `(ISBN: ${req.isbn})`}
                      </div>
                      <p className="text-[11px] text-slate-500 italic mt-0.5">"{req.reason}"</p>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{req.faculty_name}</div>
                      <div className="text-[11px] text-slate-500">{req.department}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase">
                        {req.priority}
                      </span>
                      <div className="text-xs font-bold text-blue-600 mt-1">
                        ₹{req.estimated_cost.toFixed(2)}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                          req.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : req.status === "ORDERED"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : req.status === "REJECTED"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {req.status}
                      </span>
                      {req.admin_notes && (
                        <p className="text-[10px] text-slate-500 mt-1">Note: {req.admin_notes}</p>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {isAdmin || isLibrarian ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status !== "APPROVED" && (
                            <button
                              onClick={() => handleOpenStatusModal(req, "APPROVED")}
                              className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200"
                            >
                              Approve
                            </button>
                          )}
                          {req.status !== "ORDERED" && req.status === "APPROVED" && (
                            <button
                              onClick={() => handleOpenStatusModal(req, "ORDERED")}
                              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
                            >
                              Order
                            </button>
                          )}
                          {req.status !== "REJECTED" && (
                            <button
                              onClick={() => handleOpenStatusModal(req, "REJECTED")}
                              className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Faculty Request</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">
              Submit Acquisition Request
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est. Cost (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.estimated_cost}
                    onChange={(e) => setFormData({ ...formData, estimated_cost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Acquisition *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {notesModalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm p-6 rounded-lg border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              Update Status: {targetStatus}
            </h3>

            <form onSubmit={handleStatusSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reviewer Notes (Optional)</label>
                <textarea
                  rows={3}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="e.g. Approved under Q2 Budget..."
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setNotesModalOpen(false)}
                  className="px-3 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
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
