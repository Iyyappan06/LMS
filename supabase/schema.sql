-- ==============================================================================
-- 📚 LMS (Library Management System) - PostgreSQL Schema (Modules 1 to 6)
-- Next.js 15 + Supabase
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('ADMIN', 'LIBRARIAN', 'FACULTY', 'STUDENT', 'COORDINATOR');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'GRADUATED', 'INACTIVE');
CREATE TYPE borrow_status AS ENUM ('ACTIVE', 'RETURNED', 'OVERDUE');

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

-- 4. BORROW RECORDS (Module 5 & 6: Book Issue, Return & Renewal)
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

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrow_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Books" ON books FOR SELECT USING (true);
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Borrows" ON borrow_records FOR SELECT USING (true);
