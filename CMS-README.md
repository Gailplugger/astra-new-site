# Astra Forensics - Custom Blog CMS System

A complete, production-ready blog CMS with pure client-side authentication and GitHub API storage. No backend servers or paid services required!

## ✨ Features

### Admin Panel
- 🔐 **Pure Client-Side Authentication** - Simple username/password login (no Netlify Identity)
- 📝 **Full CRUD Operations** - Create, read, update, delete blog posts
- 🎨 **Markdown Editor** - Rich text toolbar with live preview
- 🖼️ **Image Upload** - Direct upload to GitHub with drag-and-drop
- 💾 **Auto-Save Drafts** - Never lose your work
- 📊 **Dashboard Statistics** - Total posts, images, tags, and more
- 🌓 **Dark/Light Mode** - Beautiful theme toggle
- 📱 **Fully Responsive** - Works on all devices

### Public Blog
- 🔍 **Search Functionality** - Search posts by title, description, tags
- 🏷️ **Tag Filtering** - Filter posts by category
- 📄 **Pagination** - Clean navigation through posts
- 📱 **Mobile Optimized** - Responsive design
- 🔗 **Social Sharing** - Share to Facebook, Twitter, LinkedIn, WhatsApp
- ⚡ **Fast Loading** - Optimized performance
- 🎯 **SEO Friendly** - Meta tags and structured data

## 📁 File Structure

```
/
├── cms-admin/                  # Admin panel
│   ├── login.html             # Login page
│   ├── dashboard.html         # Main dashboard
│   ├── new-post.html          # Post editor
│   └── assets/
│       ├── styles.css         # Complete styling (1000+ lines)
│       └── admin.js           # Admin functionality
│
├── posts/                     # Blog posts (Markdown)
│   └── *.md                   # Post files
│
├── js/                        # Public scripts
│   └── blog-loader.js         # Blog listing & single post logic
│
├── uploads/                   # Uploaded images
│
├── blog.html                  # Blog listing page
└── post.html                  # Single post page
```

## 🚀 Quick Start

### Step 1: Configure GitHub Access

1. **Generate a GitHub Personal Access Token**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a descriptive name: "Astra Blog CMS"
   - Select scopes:
     - ✅ `repo` (Full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

2. **Update Repository Settings**
   - Make sure your repository is public or the token has access
   - Repository: `Gailplugger/astra-new-site` (or your repo name)
   - Branch: `main`

### Step 2: Configure Admin Login

The admin credentials are stored in `cms-admin/login.html`:

```javascript
// Default credentials
const ADMIN_USERNAME = "kartikgoyal";
const ADMIN_PASSWORD = "K7RTK@2580";
```

**To change credentials:**
1. Open `cms-admin/login.html`
2. Find lines 95-96
3. Update username and password
4. Save and commit

### Step 3: First-Time Admin Setup

1. Open `cms-admin/login.html` in your browser
2. Login with credentials:
   - Username: `kartikgoyal`
   - Password: `K7RTK@2580`
3. On the dashboard, configure GitHub:
   - **GitHub Token**: Paste your personal access token
   - **GitHub Username**: Your GitHub username (e.g., `Gailplugger`)
   - **Repository Name**: Your repo name (e.g., `astra-new-site`)
4. Click "Save Configuration"
5. Page will reload with posts loaded

### Step 4: Create Your First Post

1. Click "➕ New Post" in the sidebar
2. Fill in the form:
   - **Title**: Auto-generates URL-friendly slug
   - **Date**: Publication date
   - **Description**: SEO meta description
   - **Tags**: Comma-separated (e.g., `cybersecurity, tutorial, forensics`)
   - **Cover Image**: Upload or paste URL
   - **Content**: Write in Markdown
3. Use toolbar for formatting:
   - **B** Bold, *I* Italic, **H** Heading
   - 🔗 Link, 🖼️ Image, `<>` Code
   - • List, 👁️ Preview
4. Click "📤 Publish Post"

## 📝 Markdown Syntax Guide

### Basic Formatting

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
***Bold and italic***

[Link text](https://example.com)
![Image alt text](image-url.jpg)
```

### Lists

```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Second item
3. Third item
```

### Code

````markdown
Inline `code` with backticks

```javascript
// Code block with syntax highlighting
function hello() {
  console.log("Hello, world!");
}
```
````

### Blockquotes

```markdown
> This is a blockquote
> It can span multiple lines
```

### Images

```markdown
![Description of image](/uploads/image-name.jpg)
```

## 🎨 Customization

### Change Color Scheme

Edit `cms-admin/assets/styles.css`:

```css
/* Light mode colors */
:root[data-theme="light"] {
  --primary-color: #667eea;      /* Main brand color */
  --primary-hover: #5568d3;
  --secondary-color: #764ba2;
}

/* Dark mode colors */
:root[data-theme="dark"] {
  --primary-color: #818cf8;
  --primary-hover: #6366f1;
}
```

### Change Admin Branding

Edit `cms-admin/login.html`, `dashboard.html`, `new-post.html`:

```html
<!-- Update logo and title -->
<div class="logo">Astra Forensics CMS</div>
```

### Modify Blog Layout

Edit `blog.html` and `post.html` to match your website design.

## 🔧 How It Works

### Authentication Flow

1. User enters credentials on `login.html`
2. JavaScript validates against hardcoded credentials
3. On success, stores session in `localStorage`:
   - `cms_auth`: "true"
   - `cms_user`: username
   - `cms_login_time`: timestamp
4. All admin pages check for valid session

### Post Storage

Posts are stored as Markdown files in `/posts/` folder:

```
/posts/
  ├── getting-started-with-digital-forensics.md
  ├── mobile-forensics-techniques.md
  └── incident-response-guide.md
```

Each file has YAML frontmatter:

```yaml
---
title: "Post Title"
date: "2024-01-15"
description: "SEO description"
tags: "tag1, tag2, tag3"
cover_image: "/uploads/image.jpg"
---

Markdown content here...
```

### GitHub API Integration

- **Create Post**: `PUT /repos/{owner}/{repo}/contents/posts/{slug}.md`
- **Update Post**: `PUT` with SHA (prevents conflicts)
- **Delete Post**: `DELETE` with SHA
- **Upload Image**: `PUT /repos/{owner}/{repo}/contents/uploads/{filename}`
- **List Posts**: `GET /repos/{owner}/{repo}/contents/posts`

All content is Base64 encoded when sent to GitHub.

### Public Blog Loading

1. `blog.html` loads all posts from GitHub
2. `js/blog-loader.js` fetches and parses frontmatter
3. Posts displayed in grid with pagination
4. Search and filter functionality
5. Click post → navigate to `post.html?slug=post-name`
6. Single post page fetches and renders Markdown

## 🔒 Security Notes

### Important Security Considerations

1. **GitHub Token Security**
   - Token is stored in `localStorage` (client-side only)
   - Never commit token to repository
   - Token grants full repository access
   - Rotate tokens regularly

2. **Admin Credentials**
   - Change default credentials immediately
   - Use strong passwords
   - Credentials are in client-side JavaScript (visible in source)
   - For production, consider:
     - Obscuring credentials with environment variables
     - Adding IP restrictions
     - Implementing proper backend authentication

3. **Repository Access**
   - Anyone with the token can modify your content
   - Keep your token private
   - Don't share admin login credentials

### Production Security Recommendations

For a production environment:
- Use a backend authentication service
- Implement OAuth or JWT tokens
- Add rate limiting
- Use environment variables for sensitive data
- Enable 2FA on GitHub account
- Monitor repository activity

## 🐛 Troubleshooting

### Posts Not Loading

**Problem**: Dashboard shows "Loading posts..." forever

**Solutions**:
1. Check GitHub configuration (token, username, repo)
2. Verify token has `repo` scope permissions
3. Check browser console for error messages
4. Ensure repository exists and is accessible
5. Check if `/posts/` folder exists in repository

### Cannot Publish Post

**Problem**: "Failed to publish" error message

**Solutions**:
1. Verify GitHub token is valid
2. Check token hasn't expired
3. Ensure you have write access to repository
4. Check internet connection
5. Look for GitHub API rate limits (60 requests/hour for unauthenticated)

### Images Not Uploading

**Problem**: Image upload fails

**Solutions**:
1. Check image file size (must be < 5MB)
2. Verify `/uploads/` folder exists
3. Check GitHub token permissions
4. Ensure image format is supported (JPG, PNG, GIF)

### Login Not Working

**Problem**: Cannot login to admin panel

**Solutions**:
1. Clear browser cache and localStorage
2. Check credentials in `cms-admin/login.html`
3. Open browser console for JavaScript errors
4. Try in incognito/private mode

### Posts Show on Dashboard but Not on Public Blog

**Problem**: Posts visible in admin but not on blog.html

**Solutions**:
1. Check if `js/blog-loader.js` is loaded correctly
2. Verify repository name in blog-loader.js matches
3. Check browser console for fetch errors
4. Ensure posts have proper YAML frontmatter
5. Check if repository is public or token is set

## 📚 Advanced Usage

### Bulk Import Posts

Create multiple `.md` files with frontmatter and upload them directly to `/posts/` folder via GitHub interface.

### Custom Post Types

Add new frontmatter fields:

```yaml
---
title: "Post Title"
author: "Kartik Goyal"
category: "Tutorial"
featured: true
---
```

Then update `admin.js` and `blog-loader.js` to handle these fields.

### Analytics Integration

Add Google Analytics or Plausible to track:
- Page views
- Popular posts
- User behavior

### Comments System

Integrate a comments system:
- **Disqus** - Easy setup, third-party hosted
- **Utterances** - GitHub Issues-based (free)
- **Giscus** - GitHub Discussions-based (free)

## 🚀 Deployment

### Deploy to Netlify

1. Push code to GitHub
2. Login to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Build settings:
   - Build command: (leave empty - static site)
   - Publish directory: `/`
6. Deploy!

Your site will be live at `https://your-site.netlify.app`

### Custom Domain

1. In Netlify: Domain settings → Add custom domain
2. In DNS provider: Add Netlify's DNS records
3. Enable HTTPS (automatic)

## 📞 Support

For issues or questions:
- **Email**: info@astraforensics.in
- **Phone**: +91 96431 07978
- **GitHub Issues**: Open an issue on the repository

## 📄 License

© 2024 Astra Forensics. All Rights Reserved.

---

**Built with ❤️ by Astra Forensics Team**

*Making digital forensics accessible to everyone.*
