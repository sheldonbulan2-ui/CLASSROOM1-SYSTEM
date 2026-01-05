// Main Application Module
// Note: Using script tags in HTML instead of ES6 imports for better compatibility

function initializeApp() {
    // Wait for auth module to be available
    if (typeof window.authModule === 'undefined') {
        setTimeout(initializeApp, 100);
        return;
    }
    
    // Check authentication
    if (!window.authModule.isAuthenticated()) {
        // Small delay to ensure redirect works
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 100);
        return;
    }
    
    // Set user info
    const user = window.authModule.getCurrentUser();
    if (document.getElementById('userName')) {
        document.getElementById('userName').textContent = user.name;
    }
    if (document.getElementById('userRole')) {
        document.getElementById('userRole').textContent = user.role.toUpperCase();
    }
    
    // Show/hide buttons based on role
    // Only Admin, Teacher, and Class Rep can see edit/add buttons
    // Students can only view
    const canManage = window.authModule.canManage();
    const isAdmin = window.authModule.hasRole('admin');
    const isTeacher = user.role === 'teacher';
    const isClassRep = user.role === 'classrep';
    
    // Show buttons only for Admin, Teacher, and Class Rep
    document.querySelectorAll('[id$="Btn"]').forEach(btn => {
        if (btn.id.includes('new') || btn.id.includes('upload') || btn.id.includes('edit')) {
            btn.style.display = canManage ? 'inline-block' : 'none';
        }
    });
    
    // Add info message for students
    if (user.role === 'student') {
        const studentInfo = document.createElement('div');
        studentInfo.style.cssText = 'background: #e8f4f8; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid var(--primary-color);';
        studentInfo.innerHTML = '<p style="margin: 0; color: #2c3e50;"><strong>ℹ️ Student View:</strong> You can view all content. Only teachers and administrators can edit or add new items.</p>';
        
        // Add to activities, materials, and schedule pages
        ['activities-page', 'materials-page', 'schedule-page'].forEach(pageId => {
            const page = document.getElementById(pageId);
            if (page) {
                const header = page.querySelector('.page-header');
                if (header && !page.querySelector('.student-info-message')) {
                    const infoClone = studentInfo.cloneNode(true);
                    infoClone.className = 'student-info-message';
                    header.insertAdjacentElement('afterend', infoClone);
                }
            }
        });
    }
    
    // Show feedback list only for admin
    if (isAdmin && document.getElementById('feedback-list')) {
        document.getElementById('feedback-list').style.display = 'block';
        if (document.getElementById('feedback-form-container')) {
            document.getElementById('feedback-form-container').style.display = 'none';
        }
    }
    
    // Show User Management link only for admin
    if (isAdmin && document.getElementById('usersNavLink')) {
        document.getElementById('usersNavLink').style.display = 'inline-block';
    }
    if (isAdmin && document.getElementById('newUserBtn')) {
        document.getElementById('newUserBtn').style.display = 'inline-block';
    }
    
    // Show Students Info link for admin and teachers
    const isTeacher = user.role === 'teacher' || user.role === 'classrep';
    if ((isAdmin || isTeacher) && document.getElementById('studentsNavLink')) {
        document.getElementById('studentsNavLink').style.display = 'inline-block';
    }
    
    // Show Pending Approvals link for admin and teachers
    if ((isAdmin || isTeacher) && document.getElementById('approvalsNavLink')) {
        document.getElementById('approvalsNavLink').style.display = 'inline-block';
        
        // Check for pending approvals and show badge
        const users = window.userManagementModule ? window.userManagementModule.getAllUsers() : {};
        const pendingCount = Object.values(users).filter(u => u.role === 'student' && u.status === 'pending').length;
        if (pendingCount > 0) {
            const approvalsLink = document.getElementById('approvalsNavLink');
            approvalsLink.innerHTML = `Pending Approvals <span style="background: var(--danger-color); color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 5px;">${pendingCount}</span>`;
        }
    }
    
    // Navigation
    setupNavigation();
    
    // Event listeners
    setupEventListeners();
    
    // Load initial page
    loadPage('dashboard');
    loadDashboard();
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            loadPage(page);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            document.querySelector('.nav-menu').classList.toggle('active');
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.authModule.logout();
        });
    }
}

function setupEventListeners() {
    // Announcements
    const newAnnouncementBtn = document.getElementById('newAnnouncementBtn');
    if (newAnnouncementBtn) {
        newAnnouncementBtn.addEventListener('click', () => {
            if (window.announcementsModule) window.announcementsModule.showAnnouncementModal();
        });
    }
    
    // Activities
    const newActivityBtn = document.getElementById('newActivityBtn');
    if (newActivityBtn) {
        newActivityBtn.addEventListener('click', () => {
            if (window.activitiesModule) window.activitiesModule.showActivityModal();
        });
    }
    
    // Materials
    const uploadMaterialBtn = document.getElementById('uploadMaterialBtn');
    if (uploadMaterialBtn) {
        uploadMaterialBtn.addEventListener('click', () => {
            if (window.materialsModule) window.materialsModule.showMaterialModal();
        });
    }
    
    // Schedule
    const editScheduleBtn = document.getElementById('editScheduleBtn');
    if (editScheduleBtn) {
        editScheduleBtn.addEventListener('click', () => {
            if (window.scheduleModule) window.scheduleModule.showScheduleModal();
        });
    }
    
    // AI Assistant
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiInput = document.getElementById('aiInput');
    if (aiSendBtn && aiInput) {
        aiSendBtn.addEventListener('click', () => {
            if (window.aiAssistantModule) window.aiAssistantModule.sendAIMessage();
        });
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && window.aiAssistantModule) {
                window.aiAssistantModule.sendAIMessage();
            }
        });
    }
    
    const aiUploadBtn = document.getElementById('aiUploadBtn');
    if (aiUploadBtn) {
        aiUploadBtn.addEventListener('click', () => {
            document.getElementById('aiFileInput').click();
        });
    }
    
    // Polls
    const newPollBtn = document.getElementById('newPollBtn');
    if (newPollBtn) {
        newPollBtn.addEventListener('click', () => {
            if (window.pollsModule) window.pollsModule.showPollModal();
        });
    }
    
    // User Management
    const newUserBtn = document.getElementById('newUserBtn');
    if (newUserBtn) {
        newUserBtn.addEventListener('click', () => {
            if (window.userManagementModule) window.userManagementModule.showCreateUserModal();
        });
    }
    
    // Modal close
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
}

function loadPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const page = document.getElementById(`${pageName}-page`);
    if (page) {
        page.classList.add('active');
        
        // Load page-specific content
        switch(pageName) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'announcements':
                if (window.announcementsModule) window.announcementsModule.loadAnnouncements();
                break;
            case 'activities':
                if (window.activitiesModule) window.activitiesModule.loadActivities();
                break;
            case 'materials':
                if (window.materialsModule) window.materialsModule.loadMaterials();
                break;
            case 'schedule':
                if (window.scheduleModule) window.scheduleModule.loadSchedule();
                break;
            case 'ai-assistant':
                if (window.aiAssistantModule) window.aiAssistantModule.loadAIAssistant();
                break;
            case 'submissions':
                if (window.submissionsModule) window.submissionsModule.loadSubmissions();
                break;
            case 'polls':
                if (window.pollsModule) window.pollsModule.loadPolls();
                break;
            case 'feedback':
                if (window.feedbackModule) window.feedbackModule.loadFeedback();
                break;
            case 'users':
                if (window.userManagementModule) window.userManagementModule.loadUserManagement();
                break;
            case 'students':
                if (window.studentsInfoModule) window.studentsInfoModule.loadStudentsInfo();
                break;
            case 'approvals':
                if (window.approvalsModule) window.approvalsModule.loadPendingApprovals();
                break;
        }
    }
}

// Dashboard
function loadDashboard() {
    const user = window.authModule.getCurrentUser();
    if (user && document.getElementById('dashboardGreeting')) {
        const greeting = document.getElementById('dashboardGreeting');
        const timeOfDay = new Date().getHours();
        let timeGreeting = 'Good day';
        if (timeOfDay < 12) timeGreeting = 'Good morning';
        else if (timeOfDay < 18) timeGreeting = 'Good afternoon';
        else timeGreeting = 'Good evening';
        
        greeting.textContent = `${timeGreeting}, ${user.name}! Here's what's happening in your classroom.`;
    }
    
    loadDashboardStats();
    loadDashboardQuickActions();
    loadDashboardAnnouncements();
    loadDashboardDeadlines();
    loadDashboardProgress();
    loadDashboardNotifications();
    loadDashboardRecentActivity();
}

function loadDashboardQuickActions() {
    const user = window.authModule.getCurrentUser();
    const canManage = window.authModule.canManage();
    
    if (!canManage) return; // Only show for teachers/admin
    
    const quickActions = document.getElementById('dashboard-quick-actions');
    if (!quickActions) {
        // Create quick actions section if it doesn't exist
        const dashboardPage = document.getElementById('dashboard-page');
        const dashboardGrid = dashboardPage.querySelector('.dashboard-grid');
        if (dashboardGrid) {
            const quickActionsDiv = document.createElement('div');
            quickActionsDiv.id = 'dashboard-quick-actions';
            quickActionsDiv.className = 'dashboard-card';
            quickActionsDiv.style.gridColumn = '1 / -1';
            quickActionsDiv.style.marginBottom = '20px';
            dashboardGrid.insertBefore(quickActionsDiv, dashboardGrid.firstChild);
        } else {
            return;
        }
    }
    
    const container = document.getElementById('dashboard-quick-actions');
    if (container) {
        container.innerHTML = `
            <h3>⚡ Quick Actions</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                <button class="btn btn-primary" onclick="window.appModule.loadPage('announcements'); setTimeout(() => document.getElementById('newAnnouncementBtn')?.click(), 100);" style="padding: 15px;">
                    📢 New Announcement
                </button>
                <button class="btn btn-primary" onclick="window.appModule.loadPage('activities'); setTimeout(() => document.getElementById('newActivityBtn')?.click(), 100);" style="padding: 15px;">
                    📅 New Activity
                </button>
                <button class="btn btn-primary" onclick="window.appModule.loadPage('materials'); setTimeout(() => document.getElementById('uploadMaterialBtn')?.click(), 100);" style="padding: 15px;">
                    📂 Upload Material
                </button>
                <button class="btn btn-secondary" onclick="window.appModule.loadPage('schedule'); setTimeout(() => window.scheduleModule.showScheduleModal(), 100);" style="padding: 15px;">
                    🗓️ Edit Schedule
                </button>
            </div>
        `;
    }
}

function loadDashboardRecentActivity() {
    const container = document.getElementById('dashboard-recent-activity');
    if (!container) {
        // Add recent activity section to dashboard
        const dashboardPage = document.getElementById('dashboard-page');
        const dashboardGrid = dashboardPage.querySelector('.dashboard-grid');
        if (dashboardGrid) {
            const recentDiv = document.createElement('div');
            recentDiv.id = 'dashboard-recent-activity';
            recentDiv.className = 'dashboard-card';
            recentDiv.style.gridColumn = '1 / -1';
            dashboardGrid.appendChild(recentDiv);
        } else {
            return;
        }
    }
    
    const activities = window.db.getAll('activities');
    const submissions = window.db.getAll('submissions');
    const announcements = window.db.getAll('announcements');
    
    // Get recent submissions
    const recentSubmissions = submissions
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 5);
    
    // Get recent announcements
    const recentAnnouncements = announcements
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
    
    const container = document.getElementById('dashboard-recent-activity');
    if (container) {
        container.innerHTML = `
            <h3>📊 Recent Activity</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 15px;">
                <div>
                    <h4 style="margin-bottom: 10px; color: var(--primary-color);">Recent Submissions</h4>
                    ${recentSubmissions.length > 0 ? recentSubmissions.map(sub => `
                        <div style="padding: 10px; background: var(--light-color); border-radius: 6px; margin-bottom: 8px;">
                            <div style="font-weight: 600;">${sub.activityTitle}</div>
                            <div style="font-size: 12px; color: #666;">
                                ${sub.studentName} • ${window.appModule.formatDate(sub.submittedAt)}
                            </div>
                        </div>
                    `).join('') : '<p style="color: #666;">No recent submissions</p>'}
                </div>
                <div>
                    <h4 style="margin-bottom: 10px; color: var(--primary-color);">Latest Announcements</h4>
                    ${recentAnnouncements.length > 0 ? recentAnnouncements.map(ann => `
                        <div style="padding: 10px; background: var(--light-color); border-radius: 6px; margin-bottom: 8px;">
                            <div style="font-weight: 600;">${ann.title}</div>
                            <div style="font-size: 12px; color: #666;">
                                ${window.appModule.formatDate(ann.createdAt)}
                            </div>
                        </div>
                    `).join('') : '<p style="color: #666;">No recent announcements</p>'}
                </div>
            </div>
        `;
    }
}

function loadDashboardStats() {
    const statsContainer = document.getElementById('dashboardStats');
    if (!statsContainer) return;
    
    const announcements = window.db.getAll('announcements');
    const activities = window.db.getAll('activities');
    const materials = window.db.getAll('materials');
    const studentsInfo = JSON.parse(localStorage.getItem('students_info') || '[]');
    
    statsContainer.innerHTML = `
        <div style="text-align: center; padding: 15px 20px; background: white; border-radius: 8px; box-shadow: var(--shadow);">
            <div style="font-size: 24px; font-weight: bold; color: var(--primary-color);">${announcements.length}</div>
            <div style="font-size: 12px; color: #666;">Announcements</div>
        </div>
        <div style="text-align: center; padding: 15px 20px; background: white; border-radius: 8px; box-shadow: var(--shadow);">
            <div style="font-size: 24px; font-weight: bold; color: var(--secondary-color);">${activities.length}</div>
            <div style="font-size: 12px; color: #666;">Activities</div>
        </div>
        <div style="text-align: center; padding: 15px 20px; background: white; border-radius: 8px; box-shadow: var(--shadow);">
            <div style="font-size: 24px; font-weight: bold; color: var(--warning-color);">${studentsInfo.length}</div>
            <div style="font-size: 12px; color: #666;">Students</div>
        </div>
    `;
}

function loadDashboardAnnouncements() {
    const announcements = window.db.getAll('announcements');
    const recent = announcements.slice(-3).reverse();
    const container = document.getElementById('dashboard-announcements');
    
    if (recent.length === 0) {
        container.innerHTML = '<p class="empty-state">No announcements yet</p>';
        return;
    }
    
    container.innerHTML = recent.map(ann => `
        <div class="card">
            <div class="card-header">
                <div>
                    <div class="card-title">${ann.title}</div>
                    <div class="card-meta">${formatDate(ann.createdAt)}</div>
                </div>
                <span class="priority-tag priority-${ann.priority}">${ann.priority}</span>
            </div>
            <p>${ann.content.substring(0, 100)}${ann.content.length > 100 ? '...' : ''}</p>
        </div>
    `).join('');
}

function loadDashboardDeadlines() {
    const activities = window.db.getAll('activities');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcoming = activities
        .filter(act => {
            const dueDate = new Date(act.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate >= today;
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);
    
    const container = document.getElementById('dashboard-deadlines');
    
    if (upcoming.length === 0) {
        container.innerHTML = '<p class="empty-state">No upcoming deadlines</p>';
        return;
    }
    
    container.innerHTML = upcoming.map(act => {
        const status = getActivityStatus(act.dueDate);
        return `
            <div class="card">
                <div class="card-title">${act.title}</div>
                <div class="card-meta">${act.subject} • Due: ${formatDate(act.dueDate)}</div>
                <span class="status-badge status-${status}">${status.replace('_', ' ')}</span>
            </div>
        `;
    }).join('');
}

function loadDashboardProgress() {
    const activities = window.db.getAll('activities');
    const submissions = window.db.getAll('submissions');
    const user = window.authModule.getCurrentUser();
    
    const userSubmissions = submissions.filter(s => s.studentId === user.username);
    const completed = userSubmissions.filter(s => s.status === 'submitted').length;
    
    const container = document.getElementById('dashboard-progress');
    if (container) {
        container.innerHTML = `
            <div style="font-size: 32px; font-weight: bold; color: var(--primary-color); margin-bottom: 10px;">
                ${completed} / ${activities.length}
            </div>
            <p>Activities Completed</p>
            <div style="margin-top: 20px;">
                <p><strong>Total Activities:</strong> ${activities.length}</p>
                <p><strong>Your Submissions:</strong> ${userSubmissions.length}</p>
            </div>
        `;
    }
}

function loadDashboardNotifications() {
    const notifications = window.db.getAll('notifications');
    const recent = notifications.slice(-5).reverse();
    const container = document.getElementById('dashboard-notifications');
    
    if (recent.length === 0) {
        container.innerHTML = '<p class="empty-state">No notifications</p>';
        return;
    }
    
    container.innerHTML = recent.map(notif => `
        <div class="card">
            <div class="card-title">${notif.title}</div>
            <div class="card-meta">${formatDate(notif.createdAt)}</div>
            <p>${notif.message}</p>
        </div>
    `).join('');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getActivityStatus(dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    if (due < today) return 'overdue';
    if (due.getTime() === today.getTime()) return 'due_today';
    return 'upcoming';
}

function showModal(content) {
    const modal = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = content;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// Make functions available globally
window.appModule = {
    loadPage,
    showModal,
    closeModal,
    formatDate,
    getActivityStatus,
    loadDashboard
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

