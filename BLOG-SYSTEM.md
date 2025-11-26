# 📝 Blog System Documentation

## Overview
The AstraForensics blog system uses GitHub as a CMS (Content Management System) with auto-generated blog pages.

## How It Works

### 1. **Admin Creates Blog Post**
- Go to `/admin` and login
- Click "New Post"
- Fill in:
  - **Title**: Post title (auto-generates slug)
  - **Date**: Publication date
  - **Description**: SEO meta description
  - **Tags**: Comma-separated tags
  - **Cover Image**: Upload thumbnail (max 5MB)
  - **Content**: Write in Markdown

### 2. **Image Upload**
- When you upload a cover image or insert images in content:
  - Images are saved to `/uploads/` folder on GitHub
  - Full GitHub URL is automatically generated
  - Example: `https://raw.githubusercontent.com/Gailplugger/astra-new-site/main/uploads/image.jpg`

### 3. **Post Storage**
- Posts are saved as Markdown files in `/posts/` folder
- Filename format: `YYYY-MM-DD-post-slug.md`
- Example: `2025-11-26-my-first-post.md`

### 4. **Auto-Generated Blog Pages**
- **Blog Listing**: `/blog.html` shows all posts
- **Single Post**: `/blog/post-slug` shows individual post
- **Clean URLs**: Using Netlify redirects for SEO-friendly URLs

## URL Structure

### Clean URLs (Recommended)
```
/blog/my-first-post          → Shows single post
/blog/cybersecurity-tips     → Shows single post
```

### Query Parameter URLs (Fallback)
```
/post.html?slug=my-first-post
```

Both formats work, but clean URLs are better for SEO.

## File Structure

```
/
├── admin/                    # Admin panel
│   ├── index.html           # Login page
│   ├── dashboard.html       # Post management
│   ├── new-post.html        # Create/edit posts
│   ├── github-api.js        # GitHub API integration
│   └── editor.js            # Post editor logic
├── posts/                    # Blog posts (Markdown)
│   └── 2025-11-26-my-post.md
├── uploads/                  # Uploaded images
│   ├── cover-image.jpg
│   └── content-image.png
├── js/
│   └── blog-loader.js       # Public blog rendering
├── blog.html                 # Blog listing page
├── post.html                 # Single post template
└── _redirects               # Netlify URL routing

```

## Post Frontmatter Format

Each post starts with YAML frontmatter:

```yaml
---
title: "My Awesome Blog Post"
date: "2025-11-26"
description: "SEO-friendly description"
tags: "cybersecurity, tutorial, ethical hacking"
cover_image: "https://raw.githubusercontent.com/.../uploads/cover.jpg"
---

Your post content goes here in Markdown...
```

## Image Handling

### Cover Images
- Uploaded via admin panel
- Stored in `/uploads/` folder
- Automatically added to frontmatter
- Displayed in blog listing and post hero

### Content Images
- Insert using Markdown: `![Alt text](/uploads/image.jpg)`
- Auto-converted to full GitHub URLs when rendering
- Supports:
  - `/uploads/image.jpg`
  - `uploads/image.jpg`
  - `https://raw.githubusercontent.com/.../uploads/image.jpg`

## How Blog Rendering Works

### Blog Listing (`blog.html`)
1. Fetches all `.md` files from `/posts/` folder
2. Parses frontmatter for each post
3. Extracts title, date, description, tags, cover image
4. Displays in grid with pagination (9 posts per page)
5. Supports:
   - Search by title/content
   - Filter by tags
   - Pagination

### Single Post (`post.html`)
1. Gets `slug` from URL (`/blog/my-post` or `?slug=my-post`)
2. Fetches corresponding `.md` file from GitHub
3. Parses frontmatter and body
4. Renders:
   - Hero with cover image
   - Title and meta (date, read time)
   - Tags
   - Content (Markdown → HTML)
   - Share buttons (Facebook, Twitter, LinkedIn, WhatsApp)

## SEO Features

✅ Clean URLs (`/blog/post-slug`)
✅ Meta descriptions
✅ Open Graph tags
✅ Twitter Cards
✅ Sitemap generation
✅ Image optimization
✅ Fast loading (CDN via GitHub)

## Admin Features

### Create Post
- Rich markdown editor
- Image upload with preview
- Slug auto-generation
- Draft saving
- Preview mode

### Edit Post
- Load existing post
- Update content/images
- Maintain SEO data
- Version control via GitHub

### Delete Post
- Remove from repository
- Update sitemap
- Clean up orphaned images

## Troubleshooting

### Images Not Showing
**Problem**: Cover images or content images not displaying

**Solution**:
1. Check if image uploaded successfully to `/uploads/`
2. Verify GitHub token has write permissions
3. Ensure image URLs use full GitHub raw URL
4. Check browser console for 404 errors

### Post Not Found
**Problem**: Blog post page shows "Article Not Found"

**Solution**:
1. Verify post file exists in `/posts/` folder
2. Check slug in URL matches filename
3. Ensure file has `.md` extension
4. Check GitHub API rate limits

### Clean URLs Not Working
**Problem**: `/blog/post-slug` shows 404

**Solution**:
1. Check `_redirects` file exists in root
2. Verify Netlify is processing redirects
3. Clear browser cache
4. Test with query parameter URL first

## GitHub API Configuration

Admin panel uses:
- **Token**: Stored in localStorage (set in dashboard)
- **Username**: `Gailplugger`
- **Repo**: `astra-new-site`
- **Branch**: `main`

### Token Permissions Required:
- ✅ `repo` (full control)
- ✅ Read/write access to code

## Performance

- **GitHub CDN**: Images served via raw.githubusercontent.com
- **No Database**: Direct file-based system
- **Fast Loads**: Static site generation
- **Caching**: Browser caches GitHub content
- **Lazy Loading**: Images load on scroll

## Best Practices

### Writing Posts
1. ✅ Use descriptive titles (50-60 characters)
2. ✅ Write meta descriptions (150-160 characters)
3. ✅ Add 3-5 relevant tags
4. ✅ Use high-quality cover images (1200x630px recommended)
5. ✅ Break content with headings (H2, H3)
6. ✅ Add images to illustrate points
7. ✅ Use code blocks for technical content
8. ✅ Include call-to-action at end

### Image Optimization
1. ✅ Compress images before upload (max 5MB)
2. ✅ Use descriptive filenames: `cybersecurity-tips.jpg`
3. ✅ Add alt text for accessibility
4. ✅ Use WebP format when possible
5. ✅ Optimize cover images: 1200x630px

### SEO Optimization
1. ✅ Use keywords in title
2. ✅ Write compelling meta descriptions
3. ✅ Use relevant tags
4. ✅ Internal linking to other posts
5. ✅ Share on social media
6. ✅ Update sitemap after publishing

## Deployment Workflow

1. **Create Post** in admin panel
2. **Upload** to GitHub (automatic)
3. **Netlify Deploy** (automatic, ~2 minutes)
4. **Live** at astraforensics.in/blog/post-slug

## Future Enhancements

- [ ] Draft posts (unpublished)
- [ ] Post scheduling
- [ ] Categories/sections
- [ ] Related posts suggestions
- [ ] Comments system
- [ ] RSS feed generation
- [ ] Analytics integration
- [ ] Social share counters

## Support

Need help?
- 📧 Email: admin@securewithtechies.com
- 📱 Phone: +91 8347 576630
- 🌐 Website: https://astraforensics.in

---

**Last Updated**: November 26, 2025
**Version**: 2.0
