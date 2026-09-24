<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.lms.model.User, com.lms.model.BorrowRecord, java.util.List" %>
<%
    User profileUser = (User) request.getAttribute("profileUser");
    int activeCount = (Integer) request.getAttribute("activeCount");
    List<BorrowRecord> userBorrows = (List<BorrowRecord>) request.getAttribute("userBorrows");
    User currentUser = (User) session.getAttribute("currentUser");

    request.setAttribute("pageTitle", profileUser.getFullName() + " - Profile");
    request.setAttribute("pageSubtitle", "User account information and circulation history");
    request.setAttribute("activeNav", "profile");
%>
<jsp:include page="/WEB-INF/includes/header.jsp" />
<jsp:include page="/WEB-INF/includes/navbar.jsp" />

<div style="display: grid; grid-template-columns: 280px 1fr; gap: 20px;">
    <!-- Profile Info Card -->
    <div class="card" style="text-align: center;">
        <div class="user-avatar-sm" style="width: 60px; height: 60px; font-size: 1.4rem; margin: 0 auto 12px;">
            <%= profileUser.getFullName().substring(0, 1) %>
        </div>
        <h3 style="font-size: 1.1rem; font-weight: 600;"><%= profileUser.getFullName() %></h3>
        <p style="color: var(--text-muted); font-size: 0.8rem;">@<%= profileUser.getUsername() %></p>
        <div style="margin: 10px 0;">
            <span class="badge badge-role-<%= profileUser.getRole().name() %>">
                <%= profileUser.getRole().name() %>
            </span>
        </div>

        <div style="text-align: left; margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 14px;">
            <div style="margin-bottom: 8px;">
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Email</span>
                <div style="font-weight: 500; font-size: 0.85rem;"><%= profileUser.getEmail() %></div>
            </div>
            <div style="margin-bottom: 8px;">
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Department</span>
                <div style="font-weight: 500; font-size: 0.85rem;"><%= profileUser.getDepartment() != null ? profileUser.getDepartment() : "General" %></div>
            </div>
            <div style="margin-bottom: 8px;">
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Phone</span>
                <div style="font-weight: 500; font-size: 0.85rem;"><%= profileUser.getPhone() != null ? profileUser.getPhone() : "Not provided" %></div>
            </div>
            <div style="margin-bottom: 8px;">
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Borrowing Allowance</span>
                <div style="font-weight: 600; font-size: 0.9rem; color: var(--primary);">
                    <%= activeCount %> / <%= profileUser.getMaxBooksAllowed() %> Active Loans
                </div>
            </div>
            <div>
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Status</span>
                <div>
                    <span class="badge badge-<%= profileUser.getStatus() == User.Status.ACTIVE ? "success" : "danger" %>">
                        <%= profileUser.getStatus() %>
                    </span>
                </div>
            </div>
        </div>

        <% if (currentUser.isAdmin() || currentUser.getId() == profileUser.getId()) { %>
        <div style="margin-top: 16px;">
            <a href="<%= request.getContextPath() %>/users?action=edit&id=<%= profileUser.getId() %>" class="btn btn-outline" style="width: 100%;">
                Edit Profile
            </a>
        </div>
        <% } %>
    </div>

    <!-- Loan History for this User -->
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Circulation History (<%= userBorrows != null ? userBorrows.size() : 0 %>)</h3>
            <% if (currentUser.canManageLibrary()) { %>
            <a href="<%= request.getContextPath() %>/borrow?action=issue&userId=<%= profileUser.getId() %>" class="btn btn-primary btn-sm">Issue Book</a>
            <% } %>
        </div>

        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Book Title</th>
                        <th>Issue Date</th>
                        <th>Due Date</th>
                        <th>Return Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                <% if (userBorrows != null && !userBorrows.isEmpty()) { 
                    for (BorrowRecord br : userBorrows) { %>
                    <tr>
                        <td>
                            <div style="font-weight: 600;"><%= br.getBookTitle() %></div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">ISBN: <%= br.getBookIsbn() %></div>
                        </td>
                        <td><%= br.getIssueDate() %></td>
                        <td>
                            <%= br.getDueDate() %>
                            <% if (br.isOverdue()) { %>
                                <span class="badge badge-danger">Overdue</span>
                            <% } %>
                        </td>
                        <td><%= br.getReturnDate() != null ? br.getReturnDate() : "-" %></td>
                        <td>
                            <span class="badge badge-<%= br.isReturned() ? "success" : (br.isOverdue() ? "danger" : "warning") %>">
                                <%= br.getStatus() %>
                            </span>
                        </td>
                    </tr>
                <% } } else { %>
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 20px; color: var(--text-muted);">No loan records found for this member.</td>
                    </tr>
                <% } %>
                </tbody>
            </table>
        </div>
    </div>
</div>

<jsp:include page="/WEB-INF/includes/footer.jsp" />
