package com.lms.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    public enum Role {
        ADMIN, LIBRARIAN, FACULTY, STUDENT, COORDINATOR;

        public static Role fromString(String roleStr) {
            if (roleStr == null) return STUDENT;
            try {
                return Role.valueOf(roleStr.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                return STUDENT;
            }
        }
    }

    public enum Status {
        ACTIVE, INACTIVE, SUSPENDED
    }

    private int id;
    private String username;
    private String password;
    private String email;
    private String fullName;
    private Role role;
    private String department;
    private String phone;
    private int maxBooksAllowed;
    private Status status;
    private Timestamp createdAt;

    public User() {
        this.role = Role.STUDENT;
        this.status = Status.ACTIVE;
        this.maxBooksAllowed = 3;
    }

    public User(int id, String username, String email, String fullName, Role role, String department, String phone, int maxBooksAllowed, Status status) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.department = department;
        this.phone = phone;
        this.maxBooksAllowed = maxBooksAllowed;
        this.status = status;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public int getMaxBooksAllowed() { return maxBooksAllowed; }
    public void setMaxBooksAllowed(int maxBooksAllowed) { this.maxBooksAllowed = maxBooksAllowed; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public boolean isAdmin() { return this.role == Role.ADMIN; }
    public boolean isLibrarian() { return this.role == Role.LIBRARIAN; }
    public boolean isFaculty() { return this.role == Role.FACULTY; }
    public boolean isStudent() { return this.role == Role.STUDENT; }
    public boolean isCoordinator() { return this.role == Role.COORDINATOR; }
    public boolean canManageLibrary() { return isAdmin() || isLibrarian(); }
}
