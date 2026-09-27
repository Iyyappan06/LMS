"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import { Book } from "@/lib/types";
import {
  Search,
  Plus,
  BookOpen,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

export default function BookCatalogPage() {
  const { canManageBooks } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [quickFilter, setQuickFilter] = useState("");

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Computer Science",
    publisher: "",
    edition: "1st Edition",
    total_copies: 5,
    shelf_location: "Shelf CS-01",
    description: "",
  });

  const loadBooks = () => {
    setBooks(DataStore.getBooks());
  };

  useEffect(() => {
    loadBooks();
    const handleDataChange = () => loadBooks();
    window.addEventListener("lms_data_change", handleDataChange);
    return () => window.removeEventListener("lms_data_change", handleDataChange);
  }, []);

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("ALL");
    setStatusFilter("ALL");
    setQuickFilter("");
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.isbn) {
      alert("Title, Author, and ISBN are required.");
      return;
    }

    DataStore.saveBook({
      isbn: formData.isbn,
      title: formData.title,
      author: formData.author,
      category: formData.category,
      publisher: formData.publisher || "Academic Press",
      edition: formData.edition || "1st Edition",
      total_copies: Number(formData.total_copies),
      available_copies: Number(formData.total_copies),
      shelf_location: formData.shelf_location || "Shelf A-01",
      description: formData.description,
      is_active: true,
    });

    setAddModalOpen(false);
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "Computer Science",
      publisher: "",
      edition: "1st Edition",
      total_copies: 5,
      shelf_location: "Shelf CS-01",
      description: "",
    });
    loadBooks();
  };

  const categories = Array.from(new Set(books.map((b) => b.category)));

  const filteredBooks = books.filter((b) => {
    const query = (searchQuery || quickFilter).toLowerCase();
    const matchesSearch =
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.isbn.toLowerCase().includes(query);
    const matchesCat = categoryFilter === "ALL" || b.category === categoryFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "AVAILABLE" && b.available_copies > 0) ||
      (statusFilter === "CHECKED_OUT" && b.available_copies === 0);

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2.5 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by title, author, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 bg-white"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 text-xs focus:outline-none focus:border-blue-600 bg-white"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 text-xs focus:outline-none focus:border-blue-600 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="CHECKED_OUT">Checked Out</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => {}}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Search
          </button>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all"
          >
            Reset
          </button>

          {canManageBooks && (
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-3.5 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all ml-auto md:ml-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Book</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">
            Catalog Records ({filteredBooks.length})
          </h2>

          <input
            type="text"
            placeholder="Quick filter..."
            value={quickFilter}
            onChange={(e) => setQuickFilter(e.target.value)}
            className="px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 w-full sm:w-48 bg-white focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <th className="p-3">ISBN</th>
                <th className="p-3">BOOK DETAILS</th>
                <th className="p-3">CATEGORY</th>
                <th className="p-3">PUBLISHER & YEAR</th>
                <th className="p-3">AVAILABILITY</th>
                <th className="p-3">SHELF</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No book records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono text-slate-500">{book.isbn}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-xs">{book.title}</div>
                      <div className="text-[11px] text-slate-500">by {book.author}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                        {book.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      <div>{book.publisher || "Pearson"}</div>
                      <div className="text-[11px] text-slate-400">{book.edition || "1st Edition"}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                        {book.available_copies} / {book.total_copies}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-medium">{book.shelf_location || "Shelf A-01"}</td>
                    <td className="p-3">
                      {book.available_copies > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase">
                          AVAILABLE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase">
                          CHECKED OUT
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedBook(book);
                          setViewModalOpen(true);
                        }}
                        className="px-3 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-xs transition-all"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Book Modal */}
      {viewModalOpen && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">
              Book Details
            </h3>

            <div className="space-y-2 text-xs">
              <p><strong className="text-slate-700">Title:</strong> {selectedBook.title}</p>
              <p><strong className="text-slate-700">Author:</strong> {selectedBook.author}</p>
              <p><strong className="text-slate-700">ISBN:</strong> {selectedBook.isbn}</p>
              <p><strong className="text-slate-700">Category:</strong> {selectedBook.category}</p>
              <p><strong className="text-slate-700">Shelf Location:</strong> {selectedBook.shelf_location}</p>
              <p><strong className="text-slate-700">Available Copies:</strong> {selectedBook.available_copies} / {selectedBook.total_copies}</p>
              {selectedBook.description && (
                <p><strong className="text-slate-700">Description:</strong> {selectedBook.description}</p>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-lg border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">
              Add New Book
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title *</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ISBN *</label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.total_copies}
                    onChange={(e) => setFormData({ ...formData, total_copies: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shelf Location</label>
                  <input
                    type="text"
                    value={formData.shelf_location}
                    onChange={(e) => setFormData({ ...formData, shelf_location: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-900 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
