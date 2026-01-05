// Firebase Configuration
// Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDemoKeyReplaceWithYourOwn",
    authDomain: "smart-classroom-demo.firebaseapp.com",
    projectId: "smart-classroom-demo",
    storageBucket: "smart-classroom-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

// Initialize Firebase (will be initialized in app.js)
// For demo purposes, we'll use localStorage as fallback

// API Configuration
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"; // Replace with your OpenAI API key

// App Configuration
const APP_CONFIG = {
    classroomId: "default-classroom",
    roles: {
        ADMIN: "admin",
        CLASS_REP: "classrep",
        STUDENT: "student"
    },
    priorities: {
        NORMAL: "normal",
        IMPORTANT: "important"
    },
    activityStatus: {
        UPCOMING: "upcoming",
        DUE_TODAY: "due_today",
        OVERDUE: "overdue"
    },
    submissionStatus: {
        SUBMITTED: "submitted",
        LATE: "late",
        MISSING: "missing"
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, OPENAI_API_KEY, APP_CONFIG };
}

