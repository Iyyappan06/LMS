package com.lms.dao;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class DBConnection {
    private static String url = "jdbc:mysql://localhost:3306/lms_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8";
    private static String username = "root";
    private static String password = ""; // Default empty, can be set via db.properties or system property

    static {
        try {
            // Load MySQL 8+ Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("[DBConnection] MySQL JDBC Driver not found: " + e.getMessage());
        }

        // Try to load db.properties if available
        try (InputStream in = DBConnection.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (in != null) {
                Properties props = new Properties();
                props.load(in);
                if (props.getProperty("db.url") != null) url = props.getProperty("db.url");
                if (props.getProperty("db.user") != null) username = props.getProperty("db.user");
                if (props.getProperty("db.password") != null) password = props.getProperty("db.password");
            }
        } catch (Exception ignored) {
        }

        // Allow environment overrides
        String envUser = System.getenv("LMS_DB_USER");
        if (envUser != null && !envUser.isEmpty()) username = envUser;
        String envPass = System.getenv("LMS_DB_PASSWORD");
        if (envPass != null) password = envPass;
    }

    public static Connection getConnection() throws SQLException {
        try {
            return DriverManager.getConnection(url, username, password);
        } catch (SQLException e) {
            // If authentication fails with empty password, try common default 'root' or 'Admin@123'
            if (password == null || password.isEmpty()) {
                try {
                    return DriverManager.getConnection(url, username, "root");
                } catch (SQLException ignored) {}
                try {
                    return DriverManager.getConnection(url, username, "Admin@123");
                } catch (SQLException ignored) {}
            }
            throw e;
        }
    }

    public static void setCredentials(String dbUrl, String user, String pass) {
        if (dbUrl != null) url = dbUrl;
        if (user != null) username = user;
        if (pass != null) password = pass;
    }

    public static void close(AutoCloseable... resources) {
        for (AutoCloseable res : resources) {
            if (res != null) {
                try {
                    res.close();
                } catch (Exception ignored) {}
            }
        }
    }

    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (Exception e) {
            return false;
        }
    }
}
