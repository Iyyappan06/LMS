package com.lms.filter;

import com.lms.model.User;
import java.io.IOException;
import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebFilter("/*")
public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String path = req.getRequestURI().substring(req.getContextPath().length());
        
        // Allow public assets & endpoints
        if (path.startsWith("/assets/") || 
            path.startsWith("/login") || 
            path.equals("/login.jsp") || 
            path.equals("/index.jsp") ||
            path.equals("/") ||
            path.equals("/logout")) {
            chain.doFilter(request, response);
            return;
        }

        HttpSession session = req.getSession(false);
        User currentUser = (session != null) ? (User) session.getAttribute("currentUser") : null;

        if (currentUser == null) {
            // Unauthorized - redirect to login
            res.sendRedirect(req.getContextPath() + "/login?message=Please log in to continue&type=warning");
            return;
        }

        // Role-based route authorization
        String action = req.getParameter("action");
        if (action == null) action = "";

        // Admin-only user management routes
        if (path.startsWith("/users") && (!currentUser.isAdmin() && !currentUser.isLibrarian())) {
            res.sendRedirect(req.getContextPath() + "/dashboard?message=Access denied: Administrator privilege required&type=danger");
            return;
        }

        // Administrative book management operations (Add, Edit, Delete)
        if (path.startsWith("/books") && (action.equals("add") || action.equals("edit") || action.equals("delete") || action.equals("save") || action.equals("update"))) {
            if (!currentUser.canManageLibrary()) {
                res.sendRedirect(req.getContextPath() + "/books?message=Access denied: Librarian privilege required for catalog modifications&type=danger");
                return;
            }
        }

        // Circulation management operations (Issue, Return)
        if (path.startsWith("/borrow") && (action.equals("issue") || action.equals("return") || action.equals("processIssue") || action.equals("processReturn"))) {
            if (!currentUser.canManageLibrary()) {
                res.sendRedirect(req.getContextPath() + "/borrow?action=myHistory&message=Access denied: Librarian privilege required for issuing/returning books&type=danger");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}
