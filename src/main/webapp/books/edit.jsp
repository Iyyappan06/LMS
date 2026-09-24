<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.lms.model.Book, java.util.List" %>
<%
    request.setAttribute("pageTitle", "Edit Book");
    request.setAttribute("pageSubtitle", "Update book details and stock");
    request.setAttribute("activeNav", "books");
    
    Book book = (Book) request.getAttribute("book");
    List<String> categories = (List<String>) request.getAttribute("categories");
%>
<jsp:include page="/WEB-INF/includes/header.jsp" />
<jsp:include page="/WEB-INF/includes/navbar.jsp" />

<div class="card" style="max-width: 760px; margin: 0 auto;">
    <div class="card-header">
        <h3 class="card-title">Edit Book: <%= book.getTitle() %></h3>
        <a href="<%= request.getContextPath() %>/books" class="btn btn-outline btn-sm">Back to Catalog</a>
    </div>

    <form action="<%= request.getContextPath() %>/books" method="post">
        <input type="hidden" name="action" value="update">
        <input type="hidden" name="id" value="<%= book.getId() %>">

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="isbn">ISBN *</label>
                <input type="text" id="isbn" name="isbn" class="form-control" value="<%= book.getIsbn() %>" required>
            </div>
            <div class="form-group">
                <label class="form-label" for="category">Category / Genre *</label>
                <input type="text" id="category" name="category" list="categoryList" class="form-control" value="<%= book.getCategory() %>" required>
                <datalist id="categoryList">
                    <% if (categories != null) { 
                        for (String cat : categories) { %>
                        <option value="<%= cat %>">
                    <% } } %>
                </datalist>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label" for="title">Book Title *</label>
            <input type="text" id="title" name="title" class="form-control" value="<%= book.getTitle() %>" required>
        </div>

        <div class="form-group">
            <label class="form-label" for="author">Author(s) *</label>
            <input type="text" id="author" name="author" class="form-control" value="<%= book.getAuthor() %>" required>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="publisher">Publisher</label>
                <input type="text" id="publisher" name="publisher" class="form-control" value="<%= book.getPublisher() != null ? book.getPublisher() : "" %>">
            </div>
            <div class="form-group">
                <label class="form-label" for="edition">Edition</label>
                <input type="text" id="edition" name="edition" class="form-control" value="<%= book.getEdition() != null ? book.getEdition() : "" %>">
            </div>
            <div class="form-group">
                <label class="form-label" for="publishYear">Publication Year</label>
                <input type="number" id="publishYear" name="publishYear" class="form-control" value="<%= book.getPublishYear() %>">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="totalCopies">Total Copies *</label>
                <input type="number" id="totalCopies" name="totalCopies" class="form-control" value="<%= book.getTotalCopies() %>" min="1" max="500" required>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Available: <%= book.getAvailableCopies() %></span>
            </div>
            <div class="form-group">
                <label class="form-label" for="shelfLocation">Shelf Location</label>
                <input type="text" id="shelfLocation" name="shelfLocation" class="form-control" value="<%= book.getShelfLocation() != null ? book.getShelfLocation() : "" %>">
            </div>
            <div class="form-group">
                <label class="form-label" for="status">Status</label>
                <select id="status" name="status" class="form-control">
                    <option value="AVAILABLE" <%= book.getStatus() == Book.Status.AVAILABLE ? "selected" : "" %>>Available</option>
                    <option value="ARCHIVED" <%= book.getStatus() == Book.Status.ARCHIVED ? "selected" : "" %>>Archived</option>
                    <option value="DAMAGED" <%= book.getStatus() == Book.Status.DAMAGED ? "selected" : "" %>>Damaged</option>
                    <option value="LOST" <%= book.getStatus() == Book.Status.LOST ? "selected" : "" %>>Lost</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label" for="description">Description</label>
            <textarea id="description" name="description" class="form-control" rows="3"><%= book.getDescription() != null ? book.getDescription() : "" %></textarea>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <a href="<%= request.getContextPath() %>/books" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary">Update Book</button>
        </div>
    </form>
</div>

<jsp:include page="/WEB-INF/includes/footer.jsp" />
