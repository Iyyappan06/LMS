<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.lms.model.User" %>
<%
    User currentUser = (User) session.getAttribute("currentUser");
    String cp = request.getContextPath();
    String activePage = (String) request.getAttribute("activeNav");
    if (activePage == null) activePage = "";
%>
<aside class="app-sidebar">
    <a href="<%= cp %>/dashboard" class="sidebar-brand">
        <div class="brand-icon">LMS</div>
        <div class="brand-text">
            <h1>Library System</h1>
            <span>Portal</span>
        </div>
    </a>

    <div class="sidebar-nav">
        <div class="nav-section-title">Main</div>
        <a href="<%= cp %>/dashboard" class="nav-item <%= "dashboard".equals(activePage) ? "active" : "" %>">
            <span>Dashboard</span>
        </a>

        <div class="nav-section-title">Books</div>
        <a href="<%= cp %>/books" class="nav-item <%= "books".equals(activePage) ? "active" : "" %>">
            <span>Book Catalog</span>
        </a>
        <% if (currentUser != null && currentUser.canManageLibrary()) { %>
        <a href="<%= cp %>/books?action=add" class="nav-item <%= "books_add".equals(activePage) ? "active" : "" %>">
            <span>Add Book</span>
        </a>
        <% } %>

        <% if (currentUser != null && currentUser.canManageLibrary()) { %>
        <div class="nav-section-title">Circulation</div>
        <a href="<%= cp %>/borrow?action=issue" class="nav-item <%= "borrow_issue".equals(activePage) ? "active" : "" %>">
            <span>Issue Book</span>
        </a>
        <a href="<%= cp %>/borrow?action=return" class="nav-item <%= "borrow_return".equals(activePage) ? "active" : "" %>">
            <span>Return Book</span>
        </a>
        <a href="<%= cp %>/borrow?action=history" class="nav-item <%= "borrow_history".equals(activePage) ? "active" : "" %>">
            <span>Loan Ledger</span>
        </a>
        <% } %>

        <% if (currentUser != null && (currentUser.isStudent() || currentUser.isFaculty() || currentUser.isCoordinator())) { %>
        <div class="nav-section-title">My Loans</div>
        <a href="<%= cp %>/borrow?action=myHistory" class="nav-item <%= "my_history".equals(activePage) ? "active" : "" %>">
            <span>My Borrowed Books</span>
        </a>
        <% } %>

        <% if (currentUser != null && (currentUser.isAdmin() || currentUser.isLibrarian())) { %>
        <div class="nav-section-title">Users</div>
        <a href="<%= cp %>/users" class="nav-item <%= "users".equals(activePage) ? "active" : "" %>">
            <span>User Accounts</span>
        </a>
        <a href="<%= cp %>/users?action=add" class="nav-item <%= "users_add".equals(activePage) ? "active" : "" %>">
            <span>Register User</span>
        </a>
        <% } %>

        <div class="nav-section-title">Account</div>
        <a href="<%= cp %>/users?action=profile" class="nav-item <%= "profile".equals(activePage) ? "active" : "" %>">
            <span>Profile</span>
        </a>
        <a href="<%= cp %>/logout" class="nav-item" onclick="return confirmAction('Are you sure you want to log out?');">
            <span>Log Out</span>
        </a>
    </div>

    <% if (currentUser != null) { %>
    <div class="sidebar-footer">
        <div class="user-badge-mini">
            <div class="user-avatar-sm"><%= currentUser.getFullName().substring(0, 1) %></div>
            <div class="user-meta-sm">
                <div class="name"><%= currentUser.getFullName() %></div>
                <div class="role-pill"><%= currentUser.getRole().name() %></div>
            </div>
        </div>
    </div>
    <% } %>
</aside>

<div class="app-main">
    <header class="app-topbar">
        <div class="page-title">
            <h2><%= request.getAttribute("pageTitle") != null ? request.getAttribute("pageTitle") : "Dashboard" %></h2>
            <p><%= request.getAttribute("pageSubtitle") != null ? request.getAttribute("pageSubtitle") : "Library Management System" %></p>
        </div>
        <div class="topbar-actions">
            <a href="<%= cp %>/books" class="btn btn-outline btn-sm">Search Catalog</a>
            <% if (currentUser != null && currentUser.canManageLibrary()) { %>
            <a href="<%= cp %>/borrow?action=issue" class="btn btn-primary btn-sm">Issue Book</a>
            <% } %>
        </div>
    </header>
    <main class="content-container">
    <% 
        String msg = request.getParameter("message");
        String msgType = request.getParameter("type");
        if (msgType == null) msgType = "info";
        if (msg != null && !msg.trim().isEmpty()) {
    %>
        <div class="alert alert-<%= msgType %>">
            <span><%= msg %></span>
        </div>
    <% } %>
