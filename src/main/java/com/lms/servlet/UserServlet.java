package com.lms.servlet;

import com.lms.dao.BorrowDAO;
import com.lms.dao.UserDAO;
import com.lms.model.BorrowRecord;
import com.lms.model.User;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/users")
public class UserServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private UserDAO userDAO;
    private BorrowDAO borrowDAO;

    @Override
    public void init() {
        userDAO = new UserDAO();
        borrowDAO = new BorrowDAO();
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
            case "profile":
                viewProfile(request, response);
                break;
            case "delete":
                deleteUser(request, response);
                break;
            case "list":
            default:
                listUsers(request, response);
                break;
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getParameter("action");
        if ("save".equals(action)) {
            saveUser(request, response);
        } else if ("update".equals(action)) {
            updateUser(request, response);
        } else {
            response.sendRedirect(request.getContextPath() + "/users");
        }
    }

    private void listUsers(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String roleFilter = request.getParameter("role");
        List<User> users;
        if (roleFilter != null && !roleFilter.trim().isEmpty() && !"ALL".equalsIgnoreCase(roleFilter)) {
            users = userDAO.getUsersByRole(roleFilter);
        } else {
            users = userDAO.getAllUsers();
        }
        request.setAttribute("users", users);
        request.setAttribute("selectedRole", roleFilter);
        request.getRequestDispatcher("/users/list.jsp").forward(request, response);
    }

    private void showAddForm(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.getRequestDispatcher("/users/add.jsp").forward(request, response);
    }

    private void showEditForm(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String idStr = request.getParameter("id");
        if (idStr != null) {
            try {
                int id = Integer.parseInt(idStr);
                User user = userDAO.getUserById(id);
                if (user != null) {
                    request.setAttribute("user", user);
                    request.getRequestDispatcher("/users/edit.jsp").forward(request, response);
                    return;
                }
            } catch (NumberFormatException ignored) {}
        }
        response.sendRedirect(request.getContextPath() + "/users?message=User not found&type=danger");
    }

    private void viewProfile(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User currentUser = (session != null) ? (User) session.getAttribute("currentUser") : null;

        String idStr = request.getParameter("id");
        User targetUser = null;
        if (idStr != null) {
            try {
                int id = Integer.parseInt(idStr);
                targetUser = userDAO.getUserById(id);
            } catch (NumberFormatException ignored) {}
        } else if (currentUser != null) {
            targetUser = currentUser;
        }

        if (targetUser != null) {
            List<BorrowRecord> userBorrows = borrowDAO.getBorrowRecordsByUser(targetUser.getId());
            int activeCount = borrowDAO.getActiveIssuedCountByUser(targetUser.getId());

            request.setAttribute("profileUser", targetUser);
            request.setAttribute("userBorrows", userBorrows);
            request.setAttribute("activeCount", activeCount);
            request.getRequestDispatcher("/users/profile.jsp").forward(request, response);
        } else {
            response.sendRedirect(request.getContextPath() + "/dashboard?message=User not found&type=danger");
        }
    }

    private void saveUser(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            String email = request.getParameter("email");
            String fullName = request.getParameter("fullName");
            String roleStr = request.getParameter("role");
            String department = request.getParameter("department");
            String phone = request.getParameter("phone");
            int maxBooks = parseInt(request.getParameter("maxBooksAllowed"), 3);

            if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty() || email == null || email.trim().isEmpty() || fullName == null || fullName.trim().isEmpty()) {
                response.sendRedirect(request.getContextPath() + "/users?action=add&message=All required fields must be filled&type=danger");
                return;
            }

            User u = new User();
            u.setUsername(username.trim());
            u.setPassword(password);
            u.setEmail(email.trim());
            u.setFullName(fullName.trim());
            u.setRole(User.Role.fromString(roleStr));
            u.setDepartment(department != null ? department.trim() : "General");
            u.setPhone(phone);
            u.setMaxBooksAllowed(maxBooks);
            u.setStatus(User.Status.ACTIVE);

            boolean ok = userDAO.createUser(u);
            if (ok) {
                response.sendRedirect(request.getContextPath() + "/users?message=User " + java.net.URLEncoder.encode(username, "UTF-8") + " registered successfully&type=success");
            } else {
                response.sendRedirect(request.getContextPath() + "/users?action=add&message=Username or Email already exists&type=danger");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/users?action=add&message=Error saving user&type=danger");
        }
    }

    private void updateUser(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            int id = Integer.parseInt(request.getParameter("id"));
            User u = userDAO.getUserById(id);
            if (u == null) {
                response.sendRedirect(request.getContextPath() + "/users?message=User not found&type=danger");
                return;
            }

            u.setFullName(request.getParameter("fullName"));
            u.setEmail(request.getParameter("email"));
            u.setRole(User.Role.fromString(request.getParameter("role")));
            u.setDepartment(request.getParameter("department"));
            u.setPhone(request.getParameter("phone"));
            u.setMaxBooksAllowed(parseInt(request.getParameter("maxBooksAllowed"), u.getMaxBooksAllowed()));
            
            String statusStr = request.getParameter("status");
            if (statusStr != null) {
                try { u.setStatus(User.Status.valueOf(statusStr)); } catch (Exception ignored) {}
            }

            String newPassword = request.getParameter("password");
            if (newPassword != null && !newPassword.trim().isEmpty()) {
                u.setPassword(newPassword.trim());
            }

            boolean ok = userDAO.updateUser(u);
            if (ok) {
                response.sendRedirect(request.getContextPath() + "/users?message=User profile updated successfully&type=success");
            } else {
                response.sendRedirect(request.getContextPath() + "/users?action=edit&id=" + id + "&message=Failed to update user&type=danger");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/users?message=Error updating user&type=danger");
        }
    }

    private void deleteUser(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            int id = Integer.parseInt(request.getParameter("id"));
            boolean ok = userDAO.deleteUser(id);
            if (ok) {
                response.sendRedirect(request.getContextPath() + "/users?message=User deleted successfully&type=success");
            } else {
                response.sendRedirect(request.getContextPath() + "/users?message=Failed to delete user&type=danger");
            }
        } catch (Exception e) {
            response.sendRedirect(request.getContextPath() + "/users?message=Error deleting user&type=danger");
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
