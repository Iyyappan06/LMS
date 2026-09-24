<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.lms.model.BorrowRecord, java.util.List" %>
<%
    request.setAttribute("pageTitle", "Process Book Returns");
    request.setAttribute("pageSubtitle", "Accept returned books and update stock");
    request.setAttribute("activeNav", "borrow_return");

    List<BorrowRecord> activeBorrows = (List<BorrowRecord>) request.getAttribute("activeBorrows");
%>
<jsp:include page="/WEB-INF/includes/header.jsp" />
<jsp:include page="/WEB-INF/includes/navbar.jsp" />

<div class="card">
    <div class="card-header">
        <div>
            <h3 class="card-title">Active Loans Pending Return (<%= activeBorrows != null ? activeBorrows.size() : 0 %>)</h3>
        </div>
        <div>
            <input type="text" id="tableSearch" class="form-control" style="width: 240px;" placeholder="Search borrower, book, ISBN...">
        </div>
    </div>

    <div class="table-responsive">
        <table class="custom-table">
            <thead>
                <tr>
                    <th>Loan ID</th>
                    <th>Borrower</th>
                    <th>Role</th>
                    <th>Book Details</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            <% if (activeBorrows != null && !activeBorrows.isEmpty()) { 
                for (BorrowRecord br : activeBorrows) { %>
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
                    <td>
                        <span class="badge badge-<%= br.getStatus() == BorrowRecord.Status.RENEWED ? "info" : "warning" %>">
                            <%= br.getStatus() %> (<%= br.getRenewalCount() %>)
                        </span>
                    </td>
                    <td>
                        <form action="<%= request.getContextPath() %>/borrow" method="post" style="display: flex; gap: 6px; align-items: center;">
                            <input type="hidden" name="action" value="processReturn">
                            <input type="hidden" name="borrowId" value="<%= br.getId() %>">
                            <input type="hidden" name="redirect" value="/borrow?action=return">
                            <input type="text" name="remarks" class="form-control" style="padding: 3px 6px; font-size: 0.8rem; width: 120px;" placeholder="Remarks">
                            <button type="submit" class="btn btn-sm btn-success" onclick="return confirmAction('Confirm book return for loan #<%= br.getId() %>?');">
                                Return
                            </button>
                        </form>
                    </td>
                </tr>
            <% } } else { %>
                <tr>
                    <td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">
                        No active loans pending return.
                    </td>
                </tr>
            <% } %>
            </tbody>
        </table>
    </div>
</div>

<jsp:include page="/WEB-INF/includes/footer.jsp" />
