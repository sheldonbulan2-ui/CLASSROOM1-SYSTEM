// Activities Module

function loadActivities() {
    const activities = window.db.getAll('activities');
    const container = document.getElementById('activities-list');
    const user = window.authModule.getCurrentUser();
    const canManage = window.authModule.canManage();
    
    if (activities.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><p>No activities yet</p></div>';
        return;
    }
    
    // Sort by due date
    const sorted = activities.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    container.innerHTML = sorted.map(act => {
        const status = window.appModule.getActivityStatus(act.dueDate);
        const statusClass = status === 'overdue' ? 'overdue' : status === 'due_today' ? 'due-today' : '';
        
        return `
            <div class="activity-item ${statusClass}">
                <div class="card-header">
                    <div>
                        <div class="card-title">${act.title}</div>
                        <div class="card-meta">${act.subject} • Due: ${window.appModule.formatDate(act.dueDate)}</div>
                    </div>
                    <span class="status-badge status-${status}">${status.replace('_', ' ')}</span>
                </div>
                ${act.description ? `<p style="margin-top: 10px;">${act.description}</p>` : ''}
                ${canManage ? `
                    <div style="margin-top: 15px; display: flex; gap: 10px;">
                        <button class="btn btn-small btn-secondary" onclick="window.activitiesModule.editActivity('${act.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="window.activitiesModule.deleteActivity('${act.id}')">Delete</button>
                    </div>
                ` : ''}
                ${user.role === 'student' ? `
                    <div style="margin-top: 15px;">
                        <button class="btn btn-small btn-primary" onclick="window.activitiesModule.submitActivity('${act.id}')">Submit Activity</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function showActivityModal(activityId = null) {
    // Security check - only Admin, Teacher, and Class Rep can create/edit activities
    if (!window.authModule.canManage()) {
        alert('❌ Access Denied: Only administrators, teachers, and class representatives can create or edit activities.');
        return;
    }
    
    const activity = activityId ? window.db.getById('activities', activityId) : null;
    
    const content = `
        <h2>${activity ? 'Edit' : 'New'} Activity</h2>
        <form id="activityForm">
            <div class="form-group">
                <label for="actTitle">Title</label>
                <input type="text" id="actTitle" required value="${activity ? activity.title : ''}">
            </div>
            <div class="form-group">
                <label for="actSubject">Subject</label>
                <input type="text" id="actSubject" required value="${activity ? activity.subject : ''}">
            </div>
            <div class="form-group">
                <label for="actDescription">Description</label>
                <textarea id="actDescription">${activity ? activity.description : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="actDueDate">Due Date</label>
                <input type="datetime-local" id="actDueDate" required value="${activity ? new Date(activity.dueDate).toISOString().slice(0, 16) : ''}">
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="btn btn-primary">${activity ? 'Update' : 'Create'}</button>
                <button type="button" class="btn btn-secondary" onclick="window.appModule.closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    window.appModule.showModal(content);
    
    const form = document.getElementById('activityForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveActivity(activityId);
    });
}

function saveActivity(activityId) {
    const title = document.getElementById('actTitle').value.trim();
    const subject = document.getElementById('actSubject').value.trim();
    const description = document.getElementById('actDescription').value.trim();
    const dueDate = document.getElementById('actDueDate').value;
    const user = window.authModule.getCurrentUser();
    
    if (!title || !subject || !dueDate) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (activityId) {
        window.db.update('activities', activityId, {
            title,
            subject,
            description,
            dueDate: new Date(dueDate).toISOString()
        });
    } else {
        window.db.create('activities', {
            title,
            subject,
            description,
            dueDate: new Date(dueDate).toISOString(),
            createdBy: user.name
        });
        
        // Create notification
        window.db.create('notifications', {
            title: 'New Activity',
            message: `${title} for ${subject} - Due: ${window.appModule.formatDate(new Date(dueDate).toISOString())}`,
            type: 'activity'
        });
    }
    
    window.appModule.closeModal();
    loadActivities();
    if (window.appModule.loadDashboard) {
        window.appModule.loadDashboard();
    }
}

function editActivity(id) {
    // Security check
    if (!window.authModule.canManage()) {
        alert('❌ Access Denied: Only administrators, teachers, and class representatives can edit activities.');
        return;
    }
    showActivityModal(id);
}

function deleteActivity(id) {
    // Security check
    if (!window.authModule.canManage()) {
        alert('❌ Access Denied: Only administrators, teachers, and class representatives can delete activities.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this activity?')) {
        window.db.delete('activities', id);
        loadActivities();
        if (window.appModule.loadDashboard) {
            window.appModule.loadDashboard();
        }
    }
}

function submitActivity(activityId) {
    const activity = window.db.getById('activities', activityId);
    if (!activity) return;
    
    const content = `
        <h2>Submit Activity: ${activity.title}</h2>
        <form id="submissionForm">
            <div class="form-group">
                <label for="submissionFile">Upload File</label>
                <input type="file" id="submissionFile" required>
                <small>Accepted: PDF, DOC, DOCX, images</small>
            </div>
            <div class="form-group">
                <label for="submissionNotes">Notes (optional)</label>
                <textarea id="submissionNotes" placeholder="Any additional notes..."></textarea>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="btn btn-primary">Submit</button>
                <button type="button" class="btn btn-secondary" onclick="window.appModule.closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    window.appModule.showModal(content);
    
    const form = document.getElementById('submissionForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('submissionFile');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Please select a file');
            return;
        }
        
        // In production, upload to Firebase Storage
        // For demo, we'll store file info
        const reader = new FileReader();
        reader.onload = (e) => {
            const user = window.authModule.getCurrentUser();
            const now = new Date();
            const dueDate = new Date(activity.dueDate);
            const isLate = now > dueDate;
            
            window.db.create('submissions', {
                activityId: activityId,
                activityTitle: activity.title,
                studentId: user.username,
                studentName: user.name,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                fileData: e.target.result, // In production, this would be a URL
                notes: document.getElementById('submissionNotes').value.trim(),
                submittedAt: now.toISOString(),
                status: isLate ? 'late' : 'submitted'
            });
            
            window.appModule.closeModal();
            alert('Activity submitted successfully!');
            loadActivities();
            if (window.loadSubmissions) {
                window.loadSubmissions();
            }
        };
        reader.readAsDataURL(file);
    });
}

// Make functions available globally
window.activitiesModule = {
    loadActivities,
    showActivityModal,
    editActivity,
    deleteActivity,
    submitActivity
};

