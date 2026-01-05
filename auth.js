// Authentication Module
// Using localStorage for demo (replace with Firebase Auth in production)

const AUTH_STORAGE_KEY = 'smart_classroom_auth';

// Default admin user for initial setup (can be removed after creating admin account)
const DEFAULT_ADMIN = {
    'admin': {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'System Administrator'
    }
};

// Initialize admin user in localStorage if not exists (only if no users exist)
if (!localStorage.getItem('smart_classroom_users')) {
    localStorage.setItem('smart_classroom_users', JSON.stringify(DEFAULT_ADMIN));
}

function login(username, password) {
    // Clear any previous errors
    const errorDiv = document.getElementById('loginError');
    
    // Validation
    if (!username || username.trim() === '') {
        return { 
            success: false, 
            error: '❌ <strong>Error:</strong> Username is required. Please enter your username.' 
        };
    }
    
    if (!password || password === '') {
        return { 
            success: false, 
            error: '❌ <strong>Error:</strong> Password is required. Please enter your password.' 
        };
    }
    
    const users = JSON.parse(localStorage.getItem('smart_classroom_users') || '{}');
    const user = users[username.trim().toLowerCase()];
    
    if (!user) {
        return { 
            success: false, 
            error: '❌ <strong>Error:</strong> Username "' + username + '" not found. Please check your username or sign up for a new account.' 
        };
    }
    
    if (user.password !== password) {
        return { 
            success: false, 
            error: '❌ <strong>Error:</strong> Incorrect password. Please check your password and try again.' 
        };
    }
    
    // Check if student is pending approval
    if (user.role === 'student' && user.status === 'pending') {
        return { 
            success: false, 
            error: '⏳ <strong>Account Pending Approval:</strong> Your registration is still pending approval from your teacher. Please wait for approval before logging in. You will be notified once your account is approved.' 
        };
    }
    
    // Success - NO LIMIT on number of users, unlimited accounts allowed
    const session = {
        username: user.username,
        role: user.role,
        name: user.name,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    return { success: true, user: session };
}

function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.location.href = 'index.html';
}

function getCurrentUser() {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authData) {
        return JSON.parse(authData);
    }
    return null;
}

function isAuthenticated() {
    return getCurrentUser() !== null;
}

function hasRole(role) {
    const user = getCurrentUser();
    return user && user.role === role;
}

function canManage() {
    const user = getCurrentUser();
    // Only Admin, Teacher, and Class Rep can manage content
    // Students can only view
    return user && (user.role === 'admin' || user.role === 'teacher' || user.role === 'classrep');
}

// Handle login form
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            const result = login(username, password);
            
            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                errorDiv.textContent = result.error;
                errorDiv.style.display = 'block';
            }
        });
    }
    
    // Redirect to login if not authenticated on dashboard
    if (window.location.pathname.includes('dashboard.html') || window.location.href.includes('dashboard.html')) {
        if (!isAuthenticated()) {
            window.location.href = 'index.html';
        }
    }
});

// Export functions
if (typeof window !== 'undefined') {
    window.authModule = {
        login,
        logout,
        getCurrentUser,
        isAuthenticated,
        hasRole,
        canManage
    };
}

