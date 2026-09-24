export type UserRole = 'ADMIN' | 'LIBRARIAN' | 'FACULTY' | 'STUDENT' | 'COORDINATOR';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'INACTIVE';
export type BorrowStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE';

export interface UserProfile {
  id: string;
  auth_user_id?: string;
  email: string;
  full_name: string;
  role: UserRole;
  department?: string;
  max_books_allowed: number;
  phone?: string;
  avatar_url?: string;
  status: UserStatus;
  created_at: string;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  publisher?: string;
  edition?: string;
  total_copies: number;
  available_copies: number;
  shelf_location?: string;
  cover_image_url?: string;
  description?: string;
  featured?: boolean;
  is_active: boolean;
  created_at: string;
}

export interface BorrowRecord {
  id: string;
  user_id: string;
  book_id: string;
  issue_date: string;
  due_date: string;
  return_date?: string | null;
  renewal_count: number;
  status: BorrowStatus;
  remarks?: string;
  issued_by?: string;
  user?: UserProfile;
  book?: Book;
  created_at: string;
}

export interface SystemConfig {
  student_loan_days: number;
  faculty_loan_days: number;
  max_renewals_allowed: number;
  library_name: string;
  contact_email: string;
}
