"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import { FineRecord, PaymentStatus } from "@/lib/types";
import {
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  CreditCard,
  Receipt,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

export default function FineOverduesPage() {
  const { currentUser, isLibrarian, isAdmin } = useAuth();
  const [fines, setFines] = useState<FineRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedFine, setSelectedFine] = useState<FineRecord | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  const loadData = () => {
    setFines(DataStore.getFines());
  };

  useEffect(() => {
    loadData();
    const handleDataChange = () => loadData();
    window.addEventListener("lms_data_change", handleDataChange);
    return () => window.removeEventListener("lms_data_change", handleDataChange);
  }, []);

  const handleSettleFine = (action: "PAID" | "WAIVED") => {
    if (!selectedFine) return;
    DataStore.settleFine(
      selectedFine.id,
      action,
      action === "PAID" ? paymentMethod : undefined,
      action === "WAIVED" ? currentUser.full_name : undefined
    );
    setPaymentModalOpen(false);
    setSelectedFine(null);
    loadData();
  };

  const filteredFines = fines.filter((f) => {
    const matchesSearch =
      f.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.book_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || f.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalUnpaid = fines
    .filter((f) => f.payment_status === "UNPAID")
    .reduce((acc, f) => acc + f.amount, 0);

  const totalCollected = fines
    .filter((f) => f.payment_status === "PAID")
    .reduce((acc, f) => acc + f.amount, 0);

  const totalWaived = fines
    .filter((f) => f.payment_status === "WAIVED")
    .reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <DollarSign className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Fine & Overdue Settlement Manager</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Track overdue book loans, calculated late penalties, fee settlements, and waivers.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Unpaid Balance</p>
            <p className="text-2xl font-bold text-rose-300">${totalUnpaid.toFixed(2)}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Revenue Collected</p>
            <p className="text-2xl font-bold text-emerald-300">${totalCollected.toFixed(2)}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Waived Fines</p>
            <p className="text-2xl font-bold text-indigo-300">${totalWaived.toFixed(2)}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Overdue Records</p>
            <p className="text-2xl font-bold text-amber-300">{fines.length}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search member, email, book title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-1.5">
            {["ALL", "UNPAID", "PAID", "WAIVED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  statusFilter === st
                    ? "bg-amber-600 text-white border-amber-500"
                    : "bg-slate-900/60 text-slate-400 border-white/10 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fines Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/80 text-slate-400 text-xs uppercase font-semibold tracking-wider">
                <th className="p-4">Member Details</th>
                <th className="p-4">Book Title & Overdue Info</th>
                <th className="p-4">Fine Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredFines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No fine records found matching search filters.
                  </td>
                </tr>
              ) : (
                filteredFines.map((fine) => (
                  <tr key={fine.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-amber-400" />
                        {fine.user_name}
                      </div>
                      <div className="text-xs text-slate-400">{fine.user_email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{fine.book_title}</div>
                      <div className="text-xs text-rose-400 font-semibold mt-0.5">
                        {fine.days_overdue} Days Overdue ({fine.reason})
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-base font-extrabold text-amber-400">${fine.amount.toFixed(2)}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                          fine.payment_status === "PAID"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : fine.payment_status === "WAIVED"
                            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                            : "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                        }`}
                      >
                        {fine.payment_status === "PAID" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {fine.payment_status === "WAIVED" && <Receipt className="w-3.5 h-3.5" />}
                        {fine.payment_status === "UNPAID" && <AlertTriangle className="w-3.5 h-3.5" />}
                        {fine.payment_status}
                      </span>
                      {fine.payment_method && (
                        <p className="text-[11px] text-slate-400 mt-1">Paid via {fine.payment_method}</p>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {fine.payment_status === "UNPAID" && (isLibrarian || isAdmin) ? (
                        <button
                          onClick={() => {
                            setSelectedFine(fine);
                            setPaymentModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-lg shadow-amber-600/30 transition-all"
                        >
                          Settle Fine
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fine Settlement Modal */}
      {paymentModalOpen && selectedFine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/10 space-y-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              Settle Fine Payment
            </h3>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
              <p className="text-xs text-slate-400">Member: <strong className="text-white">{selectedFine.user_name}</strong></p>
              <p className="text-xs text-slate-400">Book: <strong className="text-white">{selectedFine.book_title}</strong></p>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs text-slate-300 font-semibold">Fine Amount:</span>
                <span className="text-xl font-extrabold text-amber-400">${selectedFine.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Select Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-amber-500"
              >
                <option value="Credit Card">Credit / Debit Card</option>
                <option value="Cash">Cash Counter Settlement</option>
                <option value="University Account">University Student Account Deduction</option>
              </select>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSettleFine("WAIVED")}
                className="px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 font-semibold text-xs transition-all"
              >
                Waive Fine
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSettleFine("PAID")}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
