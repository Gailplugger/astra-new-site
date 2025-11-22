# 🔐 Custom Admin Panel - NO Netlify Identity

## ✅ What This Is

A **fully custom admin panel** for managing your blog with:
- ✅ Simple username/password login (NO Netlify Identity)
- ✅ GitHub API for storage (posts + images)
- ✅ Clean, modern dashboard
- ✅ Markdown editor with toolbar
- ✅ Image upload to GitHub
- ✅ Dark/Light theme toggle
- ✅ 100% client-side (no backend needed)

## 📁 Files Created

```
/admin/
├── index.html          # Custom login page
├── dashboard.html      # Main dashboard with post management
├── new-post.html       # Create new post editor
├── edit-post.html      # Edit existing post editor
├── style.css           # Complete admin panel styling
├── auth.js             # Authentication system
├── github-api.js       # GitHub API integration
├── editor.js           # Markdown editor functionality
├── POST-TEMPLATE.md    # Example markdown post template
└── README-ADMIN.md     # This file
```

## 🚀 Setup Instructions

### Step 1: Update GitHub Token

Your GitHub token is already configured! It's stored in `localStorage`:

```javascript
// Already configured from GITHUB-TOKEN-CONFIG.md
localStorage.setItem('github_token', 'github_pat_11BNBIZZI0...');
localStorage.setItem('github_username', 'Gailplugger');
localStorage.setItem('github_repo', 'astra-new-site');
```

### Step 2: Access Admin Panel

1. **Navigate to**: `https://your-site.netlify.app/admin/`
2. **Login with**:
   - Username: `kartikgoyal`
   - Password: `K7RTK@2580`

### Step 3: Configure GitHub (First Time Only)

After login, you'll see a GitHub configuration form:
1. Enter your GitHub token (from GITHUB-TOKEN-CONFIG.md)
2. Enter username: `Gailplugger`
3. Enter repo: `astra-new-site`
4. Click "Save Configuration"

### Step 4: Create Your First Post

1. Click "➕ New Post" in sidebar
2. Fill in:
   - **Title**: Auto-generates URL slug
   - **Date**: Select publication date
   - **Description**: SEO meta description
   - **Tags**: Comma-separated (e.g., `forensics, tutorial, cybersecurity`)
   - **Cover Image**: Upload or paste URL
   - **Content**: Write in Markdown
3. Use toolbar for formatting
4. Click "📤 Publish Post"

## 🔑 Default Credentials

**IMPORTANT**: Change these for production!

Edit `admin/auth.js` lines 8-9:

```javascript
const ADMIN_USERNAME = "kartikgoyal";  // Change this
const ADMIN_PASSWORD = "K7RTK@2580";   // Change this
```

## 📝 How It Works

### Authentication
- Credentials stored in `auth.js` (client-side)
- Session saved in `localStorage` (24-hour expiry)
- No backend authentication required

### Post Storage
Posts are stored in `/posts/` as Markdown files with YAML frontmatter:

```yaml
---
title: "My Post Title"
date: "2024-11-22"
description: "Post description"
tags: "tag1, tag2, tag3"
cover_image: "/uploads/image.jpg"
---

Post content in Markdown...
```

### Image Upload
Images uploaded to `/uploads/` folder in your GitHub repo:
- Max size: 5MB
- Formats: JPG, PNG, GIF
- Automatic naming: `timestamp-filename.jpg`

### GitHub API
All operations use GitHub REST API v3:
- **Create**: `PUT /repos/{owner}/{repo}/contents/posts/{slug}.md`
- **Update**: `PUT` with SHA to prevent conflicts
- **Delete**: `DELETE` with SHA
- **Upload**: `PUT /repos/{owner}/{repo}/contents/uploads/{filename}`

## 🎨 Features

### Dashboard
- Total posts count
- Images count
- Last post date
- Total tags count
- Post list with edit/delete actions

### Post Editor
- Markdown toolbar (Bold, Italic, Heading, Link, Image, Code, List, Preview)
- Auto-save drafts (every 30 seconds)
- Slug auto-generation from title
- Cover image upload with preview
- Live markdown preview

### Theme Toggle
- Light mode (default)
- Dark mode
- Preference saved in localStorage

## 🐛 Troubleshooting

### "Invalid username or password"
- Check credentials in `admin/auth.js`
- Make sure you're using the correct username/password

### "Failed to load posts"
- Verify GitHub token is valid
- Check token hasn't expired
- Ensure username/repo are correct
- Check browser console for detailed errors

### "Failed to publish post"
- Verify GitHub token has `repo` scope
- Check internet connection
- Look for GitHub API rate limits (60/hour unauthenticated)
- Ensure `/posts/` folder exists in repo

### Images not uploading
- File must be < 5MB
- Check GitHub token permissions
- Verify `/uploads/` folder exists
- Ensure file is JPG, PNG, or GIF

### Session expired
- Sessions last 24 hours
- Re-login if expired
- Clear localStorage to reset: `localStorage.clear()`

## 🔒 Security Notes

### Current Setup
- Credentials stored in JavaScript (visible in source code)
- Token stored in localStorage (client-side only)
- NO server-side authentication
- Suitable for personal/small team use

### For Production
Consider these improvements:
1. **Backend Authentication**
   - Use proper authentication service
   - Implement OAuth/JWT tokens
   - Add rate limiting

2. **Token Security**
   - Use environment variables
   - Rotate tokens regularly
   - Set expiration dates
   - Enable 2FA on GitHub

3. **Access Control**
   - IP whitelisting
   - Multiple user roles
   - Audit logging

## 📚 Markdown Guide

See `POST-TEMPLATE.md` for a complete example with:
- Headings
- Bold/Italic text
- Lists (ordered & unordered)
- Links
- Images
- Code blocks
- Blockquotes
- Tables

## 🎯 Next Steps

1. ✅ Login to admin panel
2. ✅ Configure GitHub settings
3. ✅ Create first post
4. ✅ Change default credentials
5. ✅ Add more posts
6. ✅ Customize styling (style.css)
7. ✅ Deploy to Netlify

## 💡 Tips

- **Draft Saving**: Write freely - drafts auto-save every 30 seconds
- **Slug Preview**: Watch slug update as you type title
- **Image Upload**: Drag & drop images directly
- **Markdown Preview**: Click 👁️ to preview rendered content
- **Theme Toggle**: Try dark mode with 🌙 button

## 🚀 Deployment

### Netlify
1. Push all files to GitHub
2. Connect Netlify to your repo
3. Deploy settings:
   - Build command: (empty)
   - Publish directory: `/`
4. Access admin at: `https://your-site.netlify.app/admin/`

### GitHub Pages
1. Enable GitHub Pages in repo settings
2. Choose `main` branch
3. Access admin at: `https://username.github.io/repo/admin/`

## 📞 Support

Questions? Issues?
- Email: info@astraforensics.in
- Phone: +91 96431 07978

---

**✅ Your custom admin panel is ready to use!**

**🔥 NO Netlify Identity • NO Git Gateway • 100% Custom**
