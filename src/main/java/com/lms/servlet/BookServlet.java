package com.lms.servlet;

import com.lms.dao.BookDAO;
import com.lms.model.Book;
import com.lms.model.User;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/books")
public class BookServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private BookDAO bookDAO;

    @Override
    public void init() {
        bookDAO = new BookDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getParameter("action");
        if (action == null) action = "list";

        switch (action) {
            case "add":
                showAddForm(request, response);
                break;
            case "edit":
                showEditForm(request, response);
                break;
            case "view":
                viewBook(request, response);
                break;
            case "delete":
                deleteBook(request, response);
                break;
            case "list":
            case "search":
            default:
                listBooks(request, response);
                break;
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getParameter("action");
        if ("save".equals(action)) {
            saveBook(request, response);
        } else if ("update".equals(action)) {
            updateBook(request, response);
        } else {
            response.sendRedirect(request.getContextPath() + "/books");
        }
    }

    private void listBooks(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String keyword = request.getParameter("keyword");
        String category = request.getParameter("category");
        String status = request.getParameter("status");

        List<Book> books = bookDAO.searchBooks(keyword, category, status);
        List<String> categories = bookDAO.getAllCategories();

        request.setAttribute("books", books);
        request.setAttribute("categories", categories);
        request.setAttribute("selectedCategory", category);
        request.setAttribute("selectedStatus", status);
        request.setAttribute("searchKeyword", keyword);

        request.getRequestDispatcher("/books/list.jsp").forward(request, response);
    }

    private void showAddForm(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        List<String> categories = bookDAO.getAllCategories();
        request.setAttribute("categories", categories);
        request.getRequestDispatcher("/books/add.jsp").forward(request, response);
    }

    private void showEditForm(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String idStr = request.getParameter("id");
        if (idStr != null) {
            try {
                int id = Integer.parseInt(idStr);
                Book book = bookDAO.getBookById(id);
                if (book != null) {
                    List<String> categories = bookDAO.getAllCategories();
                    request.setAttribute("book", book);
                    request.setAttribute("categories", categories);
                    request.getRequestDispatcher("/books/edit.jsp").forward(request, response);
                    return;
                }
            } catch (NumberFormatException ignored) {}
        }
        response.sendRedirect(request.getContextPath() + "/books?message=Book not found&type=danger");
    }

    private void viewBook(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String idStr = request.getParameter("id");
        if (idStr != null) {
            try {
                int id = Integer.parseInt(idStr);
                Book book = bookDAO.getBookById(id);
                if (book != null) {
                    request.setAttribute("book", book);
                    request.getRequestDispatcher("/books/view.jsp").forward(request, response);
                    return;
                }
            } catch (NumberFormatException ignored) {}
        }
        response.sendRedirect(request.getContextPath() + "/books?message=Book not found&type=danger");
    }

    private void saveBook(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            String isbn = request.getParameter("isbn");
            String title = request.getParameter("title");
            String author = request.getParameter("author");
            String category = request.getParameter("category");
            String publisher = request.getParameter("publisher");
            String edition = request.getParameter("edition");
            int publishYear = parseInt(request.getParameter("publishYear"), 2024);
            int totalCopies = parseInt(request.getParameter("totalCopies"), 1);
            String shelfLocation = request.getParameter("shelfLocation");
            String description = request.getParameter("description");
            String statusStr = request.getParameter("status");

            if (isbn == null || isbn.trim().isEmpty() || title == null || title.trim().isEmpty() || author == null || author.trim().isEmpty()) {
                response.sendRedirect(request.getContextPath() + "/books?action=add&message=ISBN, Title, and Author are required&type=danger");
                return;
            }

            Book existing = bookDAO.getBookByIsbn(isbn.trim());
            if (existing != null) {
                response.sendRedirect(request.getContextPath() + "/books?action=add&message=A book with this ISBN already exists&type=danger");
                return;
            }

            Book b = new Book();
            b.setIsbn(isbn.trim());
            b.setTitle(title.trim());
            b.setAuthor(author.trim());
            b.setCategory(category != null ? category.trim() : "General");
            b.setPublisher(publisher);
            b.setEdition(edition);
            b.setPublishYear(publishYear);
            b.setTotalCopies(totalCopies);
            b.setAvailableCopies(totalCopies);
            b.setShelfLocation(shelfLocation);
            b.setDescription(description);
            if (statusStr != null) {
                try { b.setStatus(Book.Status.valueOf(statusStr)); } catch (Exception ignored) {}
            }

            boolean ok = bookDAO.addBook(b);
            if (ok) {
                response.sendRedirect(request.getContextPath() + "/books?message=Book '" + java.net.URLEncoder.encode(title, "UTF-8") + "' added successfully&type=success");
            } else {
                response.sendRedirect(request.getContextPath() + "/books?action=add&message=Failed to add book&type=danger");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/books?action=add&message=Error: " + java.net.URLEncoder.encode(e.getMessage(), "UTF-8") + "&type=danger");
        }
    }

    private void updateBook(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            int id = Integer.parseInt(request.getParameter("id"));
            Book b = bookDAO.getBookById(id);
            if (b == null) {
                response.sendRedirect(request.getContextPath() + "/books?message=Book not found&type=danger");
                return;
            }

            b.setIsbn(request.getParameter("isbn").trim());
            b.setTitle(request.getParameter("title").trim());
            b.setAuthor(request.getParameter("author").trim());
            b.setCategory(request.getParameter("category").trim());
            b.setPublisher(request.getParameter("publisher"));
            b.setEdition(request.getParameter("edition"));
            b.setPublishYear(parseInt(request.getParameter("publishYear"), b.getPublishYear()));
            
            int oldTotal = b.getTotalCopies();
            int newTotal = parseInt(request.getParameter("totalCopies"), oldTotal);
            int copyDiff = newTotal - oldTotal;
            b.setTotalCopies(newTotal);
            b.setAvailableCopies(Math.max(0, Math.min(newTotal, b.getAvailableCopies() + copyDiff)));

            b.setShelfLocation(request.getParameter("shelfLocation"));
            b.setDescription(request.getParameter("description"));
            String statusStr = request.getParameter("status");
            if (statusStr != null) {
                try { b.setStatus(Book.Status.valueOf(statusStr)); } catch (Exception ignored) {}
            }

            boolean ok = bookDAO.updateBook(b);
            if (ok) {
                response.sendRedirect(request.getContextPath() + "/books?message=Book updated successfully&type=success");
            } else {
                response.sendRedirect(request.getContextPath() + "/books?action=edit&id=" + id + "&message=Failed to update book&type=danger");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/books?message=Error updating book&type=danger");
        }
    }

    private void deleteBook(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            int id = Integer.parseInt(request.getParameter("id"));
            boolean ok = bookDAO.deleteBook(id);
            if (ok) {
                response.sendRedirect(request.getContextPath() + "/books?message=Book deleted successfully&type=success");
            } else {
                response.sendRedirect(request.getContextPath() + "/books?message=Failed to delete book (it may have active loan records)&type=danger");
            }
        } catch (Exception e) {
            response.sendRedirect(request.getContextPath() + "/books?message=Error deleting book&type=danger");
        }
    }

    private int parseInt(String str, int defaultVal) {
        if (str == null || str.trim().isEmpty()) return defaultVal;
        try {
            return Integer.parseInt(str.trim());
        } catch (NumberFormatException e) {
            return defaultVal;
        }
    }
}
