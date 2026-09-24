# 📚 Library Management System (LMS) - Next.js & Supabase

A modern, glassmorphic **Library Management System** built with **Next.js 15 (App Router, React 19, TypeScript)**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth, RLS)**.

---

## 🌟 Modules Implemented (Core Modules 1 – 6)

1. **Module 1: User Authentication & Role-Based Access Control (RBAC)**
   - 5 Supported Roles: **Admin**, **Librarian**, **Faculty**, **Student**, **Coordinator**.
   - Built-in **1-Click Role Switcher** in the sidebar for rapid multi-role preview and testing.
   - Dynamic permissions: role-gated navigation, catalog edit controls, and circulation desks.

2. **Module 2: Book Catalog & Inventory Management**
   - Full CRUD operations: Add new book, Edit metadata, Delete entries.
   - Comprehensive metadata: Title, Author, ISBN, Category, Publisher, Edition, Shelf Location, Cover Preview, Total Copies, and Available Copies.

3. **Module 3: Student & Faculty Member Management**
   - Centralized Member Directory with live search and role filters.
   - User registration and role assignment.
   - Configurable borrowing quotas (e.g., Student: 3 books max, Faculty: 5 books max, Admin/Librarian: unlimited).

4. **Module 4: Book Search & Catalog Live Discovery**
   - Instant live search by Title, Author, ISBN, or Keyword.
   - Faceted category filter pills (Computer Science, Artificial Intelligence, Database Systems, Networking, etc.).
   - Real-time In-Stock / Checked Out availability gauges.

5. **Module 5: Book Issue Management (Circulation Desk)**
   - 1-Click checkout desk validating real-time copy availability and user quota limits.
   - Automated due date calculation based on member role (14 days for students, 30 days for faculty).

6. **Module 6: Book Return & Loan Renewal**
   - 1-Click Return processing that immediately restores inventory copy counts.
   - Loan renewals with max renewal counter validation (up to 2 extensions).
   - Real-time overdue detection and badge indicators.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router) with React 19 & TypeScript
- **Database & Auth**: Supabase PostgreSQL + Row Level Security (RLS)
- **Styling**: Tailwind CSS with custom Glassmorphism design tokens & micro-animations
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ or v20+ / v24+
- **npm** or **pnpm** / **yarn**

### 2. Installation
```bash
npm install
```

### 3. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

*Note*: The application features a built-in reactive storage layer with pre-seeded books, members, and active loans, allowing it to work **100% offline out-of-the-box** without any mandatory setup!

---

## 🗄️ Supabase PostgreSQL Setup (Optional for Live Supabase Deployment)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Run the schema script from [`supabase/schema.sql`](file:///supabase/schema.sql) to create tables and RLS policies.
4. Run the seed script from [`supabase/seed.sql`](file:///supabase/seed.sql) to populate sample books and user profiles.
5. Create `.env.local` based on [`.env.local.example`](file:///..env.local.example):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## 📁 Project Directory Structure

```
LMS/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   ├── books/             # Module 2 & 4: Book Catalog & Live Search
│   │   ├── circulation/       # Module 5 & 6: Circulation Desk (Issue, Return & Renew)
│   │   ├── dashboard/         # Module 1: Dynamic Role Overview
│   │   ├── members/           # Module 3: Member Directory
│   │   ├── globals.css        # Tailwind & Glassmorphism design system
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   └── page.tsx           # Entry redirect
│   ├── components/
│   │   └── layout/            # Sidebar, Header, AppShell
│   ├── context/
│   │   └── AuthContext.tsx    # Role Switcher & RBAC Permissions
│   └── lib/
│       ├── data-store.ts      # Reactive local store with pre-seeded data
│       ├── types.ts           # TypeScript interfaces for all entities
│       └── utils.ts           # Date and class helper functions
├── supabase/
│   ├── schema.sql             # PostgreSQL tables & RLS
│   └── seed.sql               # Pre-seeded users, books & borrowings
├── .gitignore
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```
