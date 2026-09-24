<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.lms.model.User" %>
<%
    User sessionUser = (User) session.getAttribute("currentUser");
    String appPath = request.getContextPath();
    String pageTitle = (String) request.getAttribute("pageTitle");
    if (pageTitle == null) pageTitle = "Library Management System";
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= pageTitle %> - LMS</title>
    <link rel="stylesheet" href="<%= appPath %>/assets/css/style.css?v=<%= System.currentTimeMillis() %>">
</head>
<body>
<div class="app-layout">
