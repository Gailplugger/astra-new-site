// ============================================
// GITHUB API FUNCTIONS
// ============================================

class GitHubAPI {
    constructor() {
        this.token = localStorage.getItem('github_token') || '';
        this.username = localStorage.getItem('github_username') || '';
        this.repo = localStorage.getItem('github_repo') || '';
        this.baseUrl = `https://api.github.com/repos/${this.username}/${this.repo}/contents`;
    }

    async request(url, method = 'GET', body = null) {
        const headers = {
            'Authorization': `token ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        };

        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `HTTP ${response.status}`);
            }
            return method === 'DELETE' ? response : await response.json();
        } catch (error) {
            console.error('GitHub API Error:', error);
            throw error;
        }
    }

    async listPosts() {
        try {
            const url = `${this.baseUrl}/posts`;
            const files = await this.request(url);
            return files.filter(f => f.name.endsWith('.md'));
        } catch (error) {
            return [];
        }
    }

    async getPost(slug) {
        const url = `${this.baseUrl}/posts/${slug}.md`;
        const data = await this.request(url);
        const content = atob(data.content);
        return { content, sha: data.sha };
    }

    async createPost(slug, content, message = 'Create post') {
        const url = `${this.baseUrl}/posts/${slug}.md`;
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        return await this.request(url, 'PUT', {
            message,
            content: encodedContent,
            branch: 'main'
        });
    }

    async updatePost(slug, content, sha, message = 'Update post') {
        const url = `${this.baseUrl}/posts/${slug}.md`;
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        return await this.request(url, 'PUT', {
            message,
            content: encodedContent,
            sha,
            branch: 'main'
        });
    }

    async deletePost(slug, sha, message = 'Delete post') {
        const url = `${this.baseUrl}/posts/${slug}.md`;
        return await this.request(url, 'DELETE', {
            message,
            sha,
            branch: 'main'
        });
    }

    async uploadImage(filename, base64Content) {
        const url = `${this.baseUrl}/uploads/${filename}`;
        const base64Data = base64Content.replace(/^data:image\/\w+;base64,/, '');
        
        try {
            return await this.request(url, 'PUT', {
                message: `Upload image ${filename}`,
                content: base64Data,
                branch: 'main'
            });
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function parseFrontmatter(content) {
    const regex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(regex);
    
    if (!match) {
        return { frontmatter: {}, body: content };
    }
    
    const frontmatter = {};
    match[1].split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim();
            frontmatter[key.trim()] = value.replace(/^["']|["']$/g, '');
        }
    });
    
    return { frontmatter, body: match[2].trim() };
}

function generateFrontmatter(title, date, description, tags, coverImage) {
    return `---
title: "${title}"
date: "${date}"
description: "${description}"
tags: ${tags}
cover_image: "${coverImage}"
---

`;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// ============================================
// THEME TOGGLE
// ============================================

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// ============================================
// MOBILE MENU
// ============================================

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!menuToggle || !sidebar) return;

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
        }
    });
}

// ============================================
// LOGOUT
// ============================================

function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('cms_auth');
            localStorage.removeItem('cms_user');
            localStorage.removeItem('cms_login_time');
            window.location.href = 'login.html';
        }
    });
}

// ============================================
// DASHBOARD
// ============================================

async function initDashboard() {
    initTheme();
    initMobileMenu();
    initLogout();

    // Check GitHub config
    const token = localStorage.getItem('github_token');
    const username = localStorage.getItem('github_username');
    const repo = localStorage.getItem('github_repo');

    if (!token || !username || !repo) {
        document.getElementById('githubSetup').style.display = 'block';
        document.getElementById('postsSection').style.display = 'none';
        
        // Setup config save
        document.getElementById('saveGithubConfig').addEventListener('click', saveGitHubConfig);
        return;
    }

    // Load posts
    await loadDashboardPosts();

    // Refresh button
    document.getElementById('refreshPosts').addEventListener('click', loadDashboardPosts);
}

function saveGitHubConfig() {
    const token = document.getElementById('githubToken').value.trim();
    const username = document.getElementById('githubUsername').value.trim();
    const repo = document.getElementById('githubRepo').value.trim();

    if (!token || !username || !repo) {
        alert('Please fill in all fields');
        return;
    }

    localStorage.setItem('github_token', token);
    localStorage.setItem('github_username', username);
    localStorage.setItem('github_repo', repo);

    showToast('Configuration saved! Reloading...', 'success');
    setTimeout(() => window.location.reload(), 1500);
}

async function loadDashboardPosts() {
    const api = new GitHubAPI();
    const loadingEl = document.getElementById('loadingPosts');
    const tableEl = document.getElementById('postsTable');
    const emptyEl = document.getElementById('emptyState');
    const tbody = document.getElementById('postsTableBody');

    loadingEl.style.display = 'flex';
    tableEl.style.display = 'none';
    emptyEl.style.display = 'none';

    try {
        const posts = await api.listPosts();
        
        if (posts.length === 0) {
            loadingEl.style.display = 'none';
            emptyEl.style.display = 'block';
            updateStats(0, 0, '-', 0);
            return;
        }

        // Sort by name (newest first)
        posts.sort((a, b) => b.name.localeCompare(a.name));

        // Load post details
        const postDetails = [];
        for (const post of posts.slice(0, 10)) { // Limit to 10 recent posts
            try {
                const { content } = await api.getPost(post.name.replace('.md', ''));
                const { frontmatter } = parseFrontmatter(content);
                postDetails.push({ ...post, frontmatter });
            } catch (error) {
                console.error('Error loading post:', error);
            }
        }

        // Render table
        tbody.innerHTML = postDetails.map(post => `
            <tr>
                <td><strong>${post.frontmatter.title || post.name}</strong></td>
                <td>${formatDate(post.frontmatter.date || new Date().toISOString())}</td>
                <td>${(post.frontmatter.tags || 'none').split(',').map(t => `<span class="tag">${t.trim()}</span>`).join(' ')}</td>
                <td class="table-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editPost('${post.name.replace('.md', '')}')">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deletePost('${post.name.replace('.md', '')}', '${post.sha}')">
                        🗑️ Delete
                    </button>
                </td>
            </tr>
        `).join('');

        loadingEl.style.display = 'none';
        tableEl.style.display = 'block';

        // Update stats
        const latestPost = postDetails[0];
        const allTags = new Set();
        postDetails.forEach(p => {
            if (p.frontmatter.tags) {
                p.frontmatter.tags.split(',').forEach(t => allTags.add(t.trim()));
            }
        });

        updateStats(
            posts.length,
            0, // Images count - would need separate API call
            latestPost?.frontmatter.date || '-',
            allTags.size
        );

    } catch (error) {
        console.error('Error loading posts:', error);
        showToast('Failed to load posts. Check console.', 'error');
        loadingEl.style.display = 'none';
        emptyEl.style.display = 'block';
    }
}

function updateStats(totalPosts, totalImages, lastPost, totalTags) {
    document.getElementById('totalPosts').textContent = totalPosts;
    document.getElementById('totalImages').textContent = totalImages;
    document.getElementById('lastPost').textContent = lastPost === '-' ? '-' : formatDate(lastPost);
    document.getElementById('totalTags').textContent = totalTags;
}

window.editPost = function(slug) {
    window.location.href = `new-post.html?edit=${slug}`;
};

window.deletePost = async function(slug, sha) {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
        return;
    }

    const api = new GitHubAPI();
    try {
        await api.deletePost(slug, sha);
        showToast('Post deleted successfully!', 'success');
        setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
        showToast('Failed to delete post: ' + error.message, 'error');
    }
};

// ============================================
// POST EDITOR
// ============================================

function initPostEditor() {
    initTheme();
    initMobileMenu();
    initLogout();
    initImageUpload();
    initMarkdownToolbar();
    initSlugPreview();
    initPostForm();
    initDraft();
}

function initImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    const fileInput = document.getElementById('coverImageInput');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const uploadPrompt = document.getElementById('uploadPrompt');
    const removeBtn = document.getElementById('removeImage');
    const urlInput = document.getElementById('coverImageUrl');

    uploadArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            previewImg.src = e.target.result;
            uploadPrompt.style.display = 'none';
            preview.style.display = 'block';

            // Upload to GitHub
            showToast('Uploading image...', 'success');
            try {
                const api = new GitHubAPI();
                const timestamp = Date.now();
                const filename = `${timestamp}-${file.name.replace(/[^a-z0-9.]/gi, '-')}`;
                await api.uploadImage(filename, e.target.result);
                urlInput.value = `/uploads/${filename}`;
                showToast('Image uploaded!', 'success');
            } catch (error) {
                showToast('Upload failed: ' + error.message, 'error');
            }
        };
        reader.readAsDataURL(file);
    });

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        preview.style.display = 'none';
        uploadPrompt.style.display = 'block';
        fileInput.value = '';
        urlInput.value = '';
    });

    // URL input
    urlInput.addEventListener('input', (e) => {
        if (e.target.value) {
            previewImg.src = e.target.value;
            uploadPrompt.style.display = 'none';
            preview.style.display = 'block';
        }
    });
}

function initMarkdownToolbar() {
    const toolbar = document.querySelectorAll('.toolbar-btn');
    const textarea = document.getElementById('postContent');
    const preview = document.getElementById('markdownPreview');
    let previewMode = false;

    toolbar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.getAttribute('data-action');

            if (action === 'preview') {
                previewMode = !previewMode;
                if (previewMode) {
                    if (typeof marked !== 'undefined') {
                        preview.innerHTML = marked.parse(textarea.value);
                    } else {
                        preview.textContent = textarea.value;
                    }
                    textarea.style.display = 'none';
                    preview.style.display = 'block';
                } else {
                    textarea.style.display = 'block';
                    preview.style.display = 'none';
                }
                return;
            }

            insertMarkdown(textarea, action);
        });
    });
}

function insertMarkdown(textarea, action) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let replacement = '';

    switch (action) {
        case 'bold':
            replacement = `**${selectedText || 'bold text'}**`;
            break;
        case 'italic':
            replacement = `*${selectedText || 'italic text'}*`;
            break;
        case 'heading':
            replacement = `## ${selectedText || 'Heading'}`;
            break;
        case 'link':
            replacement = `[${selectedText || 'link text'}](url)`;
            break;
        case 'image':
            replacement = `![alt text](image-url)`;
            break;
        case 'code':
            replacement = `\`\`\`\n${selectedText || 'code'}\n\`\`\``;
            break;
        case 'list':
            replacement = `- ${selectedText || 'list item'}`;
            break;
    }

    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + replacement.length, start + replacement.length);
}

function initSlugPreview() {
    const titleInput = document.getElementById('postTitle');
    const slugPreview = document.getElementById('slugPreview');

    titleInput.addEventListener('input', () => {
        const slug = generateSlug(titleInput.value || 'title');
        slugPreview.textContent = slug;
    });
}

function initPostForm() {
    const form = document.getElementById('postForm');
    form.addEventListener('submit', handlePostSubmit);
}

async function handlePostSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('postTitle').value.trim();
    const date = document.getElementById('postDate').value;
    const description = document.getElementById('postDescription').value.trim();
    const tags = document.getElementById('postTags').value.trim();
    const coverImage = document.getElementById('coverImageUrl').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const isEdit = document.getElementById('isEditMode').value === 'true';
    const existingSlug = document.getElementById('postSlug').value;
    const existingSha = document.getElementById('postSha').value;

    if (!title || !date || !content) {
        alert('Please fill in all required fields');
        return;
    }

    const slug = isEdit && existingSlug ? existingSlug : generateSlug(title);
    const fullContent = generateFrontmatter(title, date, description, tags, coverImage) + content;

    const btnText = document.getElementById('publishBtnText');
    const btnLoader = document.getElementById('publishBtnLoader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    try {
        const api = new GitHubAPI();
        
        if (isEdit && existingSha) {
            await api.updatePost(slug, fullContent, existingSha, `Update: ${title}`);
            showToast('Post updated successfully!', 'success');
        } else {
            await api.createPost(slug, fullContent, `Create: ${title}`);
            showToast('Post published successfully!', 'success');
        }

        // Clear draft
        localStorage.removeItem('post_draft');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

    } catch (error) {
        showToast('Failed: ' + error.message, 'error');
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

async function loadPostForEdit(slug) {
    try {
        const api = new GitHubAPI();
        const { content, sha } = await api.getPost(slug);
        const { frontmatter, body } = parseFrontmatter(content);

        document.getElementById('postTitle').value = frontmatter.title || '';
        document.getElementById('postDate').value = frontmatter.date || '';
        document.getElementById('postDescription').value = frontmatter.description || '';
        document.getElementById('postTags').value = frontmatter.tags || '';
        document.getElementById('coverImageUrl').value = frontmatter.cover_image || '';
        document.getElementById('postContent').value = body;
        document.getElementById('postSlug').value = slug;
        document.getElementById('postSha').value = sha;

        // Show image preview if exists
        if (frontmatter.cover_image) {
            document.getElementById('previewImg').src = frontmatter.cover_image;
            document.getElementById('uploadPrompt').style.display = 'none';
            document.getElementById('imagePreview').style.display = 'block';
        }

        showToast('Post loaded for editing', 'success');
    } catch (error) {
        showToast('Failed to load post: ' + error.message, 'error');
    }
}

window.loadPostForEdit = loadPostForEdit;

// ============================================
// DRAFT AUTO-SAVE
// ============================================

function initDraft() {
    const form = document.getElementById('postForm');
    if (!form) return;

    // Load draft
    const draft = localStorage.getItem('post_draft');
    if (draft && !document.getElementById('isEditMode').value) {
        if (confirm('Load saved draft?')) {
            const data = JSON.parse(draft);
            Object.keys(data).forEach(key => {
                const el = document.getElementById(key);
                if (el) el.value = data[key];
            });
        }
    }

    // Auto-save every 30 seconds
    setInterval(saveDraft, 30000);
}

function saveDraft() {
    const draft = {
        postTitle: document.getElementById('postTitle').value,
        postDate: document.getElementById('postDate').value,
        postDescription: document.getElementById('postDescription').value,
        postTags: document.getElementById('postTags').value,
        coverImageUrl: document.getElementById('coverImageUrl').value,
        postContent: document.getElementById('postContent').value
    };

    localStorage.setItem('post_draft', JSON.stringify(draft));
    showToast('Draft saved', 'success');
}

window.saveDraft = saveDraft;

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});
