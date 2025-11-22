// GitHub Configuration
const GITHUB_OWNER = 'Gailplugger';
const GITHUB_REPO = 'astra-new-site';
const GITHUB_BRANCH = 'main';
const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`;

let allPosts = [];

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    await loadBlogPosts();
    initializeSearch();
});

// Load blog posts from GitHub
async function loadBlogPosts() {
    try {
        const response = await fetch(`${API_BASE}/blogs`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        const files = await response.json();
        
        // Filter markdown files
        const markdownFiles = files.filter(file => file.name.endsWith('.md'));
        
        if (markdownFiles.length === 0) {
            showEmptyState();
            return;
        }

        // Sort by date (newest first)
        markdownFiles.sort((a, b) => {
            const dateA = a.name.substring(0, 10);
            const dateB = b.name.substring(0, 10);
            return dateB.localeCompare(dateA);
        });

        allPosts = markdownFiles;
        await renderPosts(markdownFiles);
        
    } catch (error) {
        console.error('Error loading posts:', error);
        showEmptyState();
    }
}

// Render blog posts
async function renderPosts(posts) {
    const gridContainer = document.getElementById('blogGrid');
    gridContainer.innerHTML = '';

    for (const post of posts) {
        try {
            const content = await fetch(post.download_url).then(r => r.text());
            const { frontmatter } = parseFrontmatter(content);
            
            const card = createBlogCard(post.name, frontmatter);
            gridContainer.appendChild(card);
        } catch (error) {
            console.error('Error rendering post:', error);
        }
    }
}

// Create blog card element
function createBlogCard(filename, frontmatter) {
    const card = document.createElement('a');
    card.href = `blog-single.html?post=${filename}`;
    card.className = 'blog-card';

    const image = frontmatter.image || 'https://via.placeholder.com/400x300/667eea/ffffff?text=AstraForensics';
    const title = frontmatter.title || extractTitle(filename);
    const date = frontmatter.date || extractDate(filename);
    const author = frontmatter.author || 'Astra Forensics';
    const excerpt = createExcerpt(frontmatter.body || '');

    card.innerHTML = `
        <img src="${image}" alt="${title}" class="blog-card-image" onerror="this.src='https://via.placeholder.com/400x300/667eea/ffffff?text=AstraForensics'">
        <div class="blog-card-content">
            <h2 class="blog-card-title">${title}</h2>
            <div class="blog-card-meta">
                <span>${author}</span> • <span>${formatDate(date)}</span>
            </div>
            <p class="blog-card-excerpt">${excerpt}</p>
        </div>
    `;

    return card;
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
    
    frontmatter.body = match[2].trim();
    
    return {
        frontmatter,
        body: match[2].trim()
    };
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

// Create excerpt from content
function createExcerpt(text, length = 150) {
    const plainText = text.replace(/[#*`\[\]]/g, '').trim();
    if (plainText.length <= length) return plainText;
    return plainText.substring(0, length).trim() + '...';
}

// Initialize search
function initializeSearch() {
    const searchInput = document.getElementById('searchPosts');
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.blog-card');
        
        cards.forEach(card => {
            const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.blog-card-excerpt').textContent.toLowerCase();
            
            if (title.includes(query) || excerpt.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Check if all cards are hidden
        const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
        if (visibleCards.length === 0 && query) {
            document.getElementById('blogGrid').innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>No results found</h3>
                    <p>Try a different search term</p>
                </div>
            `;
        } else if (visibleCards.length === 0 && !query) {
            renderPosts(allPosts);
        }
    });
}

// Show empty state
function showEmptyState() {
    document.getElementById('blogGrid').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
}
