// ============================================
// GITHUB API INTEGRATION
// ============================================

// GitHub Configuration
function getGitHubConfig() {
    return {
        token: localStorage.getItem('github_token') || 'PASTE_TOKEN_HERE',
        username: localStorage.getItem('github_username') || 'Gailplugger',
        repo: localStorage.getItem('github_repo') || 'astra-new-site',
        branch: 'main'
    };
}

// API Request Helper
async function githubRequest(endpoint, method = 'GET', body = null) {
    const config = getGitHubConfig();
    
    // Validate token exists
    if (!config.token || config.token === 'PASTE_TOKEN_HERE') {
        throw new Error('GitHub token not configured. Please configure it in the dashboard settings.');
    }
    
    const url = `https://api.github.com/repos/${config.username}/${config.repo}/contents/${endpoint}`;
    
    const headers = {
        'Authorization': `token ${config.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
    };
    
    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid GitHub token. Please check your token in dashboard settings.');
            }
            const error = await response.json();
            throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        return method === 'DELETE' ? response : await response.json();
    } catch (error) {
        console.error('GitHub API Error:', error);
        throw error;
    }
}

// List all posts
async function listPosts() {
    try {
        const files = await githubRequest('posts');
        return files.filter(f => f.name.endsWith('.md'));
    } catch (error) {
        if (error.message.includes('404')) {
            return []; // posts folder doesn't exist yet
        }
        throw error;
    }
}

// Get single post content
async function getPost(slug) {
    const data = await githubRequest(`posts/${slug}.md`);
    const content = atob(data.content);
    return content;
}

// Get post with SHA (for editing)
async function getPostWithSha(slug) {
    const data = await githubRequest(`posts/${slug}.md`);
    const content = atob(data.content);
    return { content, sha: data.sha };
}

// Create new post
async function createPost(slug, content, commitMessage = 'Create post') {
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    
    // Check if file exists (to get SHA if it does)
    try {
        const existing = await getPostWithSha(slug);
        // File exists, update it instead
        return await updatePost(slug, content, existing.sha, commitMessage);
    } catch (error) {
        // File doesn't exist, create new
        if (error.message.includes('404') || error.message.includes('Not Found')) {
            return await githubRequest(`posts/${slug}.md`, 'PUT', {
                message: commitMessage,
                content: encodedContent,
                branch: getGitHubConfig().branch
            });
        }
        throw error;
    }
}

// Update existing post
async function updatePost(slug, content, sha, commitMessage = 'Update post') {
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    
    return await githubRequest(`posts/${slug}.md`, 'PUT', {
        message: commitMessage,
        content: encodedContent,
        sha: sha,
        branch: getGitHubConfig().branch
    });
}

// Delete post
async function deletePost(slug, sha, commitMessage = 'Delete post') {
    return await githubRequest(`posts/${slug}.md`, 'DELETE', {
        message: commitMessage,
        sha: sha,
        branch: getGitHubConfig().branch
    });
}

// Upload image
async function uploadImage(filename, base64Content) {
    // Remove data:image prefix if present
    const base64Data = base64Content.replace(/^data:image\/\w+;base64,/, '');
    
    try {
        const result = await githubRequest(`uploads/${filename}`, 'PUT', {
            message: `Upload image: ${filename}`,
            content: base64Data,
            branch: getGitHubConfig().branch
        });
        
        return `/uploads/${filename}`;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Generate frontmatter
function generateFrontmatter(title, date, description, tags, coverImage) {
    return `---
title: "${title}"
date: "${date}"
description: "${description}"
tags: "${tags}"
cover_image: "${coverImage}"
---

`;
}

// Parse markdown frontmatter
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return {
            frontmatter: {},
            body: content
        };
    }
    
    const frontmatterLines = match[1].split('\n');
    const frontmatter = {};
    
    frontmatterLines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim().replace(/^"|"$/g, '');
            frontmatter[key.trim()] = value;
        }
    });
    
    return {
        frontmatter,
        body: match[2].trim()
    };
}

// Validate GitHub token
async function validateToken() {
    const config = getGitHubConfig();
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        return response.ok;
    } catch (error) {
        return false;
    }
}


