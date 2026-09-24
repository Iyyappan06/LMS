package com.lms.servlet;

import com.lms.dao.BookDAO;
import com.lms.dao.BorrowDAO;
import com.lms.dao.UserDAO;
import com.lms.model.Book;
import com.lms.model.BorrowRecord;
import com.lms.model.User;
import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/borrow")
public class BorrowServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private BorrowDAO borrowDAO;
    private BookDAO bookDAO;
    private UserDAO userDAO;

    @Override
    public void init() {
        borrowDAO = new BorrowDAO();
        bookDAO = new BookDAO();
        userDAO = new UserDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getParameter("action");
        if (action == null) action = "history";

        switch (action) {
            case "issue":
                showIssueForm(request, response);
                break;
            case "return":
                showReturnForm(request, response);
                break;
            case "myHistory":
                showMyHistory(request, response);
                break;
            case "history":
            default:
                showAllHistory(request, response);
                break;
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getParameter("action");

        if ("processIssue".equals(action)) {
            processIssue(request, response);
        } else if ("processReturn".equals(action)) {
            processReturn(request, response);
        } else if ("renew".equals(action)) {
            processRenew(request, response);
        } else {
            response.sendRedirect(request.getContextPath() + "/borrow?action=history");
        }
    }

    private void showIssueForm(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        List<User> users = userDAO.getAllUsers();
        List<Book> availableBooks = bookDAO.searchBooks(null, null, "AVAILABLE");

        String preselectedBookId = request.getParameter("bookId");
        String preselectedUserId = request.getParameter("userId");

        request.setAttribute("users", users);
        request.setAttribute("availableBooks", availableBooks);
        request.setAttribute("preselectedBookId", preselectedBookId);
        request.setAttribute("preselectedUserId", preselectedUserId);
        request.getRequestDispatcher("/circulation/issue.jsp").forward(request, response);
    }

    private void showReturnForm(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        List<BorrowRecord> activeBorrows = borrowDAO.getAllBorrowRecords();
        // filter active only
        activeBorrows.removeIf(BorrowRecord::isReturned);

        request.setAttribute("activeBorrows", activeBorrows);
        request.getRequestDispatcher("/circulation/return.jsp").forward(request, response);
    }

    private void showAllHistory(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        List<BorrowRecord> history = borrowDAO.getAllBorrowRecords();
        request.setAttribute("history", history);
        request.getRequestDispatcher("/circulation/history.jsp").forward(request, response);
    }

    private void showMyHistory(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User currentUser = (session != null) ? (User) session.getAttribute("currentUser") : null;
        if (currentUser == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        List<BorrowRecord> myHistory = borrowDAO.getBorrowRecordsByUser(currentUser.getId());
        int activeCount = borrowDAO.getActiveIssuedCountByUser(currentUser.getId());

        request.setAttribute("myHistory", myHistory);
        request.setAttribute("activeCount", activeCount);
        request.setAttribute("maxAllowed", currentUser.getMaxBooksAllowed());
        request.getRequestDispatcher("/circulation/my_history.jsp").forward(request, response);
    }

    private void processIssue(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            int userId = Integer.parseInt(request.getParameter("userId"));
            int bookId = Integer.parseInt(request.getParameter("bookId"));
            String remarks = request.getParameter("remarks");
            String dueDateStr = request.getParameter("dueDate");

            User user = userDAO.getUserById(userId);
            Book book = bookDAO.getBookById(bookId);

            if (user == null || book == null) {
                response.sendRedirect(request.getContextPath() + "/borrow?action=issue&message=Invalid user or book selection&type=danger");
                return;
            }

            if (!book.isAvailableToBorrow()) {
                response.sendRedirect(request.getContextPath() + "/borrow?action=issue&message=Selected book has no available copies&type=danger");
                return;
            }

            int activeIssued = borrowDAO.getActiveIssuedCountByUser(userId);
            if (activeIssued >= user.getMaxBooksAllowed()) {
                response.sendRedirect(request.getContextPath() + "/borrow?action=issue&message=User has reached their borrowing limit of " + user.getMaxBooksAllowed() + " books&type=danger");
                return;
            }

            LocalDate issueLocalDate = LocalDate.now();
            LocalDate dueLocalDate;
            if (dueDateStr != null && !dueDateStr.trim().isEmpty()) {
                dueLocalDate = LocalDate.parse(dueDateStr.trim());
            } else {
                // Default loan duration: Faculty = 30 days, others = 14 days
                int loanDays = (user.isFaculty() || user.isCoordinator()) ? 30 : 14;
                dueLocalDate = issueLocalDate.plusDays(loanDays);
            }

            BorrowRecord record = new BorrowRecord();
            record.setUserId(userId);
            record.setBookId(bookId);
            record.setIssueDate(Date.valueOf(issueLocalDate));
            record.setDueDate(Date.valueOf(dueLocalDate));
            record.setRemarks(remarks != null && !remarks.trim().isEmpty() ? remarks.trim() : "Standard issue");

            boolean ok = borrowDAO.issueBook(record);
            if (ok) {
                response.sendRedirect(request.getContextPath() + "/borrow?action=history&message=Book '" + java.net.URLEncoder.encode(book.getTitle(), "UTF-8") + "' issued to " + java.net.URLEncoder.encode(user.getFullName(), "UTF-8") + " successfully&type=success");
            } else {
                response.sendRedirect(request.getContextPath() + "/borrow?action=issue&message=Could not complete book issuance (stock or database conflict)&type=danger");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/borrow?action=issue&message=Error issuing book: " + java.net.URLEncoder.encode(e.getMessage(), "UTF-8") + "&type=danger");
        }
    }

    private void processReturn(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            int borrowId = Integer.parseInt(request.getParameter("borrowId"));
            String remarks = request.getParameter("remarks");
            String redirectParam = request.getParameter("redirect");

            boolean ok = borrowDAO.returnBook(borrowId, remarks != null ? remarks.trim() : "Returned in good condition");
            
            String dest = (redirectParam != null && !redirectParam.isEmpty()) ? redirectParam : "/borrow?action=return";
            if (ok) {
                response.sendRedirect(request.getContextPath() + dest + (dest.contains("?") ? "&" : "?") + "message=Book return processed successfully&type=success");
            } else {
                response.sendRedirect(request.getContextPath() + dest + (dest.contains("?") ? "&" : "?") + "message=Failed to process return&type=danger");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/borrow?action=return&message=Error processing return&type=danger");
        }
    }

    private void processRenew(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            int borrowId = Integer.parseInt(request.getParameter("borrowId"));
            String redirectParam = request.getParameter("redirect");
            
            // Allow up to 2 renewals of 14 days each
            boolean ok = borrowDAO.renewBook(borrowId, 14, 2);

            String dest = (redirectParam != null && !redirectParam.isEmpty()) ? redirectParam : "/borrow?action=myHistory";
            if (ok) {
                response.sendRedirect(request.getContextPath() + dest + (dest.contains("?") ? "&" : "?") + "message=Book renewed for 14 additional days&type=success");
            } else {
                response.sendRedirect(request.getContextPath() + dest + (dest.contains("?") ? "&" : "?") + "message=Renewal limit reached or loan is already closed&type=danger");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/dashboard?message=Error renewing book&type=danger");
        }
    }
}
