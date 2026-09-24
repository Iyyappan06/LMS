<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%
    request.setAttribute("pageTitle", "Add New Book");
    request.setAttribute("pageSubtitle", "Register a new book in the library inventory");
    request.setAttribute("activeNav", "books_add");
    List<String> categories = (List<String>) request.getAttribute("categories");
%>
<jsp:include page="/WEB-INF/includes/header.jsp" />
<jsp:include page="/WEB-INF/includes/navbar.jsp" />

<div class="card" style="max-width: 760px; margin: 0 auto;">
    <div class="card-header">
        <h3 class="card-title">New Book Details</h3>
        <a href="<%= request.getContextPath() %>/books" class="btn btn-outline btn-sm">Back to Catalog</a>
    </div>

    <form action="<%= request.getContextPath() %>/books" method="post">
        <input type="hidden" name="action" value="save">

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="isbn">ISBN *</label>
                <input type="text" id="isbn" name="isbn" class="form-control" placeholder="e.g. 978-0134685991" required>
            </div>
            <div class="form-group">
                <label class="form-label" for="category">Category / Genre *</label>
                <input type="text" id="category" name="category" list="categoryList" class="form-control" placeholder="e.g. Computer Science" required>
                <datalist id="categoryList">
                    <% if (categories != null) { 
                        for (String cat : categories) { %>
                        <option value="<%= cat %>">
                    <% } } %>
                    <option value="Computer Science">
                    <option value="Information Technology">
                    <option value="Electrical Engineering">
                    <option value="Mathematics">
                    <option value="Management">
                    <option value="Literature">
                </datalist>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label" for="title">Book Title *</label>
            <input type="text" id="title" name="title" class="form-control" placeholder="e.g. Effective Java" required>
        </div>

        <div class="form-group">
            <label class="form-label" for="author">Author(s) *</label>
            <input type="text" id="author" name="author" class="form-control" placeholder="e.g. Joshua Bloch" required>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="publisher">Publisher</label>
                <input type="text" id="publisher" name="publisher" class="form-control" placeholder="e.g. Addison-Wesley">
            </div>
            <div class="form-group">
                <label class="form-label" for="edition">Edition</label>
                <input type="text" id="edition" name="edition" class="form-control" placeholder="e.g. 3rd Edition">
            </div>
            <div class="form-group">
                <label class="form-label" for="publishYear">Publication Year</label>
                <input type="number" id="publishYear" name="publishYear" class="form-control" value="2024" min="1900" max="2030">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="totalCopies">Total Copies *</label>
                <input type="number" id="totalCopies" name="totalCopies" class="form-control" value="1" min="1" max="500" required>
            </div>
            <div class="form-group">
                <label class="form-label" for="shelfLocation">Shelf Location</label>
                <input type="text" id="shelfLocation" name="shelfLocation" class="form-control" placeholder="e.g. Shelf CS-01">
            </div>
            <div class="form-group">
                <label class="form-label" for="status">Status</label>
                <select id="status" name="status" class="form-control">
                    <option value="AVAILABLE">Available</option>
                    <option value="ARCHIVED">Archived</option>
                    <option value="DAMAGED">Damaged</option>
                    <option value="LOST">Lost</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label" for="description">Description</label>
            <textarea id="description" name="description" class="form-control" rows="3" placeholder="Overview of book topics, syllabus tags, or keywords..."></textarea>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <a href="<%= request.getContextPath() %>/books" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary">Save Book</button>
        </div>
    </form>
</div>

<jsp:include page="/WEB-INF/includes/footer.jsp" />
