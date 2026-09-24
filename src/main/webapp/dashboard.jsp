<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.lms.model.User, com.lms.model.Book, com.lms.model.BorrowRecord, java.util.List" %>
<%
    request.setAttribute("pageTitle", "Dashboard");
    request.setAttribute("pageSubtitle", "Library system metrics and overview");
    request.setAttribute("activeNav", "dashboard");
%>
<jsp:include page="/WEB-INF/includes/header.jsp" />
<jsp:include page="/WEB-INF/includes/navbar.jsp" />

<%
    User user = (User) session.getAttribute("currentUser");
    int totalBooks = (Integer) request.getAttribute("totalBooks");
    int totalCopies = (Integer) request.getAttribute("totalCopies");
    int availableCopies = (Integer) request.getAttribute("availableCopies");
    int activeLoans = (Integer) request.getAttribute("activeLoans");
    int overdueLoans = (Integer) request.getAttribute("overdueLoans");
    int totalUsers = (Integer) request.getAttribute("totalUsers");
%>

<!-- Welcome Card -->
<div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="badge badge-role-<%= user.getRole().name() %>"><%= user.getRole().name() %></span>
                <span style="color: var(--text-muted); font-size: 0.8rem;">Department: <%= user.getDepartment() != null ? user.getDepartment() : "General" %></span>
            </div>
            <h2 style="font-size: 1.25rem; font-weight: 600;">Welcome, <%= user.getFullName() %></h2>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">
                <%= user.canManageLibrary() ? "Manage books, user accounts, and circulation records." : "View your borrowed books and search the catalog." %>
            </p>
        </div>
        <div style="display: flex; gap: 8px;">
            <a href="<%= request.getContextPath() %>/books" class="btn btn-outline">Catalog</a>
            <% if (user.canManageLibrary()) { %>
            <a href="<%= request.getContextPath() %>/borrow?action=issue" class="btn btn-primary">Issue Book</a>
            <% } else { %>
            <a href="<%= request.getContextPath() %>/borrow?action=myHistory" class="btn btn-primary">My Loans</a>
            <% } %>
        </div>
    </div>
</div>

<!-- Stats Grid -->
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-info">
            <div class="stat-value"><%= totalBooks %></div>
            <div class="stat-label">Book Titles</div>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-info">
            <div class="stat-value"><%= totalCopies %></div>
            <div class="stat-label">Total Copies</div>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-info">
            <div class="stat-value"><%= availableCopies %></div>
            <div class="stat-label">Available Copies</div>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-info">
            <div class="stat-value"><%= activeLoans %></div>
            <div class="stat-label">Active Loans</div>
        </div>
    </div>

    <% if (user.canManageLibrary() || user.isAdmin()) { %>
    <div class="stat-card">
        <div class="stat-info">
            <div class="stat-value" style="color: <%= overdueLoans > 0 ? "var(--danger)" : "inherit" %>;"><%= overdueLoans %></div>
            <div class="stat-label">Overdue Loans</div>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-info">
            <div class="stat-value"><%= totalUsers %></div>
            <div class="stat-label">Registered Members</div>
        </div>
    </div>
    <% } %>
</div>

<% if (user.isStudent() || user.isFaculty() || user.isCoordinator()) { 
    List<BorrowRecord> myActive = (List<BorrowRecord>) request.getAttribute("myActiveBorrows");
    int myActiveCount = (Integer) request.getAttribute("myActiveCount");
    int remainingQuota = (Integer) request.getAttribute("remainingQuota");
    List<Book> featuredBooks = (List<Book>) request.getAttribute("featuredBooks");
%>
<!-- Student / Faculty View -->
<div class="card">
    <div class="card-header">
        <div>
            <h3 class="card-title">Currently Borrowed Books</h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);">
                Active: <%= myActiveCount %> / <%= user.getMaxBooksAllowed() %> limit (<%= remainingQuota %> slots remaining)
            </span>
        </div>
        <a href="<%= request.getContextPath() %>/borrow?action=myHistory" class="btn btn-outline btn-sm">View All</a>
    </div>

    <% if (myActive == null || myActive.isEmpty()) { %>
        <div style="text-align: center; padding: 24px 16px; color: var(--text-muted);">
            <p style="font-weight: 500; color: var(--text-main);">No active borrowed books</p>
            <p style="font-size: 0.82rem; margin-top: 4px;">You have no active loans at this time.</p>
            <div style="margin-top: 12px;">
                <a href="<%= request.getContextPath() %>/books" class="btn btn-primary btn-sm">Browse Catalog</a>
            </div>
        </div>
    <% } else { %>
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Book Title</th>
                        <th>Author</th>
                        <th>Issue Date</th>
                        <th>Due Date</th>
                        <th>Renewals</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                <% for (BorrowRecord br : myActive) { %>
                    <tr>
                        <td><strong><%= br.getBookTitle() %></strong></td>
                        <td><%= br.getBookAuthor() %></td>
                        <td><%= br.getIssueDate() %></td>
                        <td>
                            <%= br.getDueDate() %>
                            <% if (br.isOverdue()) { %>
                                <span class="badge badge-danger">Overdue</span>
                            <% } %>
                        </td>
                        <td><%= br.getRenewalCount() %> / 2</td>
                        <td>
                            <span class="badge badge-<%= br.getStatus() == BorrowRecord.Status.RENEWED ? "info" : "warning" %>">
                                <%= br.getStatus() %>
                            </span>
                        </td>
                        <td>
                            <% if (br.getRenewalCount() < 2 && !br.isOverdue()) { %>
                            <form action="<%= request.getContextPath() %>/borrow" method="post" style="display:inline;">
                                <input type="hidden" name="action" value="renew">
                                <input type="hidden" name="borrowId" value="<%= br.getId() %>">
                                <input type="hidden" name="redirect" value="/dashboard">
                                <button type="submit" class="btn btn-sm btn-outline" onclick="return confirmAction('Renew this book for 14 additional days?');">
                                    Renew
                                </button>
                            </form>
                            <% } else { %>
                                <span style="font-size: 0.78rem; color: var(--text-muted);">No renewals</span>
                            <% } %>
                        </td>
                    </tr>
                <% } %>
                </tbody>
            </table>
        </div>
    <% } %>
</div>

<!-- Available Books -->
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Available Books</h3>
        <a href="<%= request.getContextPath() %>/books" class="btn btn-outline btn-sm">View All</a>
    </div>
    <div class="table-responsive">
        <table class="custom-table">
            <thead>
                <tr>
                    <th>ISBN</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Available Copies</th>
                    <th>Shelf</th>
                </tr>
            </thead>
            <tbody>
            <% if (featuredBooks != null) { 
                for (Book b : featuredBooks) { %>
                <tr>
                    <td><code><%= b.getIsbn() %></code></td>
                    <td><strong><%= b.getTitle() %></strong></td>
                    <td><%= b.getAuthor() %></td>
                    <td><span class="badge badge-secondary"><%= b.getCategory() %></span></td>
                    <td><span class="badge badge-success"><%= b.getAvailableCopies() %> / <%= b.getTotalCopies() %></span></td>
                    <td><%= b.getShelfLocation() != null ? b.getShelfLocation() : "General" %></td>
                </tr>
            <% } } %>
            </tbody>
        </table>
    </div>
</div>

<% } else { 
    List<BorrowRecord> recentBorrows = (List<BorrowRecord>) request.getAttribute("recentBorrows");
    List<Book> recentBooks = (List<Book>) request.getAttribute("recentBooks");
%>
<!-- Admin / Librarian Operational View -->
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Recent Circulation Transactions</h3>
        <a href="<%= request.getContextPath() %>/borrow?action=history" class="btn btn-outline btn-sm">View Ledger</a>
    </div>
    <div class="table-responsive">
        <table class="custom-table">
            <thead>
                <tr>
                    <th>Borrower</th>
                    <th>Role</th>
                    <th>Book</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            <% if (recentBorrows != null && !recentBorrows.isEmpty()) { 
                for (BorrowRecord br : recentBorrows) { %>
                <tr>
                    <td><strong><%= br.getUserName() %></strong></td>
                    <td><span class="badge badge-role-<%= br.getUserRole() %>"><%= br.getUserRole() %></span></td>
                    <td><%= br.getBookTitle() %></td>
                    <td><%= br.getIssueDate() %></td>
                    <td>
                        <%= br.getDueDate() %>
                        <% if (br.isOverdue()) { %>
                            <span class="badge badge-danger">Overdue</span>
                        <% } %>
                    </td>
                    <td>
                        <span class="badge badge-<%= br.isReturned() ? "success" : (br.isOverdue() ? "danger" : "warning") %>">
                            <%= br.getStatus() %>
                        </span>
                    </td>
                    <td>
                        <% if (!br.isReturned()) { %>
                        <form action="<%= request.getContextPath() %>/borrow" method="post" style="display:inline;">
                            <input type="hidden" name="action" value="processReturn">
                            <input type="hidden" name="borrowId" value="<%= br.getId() %>">
                            <input type="hidden" name="redirect" value="/dashboard">
                            <button type="submit" class="btn btn-sm btn-success" onclick="return confirmAction('Confirm return for <%= br.getBookTitle() %>?');">
                                Return
                            </button>
                        </form>
                        <% } else { %>
                            <span style="font-size: 0.78rem; color: var(--text-muted);"><%= br.getReturnDate() %></span>
                        <% } %>
                    </td>
                </tr>
            <% } } else { %>
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">No circulation records yet.</td>
                </tr>
            <% } %>
            </tbody>
        </table>
    </div>
</div>

<div class="card">
    <div class="card-header">
        <h3 class="card-title">Recent Books</h3>
        <a href="<%= request.getContextPath() %>/books" class="btn btn-outline btn-sm">Manage Books</a>
    </div>
    <div class="table-responsive">
        <table class="custom-table">
            <thead>
                <tr>
                    <th>ISBN</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Stock (Avail / Total)</th>
                    <th>Shelf</th>
                </tr>
            </thead>
            <tbody>
            <% if (recentBooks != null) { 
                for (Book b : recentBooks) { %>
                <tr>
                    <td><code><%= b.getIsbn() %></code></td>
                    <td><strong><%= b.getTitle() %></strong></td>
                    <td><%= b.getAuthor() %></td>
                    <td><span class="badge badge-secondary"><%= b.getCategory() %></span></td>
                    <td>
                        <span class="badge badge-<%= b.getAvailableCopies() > 0 ? "success" : "danger" %>">
                            <%= b.getAvailableCopies() %> / <%= b.getTotalCopies() %>
                        </span>
                    </td>
                    <td><%= b.getShelfLocation() != null ? b.getShelfLocation() : "-" %></td>
                </tr>
            <% } } %>
            </tbody>
        </table>
    </div>
</div>
<% } %>

<jsp:include page="/WEB-INF/includes/footer.jsp" />
