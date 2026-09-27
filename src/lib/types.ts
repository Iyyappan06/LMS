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
  fine_per_day: number;
  library_name: string;
  contact_email: string;
  operating_hours?: string;
}

export type BookRequestStatus = 'PENDING' | 'APPROVED' | 'ORDERED' | 'REJECTED';
export type BookRequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface BookRequest {
  id: string;
  faculty_id: string;
  faculty_name: string;
  faculty_email: string;
  title: string;
  author: string;
  publisher?: string;
  isbn?: string;
  reason: string;
  department: string;
  estimated_cost: number;
  priority: BookRequestPriority;
  status: BookRequestStatus;
  admin_notes?: string;
  requested_at: string;
}

export interface CourseReading {
  id: string;
  course_code: string;
  course_name: string;
  department: string;
  coordinator_name: string;
  book_title: string;
  author: string;
  isbn?: string;
  required_copies: number;
  is_mandatory: boolean;
  semester: string;
  academic_year: string;
  status: 'PROPOSED' | 'APPROVED' | 'AVAILABLE';
  created_at: string;
}

export type PaymentStatus = 'UNPAID' | 'PAID' | 'WAIVED';

export interface FineRecord {
  id: string;
  borrow_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  book_title: string;
  amount: number;
  reason: string;
  days_overdue: number;
  payment_status: PaymentStatus;
  issued_at: string;
  paid_at?: string | null;
  payment_method?: string;
  waived_by?: string;
}

export type ConditionStatus = 'GOOD' | 'DAMAGED' | 'LOST' | 'WEEDING';

export interface InventoryAudit {
  id: string;
  book_id: string;
  book_title: string;
  isbn: string;
  condition_status: ConditionStatus;
  notes: string;
  copies_affected: number;
  audited_by: string;
  audited_at: string;
}

