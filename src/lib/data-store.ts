import {
  UserProfile,
  Book,
  BorrowRecord,
  SystemConfig,
  UserRole,
  BookRequest,
  CourseReading,
  FineRecord,
  InventoryAudit,
} from "./types";
import { supabase } from "./supabase/client";

export const INITIAL_REQUESTS: BookRequest[] = [
  {
    id: "req-001",
    faculty_id: "33333333-3333-3333-3333-333333333333",
    faculty_name: "Prof. Kanishkkan",
    faculty_email: "faculty@lms.com",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    publisher: "O'Reilly Media",
    isbn: "978-1449373320",
    reason: "Required reference textbook for CS401 Distributed Systems course.",
    department: "Computer Science & Engineering",
    estimated_cost: 45.0,
    priority: "HIGH",
    status: "PENDING",
    requested_at: "2026-02-15T10:30:00Z",
  },
  {
    id: "req-002",
    faculty_id: "33333333-3333-3333-3333-333333333333",
    faculty_name: "Prof. Kanishkkan",
    faculty_email: "faculty@lms.com",
    title: "Quantum Computing: An Applied Approach",
    author: "Jack D. Hidary",
    publisher: "Springer",
    isbn: "978-3030239213",
    reason: "Advanced electives research for final year CSE students.",
    department: "Computer Science & Engineering",
    estimated_cost: 65.0,
    priority: "MEDIUM",
    status: "APPROVED",
    admin_notes: "Approved under Q1 Department Research Budget.",
    requested_at: "2026-01-20T14:15:00Z",
  },
];

export const INITIAL_READINGS: CourseReading[] = [
  {
    id: "cr-101",
    course_code: "CS302",
    course_name: "Database Management Systems",
    department: "Computer Science & Engineering",
    coordinator_name: "Dr. Adhikesavan - Dept Coordinator",
    book_title: "Database System Concepts (7th Edition)",
    author: "Abraham Silberschatz",
    isbn: "978-0078022159",
    required_copies: 15,
    is_mandatory: true,
    semester: "Spring 2026",
    academic_year: "2025-2026",
    status: "AVAILABLE",
    created_at: "2026-01-05T09:00:00Z",
  },
  {
    id: "cr-102",
    course_code: "EE201",
    course_name: "Digital Circuits & Systems",
    department: "Electrical Engineering",
    coordinator_name: "Dr. Adhikesavan - Dept Coordinator",
    book_title: "Digital Design: With an Introduction to the Verilog HDL",
    author: "M. Morris Mano",
    isbn: "978-0132774208",
    required_copies: 10,
    is_mandatory: true,
    semester: "Spring 2026",
    academic_year: "2025-2026",
    status: "APPROVED",
    created_at: "2026-01-12T11:00:00Z",
  },
];

export const INITIAL_FINES: FineRecord[] = [
  {
    id: "fn-501",
    borrow_id: "b-003",
    user_id: "44444444-4444-4444-4444-444444444444",
    user_name: "Iyyappan",
    user_email: "iyyappan06012007@gmail.com",
    book_title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    amount: 14.5,
    reason: "Late return (29 days overdue)",
    days_overdue: 29,
    payment_status: "UNPAID",
    issued_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "fn-502",
    borrow_id: "b-004",
    user_id: "66666666-6666-6666-6666-666666666666",
    user_name: "Emma Watson",
    user_email: "emma.watson@student.lms.com",
    book_title: "Introduction to Algorithms (4th Edition)",
    amount: 5.0,
    reason: "Late return (10 days overdue)",
    days_overdue: 10,
    payment_status: "PAID",
    issued_at: "2026-01-15T16:20:00Z",
    paid_at: "2026-01-16T11:00:00Z",
    payment_method: "Credit Card",
  },
];

export const INITIAL_AUDITS: InventoryAudit[] = [
  {
    id: "aud-001",
    book_id: "b1010101-0001-0000-0000-000000000001",
    book_title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    isbn: "978-0132350884",
    condition_status: "DAMAGED",
    notes: "Spine torn on Copy #3. Sent for rebinding.",
    copies_affected: 1,
    audited_by: "Sarah Jenkins (Librarian)",
    audited_at: "2026-02-10T14:00:00Z",
  },
  {
    id: "aud-002",
    book_id: "b1010101-0004-0000-0000-000000000004",
    book_title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    isbn: "978-0201633610",
    condition_status: "LOST",
    notes: "Reported missing during annual shelf audit CS-A-105.",
    copies_affected: 1,
    audited_by: "Vijay (Admin)",
    audited_at: "2026-01-28T11:30:00Z",
  },
];

// Default Initial Profiles (Module 1 & 3)
export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "admin@lms.com",
    full_name: "Vijay",
    role: "ADMIN",
    department: "Administration",
    max_books_allowed: 99,
    phone: "+1-555-0101",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    email: "librarian@lms.com",
    full_name: "HariKumar - Chief Librarian",
    role: "LIBRARIAN",
    department: "Library Services",
    max_books_allowed: 99,
    phone: "+1-555-0102",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    email: "faculty@lms.com",
    full_name: "Prof. Kanishkkan",
    role: "FACULTY",
    department: "Computer Science & Engineering",
    max_books_allowed: 5,
    phone: "+1-555-0103",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    email: "iyyappan06012007@gmail.com",
    full_name: "Iyyappan",
    role: "STUDENT",
    department: "Computer Science & Engineering",
    max_books_allowed: 3,
    phone: "+1-555-0104",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    email: "coordinator@lms.com",
    full_name: "Dr. Adhikesavan - Dept Coordinator",
    role: "COORDINATOR",
    department: "Computer Science & Engineering",
    max_books_allowed: 5,
    phone: "+1-555-0105",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  },
];

// Initial Books (Module 2 & 4)
export const INITIAL_BOOKS: Book[] = [
  {
    id: "b1010101-0001-0000-0000-000000000001",
    isbn: "978-0132350884",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    category: "Computer Science",
    publisher: "Prentice Hall",
    edition: "1st Edition",
    total_copies: 6,
    available_copies: 4,
    shelf_location: "CS-A-102",
    cover_image_url: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?w=600&auto=format&fit=crop&q=80",
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
    featured: true,
    is_active: true,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "b1010101-0002-0000-0000-000000000002",
    isbn: "978-0262033848",
    title: "Introduction to Algorithms (CLRS)",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    category: "Computer Science",
    publisher: "MIT Press",
    edition: "4th Edition",
    total_copies: 8,
    available_copies: 5,
    shelf_location: "CS-B-204",
    cover_image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    description: "A comprehensive textbook covering the modern study of computer algorithms with depth and rigor.",
    featured: true,
    is_active: true,
    created_at: "2026-01-12T09:00:00Z",
  },
  {
    id: "b1010101-0003-0000-0000-000000000003",
    isbn: "978-0134685991",
    title: "Effective Java",
    author: "Joshua Bloch",
    category: "Computer Science",
    publisher: "Addison-Wesley",
    edition: "3rd Edition",
    total_copies: 5,
    available_copies: 2,
    shelf_location: "CS-A-105",
    cover_image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    description: "The definitive best-practices guide to the Java programming language.",
    featured: true,
    is_active: true,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "b1010101-0004-0000-0000-000000000004",
    isbn: "978-1449373320",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    category: "Computer Science",
    publisher: "O'Reilly Media",
    edition: "1st Edition",
    total_copies: 7,
    available_copies: 0,
    shelf_location: "CS-C-301",
    cover_image_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80",
    description: "The big ideas behind reliable, scalable, and maintainable data systems.",
    featured: true,
    is_active: true,
    created_at: "2026-01-18T11:00:00Z",
  },
  {
    id: "b1010101-0005-0000-0000-000000000005",
    isbn: "978-0262035613",
    title: "Deep Learning",
    author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    category: "Artificial Intelligence",
    publisher: "MIT Press",
    edition: "1st Edition",
    total_copies: 5,
    available_copies: 3,
    shelf_location: "AI-A-101",
    cover_image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80",
    description: "An introduction to a broad range of topics in deep learning, covering mathematical and conceptual background.",
    featured: true,
    is_active: true,
    created_at: "2026-01-20T12:00:00Z",
  },
  {
    id: "b1010101-0006-0000-0000-000000000006",
    isbn: "978-0073529325",
    title: "Database System Concepts",
    author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
    category: "Database Systems",
    publisher: "McGraw-Hill",
    edition: "7th Edition",
    total_copies: 5,
    available_copies: 2,
    shelf_location: "DB-A-101",
    cover_image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
    description: "Presents the fundamental concepts of database management in an intuitive manner.",
    featured: false,
    is_active: true,
    created_at: "2026-01-22T13:00:00Z",
  },
  {
    id: "b1010101-0007-0000-0000-000000000007",
    isbn: "978-0133594140",
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum, David J. Wetherall",
    category: "Networking",
    publisher: "Pearson",
    edition: "5th Edition",
    total_copies: 4,
    available_copies: 4,
    shelf_location: "NET-B-101",
    cover_image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    description: "Covers standard layered architectures, IP routing, Ethernet protocols, and network security.",
    featured: false,
    is_active: true,
    created_at: "2026-01-25T14:00:00Z",
  },
];

// Initial Borrow Records (Module 5 & 6)
export const INITIAL_BORROWS: BorrowRecord[] = [
  {
    id: "c1010101-0001-0000-0000-000000000001",
    user_id: "44444444-4444-4444-4444-444444444444",
    book_id: "b1010101-0001-0000-0000-000000000001",
    issue_date: "2026-09-18",
    due_date: "2026-10-02",
    return_date: null,
    renewal_count: 0,
    status: "ACTIVE",
    remarks: "Regular student checkout",
    created_at: "2026-09-18T10:00:00Z",
  },
  {
    id: "c1010101-0002-0000-0000-000000000002",
    user_id: "44444444-4444-4444-4444-444444444444",
    book_id: "b1010101-0003-0000-0000-000000000003",
    issue_date: "2026-09-01",
    due_date: "2026-09-15",
    return_date: null,
    renewal_count: 0,
    status: "OVERDUE",
    remarks: "Overdue loan notice sent",
    created_at: "2026-09-01T10:00:00Z",
  },
  {
    id: "c1010101-0003-0000-0000-000000000003",
    user_id: "33333333-3333-3333-3333-333333333333",
    book_id: "b1010101-0004-0000-0000-000000000004",
    issue_date: "2026-09-10",
    due_date: "2026-10-10",
    return_date: null,
    renewal_count: 1,
    status: "ACTIVE",
    remarks: "Faculty course reference",
    created_at: "2026-09-10T10:00:00Z",
  },
  {
    id: "c1010101-0004-0000-0000-000000000004",
    user_id: "66666666-6666-6666-6666-666666666666",
    book_id: "b1010101-0002-0000-0000-000000000002",
    issue_date: "2026-08-20",
    due_date: "2026-09-03",
    return_date: "2026-09-02",
    renewal_count: 0,
    status: "RETURNED",
    remarks: "Returned in good condition",
    created_at: "2026-08-20T10:00:00Z",
  },
];

export const INITIAL_CONFIG: SystemConfig = {
  student_loan_days: 14,
  faculty_loan_days: 30,
  max_renewals_allowed: 2,
  fine_per_day: 0.5,
  library_name: "Apex University Central Library",
  contact_email: "library-support@apex.edu",
  operating_hours: "Mon - Fri: 8:00 AM - 10:00 PM | Sat - Sun: 10:00 AM - 6:00 PM",
};

const STORAGE_KEYS = {
  CURRENT_USER: "lms_active_user",
  PROFILES: "lms_profiles",
  BOOKS: "lms_books",
  BORROWS: "lms_borrows",
  CONFIG: "lms_config",
  REQUESTS: "lms_requests",
  READINGS: "lms_readings",
  FINES: "lms_fines",
  AUDITS: "lms_audits",
};

export class DataStore {
  private static get<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent("lms_data_change", { detail: { key } }));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }

  // Module 1: Auth / Active Role
  static getCurrentUser(): UserProfile {
    const user = this.get<UserProfile>(STORAGE_KEYS.CURRENT_USER, INITIAL_PROFILES[0]);
    if (user) {
      if ((user.id === "11111111-1111-1111-1111-111111111111" || user.role === "ADMIN") && user.full_name !== "Vijay") {
        user.full_name = "Vijay";
        user.department = "Administration";
        this.setCurrentUser(user);
      } else if ((user.id === "22222222-2222-2222-2222-222222222222" || user.role === "LIBRARIAN") && user.full_name !== "HariKumar - Chief Librarian") {
        user.full_name = "HariKumar - Chief Librarian";
        user.department = "Library Services";
        this.setCurrentUser(user);
      } else if ((user.id === "33333333-3333-3333-3333-333333333333" || user.role === "FACULTY") && user.full_name !== "Prof. Kanishkkan") {
        user.full_name = "Prof. Kanishkkan";
        this.setCurrentUser(user);
      } else if (user.id === "44444444-4444-4444-4444-444444444444" && (user.full_name !== "Iyyappan" || user.email !== "iyyappan06012007@gmail.com")) {
        user.full_name = "Iyyappan";
        user.email = "iyyappan06012007@gmail.com";
        this.setCurrentUser(user);
      } else if ((user.id === "55555555-5555-5555-5555-555555555555" || user.role === "COORDINATOR") && user.full_name !== "Dr. Adhikesavan - Dept Coordinator") {
        user.full_name = "Dr. Adhikesavan - Dept Coordinator";
        this.setCurrentUser(user);
      }
    }
    return user;
  }

  static setCurrentUser(user: UserProfile): void {
    this.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  static setCurrentUserByRole(role: UserRole): UserProfile {
    const profiles = this.getProfiles();
    const match = profiles.find((p) => p.role === role) || profiles[0];
    this.setCurrentUser(match);
    return match;
  }

  // Module 3: Student & Faculty Profiles
  static getProfiles(): UserProfile[] {
    const profiles = this.get<UserProfile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    let updated = false;

    // Direct mapping to ensure exact matches with member directory
    const targetMap: Record<string, { full_name: string; email?: string; department?: string }> = {
      "11111111-1111-1111-1111-111111111111": { full_name: "Vijay", department: "Administration" },
      "22222222-2222-2222-2222-222222222222": { full_name: "HariKumar - Chief Librarian", department: "Library Services" },
      "33333333-3333-3333-3333-333333333333": { full_name: "Prof. Kanishkkan" },
      "44444444-4444-4444-4444-444444444444": { full_name: "Iyyappan", email: "iyyappan06012007@gmail.com" },
      "55555555-5555-5555-5555-555555555555": { full_name: "Dr. Adhikesavan - Dept Coordinator" },
    };

    profiles.forEach((p) => {
      const target = targetMap[p.id];
      if (target) {
        if (p.full_name !== target.full_name) {
          p.full_name = target.full_name;
          updated = true;
        }
        if (target.email && p.email !== target.email) {
          p.email = target.email;
          updated = true;
        }
        if (target.department && p.department !== target.department) {
          p.department = target.department;
          updated = true;
        }
      }
    });

    if (updated) {
      this.set(STORAGE_KEYS.PROFILES, profiles);
    }
    return profiles;
  }

  static saveProfile(profile: Partial<UserProfile> & { full_name: string; email: string; role: UserRole }): UserProfile {
    const profiles = this.getProfiles();
    let updated: UserProfile;
    if (profile.id) {
      const idx = profiles.findIndex((p) => p.id === profile.id);
      if (idx !== -1) {
        updated = { ...profiles[idx], ...profile };
        profiles[idx] = updated;
      } else {
        updated = {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          department: profile.department || "General",
          max_books_allowed: profile.max_books_allowed || (profile.role === "STUDENT" ? 3 : 5),
          phone: profile.phone || "",
          status: profile.status || "ACTIVE",
          created_at: new Date().toISOString(),
        };
        profiles.push(updated);
      }
    } else {
      updated = {
        id: crypto.randomUUID(),
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        department: profile.department || "General",
        max_books_allowed: profile.max_books_allowed || (profile.role === "STUDENT" ? 3 : 5),
        phone: profile.phone || "",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
      };
      profiles.push(updated);
    }
    this.set(STORAGE_KEYS.PROFILES, profiles);

    // Sync to Supabase PostgreSQL database & Supabase Auth if configured
    if (supabase) {
      supabase
        .from("profiles")
        .upsert({
          id: updated.id,
          email: updated.email,
          full_name: updated.full_name,
          role: updated.role,
          department: updated.department,
          max_books_allowed: updated.max_books_allowed,
          phone: updated.phone,
          status: updated.status,
        })
        .then(({ error }) => {
          if (error) console.error("Supabase profile sync error:", error.message);
          else console.log("Profile successfully saved to Supabase DB:", updated.email);
        });

      // Register/sync user in Supabase Auth as well
      supabase.auth.signUp({
        email: updated.email,
        password: "password123",
        options: {
          data: {
            full_name: updated.full_name,
            role: updated.role,
          },
        },
      }).then(({ data, error }) => {
        if (error) console.warn("Supabase Auth sync notice:", error.message);
        else console.log("User synced to Supabase Auth:", updated.email);
      });
    }

    return updated;
  }

  static deleteProfile(id: string): void {
    const profiles = this.getProfiles().filter((p) => p.id !== id);
    this.set(STORAGE_KEYS.PROFILES, profiles);
    if (supabase) {
      supabase
        .from("profiles")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Supabase profile delete error:", error.message);
        });
    }
  }

  // Module 2 & 4: Book Catalog CRUD & Search
  static getBooks(): Book[] {
    return this.get<Book[]>(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
  }

  static getBookById(id: string): Book | undefined {
    return this.getBooks().find((b) => b.id === id);
  }

  static saveBook(bookData: Partial<Book> & { title: string; author: string; category: string; isbn: string }): Book {
    const books = this.getBooks();
    let saved: Book;
    if (bookData.id) {
      const idx = books.findIndex((b) => b.id === bookData.id);
      if (idx !== -1) {
        saved = { ...books[idx], ...bookData };
        books[idx] = saved;
      } else {
        saved = {
          id: bookData.id,
          isbn: bookData.isbn,
          title: bookData.title,
          author: bookData.author,
          category: bookData.category,
          publisher: bookData.publisher || "",
          edition: bookData.edition || "1st Edition",
          total_copies: bookData.total_copies ?? 1,
          available_copies: bookData.available_copies ?? bookData.total_copies ?? 1,
          shelf_location: bookData.shelf_location || "General Shelf",
          cover_image_url: bookData.cover_image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
          description: bookData.description || "",
          featured: bookData.featured || false,
          is_active: true,
          created_at: new Date().toISOString(),
        };
        books.push(saved);
      }
    } else {
      const total = bookData.total_copies ?? 1;
      saved = {
        id: crypto.randomUUID(),
        isbn: bookData.isbn,
        title: bookData.title,
        author: bookData.author,
        category: bookData.category,
        publisher: bookData.publisher || "",
        edition: bookData.edition || "1st Edition",
        total_copies: total,
        available_copies: total,
        shelf_location: bookData.shelf_location || "General Shelf",
        cover_image_url: bookData.cover_image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
        description: bookData.description || "",
        featured: bookData.featured || false,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      books.unshift(saved);
    }
    this.set(STORAGE_KEYS.BOOKS, books);

    if (supabase) {
      supabase
        .from("books")
        .upsert({
          id: saved.id,
          isbn: saved.isbn,
          title: saved.title,
          author: saved.author,
          category: saved.category,
          publisher: saved.publisher,
          edition: saved.edition,
          total_copies: saved.total_copies,
          available_copies: saved.available_copies,
          shelf_location: saved.shelf_location,
          cover_image_url: saved.cover_image_url,
          description: saved.description,
          featured: saved.featured,
        })
        .then(({ error }) => {
          if (error) console.error("Supabase book sync error:", error.message);
          else console.log("Book successfully saved to Supabase DB:", saved.title);
        });
    }

    return saved;
  }

  static deleteBook(id: string): void {
    const books = this.getBooks().filter((b) => b.id !== id);
    this.set(STORAGE_KEYS.BOOKS, books);
  }

  // Module 5 & 6: Circulation (Issue, Return, Renewal)
  static getBorrows(): BorrowRecord[] {
    const raw = this.get<BorrowRecord[]>(STORAGE_KEYS.BORROWS, INITIAL_BORROWS);
    const users = this.getProfiles();
    const books = this.getBooks();

    return raw.map((b) => ({
      ...b,
      user: users.find((u) => u.id === b.user_id),
      book: books.find((bk) => bk.id === b.book_id),
    }));
  }

  static issueBook(userId: string, bookId: string, remarks?: string): { success: boolean; message: string; record?: BorrowRecord } {
    const user = this.getProfiles().find((u) => u.id === userId);
    const book = this.getBookById(bookId);

    if (!user) return { success: false, message: "User not found." };
    if (!book) return { success: false, message: "Book not found." };
    if (book.available_copies <= 0) return { success: false, message: "No copies currently available for checkout." };

    const activeBorrows = this.getBorrows().filter((b) => b.user_id === userId && b.status !== "RETURNED");
    if (activeBorrows.length >= user.max_books_allowed) {
      return {
        success: false,
        message: `Member has reached maximum allowed active borrowing limit of ${user.max_books_allowed} books.`,
      };
    }

    const config = this.getConfig();
    const days = user.role === "FACULTY" ? config.faculty_loan_days : config.student_loan_days;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    const newRecord: BorrowRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      book_id: bookId,
      issue_date: new Date().toISOString().split("T")[0],
      due_date: dueDate.toISOString().split("T")[0],
      return_date: null,
      renewal_count: 0,
      status: "ACTIVE",
      remarks: remarks || "Standard checkout",
      created_at: new Date().toISOString(),
    };

    const borrows = this.get<BorrowRecord[]>(STORAGE_KEYS.BORROWS, INITIAL_BORROWS);
    borrows.unshift(newRecord);
    this.set(STORAGE_KEYS.BORROWS, borrows);

    this.saveBook({
      ...book,
      available_copies: Math.max(0, book.available_copies - 1),
    });

    return { success: true, message: `Book successfully issued to ${user.full_name}! Due date: ${newRecord.due_date}`, record: newRecord };
  }

  static returnBook(borrowId: string, remarks?: string): { success: boolean; message: string } {
    const raw = this.get<BorrowRecord[]>(STORAGE_KEYS.BORROWS, INITIAL_BORROWS);
    const idx = raw.findIndex((b) => b.id === borrowId);
    if (idx === -1) return { success: false, message: "Borrow record not found." };

    const record = raw[idx];
    if (record.status === "RETURNED") return { success: false, message: "Book has already been returned." };

    record.status = "RETURNED";
    record.return_date = new Date().toISOString().split("T")[0];
    if (remarks) record.remarks = remarks;
    this.set(STORAGE_KEYS.BORROWS, raw);

    const book = this.getBookById(record.book_id);
    if (book) {
      this.saveBook({
        ...book,
        available_copies: Math.min(book.total_copies, book.available_copies + 1),
      });
    }

    return { success: true, message: "Book returned and inventory copy count restored successfully!" };
  }

  static renewBook(borrowId: string): { success: boolean; message: string } {
    const raw = this.get<BorrowRecord[]>(STORAGE_KEYS.BORROWS, INITIAL_BORROWS);
    const idx = raw.findIndex((b) => b.id === borrowId);
    if (idx === -1) return { success: false, message: "Loan record not found." };

    const record = raw[idx];
    const config = this.getConfig();

    if (record.renewal_count >= config.max_renewals_allowed) {
      return { success: false, message: `Maximum renewal limit of ${config.max_renewals_allowed} times reached.` };
    }

    const currentDue = new Date(record.due_date);
    currentDue.setDate(currentDue.getDate() + 14);

    record.due_date = currentDue.toISOString().split("T")[0];
    record.renewal_count += 1;
    record.status = "ACTIVE";
    this.set(STORAGE_KEYS.BORROWS, raw);

    return { success: true, message: `Loan renewed! New due date is ${record.due_date} (Renewal ${record.renewal_count}/${config.max_renewals_allowed})` };
  }

  static getConfig(): SystemConfig {
    return this.get<SystemConfig>(STORAGE_KEYS.CONFIG, INITIAL_CONFIG);
  }

  static saveConfig(config: SystemConfig): void {
    this.set(STORAGE_KEYS.CONFIG, config);
  }

  // Module 8: Requests
  static getRequests(): BookRequest[] {
    const list = this.get<BookRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    let updated = false;
    list.forEach((r) => {
      if (r.faculty_id === "33333333-3333-3333-3333-333333333333" || r.faculty_name === "Prof. Robert Thorne") {
        if (r.faculty_name !== "Prof. Kanishkkan") {
          r.faculty_name = "Prof. Kanishkkan";
          updated = true;
        }
      }
    });
    if (updated) {
      this.set(STORAGE_KEYS.REQUESTS, list);
    }
    return list;
  }

  static saveRequest(req: Omit<BookRequest, "id" | "requested_at" | "status">): BookRequest {
    const list = this.getRequests();
    const newReq: BookRequest = {
      ...req,
      id: "req-" + Math.random().toString(36).substring(2, 9),
      status: "PENDING",
      requested_at: new Date().toISOString(),
    };
    list.unshift(newReq);
    this.set(STORAGE_KEYS.REQUESTS, list);
    return newReq;
  }

  static updateRequestStatus(id: string, status: BookRequest["status"], adminNotes?: string): void {
    const list = this.getRequests();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (adminNotes !== undefined) list[idx].admin_notes = adminNotes;
      this.set(STORAGE_KEYS.REQUESTS, list);
    }
  }

  // Module 9: Course Readings
  static getReadings(): CourseReading[] {
    const list = this.get<CourseReading[]>(STORAGE_KEYS.READINGS, INITIAL_READINGS);
    let updated = false;
    list.forEach((r) => {
      if (r.coordinator_name.includes("Maya Patel") || r.coordinator_name.includes("Patel")) {
        r.coordinator_name = "Dr. Adhikesavan - Dept Coordinator";
        updated = true;
      }
    });
    if (updated) {
      this.set(STORAGE_KEYS.READINGS, list);
    }
    return list;
  }

  static saveReading(reading: Omit<CourseReading, "id" | "created_at">): CourseReading {
    const list = this.getReadings();
    const newReading: CourseReading = {
      ...reading,
      id: "cr-" + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    list.unshift(newReading);
    this.set(STORAGE_KEYS.READINGS, list);
    return newReading;
  }

  // Module 11: Fines
  static getFines(): FineRecord[] {
    const fines = this.get<FineRecord[]>(STORAGE_KEYS.FINES, INITIAL_FINES);
    let updated = false;
    fines.forEach((f) => {
      if (f.user_id === "44444444-4444-4444-4444-444444444444" || f.user_name === "Alex Rivera" || f.user_email === "student@lms.com") {
        if (f.user_name !== "Iyyappan" || f.user_email !== "iyyappan06012007@gmail.com") {
          f.user_name = "Iyyappan";
          f.user_email = "iyyappan06012007@gmail.com";
          updated = true;
        }
      }
    });
    if (updated) {
      this.set(STORAGE_KEYS.FINES, fines);
    }
    return fines;
  }

  static settleFine(id: string, action: "PAID" | "WAIVED", paymentMethod?: string, waivedBy?: string): void {
    const list = this.getFines();
    const idx = list.findIndex((f) => f.id === id);
    if (idx !== -1) {
      list[idx].payment_status = action;
      list[idx].paid_at = new Date().toISOString();
      if (paymentMethod) list[idx].payment_method = paymentMethod;
      if (waivedBy) list[idx].waived_by = waivedBy;
      this.set(STORAGE_KEYS.FINES, list);
    }
  }

  // Module 13: Inventory Audits
  static getAudits(): InventoryAudit[] {
    const list = this.get<InventoryAudit[]>(STORAGE_KEYS.AUDITS, INITIAL_AUDITS);
    let updated = false;
    list.forEach((a) => {
      if (a.audited_by.includes("Sarah Jenkins")) {
        a.audited_by = "HariKumar - Chief Librarian";
        updated = true;
      }
      if (a.audited_by.includes("Eleanor Vance")) {
        a.audited_by = "Vijay";
        updated = true;
      }
    });
    if (updated) {
      this.set(STORAGE_KEYS.AUDITS, list);
    }
    return list;
  }

  static saveAudit(audit: Omit<InventoryAudit, "id" | "audited_at">): InventoryAudit {
    const list = this.getAudits();
    const newAudit: InventoryAudit = {
      ...audit,
      id: "aud-" + Math.random().toString(36).substring(2, 9),
      audited_at: new Date().toISOString(),
    };
    list.unshift(newAudit);
    this.set(STORAGE_KEYS.AUDITS, list);
    return newAudit;
  }

  static async syncFromSupabase(): Promise<void> {
    if (!supabase) return;
    try {
      await supabase.from("profiles").update({ full_name: "Vijay", department: "Administration" }).eq("id", "11111111-1111-1111-1111-111111111111");
      await supabase.from("profiles").update({ full_name: "HariKumar - Chief Librarian", department: "Library Services" }).eq("id", "22222222-2222-2222-2222-222222222222");
      await supabase.from("profiles").update({ full_name: "Prof. Kanishkkan" }).eq("id", "33333333-3333-3333-3333-333333333333");
      await supabase.from("profiles").update({ full_name: "Iyyappan", email: "iyyappan06012007@gmail.com" }).eq("id", "44444444-4444-4444-4444-444444444444");
      await supabase.from("profiles").update({ full_name: "Dr. Adhikesavan - Dept Coordinator" }).eq("id", "55555555-5555-5555-5555-555555555555");

      const { data: dbProfiles, error: errProf } = await supabase.from("profiles").select("*");
      if (!errProf && dbProfiles && dbProfiles.length > 0) {
        const sanitized = (dbProfiles as UserProfile[]).map((p) => {
          if (p.id === "11111111-1111-1111-1111-111111111111") return { ...p, full_name: "Vijay", department: "Administration" };
          if (p.id === "22222222-2222-2222-2222-222222222222") return { ...p, full_name: "HariKumar - Chief Librarian", department: "Library Services" };
          if (p.id === "33333333-3333-3333-3333-333333333333") return { ...p, full_name: "Prof. Kanishkkan" };
          if (p.id === "44444444-4444-4444-4444-444444444444") return { ...p, full_name: "Iyyappan", email: "iyyappan06012007@gmail.com" };
          if (p.id === "55555555-5555-5555-5555-555555555555") return { ...p, full_name: "Dr. Adhikesavan - Dept Coordinator" };
          return p;
        });
        this.set(STORAGE_KEYS.PROFILES, sanitized);
      }

      const { data: dbBooks, error: errBooks } = await supabase.from("books").select("*");
      if (!errBooks && dbBooks && dbBooks.length > 0) {
        this.set(STORAGE_KEYS.BOOKS, dbBooks as Book[]);
      }
    } catch (err) {
      console.warn("Supabase fetch notice:", err);
    }
  }

  static resetAllData(): void {
    if (typeof window === "undefined") return;
    localStorage.clear();
    window.location.reload();
  }
}
