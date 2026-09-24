<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.lms.model.Book, com.lms.model.User" %>
<%
    Book book = (Book) request.getAttribute("book");
    request.setAttribute("pageTitle", book.getTitle());
    request.setAttribute("pageSubtitle", "Book details and catalog status");
    request.setAttribute("activeNav", "books");
    User user = (User) session.getAttribute("currentUser");
%>
<jsp:include page="/WEB-INF/includes/header.jsp" />
<jsp:include page="/WEB-INF/includes/navbar.jsp" />

<div class="card" style="max-width: 760px; margin: 0 auto;">
    <div class="card-header">
        <div>
            <span class="badge badge-secondary"><%= book.getCategory() %></span>
            <h3 class="card-title" style="margin-top: 6px;"><%= book.getTitle() %></h3>
            <p style="color: var(--text-muted); font-size: 0.85rem;">by <%= book.getAuthor() %></p>
        </div>
        <div>
            <span class="badge badge-<%= book.getStatus() == Book.Status.AVAILABLE ? "success" : "warning" %>">
                <%= book.getStatus() %>
            </span>
        </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 20px;">
        <div style="background: #f8fafc; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">ISBN</div>
            <div style="font-weight: 600; font-size: 0.9rem; margin-top: 2px;"><code><%= book.getIsbn() %></code></div>
        </div>

        <div style="background: #f8fafc; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Availability</div>
            <div style="font-weight: 700; font-size: 0.95rem; color: <%= book.getAvailableCopies() > 0 ? "var(--success)" : "var(--danger)" %>; margin-top: 2px;">
                <%= book.getAvailableCopies() %> of <%= book.getTotalCopies() %> Available
            </div>
        </div>

        <div style="background: #f8fafc; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Shelf Location</div>
            <div style="font-weight: 600; font-size: 0.9rem; margin-top: 2px;"><%= book.getShelfLocation() != null ? book.getShelfLocation() : "General" %></div>
        </div>

        <div style="background: #f8fafc; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Publisher & Edition</div>
            <div style="font-weight: 500; font-size: 0.85rem; margin-top: 2px;">
                <%= book.getPublisher() != null ? book.getPublisher() : "-" %> (<%= book.getEdition() != null ? book.getEdition() : "1st" %>, <%= book.getPublishYear() %>)
            </div>
        </div>
    </div>

    <div class="form-group">
        <label class="form-label">Description / Notes</label>
        <div style="padding: 12px; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-sm); line-height: 1.5; color: var(--text-main); font-size: 0.85rem;">
            <%= book.getDescription() != null && !book.getDescription().isEmpty() ? book.getDescription() : "No description provided." %>
        </div>
    </div>

    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
        <a href="<%= request.getContextPath() %>/books" class="btn btn-secondary">Back to Catalog</a>
        <% if (user != null && user.canManageLibrary()) { %>
            <a href="<%= request.getContextPath() %>/borrow?action=issue&bookId=<%= book.getId() %>" class="btn btn-primary">Issue Book</a>
            <a href="<%= request.getContextPath() %>/books?action=edit&id=<%= book.getId() %>" class="btn btn-outline">Edit Details</a>
        <% } %>
    </div>
</div>

<jsp:include page="/WEB-INF/includes/footer.jsp" />
