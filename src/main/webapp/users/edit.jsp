<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.lms.model.User" %>
<%
    request.setAttribute("pageTitle", "Edit User");
    request.setAttribute("pageSubtitle", "Update user account information");
    request.setAttribute("activeNav", "users");
    
    User editUser = (User) request.getAttribute("user");
    User currentUser = (User) session.getAttribute("currentUser");
%>
<jsp:include page="/WEB-INF/includes/header.jsp" />
<jsp:include page="/WEB-INF/includes/navbar.jsp" />

<div class="card" style="max-width: 680px; margin: 0 auto;">
    <div class="card-header">
        <h3 class="card-title">Edit User: <%= editUser.getFullName() %></h3>
        <a href="<%= request.getContextPath() %>/users" class="btn btn-outline btn-sm">Back to Users</a>
    </div>

    <form action="<%= request.getContextPath() %>/users" method="post">
        <input type="hidden" name="action" value="update">
        <input type="hidden" name="id" value="<%= editUser.getId() %>">

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Username</label>
                <input type="text" class="form-control" value="<%= editUser.getUsername() %>" disabled>
            </div>
            <div class="form-group">
                <label class="form-label" for="password">Change Password (optional)</label>
                <input type="password" id="password" name="password" class="form-control" placeholder="Leave blank to keep current">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="fullName">Full Name *</label>
                <input type="text" id="fullName" name="fullName" class="form-control" value="<%= editUser.getFullName() %>" required>
            </div>
            <div class="form-group">
                <label class="form-label" for="email">Email Address *</label>
                <input type="email" id="email" name="email" class="form-control" value="<%= editUser.getEmail() %>" required>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="role">Role *</label>
                <select id="role" name="role" class="form-control" required <%= !currentUser.isAdmin() ? "disabled" : "" %>>
                    <option value="STUDENT" <%= editUser.getRole() == User.Role.STUDENT ? "selected" : "" %>>Student</option>
                    <option value="FACULTY" <%= editUser.getRole() == User.Role.FACULTY ? "selected" : "" %>>Faculty</option>
                    <option value="COORDINATOR" <%= editUser.getRole() == User.Role.COORDINATOR ? "selected" : "" %>>Coordinator</option>
                    <option value="LIBRARIAN" <%= editUser.getRole() == User.Role.LIBRARIAN ? "selected" : "" %>>Librarian</option>
                    <option value="ADMIN" <%= editUser.getRole() == User.Role.ADMIN ? "selected" : "" %>>Administrator</option>
                </select>
                <% if (!currentUser.isAdmin()) { %>
                    <input type="hidden" name="role" value="<%= editUser.getRole().name() %>">
                <% } %>
            </div>
            <div class="form-group">
                <label class="form-label" for="department">Department</label>
                <input type="text" id="department" name="department" class="form-control" value="<%= editUser.getDepartment() != null ? editUser.getDepartment() : "" %>">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="phone">Phone Number</label>
                <input type="text" id="phone" name="phone" class="form-control" value="<%= editUser.getPhone() != null ? editUser.getPhone() : "" %>">
            </div>
            <div class="form-group">
                <label class="form-label" for="maxBooksAllowed">Max Borrowing Limit</label>
                <input type="number" id="maxBooksAllowed" name="maxBooksAllowed" class="form-control" value="<%= editUser.getMaxBooksAllowed() %>" min="1" max="20" required>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label" for="status">Account Status</label>
            <select id="status" name="status" class="form-control">
                <option value="ACTIVE" <%= editUser.getStatus() == User.Status.ACTIVE ? "selected" : "" %>>Active</option>
                <option value="INACTIVE" <%= editUser.getStatus() == User.Status.INACTIVE ? "selected" : "" %>>Inactive</option>
                <option value="SUSPENDED" <%= editUser.getStatus() == User.Status.SUSPENDED ? "selected" : "" %>>Suspended</option>
            </select>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <a href="<%= request.getContextPath() %>/users" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary">Update User</button>
        </div>
    </form>
</div>

<jsp:include page="/WEB-INF/includes/footer.jsp" />
