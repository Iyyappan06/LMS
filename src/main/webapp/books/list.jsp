<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.lms.model.User, com.lms.model.Book, java.util.List" %>
<%
    request.setAttribute("pageTitle", "Book Catalog");
    request.setAttribute("pageSubtitle", "Browse and manage the library book inventory");
    request.setAttribute("activeNav", "books");
    
    User user = (User) session.getAttribute("currentUser");
    List<Book> books = (List<Book>) request.getAttribute("books");
    List<String> categories = (List<String>) request.getAttribute("categories");
    String selectedCategory = (String) request.getAttribute("selectedCategory");
    String selectedStatus = (String) request.getAttribute("selectedStatus");
    String searchKeyword = (String) request.getAttribute("searchKeyword");
%>
<jsp:include page="/WEB-INF/includes/header.jsp" />
<jsp:include page="/WEB-INF/includes/navbar.jsp" />

<!-- Search & Filtering Bar -->
<div class="filter-bar">
    <form action="<%= request.getContextPath() %>/books" method="get" style="display: flex; flex-wrap: wrap; gap: 10px; width: 100%; align-items: center;">
        <input type="hidden" name="action" value="search">
        
        <div class="search-input">
            <input type="text" name="keyword" class="form-control" 
                   placeholder="Search by title, author, ISBN..." 
                   value="<%= searchKeyword != null ? searchKeyword : "" %>">
        </div>

        <div style="min-width: 150px;">
            <select name="category" class="form-control">
                <option value="ALL">All Categories</option>
                <% if (categories != null) { 
                    for (String cat : categories) { %>
                    <option value="<%= cat %>" <%= cat.equalsIgnoreCase(selectedCategory) ? "selected" : "" %>><%= cat %></option>
                <% } } %>
            </select>
        </div>

        <div style="min-width: 130px;">
            <select name="status" class="form-control">
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE" <%= "AVAILABLE".equalsIgnoreCase(selectedStatus) ? "selected" : "" %>>Available</option>
                <option value="ARCHIVED" <%= "ARCHIVED".equalsIgnoreCase(selectedStatus) ? "selected" : "" %>>Archived</option>
                <option value="DAMAGED" <%= "DAMAGED".equalsIgnoreCase(selectedStatus) ? "selected" : "" %>>Damaged</option>
                <option value="LOST" <%= "LOST".equalsIgnoreCase(selectedStatus) ? "selected" : "" %>>Lost</option>
            </select>
        </div>

        <button type="submit" class="btn btn-primary">Search</button>
        <a href="<%= request.getContextPath() %>/books" class="btn btn-outline">Reset</a>
        
        <% if (user != null && user.canManageLibrary()) { %>
        <div style="margin-left: auto;">
            <a href="<%= request.getContextPath() %>/books?action=add" class="btn btn-success">Add Book</a>
        </div>
        <% } %>
    </form>
</div>

<!-- Books Catalog Table -->
<div class="card">
    <div class="card-header">
        <div>
            <h3 class="card-title">Catalog Records (<%= books != null ? books.size() : 0 %>)</h3>
        </div>
        <div>
            <input type="text" id="tableSearch" class="form-control" style="width: 200px;" placeholder="Quick filter...">
        </div>
    </div>

    <div class="table-responsive">
        <table class="custom-table">
            <thead>
                <tr>
                    <th>ISBN</th>
                    <th>Book Details</th>
                    <th>Category</th>
                    <th>Publisher & Year</th>
                    <th>Availability</th>
                    <th>Shelf</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            <% if (books != null && !books.isEmpty()) { 
                for (Book b : books) { %>
                <tr>
                    <td><code><%= b.getIsbn() %></code></td>
                    <td>
                        <div style="font-weight: 600; color: var(--text-main);"><%= b.getTitle() %></div>
                        <div style="font-size: 0.78rem; color: var(--text-muted);">by <%= b.getAuthor() %></div>
                    </td>
                    <td><span class="badge badge-secondary"><%= b.getCategory() %></span></td>
                    <td>
                        <div style="font-size: 0.8rem;"><%= b.getPublisher() != null ? b.getPublisher() : "-" %></div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);"><%= b.getEdition() != null ? b.getEdition() : "" %> (<%= b.getPublishYear() %>)</div>
                    </td>
                    <td>
                        <span class="badge badge-<%= b.getAvailableCopies() > 0 ? "success" : "danger" %>">
                            <%= b.getAvailableCopies() %> / <%= b.getTotalCopies() %>
                        </span>
                    </td>
                    <td><%= b.getShelfLocation() != null ? b.getShelfLocation() : "-" %></td>
                    <td>
                        <span class="badge badge-<%= b.getStatus() == Book.Status.AVAILABLE ? "success" : "warning" %>">
                            <%= b.getStatus() %>
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 4px;">
                            <a href="<%= request.getContextPath() %>/books?action=view&id=<%= b.getId() %>" class="btn btn-sm btn-outline">View</a>
                            
                            <% if (user != null && user.canManageLibrary()) { %>
                                <a href="<%= request.getContextPath() %>/borrow?action=issue&bookId=<%= b.getId() %>" class="btn btn-sm btn-primary">Issue</a>
                                <a href="<%= request.getContextPath() %>/books?action=edit&id=<%= b.getId() %>" class="btn btn-sm btn-secondary">Edit</a>
                                <a href="<%= request.getContextPath() %>/books?action=delete&id=<%= b.getId() %>" class="btn btn-sm btn-danger" 
                                   onclick="return confirmAction('Are you sure you want to delete <%= b.getTitle() %>?');">Delete</a>
                            <% } %>
                        </div>
                    </td>
                </tr>
            <% } } else { %>
                <tr>
                    <td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">
                        No books found.
                    </td>
                </tr>
            <% } %>
            </tbody>
        </table>
    </div>
</div>

<jsp:include page="/WEB-INF/includes/footer.jsp" />
