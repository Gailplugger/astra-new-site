// GitHub Configuration
const GITHUB_OWNER = 'Gailplugger';
const GITHUB_REPO = 'astra-new-site';
const GITHUB_BRANCH = 'main';
const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`;

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postFilename = urlParams.get('post');

    if (!postFilename) {
        showError();
        return;
    }

    await loadPost(postFilename);
    initializeShareButtons();
});

// Load blog post
async function loadPost(filename) {
    try {
        const response = await fetch(`${API_BASE}/blogs/${filename}`);
        
        if (!response.ok) {
            throw new Error('Post not found');
        }

        const data = await response.json();
        const content = atob(data.content);
        const { frontmatter, body } = parseFrontmatter(content);

        renderPost(frontmatter, body, filename);
        
        // Hide loading, show content
        document.getElementById('loadingPost').style.display = 'none';
        document.getElementById('postContent').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading post:', error);
        showError();
    }
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

// Render post content
function renderPost(frontmatter, body, filename) {
    const title = frontmatter.title || extractTitle(filename);
    const date = frontmatter.date || extractDate(filename);
    const author = frontmatter.author || 'Astra Forensics';
    const image = frontmatter.image || '';

    // Update page title and meta
    document.getElementById('pageTitle').textContent = `${title} - AstraForensics`;
    document.getElementById('pageDescription').content = body.substring(0, 160);

    // Update post header
    document.getElementById('postTitle').textContent = title;
    document.getElementById('postAuthor').textContent = author;
    document.getElementById('postDate').textContent = formatDate(date);
    document.getElementById('breadcrumbTitle').textContent = title;

    // Featured image
    if (image) {
        document.getElementById('featuredImageContainer').style.display = 'block';
        document.getElementById('featuredImage').src = image;
        document.getElementById('featuredImage').alt = title;
    }

    // Render markdown body
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true,
            mangle: false
        });
        document.getElementById('postBody').innerHTML = marked.parse(body);
    } else {
        // Fallback if marked.js not loaded
        document.getElementById('postBody').innerHTML = body.replace(/\n/g, '<br>');
    }
}

// Extract title from filename
function extractTitle(filename) {
    return filename
        .substring(11) // Remove date
        .replace('.md', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

// Extract date from filename
function extractDate(filename) {
    return filename.substring(0, 10); // YYYY-MM-DD
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Initialize share buttons
function initializeShareButtons() {
    const currentUrl = window.location.href;
    const title = document.getElementById('postTitle')?.textContent || 'AstraForensics Blog';

    // Twitter
    document.getElementById('shareTwitter').addEventListener('click', function() {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
    });

    // Facebook
    document.getElementById('shareFacebook').addEventListener('click', function() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
    });

    // LinkedIn
    document.getElementById('shareLinkedIn').addEventListener('click', function() {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
    });

    // Copy Link
    document.getElementById('shareCopy').addEventListener('click', async function() {
        try {
            await navigator.clipboard.writeText(currentUrl);
            this.innerHTML = '<span>✓</span> Copied!';
            setTimeout(() => {
                this.innerHTML = '<span>🔗</span> Copy Link';
            }, 2000);
        } catch (error) {
            alert('Link copied: ' + currentUrl);
        }
    });
}

// Show error state
function showError() {
    document.getElementById('loadingPost').style.display = 'none';
    document.getElementById('postContent').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
}
