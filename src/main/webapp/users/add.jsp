<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    request.setAttribute("pageTitle", "Register Member");
    request.setAttribute("pageSubtitle", "Create a new user account");
    request.setAttribute("activeNav", "users_add");
%>
<jsp:include page="/WEB-INF/includes/header.jsp" />
<jsp:include page="/WEB-INF/includes/navbar.jsp" />

<div class="card" style="max-width: 680px; margin: 0 auto;">
    <div class="card-header">
        <h3 class="card-title">User Registration</h3>
        <a href="<%= request.getContextPath() %>/users" class="btn btn-outline btn-sm">Back to Users</a>
    </div>

    <form action="<%= request.getContextPath() %>/users" method="post">
        <input type="hidden" name="action" value="save">

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="username">Username *</label>
                <input type="text" id="username" name="username" class="form-control" placeholder="e.g. jdoe24" required>
            </div>
            <div class="form-group">
                <label class="form-label" for="password">Password *</label>
                <input type="password" id="password" name="password" class="form-control" placeholder="••••••••" required>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="fullName">Full Name *</label>
                <input type="text" id="fullName" name="fullName" class="form-control" placeholder="e.g. John Doe" required>
            </div>
            <div class="form-group">
                <label class="form-label" for="email">Email Address *</label>
                <input type="email" id="email" name="email" class="form-control" placeholder="e.g. jdoe@university.edu" required>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="role">Role *</label>
                <select id="role" name="role" class="form-control" required onchange="adjustLimits(this.value)">
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="COORDINATOR">Coordinator</option>
                    <option value="LIBRARIAN">Librarian</option>
                    <option value="ADMIN">Administrator</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label" for="department">Department</label>
                <input type="text" id="department" name="department" class="form-control" placeholder="e.g. Computer Science">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="phone">Phone Number</label>
                <input type="text" id="phone" name="phone" class="form-control" placeholder="e.g. +1 555-0199">
            </div>
            <div class="form-group">
                <label class="form-label" for="maxBooksAllowed">Max Borrowing Limit</label>
                <input type="number" id="maxBooksAllowed" name="maxBooksAllowed" class="form-control" value="3" min="1" max="20" required>
            </div>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <a href="<%= request.getContextPath() %>/users" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary">Create User</button>
        </div>
    </form>
</div>

<script>
function adjustLimits(role) {
    const limitInput = document.getElementById('maxBooksAllowed');
    if (role === 'STUDENT') limitInput.value = 3;
    else if (role === 'FACULTY') limitInput.value = 6;
    else if (role === 'COORDINATOR') limitInput.value = 8;
    else limitInput.value = 10;
}
</script>

<jsp:include page="/WEB-INF/includes/footer.jsp" />
