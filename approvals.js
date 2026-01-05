// Student Approval System Module

function loadPendingApprovals() {
    const users = window.userManagementModule ? window.userManagementModule.getAllUsers() : {};
    const container = document.getElementById('pending-approvals-list');
    const currentUser = window.authModule.getCurrentUser();
    const isAdmin = window.authModule.hasRole('admin');
    const isTeacher = window.authModule.hasRole('teacher') || window.authModule.hasRole('classrep');
    
    if (!isAdmin && !isTeacher) {
        container.innerHTML = '<div class="empty-state"><p>Access denied. Only teachers and administrators can approve students.</p></div>';
        return;
    }
    
    // Get all pending students
    const pendingStudents = Object.keys(users)
        .map(username => ({ username, ...users[username] }))
        .filter(user => user.role === 'student' && user.status === 'pending')
        .sort((a, b) => new Date(a.registeredAt || 0) - new Date(b.registeredAt || 0));
    
    if (pendingStudents.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">✅</div><p>No pending student approvals. All students have been approved.</p></div>';
        return;
    }
    
    container.innerHTML = `
        <div class="card" style="margin-bottom: 20px; background: #fff3cd; border-left: 4px solid var(--warning-color);">
            <p style="margin: 0; font-weight: 600; color: #856404;">
                📋 You have <strong>${pendingStudents.length}</strong> student${pendingStudents.length > 1 ? 's' : ''} waiting for approval
            </p>
        </div>
        
        ${pendingStudents.map(student => `
            <div class="card" style="margin-bottom: 20px; border-left: 4px solid var(--warning-color);">
                <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 15px;">
                    <div style="flex: 1; min-width: 250px;">
                        <h3 style="margin-bottom: 10px; color: var(--dark-color);">${student.name || 'No name'}</h3>
                        <div style="display: grid; gap: 8px; font-size: 14px; color: #666;">
                            <div><strong>Username:</strong> ${student.username}</div>
                            ${student.age ? `<div><strong>Age:</strong> ${student.age} years old</div>` : ''}
                            ${student.section ? `<div><strong>Section:</strong> ${student.section}</div>` : ''}
                            ${student.email ? `<div><strong>Email:</strong> ${student.email}</div>` : ''}
                            ${student.phone ? `<div><strong>Phone:</strong> ${student.phone}</div>` : ''}
                            ${student.address ? `<div><strong>Address:</strong> ${student.address}</div>` : ''}
                            <div><strong>Registered:</strong> ${student.registeredAt ? window.appModule.formatDate(student.registeredAt) : 'Unknown'}</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: start;">
                        <button class="btn btn-primary" onclick="window.approvalsModule.approveStudent('${student.username}')">
                            ✅ Approve
                        </button>
                        <button class="btn btn-danger" onclick="window.approvalsModule.rejectStudent('${student.username}')">
                            ❌ Reject
                        </button>
                    </div>
                </div>
            </div>
        `).join('')}
    `;
}

function approveStudent(username) {
    if (!confirm(`Approve student "${username}"? They will be able to login to the system.`)) {
        return;
    }
    
    const users = window.userManagementModule ? window.userManagementModule.getAllUsers() : {};
    const user = users[username];
    
    if (!user) {
        alert('❌ Error: Student not found.');
        return;
    }
    
    // Update status to active
    user.status = 'active';
    users[username] = user;
    localStorage.setItem('smart_classroom_users', JSON.stringify(users));
    
    // Update in students_info if exists
    const studentsInfo = JSON.parse(localStorage.getItem('students_info') || '[]');
    const studentInfoIndex = studentsInfo.findIndex(s => s.username === username);
    if (studentInfoIndex !== -1) {
        studentsInfo[studentInfoIndex].status = 'active';
        localStorage.setItem('students_info', JSON.stringify(studentsInfo));
    }
    
    // Create notification for student (they can see it when they login)
    const notifications = window.db.getAll('notifications');
    window.db.create('notifications', {
        title: 'Account Approved',
        message: `Your account has been approved! You can now login to the system.`,
        type: 'approval',
        userId: username,
        createdAt: new Date().toISOString()
    });
    
    alert(`✅ Student "${user.name || username}" has been approved successfully! They can now login to the system.`);
    loadPendingApprovals();
    
    // Refresh students info if on that page
    if (window.studentsInfoModule) {
        window.studentsInfoModule.loadStudentsInfo();
    }
}

function rejectStudent(username) {
    const reason = prompt(`Reject student "${username}"?\n\nPlease provide a reason (optional):`);
    
    if (reason === null) {
        return; // User cancelled
    }
    
    if (!confirm(`Are you sure you want to reject "${username}"? This action cannot be undone.`)) {
        return;
    }
    
    const users = window.userManagementModule ? window.userManagementModule.getAllUsers() : {};
    const user = users[username];
    
    if (!user) {
        alert('❌ Error: Student not found.');
        return;
    }
    
    // Delete the user account
    delete users[username];
    localStorage.setItem('smart_classroom_users', JSON.stringify(users));
    
    // Remove from students_info
    const studentsInfo = JSON.parse(localStorage.getItem('students_info') || '[]');
    const filtered = studentsInfo.filter(s => s.username !== username);
    localStorage.setItem('students_info', JSON.stringify(filtered));
    
    // Create notification (optional, since account is deleted)
    if (reason) {
        console.log(`Student ${username} rejected. Reason: ${reason}`);
    }
    
    alert(`❌ Student "${user.name || username}" has been rejected and their account has been removed.`);
    loadPendingApprovals();
}

// Make functions available globally
window.approvalsModule = {
    loadPendingApprovals,
    approveStudent,
    rejectStudent
};


