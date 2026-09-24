package com.lms.model;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

public class BorrowRecord implements Serializable {
    private static final long serialVersionUID = 1L;

    public enum Status {
        ISSUED, RETURNED, OVERDUE, RENEWED
    }

    private int id;
    private int userId;
    private int bookId;
    private Date issueDate;
    private Date dueDate;
    private Date returnDate;
    private int renewalCount;
    private Status status;
    private String remarks;
    private Timestamp createdAt;

    // Joined helper fields
    private String userName;
    private String userEmail;
    private String userRole;
    private String bookTitle;
    private String bookIsbn;
    private String bookAuthor;

    public BorrowRecord() {
        this.status = Status.ISSUED;
        this.renewalCount = 0;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getBookId() { return bookId; }
    public void setBookId(int bookId) { this.bookId = bookId; }

    public Date getIssueDate() { return issueDate; }
    public void setIssueDate(Date issueDate) { this.issueDate = issueDate; }

    public Date getDueDate() { return dueDate; }
    public void setDueDate(Date dueDate) { this.dueDate = dueDate; }

    public Date getReturnDate() { return returnDate; }
    public void setReturnDate(Date returnDate) { this.returnDate = returnDate; }

    public int getRenewalCount() { return renewalCount; }
    public void setRenewalCount(int renewalCount) { this.renewalCount = renewalCount; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }

    public String getBookIsbn() { return bookIsbn; }
    public void setBookIsbn(String bookIsbn) { this.bookIsbn = bookIsbn; }

    public String getBookAuthor() { return bookAuthor; }
    public void setBookAuthor(String bookAuthor) { this.bookAuthor = bookAuthor; }

    public boolean isReturned() {
        return status == Status.RETURNED || returnDate != null;
    }

    public boolean isOverdue() {
        if (isReturned()) return false;
        long now = System.currentTimeMillis();
        return dueDate != null && dueDate.getTime() < now;
    }
}
