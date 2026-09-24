/**
 * Library Management System - Main Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });

    // Client-side quick filter for tables
    const tableSearchInput = document.getElementById('tableSearch');
    if (tableSearchInput) {
        tableSearchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.custom-table tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }
});

// Quick fill credentials on login page
function fillLogin(identifier, password) {
    const identInput = document.getElementById('identifier');
    const passInput = document.getElementById('password');
    if (identInput && passInput) {
        identInput.value = identifier;
        passInput.value = password;
        identInput.classList.add('highlight');
        passInput.classList.add('highlight');
        setTimeout(() => {
            identInput.classList.remove('highlight');
            passInput.classList.remove('highlight');
        }, 500);
    }
}

// Confirmation helper for delete/return actions
function confirmAction(message) {
    return confirm(message || 'Are you sure you want to proceed with this action?');
}

// Dynamic Due Date Calculator
function updateDueDate(role) {
    const dueDateInput = document.getElementById('dueDate');
    if (!dueDateInput) return;
    
    const now = new Date();
    let days = 14; // default
    if (role === 'FACULTY' || role === 'COORDINATOR') {
        days = 30;
    }
    now.setDate(now.getDate() + days);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    dueDateInput.value = `${yyyy}-${mm}-${dd}`;
}
