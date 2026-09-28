-- ==============================================================================
-- 📚 LMS (Library Management System) - Full PostgreSQL Schema (Modules 1 to 14)
-- Next.js 15 + Supabase
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'LIBRARIAN', 'FACULTY', 'STUDENT', 'COORDINATOR');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'GRADUATED', 'INACTIVE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE borrow_status AS ENUM ('ACTIVE', 'RETURNED', 'OVERDUE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('PENDING', 'APPROVED', 'ORDERED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('UNPAID', 'PAID', 'WAIVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE condition_status AS ENUM ('GOOD', 'DAMAGED', 'LOST', 'WEEDING');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. PROFILES TABLE (Module 1 & 3: Authentication & Member Management)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'STUDENT',
    department VARCHAR(100),
    max_books_allowed INT NOT NULL DEFAULT 3,
    phone VARCHAR(50),
    avatar_url TEXT,
    status user_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. BOOKS TABLE (Module 2 & 4: Book Catalog & Live Search)
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    isbn VARCHAR(30) UNIQUE NOT NULL,
    title VARCHAR(300) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    publisher VARCHAR(255),
    edition VARCHAR(50),
    total_copies INT NOT NULL DEFAULT 1 CHECK (total_copies >= 0),
    available_copies INT NOT NULL DEFAULT 1 CHECK (available_copies >= 0 AND available_copies <= total_copies),
    shelf_location VARCHAR(100),
    cover_image_url TEXT,
    description TEXT,
    featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_books_search ON books (title, author, category, isbn);

-- 4. BORROW RECORDS (Module 5, 6 & 10: Book Issue, Return, Renewal & Audit History)
CREATE TABLE IF NOT EXISTS borrow_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    renewal_count INT NOT NULL DEFAULT 0,
    status borrow_status NOT NULL DEFAULT 'ACTIVE',
    remarks TEXT,
    issued_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_borrow_user ON borrow_records (user_id);
CREATE INDEX IF NOT EXISTS idx_borrow_book ON borrow_records (book_id);
CREATE INDEX IF NOT EXISTS idx_borrow_status ON borrow_records (status);

-- 5. BOOK REQUESTS TABLE (Module 8: Faculty Book Acquisition)
CREATE TABLE IF NOT EXISTS book_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    faculty_name VARCHAR(255) NOT NULL,
    faculty_email VARCHAR(255) NOT NULL,
    title VARCHAR(300) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    isbn VARCHAR(30),
    reason TEXT NOT NULL,
    department VARCHAR(100) NOT NULL,
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    status request_status NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. COURSE READINGS TABLE (Module 9: Department Resource Coordination)
CREATE TABLE IF NOT EXISTS course_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_code VARCHAR(20) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    coordinator_name VARCHAR(255) NOT NULL,
    book_title VARCHAR(300) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(30),
    required_copies INT NOT NULL DEFAULT 1,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    semester VARCHAR(50) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PROPOSED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. FINE RECORDS TABLE (Module 11: Fine & Overdue Settlement)
CREATE TABLE IF NOT EXISTS fine_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    borrow_id UUID REFERENCES borrow_records(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    book_title VARCHAR(300) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    reason TEXT NOT NULL,
    days_overdue INT NOT NULL DEFAULT 0,
    payment_status payment_status NOT NULL DEFAULT 'UNPAID',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    payment_method VARCHAR(50),
    waived_by VARCHAR(255)
);

-- 8. INVENTORY AUDITS TABLE (Module 13: Inventory Management & Condition Audits)
CREATE TABLE IF NOT EXISTS inventory_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    book_title VARCHAR(300) NOT NULL,
    isbn VARCHAR(30) NOT NULL,
    condition_status condition_status NOT NULL DEFAULT 'GOOD',
    notes TEXT,
    copies_affected INT NOT NULL DEFAULT 1,
    audited_by VARCHAR(255) NOT NULL,
    audited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SYSTEM CONFIG TABLE (Module 14: System Administration)
CREATE TABLE IF NOT EXISTS system_config (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ROW LEVEL SECURITY (RLS) — DISABLED
-- =============================================================================
-- RLS is DISABLED because this app uses a demo auth context (client-side role
-- switcher) instead of real Supabase Auth. Without a real auth.uid() session,
-- RLS would block all INSERT/UPDATE/DELETE operations.
--
-- To enable RLS later (when you add real Supabase Auth):
--   1. ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;
--   2. Add SELECT/INSERT/UPDATE/DELETE policies using auth.uid()
-- =============================================================================
