package com.lms.dao;

import com.lms.model.BorrowRecord;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BorrowDAO {

    public synchronized boolean issueBook(BorrowRecord record) {
        String insertSql = "INSERT INTO borrow_records (user_id, book_id, issue_date, due_date, status, remarks) VALUES (?, ?, ?, ?, 'ISSUED', ?)";
        String updateBookSql = "UPDATE books SET available_copies = available_copies - 1 WHERE id = ? AND available_copies > 0";

        Connection conn = null;
        PreparedStatement psInsert = null;
        PreparedStatement psUpdate = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            // Decrement copy
            psUpdate = conn.prepareStatement(updateBookSql);
            psUpdate.setInt(1, record.getBookId());
            int updated = psUpdate.executeUpdate();
            if (updated == 0) {
                conn.rollback();
                return false; // No copies available
            }

            // Insert record
            psInsert = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS);
            psInsert.setInt(1, record.getUserId());
            psInsert.setInt(2, record.getBookId());
            psInsert.setDate(3, record.getIssueDate());
            psInsert.setDate(4, record.getDueDate());
            psInsert.setString(5, record.getRemarks());
            psInsert.executeUpdate();

            ResultSet gk = psInsert.getGeneratedKeys();
            if (gk.next()) {
                record.setId(gk.getInt(1));
            }

            conn.commit();
            return true;
        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ignored) {}
            }
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(psInsert, psUpdate, conn);
        }
    }

    public synchronized boolean returnBook(int borrowId, String remarks) {
        String findSql = "SELECT book_id, status FROM borrow_records WHERE id = ?";
        String updateRecordSql = "UPDATE borrow_records SET return_date = CURDATE(), status = 'RETURNED', remarks = COALESCE(?, remarks) WHERE id = ? AND status IN ('ISSUED', 'RENEWED', 'OVERDUE')";
        String updateBookSql = "UPDATE books SET available_copies = LEAST(available_copies + 1, total_copies) WHERE id = ?";

        Connection conn = null;
        PreparedStatement psFind = null;
        PreparedStatement psUpdateRec = null;
        PreparedStatement psUpdateBook = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            psFind = conn.prepareStatement(findSql);
            psFind.setInt(1, borrowId);
            rs = psFind.executeQuery();
            if (!rs.next()) {
                conn.rollback();
                return false;
            }
            int bookId = rs.getInt("book_id");

            psUpdateRec = conn.prepareStatement(updateRecordSql);
            psUpdateRec.setString(1, remarks);
            psUpdateRec.setInt(2, borrowId);
            int rows = psUpdateRec.executeUpdate();
            if (rows == 0) {
                conn.rollback();
                return false; // Already returned
            }

            psUpdateBook = conn.prepareStatement(updateBookSql);
            psUpdateBook.setInt(1, bookId);
            psUpdateBook.executeUpdate();

            conn.commit();
            return true;
        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ignored) {}
            }
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(rs, psFind, psUpdateRec, psUpdateBook, conn);
        }
    }

    public boolean renewBook(int borrowId, int extendDays, int maxRenewals) {
        String sql = "UPDATE borrow_records SET due_date = DATE_ADD(due_date, INTERVAL ? DAY), "
                   + "renewal_count = renewal_count + 1, status = 'RENEWED' "
                   + "WHERE id = ? AND status IN ('ISSUED', 'RENEWED') AND renewal_count < ?";
        Connection conn = null;
        PreparedStatement ps = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, extendDays);
            ps.setInt(2, borrowId);
            ps.setInt(3, maxRenewals);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(ps, conn);
        }
    }

    public BorrowRecord getBorrowRecordById(int id) {
        String sql = "SELECT br.*, u.username, u.email, u.role as user_role, b.title as book_title, b.isbn as book_isbn, b.author as book_author "
                   + "FROM borrow_records br "
                   + "JOIN users u ON br.user_id = u.id "
                   + "JOIN books b ON br.book_id = b.id "
                   + "WHERE br.id = ?";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, id);
            rs = ps.executeQuery();
            if (rs.next()) {
                return mapRecord(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs, ps, conn);
        }
        return null;
    }

    public List<BorrowRecord> getAllBorrowRecords() {
        List<BorrowRecord> list = new ArrayList<>();
        String sql = "SELECT br.*, u.username, u.email, u.role as user_role, b.title as book_title, b.isbn as book_isbn, b.author as book_author "
                   + "FROM borrow_records br "
                   + "JOIN users u ON br.user_id = u.id "
                   + "JOIN books b ON br.book_id = b.id "
                   + "ORDER BY br.issue_date DESC, br.id DESC";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();
            while (rs.next()) {
                list.add(mapRecord(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs, ps, conn);
        }
        return list;
    }

    public List<BorrowRecord> getBorrowRecordsByUser(int userId) {
        List<BorrowRecord> list = new ArrayList<>();
        String sql = "SELECT br.*, u.username, u.email, u.role as user_role, b.title as book_title, b.isbn as book_isbn, b.author as book_author "
                   + "FROM borrow_records br "
                   + "JOIN users u ON br.user_id = u.id "
                   + "JOIN books b ON br.book_id = b.id "
                   + "WHERE br.user_id = ? "
                   + "ORDER BY br.issue_date DESC, br.id DESC";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            rs = ps.executeQuery();
            while (rs.next()) {
                list.add(mapRecord(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs, ps, conn);
        }
        return list;
    }

    public List<BorrowRecord> getActiveBorrowRecordsByUser(int userId) {
        List<BorrowRecord> list = new ArrayList<>();
        String sql = "SELECT br.*, u.username, u.email, u.role as user_role, b.title as book_title, b.isbn as book_isbn, b.author as book_author "
                   + "FROM borrow_records br "
                   + "JOIN users u ON br.user_id = u.id "
                   + "JOIN books b ON br.book_id = b.id "
                   + "WHERE br.user_id = ? AND br.status IN ('ISSUED', 'RENEWED', 'OVERDUE') "
                   + "ORDER BY br.due_date ASC";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            rs = ps.executeQuery();
            while (rs.next()) {
                list.add(mapRecord(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs, ps, conn);
        }
        return list;
    }

    public int getActiveIssuedCountByUser(int userId) {
        String sql = "SELECT COUNT(*) FROM borrow_records WHERE user_id = ? AND status IN ('ISSUED', 'RENEWED', 'OVERDUE')";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs, ps, conn);
        }
        return 0;
    }

    public int getTotalActiveBorrowsCount() {
        String sql = "SELECT COUNT(*) FROM borrow_records WHERE status IN ('ISSUED', 'RENEWED', 'OVERDUE')";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs, ps, conn);
        }
        return 0;
    }

    public int getOverdueCount() {
        String sql = "SELECT COUNT(*) FROM borrow_records WHERE status IN ('ISSUED', 'RENEWED', 'OVERDUE') AND due_date < CURDATE()";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs, ps, conn);
        }
        return 0;
    }

    private BorrowRecord mapRecord(ResultSet rs) throws SQLException {
        BorrowRecord br = new BorrowRecord();
        br.setId(rs.getInt("id"));
        br.setUserId(rs.getInt("user_id"));
        br.setBookId(rs.getInt("book_id"));
        br.setIssueDate(rs.getDate("issue_date"));
        br.setDueDate(rs.getDate("due_date"));
        br.setReturnDate(rs.getDate("return_date"));
        br.setRenewalCount(rs.getInt("renewal_count"));
        br.setStatus(BorrowRecord.Status.valueOf(rs.getString("status")));
        br.setRemarks(rs.getString("remarks"));
        br.setCreatedAt(rs.getTimestamp("created_at"));

        br.setUserName(rs.getString("username"));
        br.setUserEmail(rs.getString("email"));
        br.setUserRole(rs.getString("user_role"));
        br.setBookTitle(rs.getString("book_title"));
        br.setBookIsbn(rs.getString("book_isbn"));
        br.setBookAuthor(rs.getString("book_author"));
        return br;
    }
}
