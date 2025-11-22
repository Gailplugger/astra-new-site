# GitHub Configuration for Your CMS

## Your GitHub Details

**GitHub Token:** `YOUR_TOKEN_HERE` (Add in Netlify Environment Variables)

**GitHub Username:** `Gailplugger`

**Repository Name:** `astra-new-site`

---

## How to Use This Token

### Option 1: Configure in Admin Panel (Recommended)

1. Open `cms-admin/login.html` in your browser
2. Login with:
   - Username: `kartikgoyal`
   - Password: `K7RTK@2580`
3. On the dashboard, you'll see a GitHub configuration form
4. Enter:
   - **GitHub Token:** Paste the token above
   - **GitHub Username:** `Gailplugger`
   - **Repository Name:** `astra-new-site`
5. Click "Save Configuration"
6. Your CMS is now ready to create posts!

### Option 2: Quick Test (Browser Console)

Open your browser console (F12) and run:

```javascript
// Save configuration
localStorage.setItem('github_token', 'YOUR_GITHUB_TOKEN_HERE');
localStorage.setItem('github_username', 'Gailplugger');
localStorage.setItem('github_repo', 'astra-new-site');

// Verify
console.log('Token saved:', localStorage.getItem('github_token'));
console.log('Username:', localStorage.getItem('github_username'));
console.log('Repo:', localStorage.getItem('github_repo'));
```

Then refresh the dashboard page.

---

## ⚠️ IMPORTANT SECURITY STEPS

### 1. Rotate This Token (Recommended)

Since you've shared this token, it's best to rotate it:

1. Go to GitHub: Settings → Developer settings → Personal access tokens
2. Find this token (created recently)
3. Click "Delete" or "Revoke"
4. Generate a new token with the same `repo` scope
5. Use the new token in your CMS

### 2. Monitor Repository Activity

Keep an eye on your repository for unexpected changes:
- Check commit history regularly
- Enable notifications for pushes
- Review who has access

### 3. Best Practices

- Never commit tokens to Git
- Don't share tokens in public chats/forums
- Use environment variables for production
- Enable 2FA on your GitHub account
- Set token expiration dates

---

## Quick Test

After configuration, test your setup:

1. **Dashboard Test:**
   - Login to admin panel
   - Check if posts load (should show example posts or empty)
   - Look for any error messages

2. **Create Test Post:**
   - Click "New Post"
   - Title: "Test Post"
   - Content: "Testing my CMS setup!"
   - Click "Publish"

3. **Verify on GitHub:**
   - Go to `https://github.com/Gailplugger/astra-new-site`
   - Check if `/posts/test-post.md` was created
   - View the file to see your content

4. **View on Blog:**
   - Open `blog.html`
   - Your test post should appear
   - Click to view full post

---

## Troubleshooting

### "Failed to load posts"
- Check token is correct (no extra spaces)
- Verify username/repo names match exactly
- Check browser console for detailed errors

### "Failed to publish post"
- Ensure token has `repo` scope permission
- Check if repository exists and is accessible
- Verify you're not hitting GitHub API rate limits

### Token Invalid
- Token may have expired
- Token may have been revoked
- Generate a new token with correct scopes

---

## Next Steps

1. ✅ Token configured
2. ✅ Test post created
3. [ ] Write your first real post
4. [ ] Add cover images
5. [ ] Share on social media
6. [ ] Deploy to Netlify

---

**Your CMS is ready to use! Start creating amazing content! 🚀**

*Remember to rotate this token for security!*
