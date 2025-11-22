# 📋 Blog CMS Setup Checklist

Use this checklist to track your setup progress!

---

## Phase 1: Initial Setup ⚙️

### GitHub Token Generation
- [ ] Logged into GitHub account
- [ ] Navigated to Settings → Developer settings
- [ ] Created Personal Access Token (classic)
- [ ] Selected `repo` scope permission
- [ ] Copied token and saved securely
- [ ] Token format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Admin Access
- [ ] Opened `cms-admin/login.html` in browser
- [ ] Logged in with default credentials
- [ ] Successfully accessed dashboard

### GitHub Configuration
- [ ] Entered GitHub token in config form
- [ ] Entered GitHub username: `Gailplugger`
- [ ] Entered repository name: `astra-new-site`
- [ ] Clicked "Save Configuration"
- [ ] Page reloaded successfully
- [ ] Dashboard shows empty posts or example posts

---

## Phase 2: Customization 🎨

### Security Updates
- [ ] Changed admin username in `login.html`
- [ ] Changed admin password in `login.html`
- [ ] Tested new credentials work
- [ ] Documented new credentials securely

### Branding
- [ ] Updated logo/title in admin pages
- [ ] Changed primary color in `styles.css`
- [ ] Updated footer information
- [ ] Tested dark/light mode toggle

### Blog Configuration
- [ ] Updated `js/blog-loader.js` with correct repo details
- [ ] Verified blog.html loads correctly
- [ ] Checked post.html renders properly

---

## Phase 3: Content Creation 📝

### First Post
- [ ] Clicked "New Post" in admin
- [ ] Entered title (auto-slug generated)
- [ ] Added publication date
- [ ] Written meta description
- [ ] Added relevant tags
- [ ] Uploaded/added cover image
- [ ] Written content in Markdown
- [ ] Used formatting toolbar
- [ ] Previewed post
- [ ] Successfully published

### Additional Posts
- [ ] Created 2nd post
- [ ] Created 3rd post
- [ ] Created 4th post
- [ ] Created 5th post
- [ ] Used different tags across posts
- [ ] Added cover images to all posts

---

## Phase 4: Testing 🧪

### Admin Panel Testing
- [ ] Dashboard loads correctly
- [ ] Statistics show accurate numbers
- [ ] Post list displays all posts
- [ ] Edit button works for each post
- [ ] Delete button works (tested on draft)
- [ ] Theme toggle works (light/dark)
- [ ] Mobile menu works on small screens
- [ ] Logout button works

### Post Editor Testing
- [ ] Title input generates correct slug
- [ ] Date picker works
- [ ] Tags input accepts comma-separated values
- [ ] Image upload works (< 5MB)
- [ ] Image preview displays
- [ ] Remove image button works
- [ ] All toolbar buttons work:
  - [ ] Bold
  - [ ] Italic
  - [ ] Heading
  - [ ] Link
  - [ ] Image
  - [ ] Code
  - [ ] List
  - [ ] Preview
- [ ] Draft auto-save works (wait 30s)
- [ ] Publish button works
- [ ] Update button works (when editing)

### Public Blog Testing
- [ ] blog.html loads all posts
- [ ] Post cards display correctly
- [ ] Cover images load
- [ ] Search box works
- [ ] Tag filters work
- [ ] "All" filter resets correctly
- [ ] Pagination appears (if > 9 posts)
- [ ] Pagination navigation works
- [ ] Clicking post opens post.html correctly

### Single Post Testing
- [ ] Post title displays
- [ ] Cover image displays as hero
- [ ] Date and read time show
- [ ] Tags display correctly
- [ ] Markdown renders properly:
  - [ ] Headings
  - [ ] Bold/italic
  - [ ] Links
  - [ ] Images
  - [ ] Code blocks
  - [ ] Lists
  - [ ] Blockquotes
- [ ] Share buttons have correct URLs
- [ ] Back to blog link works

### Mobile Testing
- [ ] Admin login works on mobile
- [ ] Dashboard responsive on mobile
- [ ] Mobile menu opens/closes
- [ ] Post editor usable on mobile
- [ ] blog.html responsive
- [ ] post.html responsive
- [ ] All buttons clickable on mobile

---

## Phase 5: Deployment 🚀

### Repository Preparation
- [ ] All files committed to GitHub
- [ ] Repository is public or token has access
- [ ] /posts/ folder exists with example posts
- [ ] /uploads/ folder exists (or will be created)
- [ ] README files included

### Netlify Deployment
- [ ] Created Netlify account
- [ ] Connected GitHub repository
- [ ] Configured build settings (none needed)
- [ ] First deploy successful
- [ ] Site URL noted: `https://__________.netlify.app`

### Post-Deployment Testing
- [ ] Visited live site
- [ ] Homepage loads correctly
- [ ] Admin panel accessible
- [ ] Logged in successfully
- [ ] Created post from live site
- [ ] Post appears on blog.html
- [ ] Post opens on post.html
- [ ] Search works
- [ ] Filters work
- [ ] Mobile version tested

### Custom Domain (Optional)
- [ ] Added custom domain in Netlify
- [ ] Updated DNS records
- [ ] HTTPS certificate issued
- [ ] Site accessible via custom domain

---

## Phase 6: Optimization 📈

### SEO
- [ ] All posts have meta descriptions
- [ ] Posts use relevant tags
- [ ] Images have alt text
- [ ] URLs are clean (slug-based)
- [ ] Sitemap created (optional)
- [ ] Submitted to Google Search Console

### Performance
- [ ] Images optimized (< 500KB each)
- [ ] No console errors
- [ ] Fast loading times
- [ ] Tested on different browsers:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

### Content Strategy
- [ ] Decided on posting frequency
- [ ] Created content calendar
- [ ] Planned post topics
- [ ] Consistent tag structure
- [ ] Brand voice established

---

## Phase 7: Enhancements (Optional) ⭐

### Comments System
- [ ] Chose comments provider (Disqus/Utterances)
- [ ] Integrated into post.html
- [ ] Tested comments work

### Analytics
- [ ] Set up Google Analytics / Plausible
- [ ] Added tracking code
- [ ] Verified tracking works
- [ ] Set up goals/events

### Social Media
- [ ] Shared first post on social media
- [ ] Added social preview images
- [ ] Set up auto-posting (if desired)

### Additional Features
- [ ] Added related posts section
- [ ] Created post categories/series
- [ ] Added newsletter signup
- [ ] Implemented RSS feed

---

## Ongoing Maintenance 🔧

### Weekly Tasks
- [ ] Write new blog post
- [ ] Respond to comments (if enabled)
- [ ] Check analytics
- [ ] Share posts on social media

### Monthly Tasks
- [ ] Review post performance
- [ ] Update old posts if needed
- [ ] Check for broken links
- [ ] Backup repository

### Quarterly Tasks
- [ ] Rotate GitHub token
- [ ] Review and update documentation
- [ ] Audit site speed
- [ ] Plan content strategy

---

## Troubleshooting Completed ✅

If you encountered and solved issues, document them here:

### Issue 1:
**Problem:** ___________________________________________
**Solution:** __________________________________________
**Date:** _____________

### Issue 2:
**Problem:** ___________________________________________
**Solution:** __________________________________________
**Date:** _____________

### Issue 3:
**Problem:** ___________________________________________
**Solution:** __________________________________________
**Date:** _____________

---

## Notes & Ideas 💡

Use this space for notes, ideas, or reminders:

```
[Your notes here]
```

---

## Completion Status 🎯

**Setup Started:** _____________ (date)
**Setup Completed:** _____________ (date)
**Time Taken:** _____________ hours

**Overall Progress:**
- [ ] Phase 1: Initial Setup (✅ when all items checked)
- [ ] Phase 2: Customization (✅ when all items checked)
- [ ] Phase 3: Content Creation (✅ when all items checked)
- [ ] Phase 4: Testing (✅ when all items checked)
- [ ] Phase 5: Deployment (✅ when all items checked)
- [ ] Phase 6: Optimization (✅ when all items checked)
- [ ] Phase 7: Enhancements (optional)

---

**🎉 When all core phases (1-6) are complete, your blog CMS is production-ready!**

---

*Keep this checklist updated as you progress through the setup!*
