# Test Accounts

## 🔐 Default Test Accounts

The system comes with three pre-configured test accounts for different user roles:

### 👨‍🏫 Admin (Teacher)
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Administrator
- **Permissions:**
  - Full system access
  - Create, edit, delete all content
  - View all submissions
  - View all feedback
  - Manage schedule
  - Create polls
  - Upload materials

### 👨‍🎓 Class Representative
- **Username:** `rep`
- **Password:** `rep123`
- **Role:** Class Representative
- **Permissions:**
  - Create announcements
  - Create activities
  - Upload materials
  - Edit schedule
  - Create polls
  - View submissions
  - Cannot delete content (limited management)

### 👨‍🎓 Student
- **Username:** `student`
- **Password:** `student123`
- **Role:** Student
- **Permissions:**
  - View announcements
  - View activities
  - Submit activities
  - Download materials
  - View schedule
  - Use AI assistant
  - Vote on polls
  - Submit feedback
  - View own submissions

## 🔄 Adding New Users

### Method 1: Through Code

Edit `js/auth.js` and add to `DEFAULT_USERS`:

```javascript
const DEFAULT_USERS = {
    // ... existing users
    'newuser': {
        username: 'newuser',
        password: 'password123',
        role: 'student', // or 'admin' or 'classrep'
        name: 'New User Name'
    }
};
```

### Method 2: Through Browser Console

1. Open browser console (F12)
2. Run:
```javascript
const users = JSON.parse(localStorage.getItem('smart_classroom_users') || '{}');
users['newuser'] = {
    username: 'newuser',
    password: 'password123',
    role: 'student',
    name: 'New User'
};
localStorage.setItem('smart_classroom_users', JSON.stringify(users));
```

## 🔒 Security Notes

⚠️ **Important:** These are default test accounts. For production:

1. **Change Default Passwords**
   - Update all default passwords
   - Use strong, unique passwords

2. **Implement Proper Authentication**
   - Use server-side authentication
   - Hash passwords (never store plain text)
   - Implement password reset functionality

3. **User Management**
   - Add user registration (if needed)
   - Implement password recovery
   - Add email verification

4. **Session Management**
   - Implement secure session tokens
   - Add session timeout
   - Implement logout on all devices

## 📝 Role Permissions Summary

| Feature | Admin | Class Rep | Student |
|---------|-------|-----------|---------|
| View Announcements | ✅ | ✅ | ✅ |
| Create Announcements | ✅ | ✅ | ❌ |
| Edit/Delete Announcements | ✅ | ❌ | ❌ |
| View Activities | ✅ | ✅ | ✅ |
| Create Activities | ✅ | ✅ | ❌ |
| Edit/Delete Activities | ✅ | ❌ | ❌ |
| Submit Activities | ✅ | ✅ | ✅ |
| View All Submissions | ✅ | ✅ | ❌ |
| Upload Materials | ✅ | ✅ | ❌ |
| Download Materials | ✅ | ✅ | ✅ |
| Edit Schedule | ✅ | ✅ | ❌ |
| Use AI Assistant | ✅ | ✅ | ✅ |
| Create Polls | ✅ | ✅ | ❌ |
| Vote on Polls | ✅ | ✅ | ✅ |
| View Poll Results | ✅ | ✅ | ✅ |
| Submit Feedback | ✅ | ✅ | ✅ |
| View All Feedback | ✅ | ❌ | ❌ |

## 🧪 Testing Checklist

Use these accounts to test:

- [ ] Admin can access all features
- [ ] Class Rep can create content but not delete
- [ ] Student can only view and submit
- [ ] Login works for all roles
- [ ] Logout works correctly
- [ ] Session persists on page refresh
- [ ] Unauthorized access is blocked

---

**Remember:** Change these passwords before deploying to production!

