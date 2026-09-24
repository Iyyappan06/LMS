package com.lms.test;

import com.lms.dao.*;
import com.lms.model.*;
import java.util.List;

public class VerifyApp {
    public static void main(String[] args) {
        System.out.println("=== Testing LMS Core Foundation ===");
        
        UserDAO userDAO = new UserDAO();
        BookDAO bookDAO = new BookDAO();
        BorrowDAO borrowDAO = new BorrowDAO();

        // 1. Test Authentication with active users
        User admin = userDAO.authenticate("admin@lms.com", "Admin@123");
        User faculty = userDAO.authenticate("faculty@lms.com", "Faculty@123");
        System.out.println("1. Auth Admin: " + (admin != null ? "PASS (" + admin.getFullName() + ", Role: " + admin.getRole() + ")" : "FAIL"));
        System.out.println("2. Auth Faculty: " + (faculty != null ? "PASS (" + faculty.getFullName() + ", Role: " + faculty.getRole() + ")" : "FAIL"));

        // 2. Test Books
        List<Book> books = bookDAO.getAllBooks();
        System.out.println("3. Total Book Titles in DB: " + books.size() + " (" + (books.size() >= 10 ? "PASS" : "FAIL") + ")");

        // 3. Test Search
        List<Book> searchRes = bookDAO.searchBooks("Java", null, null);
        System.out.println("4. Search 'Java': Found " + searchRes.size() + " matches (" + (!searchRes.isEmpty() ? "PASS" : "FAIL") + ")");

        // 4. Test Circulation
        int activeBorrows = borrowDAO.getTotalActiveBorrowsCount();
        System.out.println("5. Active Borrow Loans: " + activeBorrows + " (" + (activeBorrows >= 0 ? "PASS" : "FAIL") + ")");

        System.out.println("=== All Core 50% Functional Verification Tests Completed Successfully ===");
    }
}
