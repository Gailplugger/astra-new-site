// GitHub API Configuration
const GITHUB_TOKEN = "PASTE_TOKEN_HERE";  // Replace with your GitHub Personal Access Token
const GITHUB_OWNER = "Gailplugger";  // Your GitHub username
const GITHUB_REPO = "astra-new-site";  // Your repository name
const GITHUB_BRANCH = "main";  // Branch name

const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`;

// Helper function to make authenticated GitHub API requests
async function githubRequest(url, method = 'GET', body = null) {
    const headers = {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
    };

    const options = {
        method,
        headers
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `GitHub API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('GitHub API Error:', error);
        throw error;
    }
}

// List all blog posts from /blogs directory
async function listPosts() {
    try {
        const url = `${API_BASE}/blogs`;
        const response = await githubRequest(url);
        
        // Filter only markdown files
        const posts = response.filter(file => file.name.endsWith('.md'));
        
        // Sort by date (newest first) based on filename format YYYY-MM-DD-title.md
        posts.sort((a, b) => {
            const dateA = a.name.substring(0, 10);
            const dateB = b.name.substring(0, 10);
            return dateB.localeCompare(dateA);
        });
        
        return posts;
    } catch (error) {
        console.error('Error listing posts:', error);
        return [];
    }
}

// Get a specific blog post content
async function getPost(filename) {
    try {
        const url = `${API_BASE}/blogs/${filename}`;
        const response = await githubRequest(url);
        
        // Decode base64 content
        const content = atob(response.content);
        
        return {
            content,
            sha: response.sha,
            filename: response.name
        };
    } catch (error) {
        console.error('Error getting post:', error);
        throw error;
    }
}

// Create a new blog post
async function createPost(filename, content, commitMessage = 'Create new blog post') {
    try {
        const url = `${API_BASE}/blogs/${filename}`;
        
        // Encode content to base64
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        
        const body = {
            message: commitMessage,
            content: encodedContent,
            branch: GITHUB_BRANCH
        };

        const response = await githubRequest(url, 'PUT', body);
        console.log('Post created successfully:', response);
        return response;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

// Update an existing blog post
async function updatePost(filename, content, sha, commitMessage = 'Update blog post') {
    try {
        const url = `${API_BASE}/blogs/${filename}`;
        
        // Encode content to base64
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        
        const body = {
            message: commitMessage,
            content: encodedContent,
            sha: sha,  // Required for updates
            branch: GITHUB_BRANCH
        };

        const response = await githubRequest(url, 'PUT', body);
        console.log('Post updated successfully:', response);
        return response;
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
}

// Delete a blog post
async function deletePost(filename, sha, commitMessage = 'Delete blog post') {
    try {
        const url = `${API_BASE}/blogs/${filename}`;
        
        const body = {
            message: commitMessage,
            sha: sha,  // Required for deletion
            branch: GITHUB_BRANCH
        };

        const response = await githubRequest(url, 'DELETE', body);
        console.log('Post deleted successfully:', response);
        return response;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}

// Upload an image to /uploads directory
async function uploadImage(filename, base64Content, commitMessage = 'Upload image') {
    try {
        const url = `${API_BASE}/uploads/${filename}`;
        
        // Remove data URL prefix if present
        const base64Data = base64Content.replace(/^data:image\/\w+;base64,/, '');
        
        const body = {
            message: commitMessage,
            content: base64Data,
            branch: GITHUB_BRANCH
        };

        const response = await githubRequest(url, 'PUT', body);
        console.log('Image uploaded successfully:', response);
        
        // Return the public URL
        return `/uploads/${filename}`;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

// Get existing image SHA (needed for updates)
async function getImageSha(filename) {
    try {
        const url = `${API_BASE}/uploads/${filename}`;
        const response = await githubRequest(url);
        return response.sha;
    } catch (error) {
        return null;  // Image doesn't exist
    }
}

// Generate markdown frontmatter
function generateFrontmatter(title, date, author, image = '') {
    return `---
title: "${title}"
date: "${date}"
author: "${author}"
image: "${image}"
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

// Generate filename from title and date
function generateFilename(title, date) {
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    
    return `${date}-${slug}.md`;
}

// Validate GitHub token
async function validateToken() {
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        return response.ok;
    } catch (error) {
        return false;
    }
}
