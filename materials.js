// Learning Materials Module

function loadMaterials() {
    const materials = window.db.getAll('materials');
    const container = document.getElementById('materials-list');
    const canManage = window.authModule.canManage();
    
    if (materials.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📂</div><p>No materials uploaded yet</p></div>';
        return;
    }
    
    // Group by subject
    const grouped = {};
    materials.forEach(mat => {
        if (!grouped[mat.subject]) grouped[mat.subject] = [];
        grouped[mat.subject].push(mat);
    });
    
    container.innerHTML = Object.keys(grouped).map(subject => `
        <div style="margin-bottom: 30px;">
            <h3 style="color: var(--primary-color); margin-bottom: 15px; border-bottom: 2px solid var(--light-color); padding-bottom: 10px;">
                ${subject}
            </h3>
            ${grouped[subject].map(mat => `
                <div class="material-item">
                    <div class="material-info">
                        <h4>${mat.title}</h4>
                        <div class="material-meta">
                            ${mat.category ? `${mat.category} • ` : ''}
                            ${window.appModule.formatDate(mat.createdAt)} • 
                            ${formatFileSize(mat.fileSize)}
                        </div>
                        ${mat.description ? `<p style="margin-top: 5px; color: #666;">${mat.description}</p>` : ''}
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button class="btn btn-small btn-primary" onclick="window.materialsModule.downloadMaterial('${mat.id}')">📥 Download</button>
                        ${canManage ? `
                            <button class="btn btn-small btn-secondary" onclick="window.materialsModule.editMaterial('${mat.id}')">✏️ Edit</button>
                            <button class="btn btn-small btn-danger" onclick="window.materialsModule.deleteMaterial('${mat.id}')">🗑️ Delete</button>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function showMaterialModal() {
    // Security check - only Admin, Teacher, and Class Rep can upload materials
    if (!window.authModule.canManage()) {
        alert('❌ Access Denied: Only administrators, teachers, and class representatives can upload materials.');
        return;
    }
    
    const content = `
        <h2>Upload Learning Material</h2>
        <form id="materialForm">
            <div class="form-group">
                <label for="matTitle">Title</label>
                <input type="text" id="matTitle" required>
            </div>
            <div class="form-group">
                <label for="matSubject">Subject</label>
                <input type="text" id="matSubject" required>
            </div>
            <div class="form-group">
                <label for="matCategory">Category/Week (optional)</label>
                <input type="text" id="matCategory" placeholder="e.g., Week 1, Chapter 5">
            </div>
            <div class="form-group">
                <label for="matDescription">Description (optional)</label>
                <textarea id="matDescription"></textarea>
            </div>
            <div class="form-group">
                <label for="matFile">File</label>
                <input type="file" id="matFile" required accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png">
                <small>Accepted: PDF, PPT, DOC, Images</small>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="btn btn-primary">Upload</button>
                <button type="button" class="btn btn-secondary" onclick="window.appModule.closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    window.appModule.showModal(content);
    
    const form = document.getElementById('materialForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        uploadMaterial();
    });
}

function uploadMaterial() {
    const title = document.getElementById('matTitle').value.trim();
    const subject = document.getElementById('matSubject').value.trim();
    const category = document.getElementById('matCategory').value.trim();
    const description = document.getElementById('matDescription').value.trim();
    const fileInput = document.getElementById('matFile');
    const file = fileInput.files[0];
    const user = window.authModule.getCurrentUser();
    
    if (!title || !subject || !file) {
        alert('Please fill in all required fields');
        return;
    }
    
    // In production, upload to Firebase Storage
    // For demo, we'll store file info
    const reader = new FileReader();
    reader.onload = (e) => {
        window.db.create('materials', {
            title,
            subject,
            category,
            description,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            fileData: e.target.result, // In production, this would be a URL
            uploadedBy: user.name
        });
        
        window.appModule.closeModal();
        alert('Material uploaded successfully!');
        loadMaterials();
        
        // Create notification
        window.db.create('notifications', {
            title: 'New Learning Material',
            message: `${title} for ${subject} has been uploaded`,
            type: 'material'
        });
    };
    reader.readAsDataURL(file);
}

function editMaterial(id) {
    // Security check
    if (!window.authModule.canManage()) {
        alert('❌ Access Denied: Only administrators, teachers, and class representatives can edit materials.');
        return;
    }
    
    const material = window.db.getById('materials', id);
    if (!material) return;
    
    const content = `
        <h2>Edit Learning Material</h2>
        <form id="editMaterialForm">
            <div class="form-group">
                <label for="editMatTitle">Title</label>
                <input type="text" id="editMatTitle" required value="${material.title}">
            </div>
            <div class="form-group">
                <label for="editMatSubject">Subject</label>
                <input type="text" id="editMatSubject" required value="${material.subject}">
            </div>
            <div class="form-group">
                <label for="editMatCategory">Category/Week (optional)</label>
                <input type="text" id="editMatCategory" placeholder="e.g., Week 1, Chapter 5" value="${material.category || ''}">
            </div>
            <div class="form-group">
                <label for="editMatDescription">Description (optional)</label>
                <textarea id="editMatDescription">${material.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Current File</label>
                <p style="padding: 10px; background: var(--light-color); border-radius: 6px;">
                    ${material.fileName} (${formatFileSize(material.fileSize)})
                </p>
                <small style="color: #666;">To change the file, delete this material and upload a new one.</small>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="btn btn-primary">Update Material</button>
                <button type="button" class="btn btn-secondary" onclick="window.appModule.closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    window.appModule.showModal(content);
    
    const form = document.getElementById('editMaterialForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateMaterial(id);
    });
}

function updateMaterial(id) {
    // Security check
    if (!window.authModule.canManage()) {
        alert('❌ Access Denied: Only administrators, teachers, and class representatives can update materials.');
        return;
    }
    
    const title = document.getElementById('editMatTitle').value.trim();
    const subject = document.getElementById('editMatSubject').value.trim();
    const category = document.getElementById('editMatCategory').value.trim();
    const description = document.getElementById('editMatDescription').value.trim();
    
    if (!title || !subject) {
        alert('❌ Error: Please fill in all required fields (Title, Subject)');
        return;
    }
    
    window.db.update('materials', id, {
        title,
        subject,
        category,
        description
    });
    
    window.appModule.closeModal();
    alert('✅ Material updated successfully!');
    loadMaterials();
}

function downloadMaterial(id) {
    const material = window.db.getById('materials', id);
    if (!material) return;
    
    // In production, download from Firebase Storage
    // For demo, create download link from data URL
    const link = document.createElement('a');
    link.href = material.fileData;
    link.download = material.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function deleteMaterial(id) {
    // Security check
    if (!window.authModule.canManage()) {
        alert('❌ Access Denied: Only administrators, teachers, and class representatives can delete materials.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
        window.db.delete('materials', id);
        loadMaterials();
        alert('✅ Material deleted successfully!');
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Make functions available globally
window.materialsModule = {
    loadMaterials,
    showMaterialModal,
    uploadMaterial,
    editMaterial,
    updateMaterial,
    downloadMaterial,
    deleteMaterial
};

