// Blog listing page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
    setupNewsletterForm();
});

const POSTS_PER_PAGE = 6;
let currentPage = 1;
let allPosts = [];

async function loadBlogPosts() {
    const blogGrid = document.getElementById('blogGrid');
    
    try {
        // Fetch all blog post files from GitHub
        const response = await fetch('https://api.github.com/repos/Gailplugger/astra-new-site/contents/blog');
        
        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }
        
        const files = await response.json();
        const mdFiles = files.filter(file => file.name.endsWith('.md'));
        
        // Fetch content for each markdown file
        const postPromises = mdFiles.map(async (file) => {
            const contentResponse = await fetch(file.download_url);
            const content = await contentResponse.text();
            return parseMarkdownPost(content, file.name);
        });
        
        allPosts = await Promise.all(postPromises);
        
        // Filter published posts and sort by date (newest first)
        allPosts = allPosts
            .filter(post => post.published !== false)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (allPosts.length === 0) {
            blogGrid.innerHTML = '<div class="no-posts"><i class="fas fa-inbox"></i><p>No blog posts yet. Check back soon!</p></div>';
            return;
        }
        
        displayPosts(currentPage);
        setupPagination();
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogGrid.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i><p>Failed to load blog posts. Please try again later.</p></div>';
    }
}

function parseMarkdownPost(content, filename) {
    // Extract frontmatter
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return null;
    }
    
    const frontmatter = match[1];
    const body = match[2];
    
    // Parse frontmatter fields
    const post = {
        slug: filename.replace('.md', ''),
        body: body
    };
    
    // Extract each field
    const lines = frontmatter.split('\n');
    lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Remove quotes
            value = value.replace(/^["']|["']$/g, '');
            
            post[key] = value;
        }
    });
    
    // Extract excerpt from body
    const excerpt = body.substring(0, 200).replace(/[#*`\[\]]/g, '').trim() + '...';
    post.excerpt = post.description || excerpt;
    
    return post;
}

function displayPosts(page) {
    const blogGrid = document.getElementById('blogGrid');
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const postsToDisplay = allPosts.slice(startIndex, endIndex);
    
    blogGrid.innerHTML = postsToDisplay.map(post => `
        <article class="blog-card">
            <div class="blog-card-image">
                <img src="${post.featured_image || 'images/uploads/default-blog.jpg'}" alt="${post.title}">
                <div class="blog-card-overlay">
                    <a href="blog-post.html?post=${post.slug}" class="btn btn-primary btn-small">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
            <div class="blog-card-content">
                <div class="blog-card-meta">
                    <span class="blog-date">
                        <i class="far fa-calendar"></i> ${formatDate(post.date)}
                    </span>
                    <span class="blog-author">
                        <i class="far fa-user"></i> ${post.author || 'Kartik Goyal'}
                    </span>
                </div>
                <h3 class="blog-card-title">
                    <a href="blog-post.html?post=${post.slug}">${post.title}</a>
                </h3>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                ${post.tags ? `
                    <div class="blog-card-tags">
                        ${formatTags(post.tags)}
                    </div>
                ` : ''}
            </div>
        </article>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTags(tags) {
    if (!tags) return '';
    
    // Handle string format "[tag1, tag2]" or comma-separated
    let tagArray = [];
    if (typeof tags === 'string') {
        tags = tags.replace(/[\[\]]/g, '');
        tagArray = tags.split(',').map(tag => tag.trim());
    } else if (Array.isArray(tags)) {
        tagArray = tags;
    }
    
    return tagArray
        .filter(tag => tag)
        .map(tag => `<span class="tag">${tag}</span>`)
        .join('');
}

function setupPagination() {
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    
    if (totalPages <= 1) {
        return; // No pagination needed
    }
    
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageNumbers = document.getElementById('pageNumbers');
    
    pagination.style.display = 'flex';
    
    // Update page numbers
    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-number' + (i === currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.onclick = () => goToPage(i);
        pageNumbers.appendChild(pageBtn);
    }
    
    // Update button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    prevBtn.onclick = () => goToPage(currentPage - 1);
    nextBtn.onclick = () => goToPage(currentPage + 1);
}

function goToPage(page) {
    currentPage = page;
    displayPosts(page);
    setupPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // Here you would typically send to a newsletter service
        alert(`Thank you for subscribing with ${email}! We'll keep you updated.`);
        this.reset();
    });
}
