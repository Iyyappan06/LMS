"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { DataStore } from "@/lib/data-store";
import { Book, UserProfile } from "@/lib/types";
import {
  BookOpen,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  BookmarkCheck,
  ArrowRightLeft,
  X,
  Layers,
  Sparkles,
} from "lucide-react";

export default function BooksPage() {
  const { currentUser, canManageBooks, canIssueReturn, isStudent, isFaculty } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState<"ALL" | "AVAILABLE" | "UNAVAILABLE">("ALL");

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [issueBookTarget, setIssueBookTarget] = useState<Book | null>(null);
  const [selectedBorrowerId, setSelectedBorrowerId] = useState("");
  const [issueRemarks, setIssueRemarks] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New book form state
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Computer Science",
    isbn: "",
    publisher: "",
    edition: "1st Edition",
    total_copies: 3,
    shelf_location: "CS-A-101",
    description: "",
    cover_image_url: "",
  });

  const loadData = () => {
    setBooks(DataStore.getBooks());
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

  // Categories list
  const categories = ["ALL", ...Array.from(new Set(books.map((b) => b.category)))];

  // Filtering
  const filteredBooks = books.filter((b) => {
    const matchesQuery =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "ALL" || b.category === selectedCategory;

    const matchesAvailability =
      availabilityFilter === "ALL"
        ? true
        : availabilityFilter === "AVAILABLE"
        ? b.available_copies > 0
        : b.available_copies === 0;

    return matchesQuery && matchesCategory && matchesAvailability;
  });

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.isbn) {
      alert("Please fill in Title, Author, and ISBN.");
      return;
    }

    DataStore.saveBook({
      id: editBook ? editBook.id : undefined,
      title: formData.title,
      author: formData.author,
      category: formData.category,
      isbn: formData.isbn,
      publisher: formData.publisher,
      edition: formData.edition,
      total_copies: Number(formData.total_copies),
      available_copies: editBook
        ? Math.min(Number(formData.total_copies), editBook.available_copies + (Number(formData.total_copies) - editBook.total_copies))
        : Number(formData.total_copies),
      shelf_location: formData.shelf_location,
      description: formData.description,
      cover_image_url: formData.cover_image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    });

    setAddModalOpen(false);
    setEditBook(null);
    showToast(editBook ? "Book details updated successfully!" : "New book added to library catalog!");
    setFormData({
      title: "",
      author: "",
      category: "Computer Science",
      isbn: "",
      publisher: "",
      edition: "1st Edition",
      total_copies: 3,
      shelf_location: "CS-A-101",
      description: "",
      cover_image_url: "",
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}" from the catalog?`)) {
      DataStore.deleteBook(id);
      showToast(`Book "${title}" deleted.`);
    }
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueBookTarget || !selectedBorrowerId) return;

    const res = DataStore.issueBook(selectedBorrowerId, issueBookTarget.id, issueRemarks);
    if (res.success) {
      showToast(res.message);
      setIssueBookTarget(null);
      setSelectedBorrowerId("");
      setIssueRemarks("");
    } else {
      alert(res.message);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-medium shadow-2xl flex items-center gap-3 border border-indigo-400/40 animate-slide-up">
            <CheckCircle2 className="w-5 h-5 text-indigo-200" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <span>Library Book Catalog</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Browse, search, reserve, or manage library catalog items. Showing {filteredBooks.length} of {books.length} titles.
            </p>
          </div>

          {canManageBooks && (
            <button
              onClick={() => {
                setEditBook(null);
                setFormData({
                  title: "",
                  author: "",
                  category: "Computer Science",
                  isbn: "",
                  publisher: "",
                  edition: "1st Edition",
                  total_copies: 3,
                  shelf_location: "CS-A-101",
                  description: "",
                  cover_image_url: "",
                });
                setAddModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Book</span>
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Keyword Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Title, Author, ISBN, or Keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Availability Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setAvailabilityFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  availabilityFilter === "ALL" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setAvailabilityFilter("AVAILABLE")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  availabilityFilter === "AVAILABLE" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                In Stock
              </button>
              <button
                onClick={() => setAvailabilityFilter("UNAVAILABLE")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  availabilityFilter === "UNAVAILABLE" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Checked Out
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1 mr-1">
              <Layers className="w-3 h-3" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold"
                    : "bg-slate-900/40 text-slate-400 border border-white/5 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border border-white/10">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No matching books found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your keyword search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBooks.map((book) => {
              const inStock = book.available_copies > 0;
              return (
                <div
                  key={book.id}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-white/10 group"
                >
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={book.cover_image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 text-slate-300 border border-white/10 backdrop-blur-md">
                        {book.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border ${
                          inStock
                            ? "bg-emerald-500/80 text-white border-emerald-400/40"
                            : "bg-rose-500/80 text-white border-rose-400/40"
                        }`}
                      >
                        {inStock ? `${book.available_copies} of ${book.total_copies} Copies Available` : "Checked Out"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium line-clamp-1">By {book.author}</p>
                      {book.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                          {book.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        <div>
                          <span className="text-slate-500">ISBN: </span>
                          <span className="font-mono text-slate-300">{book.isbn}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Shelf: </span>
                          <span className="font-medium text-slate-300">{book.shelf_location || "A-101"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Publisher: </span>
                          <span className="text-slate-300">{book.publisher || "Academic Press"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Edition: </span>
                          <span className="text-slate-300">{book.edition || "1st"}</span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 flex items-center justify-between gap-2">
                        {canIssueReturn && (
                          <button
                            onClick={() => {
                              setIssueBookTarget(book);
                              setSelectedBorrowerId(profiles.find((p) => p.role === "STUDENT")?.id || "");
                            }}
                            disabled={!inStock}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>Issue Book</span>
                          </button>
                        )}



                        {canManageBooks && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditBook(book);
                                setFormData({
                                  title: book.title,
                                  author: book.author,
                                  category: book.category,
                                  isbn: book.isbn,
                                  publisher: book.publisher || "",
                                  edition: book.edition || "1st Edition",
                                  total_copies: book.total_copies,
                                  shelf_location: book.shelf_location || "CS-A-101",
                                  description: book.description || "",
                                  cover_image_url: book.cover_image_url || "",
                                });
                                setAddModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-all"
                              title="Edit Book"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(book.id, book.title)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/10 transition-all"
                              title="Delete Book"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Book Modal */}
        {addModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-dropdown w-full max-w-lg rounded-3xl p-6 border border-white/15 animate-slide-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>{editBook ? "Edit Book Details" : "Add New Book to Catalog"}</span>
                </h2>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBook} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Clean Architecture"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Author *</label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Robert C. Martin"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">ISBN Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500 font-mono"
                      placeholder="978-0134494166"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Shelf Location</label>
                    <input
                      type="text"
                      value={formData.shelf_location}
                      onChange={(e) => setFormData({ ...formData, shelf_location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. CS-B-201"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Total Copies</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.total_copies}
                      onChange={(e) => setFormData({ ...formData, total_copies: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Publisher</label>
                    <input
                      type="text"
                      value={formData.publisher}
                      onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Pearson"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Edition</label>
                    <input
                      type="text"
                      value={formData.edition}
                      onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="1st Edition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description / Summary</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Brief overview of the book contents..."
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                  >
                    {editBook ? "Save Changes" : "Create Book Entry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Issue Book Checkout Modal */}
        {issueBookTarget && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-dropdown w-full max-w-md rounded-3xl p-6 border border-white/15 animate-slide-up">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
                  <span>Issue Book to Member</span>
                </h2>
                <button
                  onClick={() => setIssueBookTarget(null)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 mb-4 space-y-1">
                <p className="text-xs text-slate-400">Selected Book:</p>
                <p className="font-bold text-white text-sm">{issueBookTarget.title}</p>
                <p className="text-xs text-indigo-400">Available: {issueBookTarget.available_copies} Copies | Shelf: {issueBookTarget.shelf_location}</p>
              </div>

              <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Select Member (Student / Faculty) *</label>
                  <select
                    required
                    value={selectedBorrowerId}
                    onChange={(e) => setSelectedBorrowerId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Choose Member Profile --</option>
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name} ({p.role} - {p.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Issue Notes / Remarks</label>
                  <input
                    type="text"
                    value={issueRemarks}
                    onChange={(e) => setIssueRemarks(e.target.value)}
                    placeholder="e.g. Standard semester checkout"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIssueBookTarget(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                  >
                    Confirm Issue
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
