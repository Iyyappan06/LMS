<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.lms.model.User, com.lms.model.Book, java.util.List" %>
<%
    request.setAttribute("pageTitle", "Issue Book");
    request.setAttribute("pageSubtitle", "Record book issuance to a registered member");
    request.setAttribute("activeNav", "borrow_issue");

    List<User> users = (List<User>) request.getAttribute("users");
    List<Book> availableBooks = (List<Book>) request.getAttribute("availableBooks");
    String preBook = (String) request.getAttribute("preselectedBookId");
    String preUser = (String) request.getAttribute("preselectedUserId");
%>
<jsp:include page="/WEB-INF/includes/header.jsp" />
<jsp:include page="/WEB-INF/includes/navbar.jsp" />

<div class="card" style="max-width: 720px; margin: 0 auto;">
    <div class="card-header">
        <h3 class="card-title">Issue Book Form</h3>
        <a href="<%= request.getContextPath() %>/borrow?action=history" class="btn btn-outline btn-sm">Circulation History</a>
    </div>

    <form action="<%= request.getContextPath() %>/borrow" method="post">
        <input type="hidden" name="action" value="processIssue">

        <div class="form-group">
            <label class="form-label" for="userId">Member (Borrower) *</label>
            <select id="userId" name="userId" class="form-control" required onchange="handleUserSelect(this)">
                <option value="">-- Choose Member --</option>
                <% if (users != null) { 
                    for (User u : users) { 
                        boolean selected = preUser != null && preUser.equals(String.valueOf(u.getId()));
                %>
                    <option value="<%= u.getId() %>" data-role="<%= u.getRole().name() %>" <%= selected ? "selected" : "" %>>
                        <%= u.getFullName() %> (<%= u.getRole().name() %> - <%= u.getDepartment() != null ? u.getDepartment() : "General" %>) [Max: <%= u.getMaxBooksAllowed() %>]
                    </option>
                <% } } %>
            </select>
        </div>

        <div class="form-group">
            <label class="form-label" for="bookId">Available Book *</label>
            <select id="bookId" name="bookId" class="form-control" required>
                <option value="">-- Choose Book Title --</option>
                <% if (availableBooks != null) { 
                    for (Book b : availableBooks) { 
                        boolean selected = preBook != null && preBook.equals(String.valueOf(b.getId()));
                %>
                    <option value="<%= b.getId() %>" <%= selected ? "selected" : "" %>>
                        <%= b.getTitle() %> by <%= b.getAuthor() %> (ISBN: <%= b.getIsbn() %>) [<%= b.getAvailableCopies() %> available]
                    </option>
                <% } } %>
            </select>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="issueDate">Issue Date</label>
                <input type="text" id="issueDate" class="form-control" value="<%= java.time.LocalDate.now() %>" readonly style="background: #f8fafc;">
            </div>
            <div class="form-group">
                <label class="form-label" for="dueDate">Due Date *</label>
                <input type="date" id="dueDate" name="dueDate" class="form-control" required>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label" for="remarks">Remarks / Notes</label>
            <input type="text" id="remarks" name="remarks" class="form-control" placeholder="Optional notes or references">
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <a href="<%= request.getContextPath() %>/dashboard" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary">Confirm Issue</button>
        </div>
    </form>
</div>

<script>
function handleUserSelect(selectElem) {
    const selectedOption = selectElem.options[selectElem.selectedIndex];
    const role = selectedOption.getAttribute('data-role');
    updateDueDate(role);
}

window.addEventListener('DOMContentLoaded', () => {
    const userSelect = document.getElementById('userId');
    if (userSelect && userSelect.selectedIndex > 0) {
        handleUserSelect(userSelect);
    } else {
        updateDueDate('STUDENT');
    }
});
</script>

<jsp:include page="/WEB-INF/includes/footer.jsp" />
