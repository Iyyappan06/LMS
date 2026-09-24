<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Library Management System</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/assets/css/style.css?v=<%= System.currentTimeMillis() %>">
</head>
<body>
<div class="auth-wrapper">
    <div class="auth-card">
        <div class="auth-header">
            <h2>Library Management System</h2>
            <p>Sign in to your account</p>
        </div>

        <% 
            String error = (String) request.getAttribute("error");
            String msg = request.getParameter("message");
            String msgType = request.getParameter("type");
            if (msgType == null) msgType = "info";
            if (error != null) {
        %>
            <div class="alert alert-danger">
                <span><%= error %></span>
            </div>
        <% } else if (msg != null) { %>
            <div class="alert alert-<%= msgType %>">
                <span><%= msg %></span>
            </div>
        <% } %>

        <form action="<%= request.getContextPath() %>/login" method="post">
            <div class="form-group">
                <label class="form-label" for="identifier">Username or Email</label>
                <input type="text" id="identifier" name="identifier" class="form-control" 
                       placeholder="Username or email" 
                       value="<%= request.getAttribute("enteredIdentifier") != null ? request.getAttribute("enteredIdentifier") : "" %>" required autofocus>
            </div>

            <div class="form-group">
                <label class="form-label" for="password">Password</label>
                <input type="password" id="password" name="password" class="form-control" 
                       placeholder="Password" required>
            </div>

            <div style="margin-top: 18px;">
                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 9px 14px;">
                    Sign In
                </button>
            </div>
        </form>

        <div class="demo-credentials">
            <h4>Demo Accounts (click to autofill):</h4>
            <div class="demo-pills">
                <button type="button" class="demo-pill" onclick="fillLogin('admin@lms.com', 'Admin@123')">Admin</button>
                <button type="button" class="demo-pill" onclick="fillLogin('librarian@lms.com', 'Lib@123')">Librarian</button>
                <button type="button" class="demo-pill" onclick="fillLogin('faculty@lms.com', 'Faculty@123')">Faculty</button>
                <button type="button" class="demo-pill" onclick="fillLogin('coordinator@lms.com', 'Coord@123')">Coordinator</button>
            </div>
        </div>
    </div>
</div>
<script src="<%= request.getContextPath() %>/assets/js/main.js"></script>
</body>
</html>
