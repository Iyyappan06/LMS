"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import { UserProfile, UserRole } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit2,
  X,
  Sparkles,
} from "lucide-react";

export default function MembersPage() {
  const { canManageMembers } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProfile, setEditProfile] = useState<UserProfile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "STUDENT" as UserRole,
    department: "Computer Science & Engineering",
    max_books_allowed: 3,
    phone: "+1-555-0199",
  });

  const loadData = () => {
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

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) {
      alert("Please provide name and email.");
      return;
    }

    DataStore.saveProfile({
      id: editProfile ? editProfile.id : undefined,
      full_name: formData.full_name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      max_books_allowed: Number(formData.max_books_allowed),
      phone: formData.phone,
    });

    setModalOpen(false);
    setEditProfile(null);
    showToast(editProfile ? "Member profile updated!" : "New member registered!");
  };

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.department || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-medium shadow-2xl flex items-center gap-3 border border-indigo-400/40 animate-slide-up">
            <CheckCircle2 className="w-5 h-5 text-indigo-200" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Users className="w-6 h-6 text-indigo-400" />
              <span>Library Member Directory (Module 3)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage student, faculty, coordinator, and librarian accounts and their respective borrowing privilege limits.
            </p>
          </div>

          {canManageMembers && (
            <button
              onClick={() => {
                setEditProfile(null);
                setFormData({
                  full_name: "",
                  email: "",
                  role: "STUDENT",
                  department: "Computer Science & Engineering",
                  max_books_allowed: 3,
                  phone: "+1-555-0199",
                });
                setModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Member</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member name, email, or department..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs overflow-x-auto">
            {["ALL", "STUDENT", "FACULTY", "COORDINATOR", "LIBRARIAN", "ADMIN"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  roleFilter === r ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto glass-panel rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-white/10">
              <tr>
                <th className="p-3.5">Member Name</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Borrowing Quota</th>
                <th className="p-3.5">Contact Phone</th>
                <th className="p-3.5">Status</th>
                {canManageMembers && <th className="p-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProfiles.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-white font-bold text-xs">
                        {p.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{p.full_name}</p>
                        <p className="text-[11px] text-slate-400">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {p.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300">{p.department || "General"}</td>
                  <td className="p-3.5 font-semibold text-white">{p.max_books_allowed} Books Max</td>
                  <td className="p-3.5 text-slate-400 font-mono">{p.phone || "—"}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {p.status}
                    </span>
                  </td>
                  {canManageMembers && (
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setEditProfile(p);
                          setFormData({
                            full_name: p.full_name,
                            email: p.email,
                            role: p.role,
                            department: p.department || "Computer Science",
                            max_books_allowed: p.max_books_allowed,
                            phone: p.phone || "",
                          });
                          setModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10"
                        title="Edit Member"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-dropdown w-full max-w-md rounded-3xl p-6 border border-white/15 animate-slide-up">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span>{editProfile ? "Edit Member Profile" : "Register New Member"}</span>
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMember} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="john@university.edu"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Role *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => {
                        const newRole = e.target.value as UserRole;
                        setFormData({
                          ...formData,
                          role: newRole,
                          max_books_allowed: newRole === "STUDENT" ? 3 : newRole === "FACULTY" ? 5 : 99,
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="FACULTY">FACULTY</option>
                      <option value="COORDINATOR">COORDINATOR</option>
                      <option value="LIBRARIAN">LIBRARIAN</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Max Books Allowed</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.max_books_allowed}
                      onChange={(e) => setFormData({ ...formData, max_books_allowed: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Computer Science & Engineering"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30">
                    {editProfile ? "Save Changes" : "Register Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
