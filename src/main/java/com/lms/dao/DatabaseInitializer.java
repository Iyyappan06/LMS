package com.lms.dao;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.Statement;

public class DatabaseInitializer {

    public static boolean initializeDatabase() {
        Connection conn = null;
        Statement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();

            InputStream is = DatabaseInitializer.class.getResourceAsStream("/database/schema.sql");
            if (is == null) {
                // Try from WEB-INF path if loaded in ServletContext
                is = DatabaseInitializer.class.getClassLoader().getResourceAsStream("schema.sql");
            }

            if (is != null) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.startsWith("--") || line.isEmpty()) continue;
                    sb.append(line).append(" ");
                    if (line.endsWith(";")) {
                        String query = sb.toString().replace(";", "").trim();
                        if (!query.isEmpty()) {
                            try {
                                stmt.execute(query);
                            } catch (Exception e) {
                                System.err.println("[DatabaseInitializer] Query warning: " + e.getMessage());
                            }
                        }
                        sb.setLength(0);
                    }
                }
                System.out.println("[DatabaseInitializer] Database initialized successfully.");
                return true;
            }
        } catch (Exception e) {
            System.err.println("[DatabaseInitializer] Init error: " + e.getMessage());
        } finally {
            DBConnection.close(stmt, conn);
        }
        return false;
    }

    public static void main(String[] args) {
        System.out.println("Starting LMS Database Initialization...");
        boolean success = initializeDatabase();
        System.out.println("Result: " + (success ? "SUCCESS" : "CHECK CONNECTION / CREDENTIALS"));
    }
}
