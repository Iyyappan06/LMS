"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data-store";
import { UserProfile, UserRole, UserStatus } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  Building2,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Phone,
  Mail,
  X,
} from "lucide-react";

export default function MemberDirectoryPage() {
  const { canManageMembers } = useAuth();
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "••••••••••••",
    full_name: "",
    email: "",
    role: "STUDENT" as UserRole,
    department: "Computer Science & Engineering",
    phone: "",
    max_books_allowed: 3,
    status: "ACTIVE" as UserStatus,
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

  const handleOpenCreateModal = () => {
    setEditingMemberId(null);
    setFormData({
      username: "",
      password: "••••••••••••",
      full_name: "",
      email: "",
      role: "STUDENT",
      department: "Computer Science & Engineering",
      phone: "+1 555-0199",
      max_books_allowed: 3,
      status: "ACTIVE",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: UserProfile) => {
    setEditingMemberId(member.id);
    setFormData({
      username: member.full_name.split(" ")[0].toLowerCase(),
      password: "••••••••••••",
      full_name: member.full_name,
      email: member.email,
      role: member.role,
      department: member.department || "Computer Science",
      phone: member.phone || "+1 555-0199",
      max_books_allowed: member.max_books_allowed,
      status: member.status || "ACTIVE",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) {
      alert("Full Name and Email Address are required.");
      return;
    }

    DataStore.saveProfile({
      id: editingMemberId || undefined,
      full_name: formData.full_name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      phone: formData.phone || "+1 555-0199",
      max_books_allowed: Number(formData.max_books_allowed) || 3,
      status: formData.status,
    });

    setIsModalOpen(false);
    loadMembers();
  };

  const handleDeleteMember = (member: UserProfile) => {
    if (confirm(`Are you sure you want to delete ${member.full_name}?`)) {
      DataStore.deleteProfile(member.id);
      loadMembers();
    }
  };

  const handleToggleStatus = (member: UserProfile) => {
    const newStatus = member.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    DataStore.saveProfile({
      ...member,
      status: newStatus,
    });
    loadMembers();
  };

  const handleRoleChange = (role: UserRole) => {
    let limit = 3;
    if (role === "FACULTY" || role === "COORDINATOR") limit = 5;
    if (role === "ADMIN" || role === "LIBRARIAN") limit = 99;
    setFormData((prev) => ({ ...prev, role, max_books_allowed: limit }));
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

        {canManageMembers && (
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-2 rounded bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ml-auto md:ml-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* Members Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-3 relative group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                  {member.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {member.full_name}
                  </h3>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                member.role === "ADMIN" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                member.role === "LIBRARIAN" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                member.role === "FACULTY" ? "bg-indigo-50 text-indigo-700 border border-indigo-200" :
                "bg-blue-50 text-blue-700 border border-blue-200"
              }`}>
                {member.role}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
              <p className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{member.department || "General Department"}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Max Books Limit: <strong className="text-slate-800">{member.max_books_allowed}</strong></span>
              </p>
              <p className="flex items-center justify-between pt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  member.status === "SUSPENDED" ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}>
                  {member.status || "ACTIVE"}
                </span>

                {canManageMembers && (
                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEditModal(member)}
                      className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                      title="Edit Member"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(member)}
                      className="p-1 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded"
                      title={member.status === "ACTIVE" ? "Suspend Member" : "Activate Member"}
                    >
                      {member.status === "ACTIVE" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member)}
                      className="p-1 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded"
                      title="Delete Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* User Registration / Edit Modal matching User's Exact Screenshot */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl p-6 sm:p-8 rounded-lg border border-slate-200 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                {editingMemberId ? "Edit User Profile" : "User Registration"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                Back to Users
              </button>
            </div>

            {/* Registration Form matching Screenshot */}
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 bg-[#eef4ff] border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-600 text-xs font-medium"
                    placeholder="Iyyappan"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-[#eef4ff] border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-600 text-xs"
                    placeholder="••••••••••••"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                    placeholder="e.g. John Doe"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                    placeholder="e.g. jdoe@university.edu"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="LIBRARIAN">Librarian</option>
                    <option value="ADMIN">Admin</option>
                    <option value="COORDINATOR">Coordinator</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                    placeholder="e.g. Computer Science"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                    placeholder="e.g. +1 555-0199"
                  />
                </div>

                {/* Max Borrowing Limit */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Max Borrowing Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={formData.max_books_allowed}
                    onChange={(e) => setFormData({ ...formData, max_books_allowed: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                    placeholder="3"
                  />
                </div>
              </div>

              {/* Action Buttons at Bottom Right */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded shadow-sm transition-all"
                >
                  {editingMemberId ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
