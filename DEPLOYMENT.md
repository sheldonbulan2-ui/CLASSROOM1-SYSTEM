# Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: GitHub Pages (Recommended for Free Hosting)

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it (e.g., `smart-classroom-system`)

2. **Upload Files**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to Pages section
   - Select `main` branch and `/` (root) folder
   - Click Save

4. **Access Your Site**
   - Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
   - Wait a few minutes for the first deployment

### Option 2: Netlify (Easiest)

1. **Go to Netlify**
   - Visit [Netlify Drop](https://app.netlify.com/drop)

2. **Drag and Drop**
   - Simply drag your entire project folder to the Netlify Drop zone
   - Your site will be live instantly!

3. **Custom Domain (Optional)**
   - Go to Site settings > Domain management
   - Add your custom domain

### Option 3: Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Project**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Public directory: `.` (current directory)
   - Single-page app: `No`
   - Overwrite index.html: `No`

4. **Deploy**
   ```bash
   firebase deploy
   ```

5. **Access Your Site**
   - Your site URL will be shown after deployment
   - Format: `https://YOUR_PROJECT_ID.web.app`

### Option 4: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow Prompts**
   - Answer the setup questions
   - Your site will be deployed automatically

## 📋 Pre-Deployment Checklist

- [ ] Test all features locally
- [ ] Verify all user roles work correctly
- [ ] Test file uploads/downloads
- [ ] Check mobile responsiveness
- [ ] Verify all navigation links
- [ ] Test AI assistant functionality
- [ ] Clear any test data if needed
- [ ] Update API keys (if using real services)

## 🔧 Post-Deployment Configuration

### Update API Keys (If Needed)

1. **OpenAI API (for AI Assistant)**
   - Edit `js/config.js`
   - Replace `YOUR_OPENAI_API_KEY` with your actual key
   - Note: Keep API keys secure, don't commit them to public repos

2. **Firebase (if upgrading from localStorage)**
   - Create Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Get your config from Project Settings
   - Update `js/config.js` with your Firebase config

## 🌐 Custom Domain Setup

### For GitHub Pages:
1. Add `CNAME` file to repository root
2. Add your domain name in the file
3. Configure DNS records as per GitHub instructions

### For Netlify:
1. Go to Site settings > Domain management
2. Add custom domain
3. Follow DNS configuration instructions

### For Firebase:
1. Go to Hosting > Add custom domain
2. Follow verification steps
3. Configure DNS records

## 🔒 Security Considerations

1. **API Keys**
   - Never commit API keys to public repositories
   - Use environment variables for sensitive data
   - Consider using server-side proxy for API calls

2. **Authentication**
   - Current system uses localStorage (client-side only)
   - For production, implement server-side authentication
   - Use HTTPS for all deployments

3. **File Uploads**
   - Implement file size limits
   - Validate file types
   - Scan for malware (in production)

## 📊 Monitoring & Analytics

### Add Google Analytics (Optional)

Add to `index.html` and `dashboard.html` before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🐛 Troubleshooting

### Site Not Loading
- Check if all files are uploaded correctly
- Verify index.html is in the root directory
- Check browser console for errors

### Features Not Working
- Ensure JavaScript is enabled
- Check browser compatibility
- Verify all JS files are loading

### File Upload Issues
- Check file size limits
- Verify browser supports FileReader API
- Check browser console for errors

## 📱 Testing After Deployment

1. **Test Login**
   - Try all three test accounts
   - Verify role-based access

2. **Test Features**
   - Create announcements
   - Add activities
   - Upload materials
   - Test AI assistant
   - Create polls
   - Submit feedback

3. **Test Mobile**
   - Open on mobile device
   - Test navigation
   - Verify responsive design

## 🔄 Updates & Maintenance

### Updating the Site

1. **Make Changes Locally**
2. **Test Changes**
3. **Commit and Push** (for Git-based hosting)
4. **Deploy** (automatic for some platforms)

### Backup

- Regularly backup your data
- Export localStorage data if needed
- Keep backups of configuration files

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all files are present
3. Test in different browsers
4. Check hosting platform status

---

**Your site is ready to use!** 🎉

