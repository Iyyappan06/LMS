-- ==============================================================================
-- 📚 LMS Pre-seeded Test Data (Modules 1 to 14, excluding Module 7)
-- Next.js 15 + Supabase
-- ==============================================================================

-- 1. SEED PROFILES
INSERT INTO profiles (id, email, full_name, role, department, max_books_allowed, phone, status) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@lms.com', 'Dr. Eleanor Vance (Admin)', 'ADMIN', 'Administration', 99, '+91-9876543210', 'ACTIVE'),
('22222222-2222-2222-2222-222222222222', 'librarian@lms.com', 'Sarah Jenkins (Chief Librarian)', 'LIBRARIAN', 'Library Services', 99, '+91-9876543211', 'ACTIVE'),
('33333333-3333-3333-3333-333333333333', 'faculty@lms.com', 'Prof. Robert Thorne', 'FACULTY', 'Computer Science & Engineering', 5, '+91-9876543212', 'ACTIVE'),
('44444444-4444-4444-4444-444444444444', 'student@lms.com', 'Alex Rivera', 'STUDENT', 'Computer Science & Engineering', 3, '+91-9876543213', 'ACTIVE'),
('55555555-5555-5555-5555-555555555555', 'coordinator@lms.com', 'Dr. Maya Patel (Dept Coordinator)', 'COORDINATOR', 'Computer Science & Engineering', 5, '+91-9876543214', 'ACTIVE'),
('66666666-6666-6666-6666-666666666666', 'emma.watson@student.lms.com', 'Emma Watson', 'STUDENT', 'Electrical Engineering', 3, '+91-9876543215', 'ACTIVE')
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

-- 4. SEED BOOK REQUESTS (Module 8: Faculty Book Acquisition)
INSERT INTO book_requests (id, faculty_id, faculty_name, faculty_email, title, author, publisher, isbn, reason, department, estimated_cost, priority, status, admin_notes, requested_at) VALUES
('d1010101-0001-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Prof. Robert Thorne', 'faculty@lms.com', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'O''Reilly Media', '978-1449373320', 'Required reference textbook for CS401 Distributed Systems course.', 'Computer Science & Engineering', 2250.00, 'HIGH', 'PENDING', NULL, NOW() - INTERVAL '30 days'),
('d1010101-0002-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Prof. Robert Thorne', 'faculty@lms.com', 'Quantum Computing: An Applied Approach', 'Jack D. Hidary', 'Springer', '978-3030239213', 'Advanced electives research for final year CSE students.', 'Computer Science & Engineering', 3250.00, 'MEDIUM', 'APPROVED', 'Approved under Q1 Department Research Budget.', NOW() - INTERVAL '45 days')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED COURSE READINGS (Module 9: Department Resource Coordination)
INSERT INTO course_readings (id, course_code, course_name, department, coordinator_name, book_title, author, isbn, required_copies, is_mandatory, semester, academic_year, status, created_at) VALUES
('e1010101-0001-0000-0000-000000000001', 'CS301', 'Data Structures & Algorithms', 'Computer Science & Engineering', 'Dr. Maya Patel (Dept Coordinator)', 'Introduction to Algorithms (CLRS)', 'Thomas H. Cormen et al.', '978-0262033848', 30, true, 'Spring 2026', '2025-2026', 'APPROVED', NOW() - INTERVAL '60 days'),
('e1010101-0002-0000-0000-000000000002', 'CS401', 'Distributed Systems', 'Computer Science & Engineering', 'Dr. Maya Patel (Dept Coordinator)', 'Designing Data-Intensive Applications', 'Martin Kleppmann', '978-1449373320', 20, true, 'Spring 2026', '2025-2026', 'PROPOSED', NOW() - INTERVAL '15 days')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED FINE RECORDS (Module 11: Fine & Overdue Settlement)
INSERT INTO fine_records (id, borrow_id, user_id, user_name, user_email, book_title, amount, reason, days_overdue, payment_status, issued_at, paid_at, payment_method, waived_by) VALUES
('f1010101-0001-0000-0000-000000000001', 'c1010101-0002-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'Alex Rivera', 'student@lms.com', 'Effective Java', 30.00, 'Overdue return penalty (₹5/day)', 6, 'UNPAID', NOW() - INTERVAL '6 days', NULL, NULL, NULL),
('f1010101-0002-0000-0000-000000000002', NULL, '66666666-6666-6666-6666-666666666666', 'Emma Watson', 'emma.watson@student.lms.com', 'Introduction to Algorithms (CLRS)', 55.00, 'Overdue return penalty (₹5/day)', 11, 'PAID', NOW() - INTERVAL '12 days', NOW() - INTERVAL '10 days', 'Credit Card', NULL),
('f1010101-0003-0000-0000-000000000003', NULL, '33333333-3333-3333-3333-333333333333', 'Prof. Robert Thorne', 'faculty@lms.com', 'Database System Concepts', 15.00, 'Overdue return penalty (₹5/day)', 3, 'WAIVED', NOW() - INTERVAL '20 days', NULL, NULL, 'Dr. Eleanor Vance (Admin)')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED INVENTORY AUDITS (Module 13: Inventory Management & Condition Audits)
INSERT INTO inventory_audits (id, book_id, book_title, isbn, condition_status, notes, copies_affected, audited_by, audited_at) VALUES
('a7010101-0001-0000-0000-000000000001', 'b1010101-0003-0000-0000-000000000003', 'Effective Java', '978-0134685991', 'DAMAGED', 'Water damage detected on 2 copies. Spine cracked on 1 copy. Moved to repair queue.', 2, 'Sarah Jenkins (Chief Librarian)', NOW() - INTERVAL '10 days'),
('a7010101-0002-0000-0000-000000000002', 'b1010101-0006-0000-0000-000000000006', 'Database System Concepts', '978-0073529325', 'LOST', 'Declared lost after annual inventory check. Not found on shelf DB-A-101.', 1, 'Sarah Jenkins (Chief Librarian)', NOW() - INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;

-- 8. SEED SYSTEM CONFIG (Module 14: System Administration)
INSERT INTO system_config (key, value, description) VALUES
('student_loan_days', '14', 'Maximum borrowing period for students (days)'),
('faculty_loan_days', '30', 'Maximum borrowing period for faculty (days)'),
('max_renewals_allowed', '2', 'Maximum renewal count per borrow record'),
('fine_per_day', '5', 'Fine amount per overdue day (in ₹)'),
('library_name', '"Apex University Central Library"', 'Display name of the library'),
('contact_email', '"library-support@apex.edu"', 'Library administration contact email'),
('operating_hours', '"Mon - Fri: 8:00 AM - 10:00 PM | Sat - Sun: 10:00 AM - 6:00 PM"', 'Library operating hours schedule')
ON CONFLICT (key) DO NOTHING;
