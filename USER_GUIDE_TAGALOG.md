# Gabay sa Paggamit - Smart Classroom System

## 🔧 Mga Naayos

### 1. Login Issue - NA-AYOS NA ✅
- Na-fix na ang problema sa pag-access sa dashboard
- Gumagana na ang login system
- Pwede na mag-login gamit ang test accounts

### 2. User Management - NADAGDAG NA ✅
- Pwede na mag-create ng bagong users (Admin/Teacher lang)
- Pwede mag-edit ng user info
- Pwede mag-delete ng users (except sa sariling account)

## 📝 Paano Gamitin

### Pag-login:
1. Buksan ang `index.html` sa browser
2. Gamitin ang test accounts:
   - **Admin**: username: `admin`, password: `admin123`
   - **Class Rep**: username: `rep`, password: `rep123`
   - **Student**: username: `student`, password: `student123`

### Pag-create ng Bagong User (Admin/Teacher lang):
1. Mag-login bilang Admin
2. Pumunta sa "Users" sa navigation menu
3. Click ang "+ Create User" button
4. Fill-up ang form:
   - **Username**: unique username (walang spaces)
   - **Full Name**: buong pangalan
   - **Password**: minimum 6 characters
   - **Role**: piliin kung Admin, Class Rep, o Student
5. Click "Create User"

### Pag-edit ng User:
1. Sa Users page, click ang "Edit" button sa user na gusto i-edit
2. Baguhin ang name, password (optional), o role
3. Click "Update User"

### Pag-delete ng User:
1. Sa Users page, click ang "Delete" button
2. Confirm ang deletion
3. **Note**: Hindi pwedeng i-delete ang sariling account

## 👥 User Roles

### Admin (Teacher)
- Full access sa lahat
- Pwede mag-create, edit, delete ng lahat
- Pwede mag-manage ng users
- Pwede mag-view ng lahat ng submissions at feedback

### Class Representative
- Pwede mag-create ng announcements, activities, materials
- Pwede mag-edit ng schedule
- Pwede mag-create ng polls
- **Hindi** pwedeng mag-delete
- **Hindi** pwedeng mag-manage ng users

### Student
- Pwede lang mag-view at mag-submit
- Pwede mag-download ng materials
- Pwede mag-submit ng activities
- Pwede gumamit ng AI Assistant
- Pwede mag-vote sa polls
- Pwede mag-submit ng feedback

## 🎯 Mga Features

1. **Dashboard** - Overview ng lahat
2. **Announcements** - Mga announcements
3. **Activities** - Mga assignments at deadlines
4. **Materials** - Learning materials (upload/download)
5. **Schedule** - Class schedule
6. **AI Assistant** - Study helper
7. **Submissions** - Activity submissions
8. **Polls** - Voting system
9. **Feedback** - Anonymous feedback
10. **Users** - User management (Admin only)

## ⚠️ Important Notes

- Ang data ay naka-save sa browser (localStorage)
- Kapag nag-clear ng browser data, mawawala ang lahat
- Ang User Management ay para lang sa Admin
- Hindi pwedeng i-delete ang sariling account
- Username ay dapat unique

## 🐛 Troubleshooting

**Hindi makapasok sa dashboard?**
- Check kung tama ang username at password
- Try i-clear ang browser cache
- Check ang browser console (F12) para sa errors

**Hindi makita ang "Users" menu?**
- Dapat naka-login bilang Admin
- Refresh ang page

**Hindi makapag-create ng user?**
- Dapat Admin ang role
- Check kung unique ang username
- Password dapat minimum 6 characters

---

**Ready na gamitin!** 🎉

