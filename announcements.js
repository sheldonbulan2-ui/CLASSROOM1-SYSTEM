// Announcements Module

function loadAnnouncements() {
    const announcements = window.db.getAll('announcements');
    const container = document.getElementById('announcements-list');
    const user = window.authModule.getCurrentUser();
    const canManage = window.authModule.canManage();
    
    if (announcements.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📢</div><p>No announcements yet</p></div>';
        return;
    }
    
    // Sort by date (newest first)
    const sorted = announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    container.innerHTML = sorted.map(ann => `
        <div class="card">
            <div class="card-header">
                <div>
                    <div class="card-title">${ann.title}</div>
                    <div class="card-meta">${window.appModule.formatDate(ann.createdAt)}</div>
                </div>
                <span class="priority-tag priority-${ann.priority}">${ann.priority}</span>
            </div>
            <p style="margin-top: 15px; white-space: pre-wrap;">${ann.content}</p>
            ${canManage ? `
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="btn btn-small btn-secondary" onclick="window.announcementsModule.editAnnouncement('${ann.id}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="window.announcementsModule.deleteAnnouncement('${ann.id}')">Delete</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function showAnnouncementModal(announcementId = null) {
    const announcement = announcementId ? window.db.getById('announcements', announcementId) : null;
    
    const content = `
        <h2>${announcement ? 'Edit' : 'New'} Announcement</h2>
        <form id="announcementForm">
            <div class="form-group">
                <label for="annTitle">Title</label>
                <input type="text" id="annTitle" required value="${announcement ? announcement.title : ''}">
            </div>
            <div class="form-group">
                <label for="annContent">Content</label>
                <textarea id="annContent" required>${announcement ? announcement.content : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="annPriority">Priority</label>
                <select id="annPriority">
                    <option value="normal" ${announcement && announcement.priority === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="important" ${announcement && announcement.priority === 'important' ? 'selected' : ''}>Important</option>
                </select>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="btn btn-primary">${announcement ? 'Update' : 'Create'}</button>
                <button type="button" class="btn btn-secondary" onclick="window.appModule.closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    window.appModule.showModal(content);
    
    const form = document.getElementById('announcementForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveAnnouncement(announcementId);
    });
}

function saveAnnouncement(announcementId) {
    const title = document.getElementById('annTitle').value.trim();
    const content = document.getElementById('annContent').value.trim();
    const priority = document.getElementById('annPriority').value;
    const user = window.authModule.getCurrentUser();
    
    if (!title || !content) {
        alert('Please fill in all fields');
        return;
    }
    
    if (announcementId) {
        window.db.update('announcements', announcementId, {
            title,
            content,
            priority,
            author: user.name
        });
    } else {
        window.db.create('announcements', {
            title,
            content,
            priority,
            author: user.name
        });
        
        // Create notification
        window.db.create('notifications', {
            title: 'New Announcement',
            message: `${title} - ${content.substring(0, 50)}...`,
            type: 'announcement'
        });
    }
    
    window.appModule.closeModal();
    loadAnnouncements();
    if (window.appModule.loadDashboard) {
        window.appModule.loadDashboard();
    }
}

function editAnnouncement(id) {
    showAnnouncementModal(id);
}

function deleteAnnouncement(id) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        window.db.delete('announcements', id);
        loadAnnouncements();
        if (window.appModule.loadDashboard) {
            window.appModule.loadDashboard();
        }
    }
}

// Make functions available globally
window.announcementsModule = {
    loadAnnouncements,
    showAnnouncementModal,
    editAnnouncement,
    deleteAnnouncement
};

