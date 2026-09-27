"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data-store";
import { UserProfile, UserRole } from "@/lib/types";
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function MemberDirectoryPage() {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "STUDENT" as UserRole,
    department: "Computer Science & Engineering",
    phone: "",
    max_books_allowed: 3,
  });

  const loadMembers = () => {
    setMembers(DataStore.getProfiles());
  };

  useEffect(() => {
    loadMembers();
    const handleDataChange = () => loadMembers();
    window.addEventListener("lms_data_change", handleDataChange);
    return () => window.removeEventListener("lms_data_change", handleDataChange);
  }, []);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) {
      alert("Name and email are required.");
      return;
    }

    DataStore.saveProfile({
      full_name: formData.full_name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      phone: formData.phone || "+1-555-0199",
      max_books_allowed: formData.role === "STUDENT" ? 3 : formData.role === "FACULTY" ? 5 : 99,
      status: "ACTIVE",
    });

    setIsModalOpen(false);
    setFormData({
      full_name: "",
      email: "",
      role: "STUDENT",
      department: "Computer Science & Engineering",
      phone: "",
      max_books_allowed: 3,
    });
    loadMembers();
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.department && m.department.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-5">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2.5 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search member name, email, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 bg-white"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 text-xs focus:outline-none focus:border-blue-600 bg-white"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
            <option value="LIBRARIAN">Librarian</option>
            <option value="ADMIN">Admin</option>
            <option value="COORDINATOR">Coordinator</option>
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all ml-auto md:ml-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Members Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                  {member.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{member.full_name}</h3>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase">
                {member.role}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
              <p className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {member.department || "General Department"}
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                Max Books Limit: <strong className="text-slate-800">{member.max_books_allowed}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-lg border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">
              Add New Member Profile
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600 bg-white"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="LIBRARIAN">Librarian</option>
                    <option value="ADMIN">Admin</option>
                    <option value="COORDINATOR">Coordinator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                  />
                </div>
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
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
