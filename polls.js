// Polls & Voting Module

function loadPolls() {
    const polls = window.db.getAll('polls');
    const container = document.getElementById('polls-list');
    const user = window.authModule.getCurrentUser();
    const canManage = window.authModule.canManage();
    
    if (polls.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🗳️</div><p>No polls yet</p></div>';
        return;
    }
    
    // Sort by date (newest first)
    const sorted = polls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    container.innerHTML = sorted.map(poll => {
        const userVote = poll.votes ? poll.votes.find(v => v.userId === user.username) : null;
        const showResults = userVote || canManage || poll.showResults;
        
        // Calculate results
        const results = {};
        poll.options.forEach(opt => results[opt] = 0);
        if (poll.votes) {
            poll.votes.forEach(vote => {
                if (results[vote.option] !== undefined) {
                    results[vote.option]++;
                }
            });
        }
        const totalVotes = poll.votes ? poll.votes.length : 0;
        
        return `
            <div class="poll-item">
                <div class="poll-question">${poll.question}</div>
                <div class="card-meta" style="margin-bottom: 20px;">
                    Created: ${window.appModule.formatDate(poll.createdAt)} • 
                    ${totalVotes} vote${totalVotes !== 1 ? 's' : ''}
                </div>
                
                ${!showResults ? `
                    <div id="poll-options-${poll.id}">
                        ${poll.options.map((option, index) => `
                            <div class="poll-option" onclick="window.pollsModule.votePoll('${poll.id}', ${index})">
                                ${option}
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="poll-results">
                        ${poll.options.map((option, index) => {
                            const votes = results[option] || 0;
                            const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0;
                            const isUserVote = userVote && userVote.option === option;
                            
                            return `
                                <div style="margin-bottom: 15px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                        <span>${option} ${isUserVote ? '✓ (Your vote)' : ''}</span>
                                        <span><strong>${votes}</strong> (${percentage}%)</span>
                                    </div>
                                    <div class="poll-bar">
                                        <div class="poll-bar-fill" style="width: ${percentage}%;">
                                            ${percentage > 10 ? `${percentage}%` : ''}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
                
                ${canManage ? `
                    <div style="margin-top: 20px; display: flex; gap: 10px;">
                        <button class="btn btn-small btn-secondary" onclick="window.pollsModule.togglePollResults('${poll.id}')">
                            ${poll.showResults ? 'Hide Results' : 'Show Results'}
                        </button>
                        <button class="btn btn-small btn-danger" onclick="window.pollsModule.deletePoll('${poll.id}')">Delete</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function showPollModal() {
    const content = `
        <h2>Create New Poll</h2>
        <form id="pollForm">
            <div class="form-group">
                <label for="pollQuestion">Question</label>
                <input type="text" id="pollQuestion" required placeholder="What would you like to ask?">
            </div>
            <div class="form-group">
                <label>Options</label>
                <div id="pollOptions">
                    <input type="text" class="poll-option-input" placeholder="Option 1" required>
                    <input type="text" class="poll-option-input" placeholder="Option 2" required>
                </div>
                <button type="button" class="btn btn-small btn-secondary" onclick="window.pollsModule.addPollOption()" style="margin-top: 10px;">+ Add Option</button>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="btn btn-primary">Create Poll</button>
                <button type="button" class="btn btn-secondary" onclick="window.appModule.closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    window.appModule.showModal(content);
    
    const form = document.getElementById('pollForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        savePoll();
    });
}

window.pollsModule.addPollOption = function() {
    const container = document.getElementById('pollOptions');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'poll-option-input';
    input.placeholder = `Option ${container.children.length + 1}`;
    input.required = true;
    container.appendChild(input);
};

function savePoll() {
    const question = document.getElementById('pollQuestion').value.trim();
    const optionInputs = document.querySelectorAll('.poll-option-input');
    const options = Array.from(optionInputs)
        .map(input => input.value.trim())
        .filter(opt => opt.length > 0);
    
    if (!question || options.length < 2) {
        alert('Please provide a question and at least 2 options');
        return;
    }
    
    const user = window.authModule.getCurrentUser();
    
    window.db.create('polls', {
        question,
        options,
        votes: [],
        showResults: false,
        createdBy: user.name
    });
    
    window.appModule.closeModal();
    alert('Poll created successfully!');
    loadPolls();
    
    // Create notification
    window.db.create('notifications', {
        title: 'New Poll',
        message: `${question}`,
        type: 'poll'
    });
}

function votePoll(pollId, optionIndex) {
    const poll = window.db.getById('polls', pollId);
    if (!poll) return;
    
    const user = window.authModule.getCurrentUser();
    
    // Check if user already voted
    if (poll.votes && poll.votes.find(v => v.userId === user.username)) {
        alert('You have already voted on this poll');
        return;
    }
    
    const selectedOption = poll.options[optionIndex];
    
    // Add vote
    if (!poll.votes) poll.votes = [];
    poll.votes.push({
        userId: user.username,
        userName: user.name,
        option: selectedOption,
        votedAt: new Date().toISOString()
    });
    
    window.db.update('polls', pollId, {
        votes: poll.votes
    });
    
    alert('Thank you for voting!');
    loadPolls();
}

function togglePollResults(pollId) {
    const poll = window.db.getById('polls', pollId);
    if (!poll) return;
    
    window.db.update('polls', pollId, {
        showResults: !poll.showResults
    });
    
    loadPolls();
}

function deletePoll(pollId) {
    if (confirm('Are you sure you want to delete this poll?')) {
        window.db.delete('polls', pollId);
        loadPolls();
    }
}

// Make functions available globally
window.pollsModule = {
    loadPolls,
    showPollModal,
    addPollOption,
    votePoll,
    togglePollResults,
    deletePoll
};

