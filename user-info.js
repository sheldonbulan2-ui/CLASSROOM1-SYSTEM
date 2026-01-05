// User Info Collection Module

document.addEventListener('DOMContentLoaded', () => {
    // Check if there's pending signup
    const pendingSignup = localStorage.getItem('pending_signup');
    
    if (!pendingSignup) {
        // No pending signup, redirect to login
        window.location.href = 'index.html';
        return;
    }
    
    let signupData;
    try {
        signupData = JSON.parse(pendingSignup);
    } catch (e) {
        console.error('Error parsing signup data:', e);
        window.location.href = 'index.html';
        return;
    }
    
    const role = signupData.role;
    
    // Show appropriate form based on role
    const studentInfo = document.getElementById('studentInfo');
    const teacherInfo = document.getElementById('teacherInfo');
    const classrepInfo = document.getElementById('classrepInfo');
    
    if (role === 'student' && studentInfo) {
        studentInfo.style.display = 'block';
    } else if (role === 'teacher' && teacherInfo) {
        teacherInfo.style.display = 'block';
    } else if (role === 'classrep' && classrepInfo) {
        classrepInfo.style.display = 'block';
    } else {
        console.error('Unknown role or form elements not found:', role);
        document.getElementById('infoError').textContent = 'Error: Invalid role or form not found.';
        document.getElementById('infoError').style.display = 'block';
        return;
    }
    
    // Handle form submission
    const form = document.getElementById('userInfoForm');
    const errorDiv = document.getElementById('infoError');
    
    if (!form) {
        console.error('Form not found!');
        return;
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted, role:', role);
        completeRegistration(role, signupData);
    });
    
    // Also add click handler to button as backup
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Button clicked, role:', role);
            completeRegistration(role, signupData);
        });
    }
});

function completeRegistration(role, signupData) {
    const errorDiv = document.getElementById('infoError');
    const loadingIndicator = document.getElementById('infoError');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!errorDiv) {
        console.error('Error div not found!');
        alert('Error: Form elements not found. Please refresh the page.');
        return;
    }
    
    // Show loading, hide error
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
    }
    
    let userInfo = {};
    
    try {
        if (role === 'student') {
            const nameEl = document.getElementById('studentName');
            const ageEl = document.getElementById('studentAge');
            const sectionEl = document.getElementById('studentSection');
            const emailEl = document.getElementById('studentEmail');
            const phoneEl = document.getElementById('studentPhone');
            const addressEl = document.getElementById('studentAddress');
            
            if (!nameEl || !ageEl || !sectionEl) {
                errorDiv.textContent = 'Error: Form fields not found. Please refresh the page.';
                errorDiv.style.display = 'block';
                return;
            }
            
            const name = nameEl.value.trim();
            const age = ageEl.value;
            const section = sectionEl.value.trim();
            const email = emailEl ? emailEl.value.trim() : '';
            const phone = phoneEl ? phoneEl.value.trim() : '';
            const address = addressEl ? addressEl.value.trim() : '';
            
            // Detailed validation with specific error messages
            if (!name) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Full Name is required. Please enter your full name.';
                errorDiv.style.display = 'block';
                nameEl.focus();
                return;
            }
            
            if (name.length < 2) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Name is too short. Please enter your full name (at least 2 characters).';
                errorDiv.style.display = 'block';
                nameEl.focus();
                return;
            }
            
            if (!age) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Age is required. Please enter your age.';
                errorDiv.style.display = 'block';
                ageEl.focus();
                return;
            }
            
            if (isNaN(age)) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Age must be a number. Please enter a valid age (e.g., 18, 20, 25).';
                errorDiv.style.display = 'block';
                ageEl.focus();
                return;
            }
            
            const ageNum = parseInt(age);
            if (ageNum < 10 || ageNum > 100) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Age must be between 10 and 100 years old. You entered ' + age + '.';
                errorDiv.style.display = 'block';
                ageEl.focus();
                return;
            }
            
            if (!section) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Section is required. Please enter your section (e.g., Section A, Section B).';
                errorDiv.style.display = 'block';
                sectionEl.focus();
                return;
            }
            
            if (section.length < 2) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Section name is too short. Please enter a valid section name.';
                errorDiv.style.display = 'block';
                sectionEl.focus();
                return;
            }
            
            userInfo = {
                name,
                age: parseInt(age),
                section,
                email,
                phone,
                address,
                role: 'student',
                status: 'pending', // Students need approval
                registeredAt: new Date().toISOString()
            };
        } else if (role === 'teacher') {
            const nameEl = document.getElementById('teacherName');
            const emailEl = document.getElementById('teacherEmail');
            const phoneEl = document.getElementById('teacherPhone');
            const subjectEl = document.getElementById('teacherSubject');
            
            if (!nameEl || !emailEl) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Form fields not found. Please refresh the page.';
                errorDiv.style.display = 'block';
                return;
            }
            
            const name = nameEl.value.trim();
            const email = emailEl.value.trim();
            const phone = phoneEl ? phoneEl.value.trim() : '';
            const subject = subjectEl ? subjectEl.value.trim() : '';
            
            if (!name) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Full Name is required. Please enter your full name.';
                errorDiv.style.display = 'block';
                nameEl.focus();
                return;
            }
            
            if (name.length < 2) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Name is too short. Please enter your full name (at least 2 characters).';
                errorDiv.style.display = 'block';
                nameEl.focus();
                return;
            }
            
            if (!email) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Email Address is required. Please enter your email address.';
                errorDiv.style.display = 'block';
                emailEl.focus();
                return;
            }
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Invalid email format. Please enter a valid email address (e.g., yourname@example.com).';
                errorDiv.style.display = 'block';
                emailEl.focus();
                return;
            }
            
            userInfo = {
                name,
                email,
                phone,
                subject,
                role: 'teacher',
                status: 'active',
                registeredAt: new Date().toISOString()
            };
        } else if (role === 'classrep') {
            const nameEl = document.getElementById('classrepName');
            const emailEl = document.getElementById('classrepEmail');
            const phoneEl = document.getElementById('classrepPhone');
            
            if (!nameEl || !emailEl) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Form fields not found. Please refresh the page.';
                errorDiv.style.display = 'block';
                return;
            }
            
            const name = nameEl.value.trim();
            const email = emailEl.value.trim();
            const phone = phoneEl ? phoneEl.value.trim() : '';
            
            if (!name) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Full Name is required. Please enter your full name.';
                errorDiv.style.display = 'block';
                nameEl.focus();
                return;
            }
            
            if (name.length < 2) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Name is too short. Please enter your full name (at least 2 characters).';
                errorDiv.style.display = 'block';
                nameEl.focus();
                return;
            }
            
            if (!email) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Email Address is required. Please enter your email address.';
                errorDiv.style.display = 'block';
                emailEl.focus();
                return;
            }
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorDiv.innerHTML = '❌ <strong>Error:</strong> Invalid email format. Please enter a valid email address (e.g., yourname@example.com).';
                errorDiv.style.display = 'block';
                emailEl.focus();
                return;
            }
            
            userInfo = {
                name,
                email,
                phone,
                role: 'classrep',
                status: 'active',
                registeredAt: new Date().toISOString()
            };
        }
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('smart_classroom_users') || '{}');
        
        // Create user account
        users[signupData.username] = {
            username: signupData.username,
            password: signupData.password,
            ...userInfo
        };
        
        // Save users
        localStorage.setItem('smart_classroom_users', JSON.stringify(users));
        
        // Store student info separately for teacher viewing
        if (role === 'student') {
            const studentsInfo = JSON.parse(localStorage.getItem('students_info') || '[]');
            studentsInfo.push({
                username: signupData.username,
                ...userInfo
            });
            localStorage.setItem('students_info', JSON.stringify(studentsInfo));
        }
        
        // Clear pending signup
        localStorage.removeItem('pending_signup');
        
        // For students, they need approval - don't auto login
        if (role === 'student' && userInfo.status === 'pending') {
            console.log('Student registration pending approval');
            if (submitBtn) {
                submitBtn.textContent = 'Registration Submitted!';
                submitBtn.style.background = 'var(--secondary-color)';
            }
            
            setTimeout(() => {
                alert('✅ Registration submitted successfully!\n\nYour account is pending approval from your teacher. You will be able to login once your teacher approves your registration.\n\nPlease wait for approval notification.');
                window.location.href = 'index.html';
            }, 300);
            return;
        }
        
        // For teachers and class reps, auto login
        const session = {
            username: signupData.username,
            role: role,
            name: userInfo.name,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('smart_classroom_auth', JSON.stringify(session));
        
        // Redirect to dashboard
        console.log('Registration successful, redirecting...');
        if (submitBtn) {
            submitBtn.textContent = 'Success! Redirecting...';
            submitBtn.style.background = 'var(--secondary-color)';
        }
        
        setTimeout(() => {
            alert('Registration successful! Welcome to Smart Classroom System!');
            window.location.href = 'dashboard.html';
        }, 300);
        
    } catch (error) {
        errorDiv.innerHTML = '❌ <strong>Error:</strong> An unexpected error occurred: ' + (error.message || error) + '. Please try again. If the problem persists, please refresh the page and try again.';
        errorDiv.style.display = 'block';
        console.error('Registration error:', error);
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Complete Registration';
        }
    }
}

