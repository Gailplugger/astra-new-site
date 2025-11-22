# 🚀 Quick Setup Guide - Astra Forensics CMS

## Step-by-Step Setup Instructions

### 1️⃣ GitHub Token Setup (5 minutes)

1. **Go to GitHub Settings**
   - Click your profile picture (top-right) → Settings
   - Scroll down to "Developer settings" (bottom-left)
   - Click "Personal access tokens" → "Tokens (classic)"

2. **Generate New Token**
   - Clicke new token (classic)"
   - Note: `Astra Blog "Generat CMS`
   - Expiration: Choose "No expiration" or custom
   - Scopes: Check ✅ `repo` (this enables all repo permissions)
   - Scroll down and click "Generate token"

3. **Save Your Token**
   - ⚠️ **CRITICAL**: Copy the token NOW - you won't see it again!
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Store it somewhere safe (password manager recommended)

### 2️⃣ Admin Login (2 minutes)

1. **Open Admin Panel**
   - Navigate to: `https://your-site.netlify.app/cms-admin/login.html`
   - Or locally: `file:///path/to/cms-admin/login.html`

2. **Login with Default Credentials**
   ```
   Username: kartikgoyal
   Password: K7RTK@2580
   ```

3. **Change Credentials (Recommended)**
   - Open `cms-admin/login.html` in a text editor
   - Find lines 95-96:
   ```javascript
   const ADMIN_USERNAME = "kartikgoyal";
   const ADMIN_PASSWORD = "K7RTK@2580";
   ```
   - Change to your preferred credentials
   - Save and reload the page

### 3️⃣ Configure GitHub (3 minutes)

1. **First Login - Configuration Screen**
   - After logging in, you'll see the GitHub setup form
   
2. **Enter Your Details**
   - **GitHub Token**: Paste the token you generated
   - **GitHub Username**: Your GitHub username (e.g., `Gailplugger`)
   - **Repository Name**: Your repository name (e.g., `astra-new-site`)

3. **Save Configuration**
   - Click "💾 Save Configuration"
   - Page will reload automatically
   - Your dashboard will now show posts (if any exist)

### 4️⃣ Create Your First Post (5 minutes)

1. **Click "New Post"**
   - In the sidebar, click "➕ New Post"

2. **Fill in Post Details**
   ```
   Title: My First Post
   Date: [Today's date - auto-filled]
   Description: This is my first blog post on Astra Forensics
   Tags: getting-started, tutorial, test
   ```

3. **Add Content**
   - Write your post in Markdown in the content area
   - Use the toolbar for formatting:
     - **B** = Bold
     - *I* = Italic
     - **H** = Heading
     - 🔗 = Link
     - 🖼️ = Image
     - `<>` = Code block
     - • = List
     - 👁️ = Preview

4. **Optional: Add Cover Image**
   - Click the upload area or drag an image
   - Maximum 5MB
   - Image uploads automatically to `/uploads/` folder

5. **Publish**
   - Click "📤 Publish Post"
   - Wait for success message
   - Post is now live!

### 5️⃣ View Your Blog (1 minute)

1. **Navigate to Blog Page**
   - Go to: `https://your-site.netlify.app/blog.html`
   - You should see your new post in the grid

2. **Click on Your Post**
   - Opens the full article at `post.html?slug=my-first-post`
   - Markdown is rendered beautifully

3. **Test Search & Filters**
   - Use the search box to find posts
   - Click tag filters to filter by category

---

## ✅ Verification Checklist

- [ ] GitHub token generated and saved
- [ ] Logged into admin panel successfully
- [ ] GitHub configuration saved
- [ ] Created and published first post
- [ ] Post visible on public blog page
- [ ] Post opens correctly when clicked
- [ ] Search functionality works
- [ ] Tag filters work

---

## 🔧 Common Issues & Solutions

### ❌ "Failed to load posts"

**Cause**: GitHub configuration incorrect or token invalid

**Solution**:
1. Check token hasn't expired
2. Verify username and repo name are correct
3. Ensure token has `repo` scope
4. Check repository exists and is accessible

### ❌ "Failed to publish post"

**Cause**: GitHub API error or rate limit

**Solution**:
1. Check internet connection
2. Verify token is still valid
3. Ensure you haven't hit GitHub API rate limits (60/hour for unauthenticated)
4. Check browser console for detailed error

### ❌ Image upload fails

**Cause**: File too large or permissions issue

**Solution**:
1. Ensure image is under 5MB
2. Check token has write permissions
3. Verify `/uploads/` folder exists in repo
4. Try a different image format (JPG, PNG, GIF)

### ❌ Posts show in admin but not on blog.html

**Cause**: JavaScript not loading or config mismatch

**Solution**:
1. Open browser console (F12) and check for errors
2. Verify `js/blog-loader.js` is included in blog.html
3. Check repository name in blog-loader.js matches yours
4. Clear browser cache and reload

---

## 🎓 Next Steps

### Add More Posts
- Create 5-10 posts to populate your blog
- Use different tags to enable filtering
- Add cover images for visual appeal

### Customize Design
- Edit `cms-admin/assets/styles.css` for colors
- Modify `blog.html` and `post.html` layout
- Add your branding and logo

### SEO Optimization
- Add meta descriptions to all posts
- Use relevant tags
- Include internal links between posts
- Submit sitemap to Google Search Console

### Advanced Features
- Add comments system (Disqus, Utterances)
- Integrate analytics (Google Analytics, Plausible)
- Add related posts section
- Create post series/categories

---

## 📞 Need Help?

**Email**: info@astraforensics.in  
**Phone**: +91 96431 07978  
**Documentation**: See `CMS-README.md` for detailed info

---

**🎉 Congratulations! Your blog CMS is ready to use!**
