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
                    <span><i class="far fa-calendar"></i> ${formatDate(post.date)}</span>
                </div>
                ${post.tags ? `
                <div class="blog-card-tags">
                    ${post.tags.split(',').slice(0, 3).map(t => `<span class="tag">${t.trim()}</span>`).join('')}
                </div>
                ` : ''}
                <h3 class="blog-card-title">
                    <a href="/blog/${post.slug}">${post.title}</a>
                </h3>
                <p class="blog-card-excerpt">${post.description || post.excerpt}</p>
                <a href="/blog/${post.slug}" class="read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
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
    // Try to get slug from URL params first (direct access to post.html?slug=xyz)
    const urlParams = new URLSearchParams(window.location.search);
    let slug = urlParams.get('slug');
    
    // If no slug in params, try to extract from clean URL path (/blog/slug-name)
    if (!slug) {
        const path = window.location.pathname;
        console.log('No slug in params, checking path:', path);
        
        // Match /blog/slug-name pattern
        const match = path.match(/\/blog\/([^\/]+)/);
        if (match && match[1]) {
            slug = match[1];
            console.log('Extracted slug from path:', slug);
        }
    }
    
    console.log('Loading post with slug:', slug);
    
    if (!slug) {
        console.error('No slug provided in URL params or path');
        showPostNotFound();
        return;
    }
    
    try {
        const url = `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/posts/${slug}.md`;
        console.log('Fetching from URL:', url);
        
        // Add timeout to prevent infinite loading
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Post not found - Status: ${response.status}`);
        }
        
        const content = await response.text();
        console.log('Content length:', content.length);
        
        const { frontmatter, body } = parseFrontmatter(content);
        console.log('Parsed frontmatter:', frontmatter);
        
        if (!frontmatter.title) {
            throw new Error('Invalid post format - missing title');
        }
        
        renderPost(frontmatter, body);
        setupShareButtons(frontmatter.title);
        
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Request timed out after 10 seconds');
        } else {
            console.error('Error loading post:', error);
        }
        showPostNotFound();
    }
}

function renderPost(frontmatter, body) {
    try {
        const loadingEl = document.getElementById('loadingPost');
        const articleEl = document.getElementById('postArticle');
        const heroEl = document.getElementById('postHero');
        
        if (!loadingEl || !articleEl || !heroEl) {
            throw new Error('Required DOM elements not found');
        }
        
        // Update page meta
        const pageTitle = document.getElementById('pageTitle');
        const pageDesc = document.getElementById('pageDescription');
        
        if (pageTitle) pageTitle.textContent = `${frontmatter.title} - Astra Forensics`;
        if (pageDesc) pageDesc.content = frontmatter.description || body.substring(0, 160);
        
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
        
        const postTitle = document.getElementById('postTitle');
        const postDate = document.getElementById('postDate');
        const readTime = document.getElementById('readTime');
        
        if (postTitle) postTitle.textContent = frontmatter.title;
        if (postDate) postDate.textContent = formatDate(frontmatter.date);
        
        // Calculate read time
        const wordCount = body.split(/\s+/).length;
        const readTimeMin = Math.ceil(wordCount / 200);
        if (readTime) readTime.textContent = readTimeMin;
        
        // Render tags
        const postTags = document.getElementById('postTags');
        if (postTags && frontmatter.tags) {
            const tagsHtml = frontmatter.tags.split(',').slice(0, 5).map(tag => 
                `<span class="tag">${tag.trim()}</span>`
            ).join('');
            postTags.innerHTML = tagsHtml;
        }
        
        // Render content with image URL handling
        const postContent = document.getElementById('postContent');
        if (postContent) {
            if (typeof marked !== 'undefined') {
                let htmlContent = marked.parse(body);
                
                // Fix relative image URLs in content
                htmlContent = htmlContent.replace(/src="\/uploads\//g, 
                    `src="https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/uploads/`
                );
                htmlContent = htmlContent.replace(/src="uploads\//g, 
                    `src="https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/uploads/`
                );
                
                postContent.innerHTML = htmlContent;
            } else {
                console.warn('Marked.js not loaded, displaying plain text');
                postContent.textContent = body;
            }
        }
        
        // Show article
        console.log('Rendering complete, showing article');
        loadingEl.style.display = 'none';
        articleEl.style.display = 'block';
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error rendering post:', error);
        showPostNotFound();
    }
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

function initializeBlog() {
    console.log('Initializing blog system...');
    console.log('Current URL:', window.location.href);
    console.log('URL params:', window.location.search);
    
    // Check which page we're on
    const blogGrid = document.getElementById('blogGrid');
    const searchInput = document.getElementById('searchInput');
    const postArticle = document.getElementById('postArticle');
    
    console.log('Elements found:', {
        blogGrid: !!blogGrid,
        searchInput: !!searchInput,
        postArticle: !!postArticle
    });
    
    if (blogGrid && searchInput) {
        // Blog listing page
        console.log('Initializing blog listing...');
        initBlogListing();
    } else if (postArticle) {
        // Single post page
        console.log('Initializing single post...');
        initSinglePost();
    } else {
        console.error('Could not determine page type');
    }
}

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBlog);
} else {
    // DOM is already ready, run immediately
    initializeBlog();
}
