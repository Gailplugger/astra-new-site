// ============================================
// BLOG LOADER - Public Blog Pages
// ============================================

// Configuration
const GITHUB_CONFIG = {
    username: localStorage.getItem('github_username') || 'Gailplugger',
    repo: localStorage.getItem('github_repo') || 'astra-new-site',
    branch: 'main'
};

const POSTS_PER_PAGE = 9;
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
let selectedTag = null;

// ============================================
// GITHUB API FUNCTIONS
// ============================================

async function fetchPosts() {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/posts?ref=${GITHUB_CONFIG.branch}`;
    
    try {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const files = await response.json();
        return files.filter(f => f.name.endsWith('.md'));
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

async function fetchPostContent(file) {
    try {
        const response = await fetch(file.download_url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const content = await response.text();
        return parseFrontmatter(content);
    } catch (error) {
        console.error('Error fetching post content:', error);
        return null;
    }
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

// ============================================
// BLOG LISTING PAGE
// ============================================

async function initBlogListing() {
    const loadingEl = document.getElementById('blogLoading');
    const emptyEl = document.getElementById('blogEmpty');
    const gridEl = document.getElementById('blogGrid');
    
    if (!loadingEl || !gridEl) return;
    
    try {
        const files = await fetchPosts();
        
        if (files.length === 0) {
            loadingEl.style.display = 'none';
            emptyEl.style.display = 'block';
            return;
        }
        
        // Fetch all post details
        const postPromises = files.map(async file => {
            const parsed = await fetchPostContent(file);
            if (!parsed) return null;
            
            return {
                slug: file.name.replace('.md', ''),
                ...parsed.frontmatter,
                excerpt: parsed.body.substring(0, 150) + '...'
            };
        });
        
        allPosts = (await Promise.all(postPromises)).filter(p => p !== null);
        
        // Sort by date (newest first)
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        filteredPosts = [...allPosts];
        
        loadingEl.style.display = 'none';
        gridEl.style.display = 'grid';
        
        renderTags();
        renderPosts();
        setupSearch();
        
    } catch (error) {
        console.error('Error initializing blog:', error);
        loadingEl.style.display = 'none';
        emptyEl.style.display = 'block';
    }
}

function renderTags() {
    const tagsContainer = document.getElementById('filterTags');
    if (!tagsContainer) return;
    
    const allTags = new Set();
    allPosts.forEach(post => {
        if (post.tags) {
            post.tags.split(',').forEach(tag => allTags.add(tag.trim()));
        }
    });
    
    const tagButtons = Array.from(allTags).map(tag => 
        `<button class="filter-tag" data-tag="${tag}" onclick="filterByTag('${tag}')">${tag}</button>`
    ).join('');
    
    tagsContainer.innerHTML = `
        <button class="filter-tag active" onclick="filterByTag(null)">All</button>
        ${tagButtons}
    `;
}

function renderPosts() {
    const gridEl = document.getElementById('blogGrid');
    const paginationEl = document.getElementById('pagination');
    
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);
    
    if (postsToShow.length === 0) {
        gridEl.innerHTML = '<div class="empty-state"><h3>No posts found</h3><p>Try a different search or filter</p></div>';
        paginationEl.style.display = 'none';
        return;
    }
    
    gridEl.innerHTML = postsToShow.map(post => {
        // Handle both relative and absolute image URLs
        let imageUrl = post.cover_image || '';
        if (imageUrl && !imageUrl.startsWith('http')) {
            // Convert relative path to GitHub raw URL
            imageUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}${imageUrl}`;
        }
        
        return `
        <article class="blog-card">
            ${imageUrl ? `
                <div class="blog-card-image">
                    <img src="${imageUrl}" alt="${post.title}" loading="lazy" onerror="this.parentElement.style.display='none'">
                </div>
            ` : ''}
            <div class="blog-card-content">
                <div class="blog-card-meta">
                    <span>📅 ${formatDate(post.date)}</span>
                    ${post.tags ? post.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('') : ''}
                </div>
                <h3>${post.title}</h3>
                <p>${post.description || post.excerpt}</p>
                <a href="/blog/${post.slug}" class="read-more">Read More →</a>
            </div>
        </article>
        `;
    }).join('');
    
    // Render pagination
    if (filteredPosts.length > POSTS_PER_PAGE) {
        renderPagination();
        paginationEl.style.display = 'flex';
    } else {
        paginationEl.style.display = 'none';
    }
}

function renderPagination() {
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginationEl = document.getElementById('pagination');
    
    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        buttons += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    paginationEl.innerHTML = `
        <button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>← Prev</button>
        ${buttons}
        <button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>
    `;
}

window.filterByTag = function(tag) {
    selectedTag = tag;
    
    // Update active tag button
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tag === tag || (!btn.dataset.tag && !tag));
    });
    
    // Filter posts
    if (tag) {
        filteredPosts = allPosts.filter(post => 
            post.tags && post.tags.split(',').map(t => t.trim()).includes(tag)
        );
    } else {
        filteredPosts = [...allPosts];
    }
    
    currentPage = 1;
    renderPosts();
};

window.goToPage = function(page) {
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!searchInput || !searchBtn) return;
    
    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) {
            filteredPosts = selectedTag 
                ? allPosts.filter(post => post.tags && post.tags.split(',').map(t => t.trim()).includes(selectedTag))
                : [...allPosts];
        } else {
            filteredPosts = allPosts.filter(post => 
                post.title.toLowerCase().includes(query) ||
                (post.description && post.description.toLowerCase().includes(query)) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
                (post.tags && post.tags.toLowerCase().includes(query))
            );
            
            if (selectedTag) {
                filteredPosts = filteredPosts.filter(post => 
                    post.tags && post.tags.split(',').map(t => t.trim()).includes(selectedTag)
                );
            }
        }
        
        currentPage = 1;
        renderPosts();
    };
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// ============================================
// SINGLE POST PAGE
// ============================================

async function initSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        showPostNotFound();
        return;
    }
    
    try {
        const url = `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/posts/${slug}.md`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Post not found');
        }
        
        const content = await response.text();
        const { frontmatter, body } = parseFrontmatter(content);
        
        renderPost(frontmatter, body);
        setupShareButtons(frontmatter.title);
        
    } catch (error) {
        console.error('Error loading post:', error);
        showPostNotFound();
    }
}

function renderPost(frontmatter, body) {
    const loadingEl = document.getElementById('loadingPost');
    const articleEl = document.getElementById('postArticle');
    const heroEl = document.getElementById('postHero');
    
    // Update page meta
    document.getElementById('pageTitle').textContent = `${frontmatter.title} - Astra Forensics`;
    document.getElementById('pageDescription').content = frontmatter.description || body.substring(0, 160);
    
    // Update hero with proper image URL
    if (frontmatter.cover_image) {
        let imageUrl = frontmatter.cover_image;
        // Convert relative path to GitHub raw URL if needed
        if (!imageUrl.startsWith('http')) {
            imageUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}${imageUrl}`;
        }
        heroEl.style.backgroundImage = `url(${imageUrl})`;
        heroEl.classList.add('has-image');
    }
    
    document.getElementById('postTitle').textContent = frontmatter.title;
    document.getElementById('postDate').textContent = formatDate(frontmatter.date);
    
    // Calculate read time
    const wordCount = body.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    document.getElementById('readTime').textContent = readTime;
    
    // Render tags
    if (frontmatter.tags) {
        const tagsHtml = frontmatter.tags.split(',').map(tag => 
            `<span class="tag">${tag.trim()}</span>`
        ).join('');
        document.getElementById('postTags').innerHTML = tagsHtml;
    }
    
    // Render content with image URL handling
    if (typeof marked !== 'undefined') {
        let htmlContent = marked.parse(body);
        
        // Fix relative image URLs in content
        htmlContent = htmlContent.replace(/src="\/uploads\//g, 
            `src="https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/uploads/`
        );
        htmlContent = htmlContent.replace(/src="uploads\//g, 
            `src="https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/uploads/`
        );
        
        document.getElementById('postContent').innerHTML = htmlContent;
    } else {
        document.getElementById('postContent').textContent = body;
    }
    
    // Show article
    loadingEl.style.display = 'none';
    articleEl.style.display = 'block';
}

function showPostNotFound() {
    document.getElementById('loadingPost').style.display = 'none';
    document.getElementById('postNotFound').style.display = 'block';
}

function setupShareButtons(title) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    
    document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    document.getElementById('shareTwitter').href = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    document.getElementById('shareLinkedIn').href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    document.getElementById('shareWhatsApp').href = `https://wa.me/?text=${text}%20${url}`;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on
    if (document.getElementById('blogGrid') && document.getElementById('searchInput')) {
        // Blog listing page
        initBlogListing();
    } else if (document.getElementById('postArticle')) {
        // Single post page
        initSinglePost();
    }
});
