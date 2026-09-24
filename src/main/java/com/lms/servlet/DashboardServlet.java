package com.lms.servlet;

import com.lms.dao.BookDAO;
import com.lms.dao.BorrowDAO;
import com.lms.dao.UserDAO;
import com.lms.model.Book;
import com.lms.model.BorrowRecord;
import com.lms.model.User;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/dashboard")
public class DashboardServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private BookDAO bookDAO;
    private UserDAO userDAO;
    private BorrowDAO borrowDAO;

    @Override
    public void init() {
        bookDAO = new BookDAO();
        userDAO = new UserDAO();
        borrowDAO = new BorrowDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User currentUser = (session != null) ? (User) session.getAttribute("currentUser") : null;

        if (currentUser == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        // Global metrics
        int totalBooks = bookDAO.getTotalBookTitles();
        int totalCopies = bookDAO.getTotalCopiesCount();
        int availableCopies = bookDAO.getAvailableCopiesCount();
        int activeLoans = borrowDAO.getTotalActiveBorrowsCount();
        int overdueLoans = borrowDAO.getOverdueCount();
        int totalUsers = userDAO.getUserCount();

        request.setAttribute("totalBooks", totalBooks);
        request.setAttribute("totalCopies", totalCopies);
        request.setAttribute("availableCopies", availableCopies);
        request.setAttribute("activeLoans", activeLoans);
        request.setAttribute("overdueLoans", overdueLoans);
        request.setAttribute("totalUsers", totalUsers);

        if (currentUser.isAdmin() || currentUser.isLibrarian() || currentUser.isCoordinator()) {
            List<BorrowRecord> recentBorrows = borrowDAO.getAllBorrowRecords();
            if (recentBorrows.size() > 8) {
                recentBorrows = recentBorrows.subList(0, 8);
            }
            request.setAttribute("recentBorrows", recentBorrows);

            List<Book> recentBooks = bookDAO.getAllBooks();
            if (recentBooks.size() > 6) {
                recentBooks = recentBooks.subList(0, 6);
            }
            request.setAttribute("recentBooks", recentBooks);
        } else {
            // Student / Faculty personal dashboard
            List<BorrowRecord> myActiveBorrows = borrowDAO.getActiveBorrowRecordsByUser(currentUser.getId());
            int myActiveCount = myActiveBorrows.size();
            int remainingQuota = Math.max(0, currentUser.getMaxBooksAllowed() - myActiveCount);

            request.setAttribute("myActiveBorrows", myActiveBorrows);
            request.setAttribute("myActiveCount", myActiveCount);
            request.setAttribute("remainingQuota", remainingQuota);

            List<Book> featuredBooks = bookDAO.searchBooks(null, null, "AVAILABLE");
            if (featuredBooks.size() > 6) {
                featuredBooks = featuredBooks.subList(0, 6);
            }
            request.setAttribute("featuredBooks", featuredBooks);
        }

        request.getRequestDispatcher("/dashboard.jsp").forward(request, response);
    }
}
