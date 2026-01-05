// Database Module - Using localStorage as fallback (replace with Firebase in production)

const DB_PREFIX = 'smart_classroom_';

function getStorageKey(collection) {
    return `${DB_PREFIX}${collection}`;
}

// Generic CRUD operations
const db = {
    // Create
    create(collection, data) {
        const items = this.getAll(collection);
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newItem = {
            id,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        localStorage.setItem(getStorageKey(collection), JSON.stringify(items));
        return newItem;
    },
    
    // Read all
    getAll(collection) {
        const data = localStorage.getItem(getStorageKey(collection));
        return data ? JSON.parse(data) : [];
    },
    
    // Read one
    getById(collection, id) {
        const items = this.getAll(collection);
        return items.find(item => item.id === id);
    },
    
    // Update
    update(collection, id, updates) {
        const items = this.getAll(collection);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = {
                ...items[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(getStorageKey(collection), JSON.stringify(items));
            return items[index];
        }
        return null;
    },
    
    // Delete
    delete(collection, id) {
        const items = this.getAll(collection);
        const filtered = items.filter(item => item.id !== id);
        localStorage.setItem(getStorageKey(collection), JSON.stringify(filtered));
        return true;
    },
    
    // Query
    query(collection, predicate) {
        const items = this.getAll(collection);
        return items.filter(predicate);
    }
};

// Initialize default data
function initializeDefaultData() {
    // Initialize collections if empty
    const collections = ['announcements', 'activities', 'materials', 'schedule', 'submissions', 'polls', 'feedback', 'notifications'];
    
    collections.forEach(collection => {
        if (!localStorage.getItem(getStorageKey(collection))) {
            localStorage.setItem(getStorageKey(collection), JSON.stringify([]));
        }
    });
    
    // Add sample schedule if empty
    const schedule = db.getAll('schedule');
    if (schedule.length === 0) {
        const defaultSchedule = [
            { id: '1', day: 'Monday', time: '8:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith' },
            { id: '2', day: 'Monday', time: '9:00 AM', subject: 'Science', teacher: 'Ms. Johnson' },
            { id: '3', day: 'Monday', time: '10:00 AM', subject: 'English', teacher: 'Mr. Brown' },
            { id: '4', day: 'Tuesday', time: '8:00 AM', subject: 'History', teacher: 'Ms. Davis' },
            { id: '5', day: 'Tuesday', time: '9:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith' },
            { id: '6', day: 'Wednesday', time: '8:00 AM', subject: 'Science', teacher: 'Ms. Johnson' },
            { id: '7', day: 'Wednesday', time: '9:00 AM', subject: 'English', teacher: 'Mr. Brown' },
            { id: '8', day: 'Thursday', time: '8:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith' },
            { id: '9', day: 'Thursday', time: '9:00 AM', subject: 'History', teacher: 'Ms. Davis' },
            { id: '10', day: 'Friday', time: '8:00 AM', subject: 'Science', teacher: 'Ms. Johnson' }
        ];
        localStorage.setItem(getStorageKey('schedule'), JSON.stringify(defaultSchedule));
    }
}

// Initialize on load
if (typeof window !== 'undefined') {
    initializeDefaultData();
}

// Export
if (typeof window !== 'undefined') {
    window.db = db;
}

