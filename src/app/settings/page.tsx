"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data-store";
import { SystemConfig } from "@/lib/types";
import {
  Settings,
  Save,
  Clock,
  DollarSign,
  Building,
  Mail,
  Shield,
  RotateCcw,
  Download,
  Database,
  CheckCircle2,
} from "lucide-react";

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

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all local storage data back to initial demo seeds?")) {
      DataStore.resetAllData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-500/20 text-slate-300 border border-slate-500/30">
              <Settings className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">System Administration & Settings</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Global library circulation policies, fine schedules, contact info, and database backup snapshots.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Circulation Config Form */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            Circulation Policies & Fine Rates
          </h2>

          <form onSubmit={handleSaveConfig} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Student Loan Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={config.student_loan_days}
                  onChange={(e) => setConfig({ ...config, student_loan_days: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  Faculty Loan Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={config.faculty_loan_days}
                  onChange={(e) => setConfig({ ...config, faculty_loan_days: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                  Max Renewals Allowed
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={config.max_renewals_allowed}
                  onChange={(e) => setConfig({ ...config, max_renewals_allowed: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  Overdue Fine Rate ($/Day)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  required
                  value={config.fine_per_day}
                  onChange={(e) => setConfig({ ...config, fine_per_day: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                Library Profile & Contact Information
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Library Name</label>
                <input
                  type="text"
                  required
                  value={config.library_name}
                  onChange={(e) => setConfig({ ...config, library_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  Support Email
                </label>
                <input
                  type="email"
                  required
                  value={config.contact_email}
                  onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={config.operating_hours || ""}
                  onChange={(e) => setConfig({ ...config, operating_hours: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Save className="w-4 h-4" />
                Save System Settings
              </button>
            </div>
          </form>
        </div>

        {/* Database Utilities & Maintenance */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-400" />
              Backup & Data Utilities
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed">
              Export full system state (Books, Circulation, Profiles, Audits, Requests) to JSON backup snapshot.
            </p>

            <button
              onClick={handleExportBackup}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              Download System Backup (.json)
            </button>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-rose-500/20 space-y-4 bg-rose-500/5">
            <h2 className="text-lg font-bold text-rose-300 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              Reset Factory State
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed">
              Reset all local demo storage back to fresh seeded defaults.
            </p>

            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/30 font-semibold text-xs transition-all"
            >
              Reset Seed Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
