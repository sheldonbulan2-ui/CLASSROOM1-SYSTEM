// Feedback Module

function loadFeedback() {
    const user = window.authModule.getCurrentUser();
    const isAdmin = window.authModule.hasRole('admin');
    
    const feedbackContainer = document.getElementById('feedback-form-container');
    const feedbackList = document.getElementById('feedback-list');
    
    if (isAdmin) {
        // Admin sees all feedback
        if (feedbackContainer) feedbackContainer.style.display = 'none';
        if (feedbackList) {
            feedbackList.style.display = 'block';
            loadFeedbackList();
        }
    } else {
        // Students see feedback form
        if (feedbackContainer) {
            feedbackContainer.style.display = 'block';
            showFeedbackForm();
        }
        if (feedbackList) feedbackList.style.display = 'none';
    }
}

function showFeedbackForm() {
    const container = document.getElementById('feedback-form-container');
    
    container.innerHTML = `
        <div class="feedback-form">
            <h2>Class Feedback Box</h2>
            <p style="color: #666; margin-bottom: 20px;">
                Your feedback is anonymous. Share your suggestions, concerns, or ideas to help improve our classroom.
            </p>
            <form id="feedbackForm">
                <div class="form-group">
                    <label for="feedbackType">Type</label>
                    <select id="feedbackType" required>
                        <option value="">Select type...</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="concern">Concern</option>
                        <option value="compliment">Compliment</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="feedbackMessage">Message</label>
                    <textarea id="feedbackMessage" required placeholder="Share your thoughts..." rows="6"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Submit Feedback</button>
            </form>
        </div>
    `;
    
    const form = document.getElementById('feedbackForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitFeedback();
    });
}

function submitFeedback() {
    const type = document.getElementById('feedbackType').value;
    const message = document.getElementById('feedbackMessage').value.trim();
    
    if (!type || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    window.db.create('feedback', {
        type,
        message,
        // Anonymous - no user info stored
        submittedAt: new Date().toISOString()
    });
    
    document.getElementById('feedbackForm').reset();
    alert('Thank you for your feedback! It has been submitted anonymously.');
    
    // Create notification for admin
    window.db.create('notifications', {
        title: 'New Feedback Received',
        message: `New ${type} feedback has been submitted`,
        type: 'feedback'
    });
}

function loadFeedbackList() {
    const feedbacks = window.db.getAll('feedback');
    const container = document.getElementById('feedback-list');
    
    if (feedbacks.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💬</div><p>No feedback received yet</p></div>';
        return;
    }
    
    // Sort by date (newest first)
    const sorted = feedbacks.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    container.innerHTML = `
        <h2>All Feedback</h2>
        ${sorted.map(fb => `
            <div class="feedback-item">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <span class="priority-tag priority-${fb.type === 'concern' ? 'important' : 'normal'}">
                        ${fb.type}
                    </span>
                    <span style="font-size: 12px; color: #666;">
                        ${window.appModule.formatDate(fb.submittedAt)}
                    </span>
                </div>
                <p style="white-space: pre-wrap;">${fb.message}</p>
            </div>
        `).join('')}
    `;
}

// Make functions available globally
window.feedbackModule = {
    loadFeedback,
    showFeedbackForm,
    submitFeedback,
    loadFeedbackList
};

