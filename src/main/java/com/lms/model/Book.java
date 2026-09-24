package com.lms.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class Book implements Serializable {
    private static final long serialVersionUID = 1L;

    public enum Status {
        AVAILABLE, ARCHIVED, DAMAGED, LOST
    }

    private int id;
    private String isbn;
    private String title;
    private String author;
    private String category;
    private String publisher;
    private String edition;
    private int publishYear;
    private int totalCopies;
    private int availableCopies;
    private String shelfLocation;
    private String description;
    private Status status;
    private Timestamp createdAt;

    public Book() {
        this.status = Status.AVAILABLE;
        this.totalCopies = 1;
        this.availableCopies = 1;
    }

    public Book(int id, String isbn, String title, String author, String category, String publisher, 
                String edition, int publishYear, int totalCopies, int availableCopies, 
                String shelfLocation, String description, Status status) {
        this.id = id;
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.category = category;
        this.publisher = publisher;
        this.edition = edition;
        this.publishYear = publishYear;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
        this.shelfLocation = shelfLocation;
        this.description = description;
        this.status = status;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public String getEdition() { return edition; }
    public void setEdition(String edition) { this.edition = edition; }

    public int getPublishYear() { return publishYear; }
    public void setPublishYear(int publishYear) { this.publishYear = publishYear; }

    public int getTotalCopies() { return totalCopies; }
    public void setTotalCopies(int totalCopies) { this.totalCopies = totalCopies; }

    public int getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(int availableCopies) { this.availableCopies = availableCopies; }

    public String getShelfLocation() { return shelfLocation; }
    public void setShelfLocation(String shelfLocation) { this.shelfLocation = shelfLocation; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public boolean isAvailableToBorrow() {
        return availableCopies > 0 && status == Status.AVAILABLE;
    }
}
