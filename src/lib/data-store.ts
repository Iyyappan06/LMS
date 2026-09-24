import {
  UserProfile,
  Book,
  BorrowRecord,
  SystemConfig,
  UserRole,
} from "./types";

// Default Initial Profiles (Module 1 & 3)
export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "admin@lms.com",
    full_name: "Dr. Eleanor Vance",
    role: "ADMIN",
    department: "Library Administration",
    max_books_allowed: 99,
    phone: "+1-555-0101",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    email: "librarian@lms.com",
    full_name: "Sarah Jenkins",
    role: "LIBRARIAN",
    department: "Circulation Services",
    max_books_allowed: 99,
    phone: "+1-555-0102",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    email: "faculty@lms.com",
    full_name: "Prof. Robert Thorne",
    role: "FACULTY",
    department: "Computer Science & Engineering",
    max_books_allowed: 5,
    phone: "+1-555-0103",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    email: "student@lms.com",
    full_name: "Alex Rivera",
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
    full_name: "Dr. Maya Patel",
    role: "COORDINATOR",
    department: "Computer Science & Engineering",
    max_books_allowed: 5,
    phone: "+1-555-0105",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    email: "emma.watson@student.lms.com",
    full_name: "Emma Watson",
    role: "STUDENT",
    department: "Electrical Engineering",
    max_books_allowed: 3,
    phone: "+1-555-0106",
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
  library_name: "Apex University Central Library",
  contact_email: "library-support@apex.edu",
};

const STORAGE_KEYS = {
  CURRENT_USER: "lms_active_user",
  PROFILES: "lms_profiles",
  BOOKS: "lms_books",
  BORROWS: "lms_borrows",
  CONFIG: "lms_config",
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
    return this.get<UserProfile>(STORAGE_KEYS.CURRENT_USER, INITIAL_PROFILES[0]);
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
    return this.get<UserProfile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
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
    return updated;
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

  static resetAllData(): void {
    if (typeof window === "undefined") return;
    localStorage.clear();
    window.location.reload();
  }
}
