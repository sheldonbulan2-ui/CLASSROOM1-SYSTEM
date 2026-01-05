// Schedule Module

function loadSchedule() {
    const schedule = window.db.getAll('schedule');
    const container = document.getElementById('schedule-view');
    const canManage = window.authModule.canManage();
    
    if (schedule.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🗓️</div><p>No schedule set yet</p></div>';
        return;
    }
    
    // Group by day
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const grouped = {};
    days.forEach(day => grouped[day] = []);
    
    schedule.forEach(item => {
        if (grouped[item.day]) {
            grouped[item.day].push(item);
        }
    });
    
    // Sort by time within each day
    Object.keys(grouped).forEach(day => {
        grouped[day].sort((a, b) => a.time.localeCompare(b.time));
    });
    
    container.innerHTML = `
        ${canManage ? `
            <div style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="window.scheduleModule.showScheduleModal()">
                    ✏️ Edit Schedule
                </button>
                <button class="btn btn-secondary" onclick="window.scheduleModule.showScheduleModal(); setTimeout(() => window.scheduleModule.addScheduleItem(), 100);">
                    ➕ Add New Subject
                </button>
            </div>
        ` : ''}
        <div class="schedule-table">
            <table>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Subject</th>
                        <th>Teacher</th>
                        ${canManage ? '<th>Actions</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${days.map(day => {
                        if (grouped[day].length === 0) return '';
                        return grouped[day].map(item => `
                            <tr>
                                <td><strong>${item.day}</strong></td>
                                <td>${item.time}</td>
                                <td><strong>${item.subject}</strong></td>
                                <td>${item.teacher}</td>
                                ${canManage ? `
                                    <td>
                                        <button class="btn btn-small btn-secondary" onclick="window.scheduleModule.editScheduleItem('${item.id}')" title="Edit">
                                            ✏️
                                        </button>
                                        <button class="btn btn-small btn-danger" onclick="window.scheduleModule.deleteScheduleItem('${item.id}')" title="Delete">
                                            🗑️
                                        </button>
                                    </td>
                                ` : ''}
                            </tr>
                        `).join('');
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function showScheduleModal() {
    // Security check - only Admin, Teacher, and Class Rep can edit
    if (!window.authModule.canManage()) {
        alert('❌ Access Denied: Only administrators, teachers, and class representatives can edit the schedule.');
        return;
    }
    
    const schedule = window.db.getAll('schedule');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    const content = `
        <h2>Edit Class Schedule</h2>
        <div id="schedule-edit-container">
            ${schedule.map(item => `
                <div class="card" style="margin-bottom: 15px;" data-id="${item.id}">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Day</label>
                            <select class="schedule-day">
                                ${days.map(d => `<option value="${d}" ${item.day === d ? 'selected' : ''}>${d}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Time</label>
                            <input type="time" class="schedule-time" value="${item.time}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Subject</label>
                            <input type="text" class="schedule-subject" value="${item.subject}">
                        </div>
                        <div class="form-group">
                            <label>Teacher</label>
                            <input type="text" class="schedule-teacher" value="${item.teacher}">
                        </div>
                    </div>
                    <button class="btn btn-small btn-danger" onclick="window.scheduleModule.removeScheduleItem('${item.id}')">Remove</button>
                </div>
            `).join('')}
            <button class="btn btn-secondary" onclick="window.scheduleModule.addScheduleItem()" style="margin-bottom: 15px;">+ Add Class</button>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-primary" onclick="window.scheduleModule.saveSchedule()">Save Schedule</button>
                <button class="btn btn-secondary" onclick="window.appModule.closeModal()">Cancel</button>
            </div>
        </div>
    `;
    
    window.appModule.showModal(content);
}

function addScheduleItem() {
    // Security check
    if (!window.authModule.canManage()) {
        alert('❌ Access Denied: Only administrators, teachers, and class representatives can add schedule items.');
        return;
    }
    
    const container = document.getElementById('schedule-edit-container');
    if (!container) return;
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const tempId = 'temp_' + Date.now();
    
    const newItem = document.createElement('div');
    newItem.className = 'card';
    newItem.style.marginBottom = '15px';
    newItem.setAttribute('data-id', tempId);
    newItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Day</label>
                <select class="schedule-day">
                    ${days.map(d => `<option value="${d}">${d}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Time</label>
                <input type="time" class="schedule-time" value="08:00">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Subject</label>
                <input type="text" class="schedule-subject" placeholder="Subject name">
            </div>
            <div class="form-group">
                <label>Teacher</label>
                <input type="text" class="schedule-teacher" placeholder="Teacher name">
            </div>
        </div>
        <button class="btn btn-small btn-danger" onclick="this.parentElement.remove()">Remove</button>
    `;
    
    const addButton = container.querySelector('button');
    container.insertBefore(newItem, addButton);
}

function removeScheduleItem(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) {
        item.remove();
    }
}

function editScheduleItem(id) {
    // Security check
    if (!window.authModule.canManage()) {
        alert('❌ Access Denied: Only administrators, teachers, and class representatives can edit schedule items.');
        return;
    }
    
    const item = window.db.getById('schedule', id);
    if (!item) return;
    
    showScheduleModal();
    // Scroll to the item in the modal
    setTimeout(() => {
        const editItem = document.querySelector(`[data-id="${id}"]`);
        if (editItem) {
            editItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            editItem.style.border = '2px solid var(--primary-color)';
            setTimeout(() => {
                editItem.style.border = '';
            }, 2000);
        }
    }, 100);
}

function deleteScheduleItem(id) {
    // Security check
    if (!window.authModule.canManage()) {
        alert('❌ Access Denied: Only administrators, teachers, and class representatives can delete schedule items.');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this schedule item?')) {
        return;
    }
    
    window.db.delete('schedule', id);
    loadSchedule();
    alert('Schedule item deleted successfully!');
}

function saveSchedule() {
    // Security check
    if (!window.authModule.canManage()) {
        alert('❌ Access Denied: Only administrators, teachers, and class representatives can save schedule changes.');
        return;
    }
    
    const container = document.getElementById('schedule-edit-container');
    if (!container) return;
    
    const items = container.querySelectorAll('[data-id]');
    const newSchedule = [];
    
    items.forEach(item => {
        const day = item.querySelector('.schedule-day').value;
        const time = item.querySelector('.schedule-time').value;
        const subject = item.querySelector('.schedule-subject').value.trim();
        const teacher = item.querySelector('.schedule-teacher').value.trim();
        const id = item.getAttribute('data-id');
        
        if (subject && teacher) {
            if (id.startsWith('temp_')) {
                // New item
                window.db.create('schedule', {
                    day,
                    time,
                    subject,
                    teacher
                });
            } else {
                // Update existing
                window.db.update('schedule', id, {
                    day,
                    time,
                    subject,
                    teacher
                });
            }
        }
    });
    
    // Remove deleted items (items that were in DB but not in form)
    const existingIds = Array.from(items).map(item => item.getAttribute('data-id')).filter(id => !id.startsWith('temp_'));
    const allSchedule = window.db.getAll('schedule');
    allSchedule.forEach(item => {
        if (!existingIds.includes(item.id)) {
            window.db.delete('schedule', item.id);
        }
    });
    
    window.appModule.closeModal();
    alert('Schedule updated successfully!');
    loadSchedule();
}

// Make functions available globally
window.scheduleModule = {
    loadSchedule,
    showScheduleModal,
    addScheduleItem,
    removeScheduleItem,
    editScheduleItem,
    deleteScheduleItem,
    saveSchedule
};

