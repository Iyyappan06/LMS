<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.lms.model.BorrowRecord, com.lms.model.User, java.util.List" %>
<%
    request.setAttribute("pageTitle", "Circulation Ledger");
    request.setAttribute("pageSubtitle", "Audit history of book issues, returns, and renewals");
    request.setAttribute("activeNav", "borrow_history");

    List<BorrowRecord> history = (List<BorrowRecord>) request.getAttribute("history");
    User currentUser = (User) session.getAttribute("currentUser");
%>
<jsp:include page="/WEB-INF/includes/header.jsp" />
<jsp:include page="/WEB-INF/includes/navbar.jsp" />

<div class="card">
    <div class="card-header">
        <div>
            <h3 class="card-title">Loan Ledger (<%= history != null ? history.size() : 0 %> records)</h3>
        </div>
        <div style="display: flex; gap: 8px;">
            <input type="text" id="tableSearch" class="form-control" style="width: 220px;" placeholder="Search history...">
            <% if (currentUser != null && currentUser.canManageLibrary()) { %>
            <a href="<%= request.getContextPath() %>/borrow?action=issue" class="btn btn-primary btn-sm">Issue Book</a>
            <% } %>
        </div>
    </div>

    <div class="table-responsive">
        <table class="custom-table">
            <thead>
                <tr>
                    <th>Loan ID</th>
                    <th>Borrower</th>
                    <th>Role</th>
                    <th>Book Title</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Renewals</th>
                    <th>Status</th>
                    <th>Remarks</th>
                </tr>
            </thead>
            <tbody>
            <% if (history != null && !history.isEmpty()) { 
                for (BorrowRecord br : history) { %>
                <tr>
                    <td><code>#<%= br.getId() %></code></td>
                    <td>
                        <div style="font-weight: 600;"><%= br.getUserName() %></div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);"><%= br.getUserEmail() %></div>
                    </td>
                    <td><span class="badge badge-role-<%= br.getUserRole() %>"><%= br.getUserRole() %></span></td>
                    <td>
                        <div style="font-weight: 500;"><%= br.getBookTitle() %></div>
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
                    <td><%= br.getRenewalCount() %></td>
                    <td>
                        <span class="badge badge-<%= br.isReturned() ? "success" : (br.isOverdue() ? "danger" : "warning") %>">
                            <%= br.getStatus() %>
                        </span>
                    </td>
                    <td style="font-size: 0.8rem; color: var(--text-muted);"><%= br.getRemarks() != null ? br.getRemarks() : "-" %></td>
                </tr>
            <% } } else { %>
                <tr>
                    <td colspan="10" style="text-align: center; padding: 24px; color: var(--text-muted);">No circulation records found.</td>
                </tr>
            <% } %>
            </tbody>
        </table>
    </div>
</div>

<jsp:include page="/WEB-INF/includes/footer.jsp" />
