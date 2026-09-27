"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import { CourseReading } from "@/lib/types";
import {
  GraduationCap,
  Plus,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Layers,
  Sparkles,
  PieChart,
} from "lucide-react";

export default function DepartmentResourcesPage() {
  const { currentUser, isCoordinator, isAdmin, isLibrarian } = useAuth();
  const [readings, setReadings] = useState<CourseReading[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    department: currentUser.department || "Computer Science & Engineering",
    coordinator_name: currentUser.full_name,
    book_title: "",
    author: "",
    isbn: "",
    required_copies: 10,
    is_mandatory: true,
    semester: "Spring 2026",
    academic_year: "2025-2026",
    status: "PROPOSED" as const,
  });

  const loadData = () => {
    setReadings(DataStore.getReadings());
  };

  useEffect(() => {
    loadData();
    const handleDataChange = () => loadData();
    window.addEventListener("lms_data_change", handleDataChange);
    return () => window.removeEventListener("lms_data_change", handleDataChange);
  }, []);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course_code || !formData.course_name || !formData.book_title || !formData.author) {
      alert("Please fill in required fields (Course Code, Course Name, Book Title, Author).");
      return;
    }

    DataStore.saveReading(formData);
    setIsModalOpen(false);
    setFormData({
      course_code: "",
      course_name: "",
      department: currentUser.department || "Computer Science & Engineering",
      coordinator_name: currentUser.full_name,
      book_title: "",
      author: "",
      isbn: "",
      required_copies: 10,
      is_mandatory: true,
      semester: "Spring 2026",
      academic_year: "2025-2026",
      status: "PROPOSED",
    });
    loadData();
  };

  const filteredReadings = readings.filter((r) => {
    const matchesSearch =
      r.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.book_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === "ALL" || r.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const totalRequiredCopies = readings.reduce((acc, r) => acc + r.required_copies, 0);
  const mandatoryCount = readings.filter((r) => r.is_mandatory).length;
  const availableCount = readings.filter((r) => r.status === "AVAILABLE").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <GraduationCap className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Department Resource Coordination</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Curriculum textbook alignment, course reading lists, and department resource allocation metrics.
          </p>
        </div>
        {(isCoordinator || isAdmin || isLibrarian) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-600/30 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Propose Course Reading
          </button>
        )}
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Recommended Texts</p>
            <p className="text-2xl font-bold text-white">{readings.length}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Mandatory Course Texts</p>
            <p className="text-2xl font-bold text-indigo-300">{mandatoryCount}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">In Stock & Ready</p>
            <p className="text-2xl font-bold text-emerald-300">{availableCount}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Required Copies</p>
            <p className="text-2xl font-bold text-amber-300">{totalRequiredCopies}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search course, book title, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Business Administration">Business Administration</option>
          </select>
        </div>
      </div>

      {/* Course Readings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReadings.length === 0 ? (
          <div className="col-span-full glass-panel p-8 rounded-2xl border border-white/10 text-center text-slate-400">
            No course textbook recommendations found.
          </div>
        ) : (
          filteredReadings.map((reading) => (
            <div
              key={reading.id}
              className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-purple-500/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {reading.course_code}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{reading.semester}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{reading.course_name}</h3>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                    reading.status === "AVAILABLE"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : reading.status === "APPROVED"
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {reading.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                <div className="font-semibold text-white text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  {reading.book_title}
                </div>
                <p className="text-xs text-slate-400">by {reading.author} {reading.isbn && `• ISBN: ${reading.isbn}`}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {reading.department}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-purple-300">{reading.required_copies} Copies Required</span>
                  {reading.is_mandatory && (
                    <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      Mandatory
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Propose Course Reading Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              Propose Recommended Course Reading
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.course_code}
                    onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                    placeholder="e.g. CS302"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Semester</label>
                  <input
                    type="text"
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  placeholder="e.g. Database Management Systems"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Recommended Book Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.book_title}
                    onChange={(e) => setFormData({ ...formData, book_title: e.target.value })}
                    placeholder="e.g. Database System Concepts"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. Silberschatz"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Required Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.required_copies}
                    onChange={(e) => setFormData({ ...formData, required_copies: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Requirement Type</label>
                  <select
                    value={formData.is_mandatory ? "MANDATORY" : "OPTIONAL"}
                    onChange={(e) => setFormData({ ...formData, is_mandatory: e.target.value === "MANDATORY" })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-purple-500"
                  >
                    <option value="MANDATORY">Mandatory Textbook</option>
                    <option value="OPTIONAL">Optional Reference</option>
                  </select>
                </div>
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
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-600/30"
                >
                  Save Recommendation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
