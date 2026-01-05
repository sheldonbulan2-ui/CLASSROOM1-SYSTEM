// Registration and User Info Module

let currentSignupRole = '';

function handleRoleChange() {
    currentSignupRole = document.getElementById('signupRole').value;
}

function showSignup() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('signupSection').style.display = 'block';
}

function showLogin() {
    document.getElementById('signupSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
}

// Handle signup form
document.addEventListener('DOMContentLoaded', () => {
    const showSignupLink = document.getElementById('showSignupLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const signupForm = document.getElementById('signupForm');
    const signupError = document.getElementById('signupError');
    
    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSignup();
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showLogin();
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSignup();
        });
        
        // Real-time password matching validation
        const passwordField = document.getElementById('signupPassword');
        const confirmPasswordField = document.getElementById('signupConfirmPassword');
        
        if (passwordField && confirmPasswordField) {
            confirmPasswordField.addEventListener('input', () => {
                const password = passwordField.value;
                const confirmPassword = confirmPasswordField.value;
                
                if (confirmPassword.length > 0) {
                    if (password !== confirmPassword) {
                        confirmPasswordField.style.borderColor = 'var(--danger-color)';
                        passwordField.style.borderColor = 'var(--danger-color)';
                    } else {
                        confirmPasswordField.style.borderColor = 'var(--secondary-color)';
                        passwordField.style.borderColor = 'var(--secondary-color)';
                    }
                } else {
                    confirmPasswordField.style.borderColor = '';
                    passwordField.style.borderColor = '';
                }
            });
            
            passwordField.addEventListener('input', () => {
                const password = passwordField.value;
                const confirmPassword = confirmPasswordField.value;
                
                if (confirmPassword.length > 0) {
                    if (password !== confirmPassword) {
                        confirmPasswordField.style.borderColor = 'var(--danger-color)';
                        passwordField.style.borderColor = 'var(--danger-color)';
                    } else {
                        confirmPasswordField.style.borderColor = 'var(--secondary-color)';
                        passwordField.style.borderColor = 'var(--secondary-color)';
                    }
                }
            });
        }
    }
});

function handleSignup() {
    const role = document.getElementById('signupRole').value;
    const username = document.getElementById('signupUsername').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const signupError = document.getElementById('signupError');
    
    // Clear previous errors
    signupError.style.display = 'none';
    document.getElementById('signupConfirmPassword').style.borderColor = '';
    document.getElementById('signupPassword').style.borderColor = '';
    
    // Validation with detailed error messages
    if (!role) {
        signupError.innerHTML = '❌ <strong>Error:</strong> Please select your role (Student, Teacher, or Class Representative)';
        signupError.style.display = 'block';
        document.getElementById('signupRole').focus();
        return;
    }
    
    if (!username) {
        signupError.innerHTML = '❌ <strong>Error:</strong> Username is required. Please enter a username.';
        signupError.style.display = 'block';
        document.getElementById('signupUsername').focus();
        return;
    }
    
    if (username.length < 3) {
        signupError.innerHTML = '❌ <strong>Error:</strong> Username must be at least 3 characters long. You entered ' + username.length + ' character(s).';
        signupError.style.display = 'block';
        document.getElementById('signupUsername').focus();
        return;
    }
    
    // Check for invalid characters in username
    if (!/^[a-z0-9_]+$/.test(username)) {
        signupError.innerHTML = '❌ <strong>Error:</strong> Username can only contain lowercase letters, numbers, and underscores. No spaces or special characters allowed.';
        signupError.style.display = 'block';
        document.getElementById('signupUsername').focus();
        return;
    }
    
    if (!password) {
        signupError.innerHTML = '❌ <strong>Error:</strong> Password is required. Please enter a password.';
        signupError.style.display = 'block';
        document.getElementById('signupPassword').focus();
        return;
    }
    
    if (password.length < 6) {
        signupError.innerHTML = '❌ <strong>Error:</strong> Password must be at least 6 characters long. You entered ' + password.length + ' character(s).';
        signupError.style.display = 'block';
        document.getElementById('signupPassword').focus();
        return;
    }
    
    if (!confirmPassword) {
        signupError.innerHTML = '❌ <strong>Error:</strong> Please confirm your password by entering it again.';
        signupError.style.display = 'block';
        document.getElementById('signupConfirmPassword').focus();
        return;
    }
    
    if (password !== confirmPassword) {
        signupError.innerHTML = '❌ <strong>Error:</strong> Passwords do not match. Please make sure both password fields contain the same password.';
        signupError.style.display = 'block';
        // Highlight the confirm password field
        document.getElementById('signupConfirmPassword').style.borderColor = 'var(--danger-color)';
        document.getElementById('signupPassword').style.borderColor = 'var(--danger-color)';
        document.getElementById('signupConfirmPassword').focus();
        return;
    } else {
        // Reset border colors if passwords match
        document.getElementById('signupConfirmPassword').style.borderColor = '';
        document.getElementById('signupPassword').style.borderColor = '';
    }
    
    // Check if username exists - NO LIMIT on number of accounts, just check if username is taken
    const users = JSON.parse(localStorage.getItem('smart_classroom_users') || '{}');
    if (users[username]) {
        signupError.innerHTML = '❌ <strong>Error:</strong> Username "' + username + '" is already taken. Please choose a different username.';
        signupError.style.display = 'block';
        document.getElementById('signupUsername').focus();
        return;
    }
    
    // Clear error if all validations pass
    signupError.style.display = 'none';
    
    // Store signup data temporarily
    const signupData = {
        username,
        password,
        role,
        step: 'info', // Next step is to collect user info
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('pending_signup', JSON.stringify(signupData));
    
    // Redirect to info collection page
    window.location.href = 'user-info.html';
}

function socialLogin(provider) {
    // For demo purposes, show message
    // In production, integrate with actual OAuth
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not yet integrated. Please use regular login or signup.`);
}

function socialSignup(provider) {
    // For demo purposes, show message
    // In production, integrate with actual OAuth
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} signup is not yet integrated. Please use regular signup.`);
}

// Make functions available globally
window.registrationModule = {
    showSignup,
    showLogin,
    handleSignup,
    socialLogin,
    socialSignup
};

// Global functions for onclick
window.showSignup = showSignup;
window.showLogin = showLogin;
window.handleRoleChange = handleRoleChange;
window.socialLogin = socialLogin;
window.socialSignup = socialSignup;

