"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data-store";
import { SystemConfig } from "@/lib/types";
import { Save, Download, RotateCcw, CheckCircle2 } from "lucide-react";

export default function SystemSettingsPage() {
  const [config, setConfig] = useState<SystemConfig>({
    student_loan_days: 14,
    faculty_loan_days: 30,
    max_renewals_allowed: 2,
    fine_per_day: 0.5,
    library_name: "Apex University Central Library",
    contact_email: "library-support@apex.edu",
    operating_hours: "Mon - Fri: 8:00 AM - 10:00 PM | Sat - Sun: 10:00 AM - 6:00 PM",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setConfig(DataStore.getConfig());
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.saveConfig(config);
    setToastMessage("System settings and circulation policies updated successfully!");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      config: DataStore.getConfig(),
      profiles: DataStore.getProfiles(),
      books: DataStore.getBooks(),
      borrows: DataStore.getBorrows(),
      requests: DataStore.getRequests(),
      readings: DataStore.getReadings(),
      fines: DataStore.getFines(),
      audits: DataStore.getAudits(),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `LMS_Backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5">
      {toastMessage && (
        <div className="p-3.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Settings Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
            Circulation Policies & Fine Rates
          </h2>

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Student Loan Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={config.student_loan_days}
                  onChange={(e) => setConfig({ ...config, student_loan_days: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Faculty Loan Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={config.faculty_loan_days}
                  onChange={(e) => setConfig({ ...config, faculty_loan_days: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Max Renewals Allowed
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={config.max_renewals_allowed}
                  onChange={(e) => setConfig({ ...config, max_renewals_allowed: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Overdue Fine Rate ($/Day)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  required
                  value={config.fine_per_day}
                  onChange={(e) => setConfig({ ...config, fine_per_day: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">
                Library Profile & Support Info
              </h3>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Library Name</label>
                <input
                  type="text"
                  required
                  value={config.library_name}
                  onChange={(e) => setConfig({ ...config, library_name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Support Email</label>
                <input
                  type="email"
                  required
                  value={config.contact_email}
                  onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>

        {/* Database Utilities */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 border-b pb-2">
              Backup & Database Snapshot
            </h3>

            <p className="text-xs text-slate-500">
              Download complete database backup snapshot (Profiles, Books, Borrows, Audits).
            </p>

            <button
              onClick={handleExportBackup}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Backup (.json)</span>
            </button>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 border-b pb-2">
              Reset Demo Data
            </h3>

            <p className="text-xs text-slate-500">
              Reset local database back to fresh seeded defaults.
            </p>

            <button
              onClick={() => {
                if (confirm("Reset local storage back to initial seed data?")) {
                  DataStore.resetAllData();
                }
              }}
              className="w-full px-3 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-all"
            >
              Reset Seed Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
