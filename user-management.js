// User Management Module

function loadUserManagement() {
    const users = getAllUsers();
    const container = document.getElementById('users-list');
    const user = window.authModule.getCurrentUser();
    const isAdmin = window.authModule.hasRole('admin');
    
    if (!isAdmin) {
        container.innerHTML = '<div class="empty-state"><p>Access denied. Only administrators can manage users.</p></div>';
        return;
    }
    
    if (Object.keys(users).length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👥</div><p>No users found</p></div>';
        return;
    }
    
    // Convert to array and sort
    const usersArray = Object.keys(users).map(username => ({
        username,
        ...users[username]
    })).sort((a, b) => {
        // Sort by role: admin, classrep, student
        const roleOrder = { admin: 1, classrep: 2, student: 3 };
        return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
    });
    
    container.innerHTML = `
        <div class="card" style="margin-bottom: 20px;">
            <h3 style="margin-bottom: 15px;">All Users (${usersArray.length})</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: var(--light-color);">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--border-color);">Username</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--border-color);">Name</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--border-color);">Role</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--border-color);">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${usersArray.map(u => `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 12px;">${u.username}</td>
                            <td style="padding: 12px;">${u.name}</td>
                            <td style="padding: 12px;">
                                <span class="priority-tag priority-${u.role === 'admin' ? 'important' : 'normal'}">
                                    ${u.role === 'admin' ? 'Admin' : u.role === 'classrep' ? 'Class Rep' : 'Student'}
                                </span>
                            </td>
                            <td style="padding: 12px;">
                                <button class="btn btn-small btn-secondary" onclick="window.userManagementModule.editUser('${u.username}')">Edit</button>
                                ${u.username !== user.username ? `
                                    <button class="btn btn-small btn-danger" onclick="window.userManagementModule.deleteUser('${u.username}')">Delete</button>
                                ` : '<span style="color: #666; font-size: 12px;">Current user</span>'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function showCreateUserModal() {
    const content = `
        <h2>Create New User</h2>
        <form id="createUserForm">
            <div class="form-group">
                <label for="newUsername">Username</label>
                <input type="text" id="newUsername" required placeholder="Enter username">
                <small style="color: #666;">Username must be unique</small>
            </div>
            <div class="form-group">
                <label for="newName">Full Name</label>
                <input type="text" id="newName" required placeholder="Enter full name">
            </div>
            <div class="form-group">
                <label for="newPassword">Password</label>
                <input type="password" id="newPassword" required placeholder="Enter password" minlength="6">
                <small style="color: #666;">Minimum 6 characters</small>
            </div>
            <div class="form-group">
                <label for="newRole">Role</label>
                <select id="newRole" required>
                    <option value="">Select role...</option>
                    <option value="admin">Admin (Teacher)</option>
                    <option value="classrep">Class Representative</option>
                    <option value="student">Student</option>
                </select>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="btn btn-primary">Create User</button>
                <button type="button" class="btn btn-secondary" onclick="window.appModule.closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    window.appModule.showModal(content);
    
    const form = document.getElementById('createUserForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        createUser();
    });
}

function createUser() {
    const username = document.getElementById('newUsername').value.trim().toLowerCase();
    const name = document.getElementById('newName').value.trim();
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;
    
    if (!username || !name || !password || !role) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    const users = getAllUsers();
    
    if (users[username]) {
        alert('Username already exists. Please choose a different username.');
        return;
    }
    
    // Add new user
    users[username] = {
        username: username,
        password: password,
        role: role,
        name: name
    };
    
    localStorage.setItem('smart_classroom_users', JSON.stringify(users));
    
    window.appModule.closeModal();
    alert('User created successfully!');
    loadUserManagement();
}

function editUser(username) {
    const users = getAllUsers();
    const user = users[username];
    
    if (!user) return;
    
    const content = `
        <h2>Edit User: ${username}</h2>
        <form id="editUserForm">
            <div class="form-group">
                <label>Username</label>
                <input type="text" value="${user.username}" disabled style="background: #f5f5f5;">
                <small style="color: #666;">Username cannot be changed</small>
            </div>
            <div class="form-group">
                <label for="editName">Full Name</label>
                <input type="text" id="editName" required value="${user.name}">
            </div>
            <div class="form-group">
                <label for="editPassword">New Password (leave blank to keep current)</label>
                <input type="password" id="editPassword" placeholder="Enter new password" minlength="6">
                <small style="color: #666;">Leave blank to keep current password</small>
            </div>
            <div class="form-group">
                <label for="editRole">Role</label>
                <select id="editRole" required>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin (Teacher)</option>
                    <option value="classrep" ${user.role === 'classrep' ? 'selected' : ''}>Class Representative</option>
                    <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
                </select>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="btn btn-primary">Update User</button>
                <button type="button" class="btn btn-secondary" onclick="window.appModule.closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    window.appModule.showModal(content);
    
    const form = document.getElementById('editUserForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateUser(username);
    });
}

function updateUser(username) {
    const name = document.getElementById('editName').value.trim();
    const newPassword = document.getElementById('editPassword').value;
    const role = document.getElementById('editRole').value;
    
    // Detailed validation
    const missing = [];
    if (!name) missing.push('Full Name');
    if (!role) missing.push('Role');
    
    if (missing.length > 0) {
        alert('❌ Error: Please fill in all required fields:\n- ' + missing.join('\n- '));
        return;
    }
    
    if (newPassword && newPassword.length < 6) {
        alert('❌ Error: Password must be at least 6 characters long. You entered ' + newPassword.length + ' character(s).');
        return;
    }
    
    const users = getAllUsers();
    const user = users[username];
    
    if (!user) {
        alert('❌ Error: User "' + username + '" not found. The user may have been deleted.');
        return;
    }
    
    // Update user
    users[username] = {
        ...user,
        name: name,
        role: role,
        password: newPassword || user.password // Keep old password if not changed
    };
    
    localStorage.setItem('smart_classroom_users', JSON.stringify(users));
    
    window.appModule.closeModal();
    alert('User updated successfully!');
    loadUserManagement();
}

function deleteUser(username) {
    const currentUser = window.authModule.getCurrentUser();
    
    if (username === currentUser.username) {
        alert('You cannot delete your own account');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
        return;
    }
    
    const users = getAllUsers();
    delete users[username];
    
    localStorage.setItem('smart_classroom_users', JSON.stringify(users));
    
    alert('User deleted successfully!');
    loadUserManagement();
}

function getAllUsers() {
    const usersData = localStorage.getItem('smart_classroom_users');
    if (usersData) {
        return JSON.parse(usersData);
    }
    return {};
}

// Make functions available globally
window.userManagementModule = {
    loadUserManagement,
    showCreateUserModal,
    createUser,
    editUser,
    updateUser,
    deleteUser,
    getAllUsers
};

