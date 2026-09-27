"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import { FineRecord } from "@/lib/types";
import {
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  Search,
  CreditCard,
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
    <div className="space-y-5">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-rose-600">${totalUnpaid.toFixed(2)}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Unpaid Balance</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-emerald-600">${totalCollected.toFixed(2)}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Total Revenue Collected</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-blue-600">${totalWaived.toFixed(2)}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Total Waived Fines</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{fines.length}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Overdue Records</p>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2.5 w-full">
          <input
            type="text"
            placeholder="Search member, email, book title..."
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
            <option value="UNPAID">Unpaid</option>
            <option value="PAID">Paid</option>
            <option value="WAIVED">Waived</option>
          </select>
        </div>
      </div>

      {/* Fines Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <th className="p-3">MEMBER DETAILS</th>
                <th className="p-3">BOOK TITLE & OVERDUE INFO</th>
                <th className="p-3">FINE AMOUNT</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No fine records found.
                  </td>
                </tr>
              ) : (
                filteredFines.map((fine) => (
                  <tr key={fine.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{fine.user_name}</div>
                      <div className="text-[11px] text-slate-500">{fine.user_email}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{fine.book_title}</div>
                      <div className="text-[11px] text-rose-600 font-semibold">
                        {fine.days_overdue} Days Overdue ({fine.reason})
                      </div>
                    </td>
                    <td className="p-3 font-extrabold text-slate-900 text-sm">
                      ${fine.amount.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                          fine.payment_status === "PAID"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : fine.payment_status === "WAIVED"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200 font-bold"
                        }`}
                      >
                        {fine.payment_status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {fine.payment_status === "UNPAID" && (isLibrarian || isAdmin) ? (
                        <button
                          onClick={() => {
                            setSelectedFine(fine);
                            setPaymentModalOpen(true);
                          }}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
                        >
                          Settle Fine
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settle Modal */}
      {paymentModalOpen && selectedFine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm p-6 rounded-lg border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              Settle Fine Payment
            </h3>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
              <p><strong className="text-slate-700">Member:</strong> {selectedFine.user_name}</p>
              <p><strong className="text-slate-700">Book:</strong> {selectedFine.book_title}</p>
              <p><strong className="text-slate-700">Fine Amount:</strong> ${selectedFine.amount.toFixed(2)}</p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-semibold text-slate-700">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600 bg-white"
              >
                <option value="Credit Card">Credit / Debit Card</option>
                <option value="Cash">Cash Counter Settlement</option>
                <option value="University Account">University Account Deduction</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <button
                type="button"
                onClick={() => handleSettleFine("WAIVED")}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
              >
                Waive Fine
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSettleFine("PAID")}
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
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
