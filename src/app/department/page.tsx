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
  Search,
  Filter,
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
      alert("Please fill in required fields.");
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
      r.book_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === "ALL" || r.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-5">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">{readings.length}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Recommended Texts</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-blue-600">
            {readings.filter((r) => r.is_mandatory).length}
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Mandatory Texts</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-emerald-600">
            {readings.filter((r) => r.status === "AVAILABLE").length}
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">In Stock</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-slate-900">
            {readings.reduce((acc, r) => acc + r.required_copies, 0)}
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Total Copies Required</p>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2.5 w-full">
          <input
            type="text"
            placeholder="Search course, book title, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 rounded border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 bg-white"
          />

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 text-xs focus:outline-none focus:border-blue-600 bg-white"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
          </select>
        </div>

        {(isCoordinator || isAdmin || isLibrarian) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all ml-auto md:ml-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Propose Reading</span>
          </button>
        )}
      </div>

      {/* Grid of Course Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReadings.map((reading) => (
          <div key={reading.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-xs">
                  {reading.course_code}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{reading.course_name}</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] uppercase">
                {reading.status}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-100 text-xs space-y-1">
              <p className="font-bold text-slate-900">{reading.book_title}</p>
              <p className="text-slate-500">by {reading.author} {reading.isbn && `| ISBN: ${reading.isbn}`}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span>{reading.department}</span>
              <span className="font-bold text-blue-600">{reading.required_copies} Copies Required</span>
            </div>
          </div>
        ))}
      </div>

      {/* Propose Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-lg border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">
              Propose Course Reading
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.course_code}
                    onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <input
                    type="text"
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.book_title}
                    onChange={(e) => setFormData({ ...formData, book_title: e.target.value })}
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
