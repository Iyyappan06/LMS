-- ==============================================================================
-- 📚 LMS Pre-seeded Test Data (Modules 1 to 6)
-- ==============================================================================

-- 1. SEED PROFILES
INSERT INTO profiles (id, email, full_name, role, department, max_books_allowed, phone, status) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@lms.com', 'Dr. Eleanor Vance (Admin)', 'ADMIN', 'Administration', 99, '+1-555-0101', 'ACTIVE'),
('22222222-2222-2222-2222-222222222222', 'librarian@lms.com', 'Sarah Jenkins (Chief Librarian)', 'LIBRARIAN', 'Library Services', 99, '+1-555-0102', 'ACTIVE'),
('33333333-3333-3333-3333-333333333333', 'faculty@lms.com', 'Prof. Robert Thorne', 'FACULTY', 'Computer Science & Engineering', 5, '+1-555-0103', 'ACTIVE'),
('44444444-4444-4444-4444-444444444444', 'student@lms.com', 'Alex Rivera', 'STUDENT', 'Computer Science & Engineering', 3, '+1-555-0104', 'ACTIVE'),
('55555555-5555-5555-5555-555555555555', 'coordinator@lms.com', 'Dr. Maya Patel (Dept Coordinator)', 'COORDINATOR', 'Computer Science & Engineering', 5, '+1-555-0105', 'ACTIVE'),
('66666666-6666-6666-6666-666666666666', 'emma.watson@student.lms.com', 'Emma Watson', 'STUDENT', 'Electrical Engineering', 3, '+1-555-0106', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED BOOKS
INSERT INTO books (id, isbn, title, author, category, publisher, edition, total_copies, available_copies, shelf_location, cover_image_url, description, featured) VALUES
('b1010101-0001-0000-0000-000000000001', '978-0132350884', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Computer Science', 'Prentice Hall', '1st Edition', 6, 4, 'CS-A-102', 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?w=600&auto=format&fit=crop&q=80', 'Even bad code can function. But if code isn''t clean, it can bring a development organization to its knees.', true),
('b1010101-0002-0000-0000-000000000002', '978-0262033848', 'Introduction to Algorithms (CLRS)', 'Thomas H. Cormen et al.', 'Computer Science', 'MIT Press', '4th Edition', 8, 5, 'CS-B-204', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80', 'A comprehensive textbook covering the modern study of computer algorithms with depth and rigor.', true),
('b1010101-0003-0000-0000-000000000003', '978-0134685991', 'Effective Java', 'Joshua Bloch', 'Computer Science', 'Addison-Wesley', '3rd Edition', 5, 2, 'CS-A-105', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80', 'The definitive best-practices guide to the Java programming language.', true),
('b1010101-0004-0000-0000-000000000004', '978-1449373320', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'Computer Science', 'O''Reilly Media', '1st Edition', 7, 0, 'CS-C-301', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80', 'The big ideas behind reliable, scalable, and maintainable data systems.', true),
('b1010101-0005-0000-0000-000000000005', '978-0262035613', 'Deep Learning', 'Ian Goodfellow, Yoshua Bengio, Aaron Courville', 'Artificial Intelligence', 'MIT Press', '1st Edition', 5, 3, 'AI-A-101', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80', 'An introduction to a broad range of topics in deep learning, covering mathematical and conceptual background.', true),
('b1010101-0006-0000-0000-000000000006', '978-0073529325', 'Database System Concepts', 'Abraham Silberschatz et al.', 'Database Systems', 'McGraw-Hill', '7th Edition', 5, 2, 'DB-A-101', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80', 'Presents the fundamental concepts of database management in an intuitive manner.', false),
('b1010101-0007-0000-0000-000000000007', '978-0133594140', 'Computer Networks', 'Andrew S. Tanenbaum, David J. Wetherall', 'Networking', 'Pearson', '5th Edition', 4, 4, 'NET-B-101', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80', 'Appropriate for Computer Networking or Introduction to Networking courses.', false)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED BORROW RECORDS
INSERT INTO borrow_records (id, user_id, book_id, issue_date, due_date, return_date, renewal_count, status, remarks) VALUES
('c1010101-0001-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'b1010101-0001-0000-0000-000000000001', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '9 days', NULL, 0, 'ACTIVE', 'Regular student checkout'),
('c1010101-0002-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'b1010101-0003-0000-0000-000000000003', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '6 days', NULL, 0, 'OVERDUE', 'Overdue loan notice sent'),
('c1010101-0003-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'b1010101-0004-0000-0000-000000000004', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', NULL, 1, 'ACTIVE', 'Faculty research borrowing'),
('c1010101-0004-0000-0000-000000000004', '66666666-6666-6666-6666-666666666666', 'b1010101-0002-0000-0000-000000000002', CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE - INTERVAL '11 days', CURRENT_DATE - INTERVAL '12 days', 0, 'RETURNED', 'Returned in good condition')
ON CONFLICT (id) DO NOTHING;
