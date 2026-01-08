// router.js - Minimal admin protection
(function() {
    'use strict';
    
    // Run on page load
    document.addEventListener('DOMContentLoaded', function() {
        const path = window.location.pathname;
        
        // Only protect /admin/* routes
        if (path.includes('/admin/') || path.endsWith('/admin')) {
            // Check auth
            const token = localStorage.getItem('auth_token');
            if (!token) {
                window.location.href = '/auth/login.html';
                return;
            }
            
            // Check admin status
            try {
                const user = JSON.parse(localStorage.getItem('current_user'));
                if (!user || user.admin !== true) {
                    alert('Admin access required');
                    window.location.href = '/dashboard.html';
                    return;
                }
                // User is admin - allow access
            } catch (e) {
                console.error('Error checking admin:', e);
                window.location.href = '/dashboard.html';
            }
        }
        
        // Setup logout buttons (optional)
        document.querySelectorAll('[data-logout]').forEach(button => {
            button.addEventListener('click', function() {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('current_user');
                window.location.href = '/index.html';
            });
        });
    });
})();