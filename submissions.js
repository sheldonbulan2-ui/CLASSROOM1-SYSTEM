// Submissions Module

function loadSubmissions() {
    const submissions = window.db.getAll('submissions');
    const activities = window.db.getAll('activities');
    const user = window.authModule.getCurrentUser();
    const isAdmin = window.authModule.hasRole('admin');
    const isClassRep = window.authModule.hasRole('classrep');
    
    const container = document.getElementById('submissions-list');
    
    // Filter submissions based on role
    let filteredSubmissions = submissions;
    if (user.role === 'student') {
        filteredSubmissions = submissions.filter(s => s.studentId === user.username);
    }
    
    if (filteredSubmissions.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><p>No submissions yet</p></div>';
        return;
    }
    
    // Group by activity
    const grouped = {};
    filteredSubmissions.forEach(sub => {
        if (!grouped[sub.activityId]) {
            grouped[sub.activityId] = [];
        }
        grouped[sub.activityId].push(sub);
    });
    
    container.innerHTML = Object.keys(grouped).map(activityId => {
        const activity = activities.find(a => a.id === activityId);
        const activitySubmissions = grouped[activityId];
        
        return `
            <div class="card" style="margin-bottom: 30px;">
                <h3 style="margin-bottom: 15px; color: var(--primary-color);">
                    ${activity ? activity.title : 'Unknown Activity'}
                </h3>
                <p style="color: #666; margin-bottom: 20px;">
                    ${activity ? `Subject: ${activity.subject} • Due: ${window.appModule.formatDate(activity.dueDate)}` : ''}
                </p>
                ${activitySubmissions.map(sub => `
                    <div class="submission-item">
                        <div>
                            <div style="font-weight: 600; margin-bottom: 5px;">
                                ${isAdmin || isClassRep ? sub.studentName : 'Your Submission'}
                            </div>
                            <div style="font-size: 12px; color: #666;">
                                File: ${sub.fileName} (${formatFileSize(sub.fileSize)}) • 
                                Submitted: ${window.appModule.formatDate(sub.submittedAt)}
                            </div>
                            ${sub.notes ? `<p style="margin-top: 5px; color: #666;">${sub.notes}</p>` : ''}
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <span class="status-badge status-${sub.status}">${sub.status}</span>
                            <button class="btn btn-small btn-primary" onclick="window.submissionsModule.downloadSubmission('${sub.id}')">Download</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }).join('');
}

function downloadSubmission(id) {
    const submission = window.db.getById('submissions', id);
    if (!submission) return;
    
    // In production, download from Firebase Storage
    // For demo, create download link from data URL
    const link = document.createElement('a');
    link.href = submission.fileData;
    link.download = submission.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Make functions available globally
window.submissionsModule = {
    loadSubmissions,
    downloadSubmission
};

