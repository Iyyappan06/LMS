<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.lms.model.BorrowRecord, com.lms.model.User, java.util.List" %>
<%
    request.setAttribute("pageTitle", "My Borrowed Books");
    request.setAttribute("pageSubtitle", "Track your current loans and borrowing history");
    request.setAttribute("activeNav", "my_history");

    List<BorrowRecord> myHistory = (List<BorrowRecord>) request.getAttribute("myHistory");
    int activeCount = (Integer) request.getAttribute("activeCount");
    int maxAllowed = (Integer) request.getAttribute("maxAllowed");
    User currentUser = (User) session.getAttribute("currentUser");
%>
<jsp:include page="/WEB-INF/includes/header.jsp" />
<jsp:include page="/WEB-INF/includes/navbar.jsp" />

<!-- Summary Stats -->
<div class="stats-grid" style="margin-bottom: 20px;">
    <div class="stat-card">
        <div class="stat-info">
            <div class="stat-value"><%= activeCount %> / <%= maxAllowed %></div>
            <div class="stat-label">Active Borrowed Books</div>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-info">
            <div class="stat-value"><%= Math.max(0, maxAllowed - activeCount) %></div>
            <div class="stat-label">Available Slots</div>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-info">
            <div class="stat-value"><%= myHistory != null ? myHistory.size() : 0 %></div>
            <div class="stat-label">Total History Records</div>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-header">
        <div>
            <h3 class="card-title">Borrowing History</h3>
        </div>
        <div>
            <a href="<%= request.getContextPath() %>/books" class="btn btn-primary btn-sm">Browse Catalog</a>
        </div>
    </div>

    <div class="table-responsive">
        <table class="custom-table">
            <thead>
                <tr>
                    <th>Book Details</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Renewals</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            <% if (myHistory != null && !myHistory.isEmpty()) { 
                for (BorrowRecord br : myHistory) { %>
                <tr>
                    <td>
                        <div style="font-weight: 600; color: var(--text-main);"><%= br.getBookTitle() %></div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Author: <%= br.getBookAuthor() %> | ISBN: <%= br.getBookIsbn() %></div>
                    </td>
                    <td><%= br.getIssueDate() %></td>
                    <td>
                        <%= br.getDueDate() %>
                        <% if (br.isOverdue()) { %>
                            <span class="badge badge-danger">Overdue</span>
                        <% } %>
                    </td>
                    <td><%= br.getReturnDate() != null ? br.getReturnDate() : "Active" %></td>
                    <td><%= br.getRenewalCount() %> / 2</td>
                    <td>
                        <span class="badge badge-<%= br.isReturned() ? "success" : (br.isOverdue() ? "danger" : "warning") %>">
                            <%= br.getStatus() %>
                        </span>
                    </td>
                    <td>
                        <% if (!br.isReturned() && br.getRenewalCount() < 2 && !br.isOverdue()) { %>
                        <form action="<%= request.getContextPath() %>/borrow" method="post" style="display:inline;">
                            <input type="hidden" name="action" value="renew">
                            <input type="hidden" name="borrowId" value="<%= br.getId() %>">
                            <input type="hidden" name="redirect" value="/borrow?action=myHistory">
                            <button type="submit" class="btn btn-sm btn-outline" onclick="return confirmAction('Renew this book for 14 more days?');">
                                Renew
                            </button>
                        </form>
                        <% } else if (br.isReturned()) { %>
                            <span style="font-size: 0.78rem; color: var(--text-muted);">Completed</span>
                        <% } else { %>
                            <span style="font-size: 0.78rem; color: var(--text-muted);">Limit reached</span>
                        <% } %>
                    </td>
                </tr>
            <% } } else { %>
                <tr>
                    <td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">
                        You have not borrowed any books yet.
                    </td>
                </tr>
            <% } %>
            </tbody>
        </table>
    </div>
</div>

<jsp:include page="/WEB-INF/includes/footer.jsp" />
