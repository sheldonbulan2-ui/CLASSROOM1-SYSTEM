// Students Information Module for Teachers/Admin

function loadStudentsInfo() {
    const studentsInfo = JSON.parse(localStorage.getItem('students_info') || '[]');
    const container = document.getElementById('students-info-list');
    const user = window.authModule.getCurrentUser();
    const isAdmin = window.authModule.hasRole('admin');
    const isTeacher = window.authModule.hasRole('teacher') || window.authModule.hasRole('classrep');
    
    if (!isAdmin && !isTeacher) {
        container.innerHTML = '<div class="empty-state"><p>Access denied. Only teachers and administrators can view student information.</p></div>';
        return;
    }
    
    if (studentsInfo.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👥</div><p>No student information available yet</p></div>';
        return;
    }
    
    // Sort by name
    const sorted = studentsInfo.sort((a, b) => a.name.localeCompare(b.name));
    
    // Group by section
    const groupedBySection = {};
    sorted.forEach(student => {
        const section = student.section || 'No Section';
        if (!groupedBySection[section]) {
            groupedBySection[section] = [];
        }
        groupedBySection[section].push(student);
    });
    
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <p style="color: #666;">Total Students: <strong>${studentsInfo.length}</strong></p>
        </div>
        ${Object.keys(groupedBySection).sort().map(section => `
            <div class="card" style="margin-bottom: 30px;">
                <h3 style="color: var(--primary-color); margin-bottom: 20px; border-bottom: 2px solid var(--light-color); padding-bottom: 10px;">
                    📚 ${section} (${groupedBySection[section].length} students)
                </h3>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: var(--light-color);">
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--border-color);">Name</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--border-color);">Age</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--border-color);">Email</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--border-color);">Phone</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--border-color);">Address</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--border-color);">Registered</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${groupedBySection[section].map(student => `
                                <tr style="border-bottom: 1px solid var(--border-color);">
                                    <td style="padding: 12px; font-weight: 600;">${student.name}</td>
                                    <td style="padding: 12px;">${student.age || 'N/A'}</td>
                                    <td style="padding: 12px;">${student.email || 'N/A'}</td>
                                    <td style="padding: 12px;">${student.phone || 'N/A'}</td>
                                    <td style="padding: 12px;">${student.address || 'N/A'}</td>
                                    <td style="padding: 12px; font-size: 12px; color: #666;">
                                        ${student.registeredAt ? window.appModule.formatDate(student.registeredAt) : 'N/A'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `).join('')}
        
        <div class="card" style="margin-top: 30px;">
            <h3 style="margin-bottom: 15px;">Quick Stats</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div style="text-align: center; padding: 15px; background: var(--light-color); border-radius: 8px;">
                    <div style="font-size: 32px; font-weight: bold; color: var(--primary-color);">${studentsInfo.length}</div>
                    <div style="color: #666;">Total Students</div>
                </div>
                <div style="text-align: center; padding: 15px; background: var(--light-color); border-radius: 8px;">
                    <div style="font-size: 32px; font-weight: bold; color: var(--primary-color);">${Object.keys(groupedBySection).length}</div>
                    <div style="color: #666;">Sections</div>
                </div>
                <div style="text-align: center; padding: 15px; background: var(--light-color); border-radius: 8px;">
                    <div style="font-size: 32px; font-weight: bold; color: var(--primary-color);">
                        ${Math.round(studentsInfo.reduce((sum, s) => sum + (s.age || 0), 0) / studentsInfo.filter(s => s.age).length) || 'N/A'}
                    </div>
                    <div style="color: #666;">Average Age</div>
                </div>
            </div>
        </div>
    `;
}

// Make functions available globally
window.studentsInfoModule = {
    loadStudentsInfo
};


