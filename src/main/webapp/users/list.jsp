<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.lms.model.User, java.util.List" %>
<%
    request.setAttribute("pageTitle", "User Accounts");
    request.setAttribute("pageSubtitle", "Manage member accounts and roles");
    request.setAttribute("activeNav", "users");
    
    User currentUser = (User) session.getAttribute("currentUser");
    List<User> users = (List<User>) request.getAttribute("users");
    String selectedRole = (String) request.getAttribute("selectedRole");
%>
<jsp:include page="/WEB-INF/includes/header.jsp" />
<jsp:include page="/WEB-INF/includes/navbar.jsp" />

<div class="filter-bar">
    <form action="<%= request.getContextPath() %>/users" method="get" style="display: flex; flex-wrap: wrap; gap: 10px; width: 100%; align-items: center;">
        <div style="min-width: 180px;">
            <select name="role" class="form-control" onchange="this.form.submit()">
                <option value="ALL">All Roles</option>
                <option value="STUDENT" <%= "STUDENT".equalsIgnoreCase(selectedRole) ? "selected" : "" %>>Students</option>
                <option value="FACULTY" <%= "FACULTY".equalsIgnoreCase(selectedRole) ? "selected" : "" %>>Faculty</option>
                <option value="COORDINATOR" <%= "COORDINATOR".equalsIgnoreCase(selectedRole) ? "selected" : "" %>>Coordinators</option>
                <option value="LIBRARIAN" <%= "LIBRARIAN".equalsIgnoreCase(selectedRole) ? "selected" : "" %>>Librarians</option>
                <option value="ADMIN" <%= "ADMIN".equalsIgnoreCase(selectedRole) ? "selected" : "" %>>Administrators</option>
            </select>
        </div>

        <div>
            <input type="text" id="tableSearch" class="form-control" style="width: 220px;" placeholder="Filter by name, email...">
        </div>

        <div style="margin-left: auto;">
            <a href="<%= request.getContextPath() %>/users?action=add" class="btn btn-primary">Register User</a>
        </div>
    </form>
</div>

<div class="card">
    <div class="card-header">
        <h3 class="card-title">Member Directory (<%= users != null ? users.size() : 0 %>)</h3>
    </div>

    <div class="table-responsive">
        <table class="custom-table">
            <thead>
                <tr>
                    <th>Member</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Contact Info</th>
                    <th>Max Loans</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            <% if (users != null && !users.isEmpty()) { 
                for (User u : users) { %>
                <tr>
                    <td>
                        <div style="font-weight: 600;"><%= u.getFullName() %></div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">@<%= u.getUsername() %></div>
                    </td>
                    <td>
                        <span class="badge badge-role-<%= u.getRole().name() %>">
                            <%= u.getRole().name() %>
                        </span>
                    </td>
                    <td><%= u.getDepartment() != null ? u.getDepartment() : "General" %></td>
                    <td>
                        <div style="font-size: 0.8rem;"><%= u.getEmail() %></div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);"><%= u.getPhone() != null ? u.getPhone() : "" %></div>
                    </td>
                    <td><%= u.getMaxBooksAllowed() %></td>
                    <td>
                        <span class="badge badge-<%= u.getStatus() == User.Status.ACTIVE ? "success" : "danger" %>">
                            <%= u.getStatus() %>
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 4px;">
                            <a href="<%= request.getContextPath() %>/users?action=profile&id=<%= u.getId() %>" class="btn btn-sm btn-outline">Profile</a>
                            <% if (currentUser != null && currentUser.canManageLibrary()) { %>
                                <a href="<%= request.getContextPath() %>/borrow?action=issue&userId=<%= u.getId() %>" class="btn btn-sm btn-primary">Issue</a>
                                <a href="<%= request.getContextPath() %>/users?action=edit&id=<%= u.getId() %>" class="btn btn-sm btn-secondary">Edit</a>
                                <% if (currentUser.isAdmin() && currentUser.getId() != u.getId()) { %>
                                <a href="<%= request.getContextPath() %>/users?action=delete&id=<%= u.getId() %>" class="btn btn-sm btn-danger" 
                                   onclick="return confirmAction('Delete user account <%= u.getUsername() %>?');">Delete</a>
                                <% } %>
                            <% } %>
                        </div>
                    </td>
                </tr>
            <% } } else { %>
                <tr>
                    <td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">No users found.</td>
                </tr>
            <% } %>
            </tbody>
        </table>
    </div>
</div>

<jsp:include page="/WEB-INF/includes/footer.jsp" />
