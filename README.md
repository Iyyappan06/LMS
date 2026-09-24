# 📚 Library Management System (LMS)

A robust, full-featured **Library Management System** built with **Java (Servlets & JSP)**, **MySQL**, and **Apache Tomcat**, designed with a modern, glassmorphic UI and Role-Based Access Control (RBAC).

---

## 🌟 Key Features

### 👥 Multi-Role Authentication & Access Control (RBAC)
- **Role-tailored interfaces** for 5 user types:
  - **Admin**: Full administrative privileges, user management, and catalog control.
  - **Librarian**: Complete catalog management, issue/return circulation desk, member directory, and loan audit logs.
  - **Faculty**: Search books, view personal borrowing records, track return deadlines, elevated loan quotas.
  - **Student**: Search & discover books, check availability, view active loans & personal borrowing history.
  - **Coordinator**: Catalog search, department-level resource coordination, loan status overview.
- **Session Security**: Centralized `AuthFilter` ensuring protected endpoints and automated redirect for unauthenticated sessions.

### 📖 Book Catalog & Inventory Management
- Full CRUD operations for books (ISBN, Title, Author, Category, Publisher, Edition, Shelf Location).
- Live Multi-criteria Search & Filtering (by keyword, category, author, status, and availability).
- Real-time stock and copy tracking (total copies vs. available copies).

### 🔄 Issue, Return & Renewal (Circulation Desk)
- **Book Issue**: Validates member borrowing quotas and real-time book copy availability before issuance.
- **Book Return**: Instantly updates inventory copies upon return and stamps completion timestamps.
- **Book Renewal**: Allows renewals with configurable renewal limits and updated due date calculation.
- **Circulation History & Audit Trail**: Comprehensive tracking of all active, returned, and overdue borrowings.

---

## 🛠️ Technology Stack

- **Backend**: Java 24 / Java EE (Jakarta/Javax Servlets, JSP, JSTL)
- **Database**: MySQL 8.0+ (via JDBC Connector/J)
- **Application Server**: Apache Tomcat 9.0+
- **Frontend**: JSP, HTML5, Vanilla CSS3 (Custom Design System with Glassmorphism, CSS Variables & Micro-animations)
- **IDE**: Eclipse IDE for Enterprise Java and Web Developers

---

## 🚀 Getting Started & Setup Guide

### 1. Prerequisites
- **Java Development Kit (JDK)**: JDK 17, 21, or 24 installed.
- **Apache Tomcat**: Version 9.0.x configured in Eclipse or standalone.
- **MySQL Server**: MySQL 8.x running on `localhost:3306`.
- **Eclipse IDE**: Eclipse IDE for Enterprise Java and Web Developers.

---

### 2. Database Setup
1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or MySQL CLI).
2. Execute the schema script located at:
   ```
   src/main/webapp/WEB-INF/database/schema.sql
   ```
3. This creates the database `lms_db`, required tables (`users`, `books`, `borrow_records`), and seeds initial sample books & accounts.

---

### 3. Database Configuration
Database connection settings are located in [DBConnection.java](file:///src/main/java/com/lms/dao/DBConnection.java).
- Default URL: `jdbc:mysql://localhost:3306/lms_db`
- Default Username: `root`
- Default Password: `""` (empty) / auto-fallback to common configurations.

*Optional*: You can also create a `db.properties` file in `src/main/resources` or specify environment variables (`LMS_DB_USER`, `LMS_DB_PASSWORD`).

---

### 4. Running the Project in Eclipse
1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   ```
2. **Open Eclipse**:
   - Go to `File` ➔ `Import...` ➔ `General` ➔ `Existing Projects into Workspace`.
   - Select the `LMS` folder and click **Finish**.
3. **Configure Apache Tomcat**:
   - Right-click the project ➔ `Run As` ➔ `Run on Server`.
   - Select Apache Tomcat v9.0 and finish.
4. **Access the Application**:
   - Open your browser and navigate to: `http://localhost:8080/LMS/`

---

## 🔑 Default Test Accounts

Use these pre-seeded accounts from `schema.sql` to test different roles:

| Role | Email | Password | Allowed Books |
|---|---|---|---|
| **Admin** | `admin@lms.com` | `Admin@123` | Unlimited |
| **Librarian** | `librarian@lms.com` | `Lib@123` | Unlimited |
| **Faculty** | `faculty@lms.com` | `Faculty@123` | 5 Books |
| **Student** | `student@lms.com` | `Student@123` | 3 Books |
| **Coordinator** | `coordinator@lms.com` | `Coord@123` | 5 Books |

---

## 📁 Project Directory Structure

```
LMS/
├── src/
│   └── main/
│       ├── java/com/lms/
│       │   ├── dao/           # DBConnection, UserDAO, BookDAO, BorrowDAO
│       │   ├── filter/        # AuthFilter (Session & Route protection)
│       │   ├── model/         # User, Book, BorrowRecord entity models
│       │   └── servlet/       # AuthServlet, BookServlet, UserServlet, BorrowServlet, DashboardServlet
│       └── webapp/
│           ├── assets/css/    # Modern Glassmorphic CSS Design System
│           ├── books/         # Book catalog and management views
│           ├── circulation/   # Issue, return, and history JSP pages
│           ├── users/         # Member directory and profile views
│           ├── WEB-INF/
│           │   ├── database/  # schema.sql (DDL & seed data)
│           │   ├── includes/  # header.jsp, footer.jsp, navbar components
│           │   ├── lib/       # mysql-connector-j-9.7.0.jar
│           │   └── web.xml    # Servlet mappings and configurations
│           ├── dashboard.jsp  # Role-specific real-time metric dashboard
│           ├── login.jsp      # Login interface
│           └── index.jsp      # Landing page / redirection
├── .gitignore
├── .classpath
├── .project
└── README.md
```

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
