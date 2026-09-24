# Implementation Plan: Library Management System (50% Core Scope)

Design and build the foundational 50% of the Java/JSP/Servlet/MySQL Library Management System (LMS) based on the architectural deployment diagram and functional specifications.

## 50% Scope Breakdown

The full specification defines 14 functional modules and 5 user classes. For this 50% milestone, we implement the **Core Operational & Transactional Backbone** (Modules 1–6 & 10) to make the system fully functional, secure, and robust end-to-end:

| Module # | Module Name | Scope Status | Key Capabilities in this Phase |
|---|---|---|---|
| **1** | **User Authentication & RBAC** | **Included (Phase 1)** | Multi-role login (Student, Faculty, Librarian, Coordinator, Admin), secure session filtering, role-tailored dashboard views. |
| **2** | **Book Management** | **Included (Phase 1)** | Full CRUD for book catalog (Title, Author, Category, ISBN, Publisher, Edition, Copies, Shelf Location, Status). |
| **3** | **Student & Faculty Management** | **Included (Phase 1)** | User registration, member directory, role assignment, profile viewing, borrowing privilege limits. |
| **4** | **Book Search & Catalog** | **Included (Phase 1)** | Multi-criteria live search (Title, Author, Category, ISBN, Keyword, Availability status). |
| **5** | **Book Issue Management** | **Included (Phase 1)** | Issuing books to students/faculty, availability check, borrowing limit validation, due date calculation. |
| **6** | **Book Return & Renewal** | **Included (Phase 1)** | Processing book returns, copy availability updates, book loan renewals with renewal limits. |
| **10** | **Borrowing History Management** | **Included (Phase 1)** | Complete loan audit trail, active borrowings view, personal history for students/faculty, centralized circulation logs for librarian/admin. |
| *7* | *Book Reservation* | *Phase 2 (Remaining 50%)* | Queue reservations for out-of-stock items. |
| *8* | *Faculty Book Request* | *Phase 2 (Remaining 50%)* | Acquisition requests for teaching & research resources. |
| *9* | *Department Resource Management* | *Phase 2 (Remaining 50%)* | Coordinator book recommendations & department usage analytics. |
| *11* | *Fine & Overdue Monitoring* | *Phase 2 (Remaining 50%)* | Overdue fee calculations & reminder alerts. |
| *12* | *Report Generation* | *Phase 2 (Remaining 50%)* | Comprehensive PDF/Excel reports & circulation analytics. |
| *13* | *Inventory Management* | *Phase 2 (Remaining 50%)* | Damaged/lost tracking & audit workflows. |
| *14* | *System Administration* | *Phase 2 (Remaining 50%)* | Automated DB backup utility & global system configuration. |

---

## User Review Required

> [!IMPORTANT]
> **Database Credentials & Configuration**:
> The MySQL server `MySQL80` is detected running on `localhost:3306`. We will configure `DBConnection.java` with standard default settings (`jdbc:mysql://localhost:3306/lms_db`, default user `root`). Please verify your MySQL password (can be configured in `db.properties` or `DBConnection.java`).
>
> **Pre-seeded Accounts for Testing**:
> We will generate a complete SQL setup script `database/schema.sql` with sample books and 5 test users corresponding to each role:
> - **Admin**: `admin@lms.com` / `Admin@123`
> - **Librarian**: `librarian@lms.com` / `Lib@123`
> - **Faculty**: `faculty@lms.com` / `Faculty@123`
> - **Student**: `student@lms.com` / `Student@123`
> - **Coordinator**: `coordinator@lms.com` / `Coord@123`

---

## Proposed Changes

### Database Layer (MySQL)

#### [NEW] [schema.sql](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/WEB-INF/database/schema.sql)
- Schema definition:
  - `users` (id, username, email, password, full_name, role, department, max_books_allowed, phone, status, created_at)
  - `books` (id, isbn, title, author, category, publisher, edition, total_copies, available_copies, shelf_location, description, status, created_at)
  - `borrow_records` (id, user_id, book_id, issue_date, due_date, return_date, renewal_count, status, remarks)
  - Initial seed data for all 5 roles and ~15 varied academic books across Engineering, Science, Management, Literature.

---

### Data Access Layer & Models (Java DAO / JDBC)

#### [NEW] [DBConnection.java](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/java/com/lms/dao/DBConnection.java)
- Robust JDBC connection manager with connection pooling helper, fallback configuration, and safe resource closing.

#### [NEW] [User.java](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/java/com/lms/model/User.java)
- User entity model with role enums (`ADMIN`, `LIBRARIAN`, `FACULTY`, `STUDENT`, `COORDINATOR`), status flags, and borrowing limits.

#### [NEW] [Book.java](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/java/com/lms/model/Book.java)
- Book entity model containing full catalog fields and availability tracking.

#### [NEW] [BorrowRecord.java](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/java/com/lms/model/BorrowRecord.java)
- Circulation transaction model mapping user details, book details, issue dates, due dates, return status, and renewal count.

#### [NEW] [UserDAO.java](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/java/com/lms/dao/UserDAO.java)
- Data access methods: `authenticate(email, password)`, `createUser(user)`, `getUserById(id)`, `getAllUsers()`, `getUsersByRole(role)`, `updateUser(user)`, `deleteUser(id)`.

#### [NEW] [BookDAO.java](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/java/com/lms/dao/BookDAO.java)
- Data access methods: `addBook(book)`, `updateBook(book)`, `deleteBook(id)`, `getBookById(id)`, `getAllBooks()`, `searchBooks(query, category, status)`, `updateAvailableCopies(bookId, delta)`.

#### [NEW] [BorrowDAO.java](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/java/com/lms/dao/BorrowDAO.java)
- Circulation data access: `issueBook(record)`, `returnBook(borrowId, returnDate)`, `renewBook(borrowId, newDueDate)`, `getActiveBorrowsByUser(userId)`, `getAllBorrowRecords()`, `getBorrowRecordById(id)`.

---

### Business Logic & Controller Layer (Servlets & Filters)

#### [NEW] [AuthFilter.java](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/java/com/lms/filter/AuthFilter.java)
- Security interceptor that prevents unauthorized access, checks active session, and validates role permissions on administrative and operational paths.

#### [NEW] [AuthServlet.java](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/java/com/lms/servlet/AuthServlet.java)
- Handles user login, authentication verification, session initiation, and secure logout.

#### [NEW] [DashboardServlet.java](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/java/com/lms/servlet/DashboardServlet.java)
- Aggregates role-specific metrics (total books, active loans, member counts, user's current borrowed books) and routes users to appropriate dashboard view.

#### [NEW] [BookServlet.java](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/java/com/lms/servlet/BookServlet.java)
- Controllers for book catalog: list, search, add, edit, delete, and view details.

#### [NEW] [UserServlet.java](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/java/com/lms/servlet/UserServlet.java)
- Controllers for member management: register, view profile, edit member, list students/faculty.

#### [NEW] [BorrowServlet.java](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/java/com/lms/servlet/BorrowServlet.java)
- Controllers for circulation transactions: Issue book (validates user quota & stock), Return book, Renew book, and History log.

---

### Presentation Layer (JSP, HTML5, CSS3, JS)

#### [NEW] [web.xml](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/WEB-INF/web.xml)
- Servlet and filter mappings, session timeout, and welcome file list.

#### [NEW] [app.css](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/assets/css/style.css)
- Premium, modern design system: typography (Inter/Plus Jakarta Sans), refined color palette, glassmorphism cards, responsive navigation, crisp data tables, intuitive status chips, and smooth transition effects.

#### [NEW] [app.js](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/assets/js/main.js)
- Interactive client utilities: live table filtering, modal openers, confirmation dialogs, toast notifications, dynamic date calculations.

#### [NEW] [header.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/WEB-INF/includes/header.jsp) & [navbar.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/WEB-INF/includes/navbar.jsp) & [footer.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/WEB-INF/includes/footer.jsp)
- Modular include components for consistent header, sidebar/navigation, and footer across all pages.

#### [NEW] [login.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/login.jsp) & [index.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/index.jsp)
- Sleek authentication portal with demo login quick-fill badges for all 5 roles.

#### [NEW] [dashboard.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/dashboard.jsp)
- Role-adaptive dashboard providing tailored quick actions, stats widgets, and recent activity cards.

#### [NEW] [books/list.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/books/list.jsp), [books/add.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/books/add.jsp), [books/edit.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/books/edit.jsp)
- Rich book management views with search filters, category badges, copy availability gauges, and CRUD forms.

#### [NEW] [users/list.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/users/list.jsp), [users/add.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/users/add.jsp), [users/profile.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/users/profile.jsp)
- Member directory, registration forms, role filters, and profile view.

#### [NEW] [circulation/issue.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/circulation/issue.jsp), [circulation/return.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/circulation/return.jsp), [circulation/history.jsp](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/circulation/history.jsp)
- Circulation transaction interfaces for issuing books to members, one-click return processing, renewal modal, and complete audit history.

---

### Dependency Management

#### [NEW] [mysql-connector-j-9.7.0.jar](file:///c:/Users/iyyap/eclipse-workspace/LMS/src/main/webapp/WEB-INF/lib/mysql-connector-j-9.7.0.jar)
- Copy MySQL connector JAR from `C:\Users\iyyap\Downloads\mysql-connector-j-9.7.0\mysql-connector-j-9.7.0.jar` into `WEB-INF/lib`.

---

## Verification Plan

### Automated Build & Compilation
- Compile all Java sources against `servlet-api.jar` from Tomcat 9.0 and `mysql-connector-j-9.7.0.jar`:
  ```powershell
  javac -cp "C:\Users\iyyap\Downloads\apache-tomcat-9.0.120\lib\servlet-api.jar;src\main\webapp\WEB-INF\lib\mysql-connector-j-9.7.0.jar" -d build/classes (Get-ChildItem -Path src/main/java -Recurse -Filter *.java | ForEach-Object { $_.FullName })
  ```

### Functional Validation
1. **Schema & Seed Verification**: Execute SQL schema against MySQL, verify tables and initial admin/librarian/faculty/student users created.
2. **Authentication Flow**: Test login with each of the 5 roles; verify role-restricted navigation and session security.
3. **Book Management**: Test Add Book, Search Books by keyword/ISBN/category, Edit Book, and Delete Book.
4. **Circulation Workflow**:
   - Issue book to Student (verify copy count decrements and active loan created).
   - Renew book (verify due date extended and renewal counter incremented).
   - Return book (verify copy count restored and loan status marked RETURNED).
   - Verify complete borrowing history log.
