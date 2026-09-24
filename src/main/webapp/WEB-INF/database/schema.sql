-- ============================================================
-- Library Management System (LMS) - Database Schema
-- Compatible with MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS lms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lms_db;

-- ------------------------------------------------------------
-- Table: users
-- Roles: ADMIN, LIBRARIAN, FACULTY, STUDENT, COORDINATOR
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'LIBRARIAN', 'FACULTY', 'STUDENT', 'COORDINATOR') NOT NULL DEFAULT 'STUDENT',
    department VARCHAR(100) DEFAULT 'General',
    phone VARCHAR(20),
    max_books_allowed INT DEFAULT 3,
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: books
-- Status: AVAILABLE, ARCHIVED, DAMAGED, LOST
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    publisher VARCHAR(150),
    edition VARCHAR(50),
    publish_year INT,
    total_copies INT NOT NULL DEFAULT 1,
    available_copies INT NOT NULL DEFAULT 1,
    shelf_location VARCHAR(50),
    description TEXT,
    status ENUM('AVAILABLE', 'ARCHIVED', 'DAMAGED', 'LOST') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: borrow_records
-- Tracks book issuance, returns, renewals, and due dates
-- Status: ISSUED, RETURNED, OVERDUE, RENEWED
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS borrow_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    renewal_count INT DEFAULT 0,
    status ENUM('ISSUED', 'RETURNED', 'OVERDUE', 'RENEWED') DEFAULT 'ISSUED',
    remarks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Pre-seeded Initial Data
-- ------------------------------------------------------------

-- Seed Users (Passwords: Admin@123, Lib@123, Faculty@123, Coord@123)
INSERT INTO users (username, password, email, full_name, role, department, phone, max_books_allowed, status)
VALUES
('admin', 'Admin@123', 'admin@lms.com', 'System Administrator', 'ADMIN', 'Information Technology', '9876543210', 10, 'ACTIVE'),
('librarian', 'Lib@123', 'librarian@lms.com', 'Chief Librarian', 'LIBRARIAN', 'Central Library', '9876543211', 10, 'ACTIVE'),
('faculty1', 'Faculty@123', 'faculty@lms.com', 'Dr. Sarah Jenkins', 'FACULTY', 'Computer Science', '9876543212', 6, 'ACTIVE'),
('coord1', 'Coord@123', 'coordinator@lms.com', 'Prof. Robert Davis', 'COORDINATOR', 'Computer Science', '9876543215', 8, 'ACTIVE')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- Seed Books
INSERT INTO books (isbn, title, author, category, publisher, edition, publish_year, total_copies, available_copies, shelf_location, description, status)
VALUES
('978-0134685991', 'Effective Java', 'Joshua Bloch', 'Computer Science', 'Addison-Wesley', '3rd Edition', 2018, 5, 5, 'Shelf CS-01', 'Best practices for the Java programming language.', 'AVAILABLE'),
('978-0132350884', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Computer Science', 'Prentice Hall', '1st Edition', 2008, 6, 6, 'Shelf CS-02', 'Guidelines for writing clean, maintainable software.', 'AVAILABLE'),
('978-0262033848', 'Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson', 'Computer Science', 'MIT Press', '3rd Edition', 2009, 4, 3, 'Shelf CS-03', 'Comprehensive textbook on modern computer algorithms.', 'AVAILABLE'),
('978-0134494166', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', 'Computer Science', 'Addison-Wesley', '1st Edition', 1994, 3, 3, 'Shelf CS-04', 'Classic GoF design patterns reference.', 'AVAILABLE'),
('978-1491950357', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'Computer Science', 'O''Reilly Media', '1st Edition', 2017, 5, 5, 'Shelf CS-05', 'The big ideas behind reliable, scalable, and maintainable systems.', 'AVAILABLE'),
('978-0073529325', 'Database System Concepts', 'Abraham Silberschatz, Henry F. Korth', 'Database Systems', 'McGraw-Hill', '6th Edition', 2010, 4, 4, 'Shelf DB-01', 'Foundations of database management and SQL engines.', 'AVAILABLE'),
('978-0133594140', 'Operating System Concepts', 'Abraham Silberschatz, Peter B. Galvin', 'Operating Systems', 'Wiley', '10th Edition', 2018, 4, 4, 'Shelf OS-01', 'Fundamental principles of modern operating systems.', 'AVAILABLE'),
('978-0132126953', 'Computer Networks', 'Andrew S. Tanenbaum, David J. Wetherall', 'Networking', 'Pearson', '5th Edition', 2010, 5, 5, 'Shelf NET-01', 'Classic networking architecture and protocol design.', 'AVAILABLE'),
('978-0321751041', 'Artificial Intelligence: A Modern Approach', 'Stuart Russell, Peter Norvig', 'Artificial Intelligence', 'Pearson', '4th Edition', 2020, 3, 3, 'Shelf AI-01', 'Leading textbook in AI and machine learning.', 'AVAILABLE'),
('978-0131103627', 'The C Programming Language', 'Brian W. Kernighan, Dennis M. Ritchie', 'Programming', 'Prentice Hall', '2nd Edition', 1988, 5, 5, 'Shelf PRG-01', 'Definitive reference by creators of C language.', 'AVAILABLE')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed Initial Borrow Records
INSERT INTO borrow_records (user_id, book_id, issue_date, due_date, return_date, renewal_count, status, remarks)
VALUES
(3, 3, DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 20 DAY), NULL, 1, 'RENEWED', 'Faculty research reference')
ON DUPLICATE KEY UPDATE status=VALUES(status);
