// Blog post detail page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadBlogPost();
});

async function loadBlogPost() {
    const loadingPost = document.getElementById('loadingPost');
    const postContent = document.getElementById('postContent');
    
    // Get post slug from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');
    
    if (!postSlug) {
        window.location.href = 'blog.html';
        return;
    }
    
    try {
        // Fetch the markdown file from GitHub
        const response = await fetch(`https://raw.githubusercontent.com/Gailplugger/astra-new-site/main/blog/${postSlug}.md`);
        
        if (!response.ok) {
            throw new Error('Post not found');
        }
        
        const content = await response.text();
        const post = parseMarkdownPost(content);
        
        if (!post) {
            throw new Error('Invalid post format');
        }
        
        // Display the post
        displayPost(post, postSlug);
        
        // Load related posts
        loadRelatedPosts(post.tags);
        
        loadingPost.style.display = 'none';
        postContent.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading blog post:', error);
        loadingPost.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Blog post not found</p>
                <a href="blog.html" class="btn btn-primary">Back to Blog</a>
            </div>
        `;
    }
}

function parseMarkdownPost(content) {
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
        body: body
    };
    
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
    
    return post;
}

function displayPost(post, slug) {
    // Update meta tags
    document.getElementById('pageTitle').textContent = `${post.title} - AstraForensics Blog`;
    document.getElementById('pageDescription').content = post.description || '';
    document.getElementById('pageAuthor').content = post.author || 'Kartik Goyal';
    
    // Update Open Graph
    document.getElementById('ogUrl').content = `https://astraforensics.in/blog-post.html?post=${slug}`;
    document.getElementById('ogTitle').content = post.title;
    document.getElementById('ogDescription').content = post.description || '';
    document.getElementById('ogImage').content = post.featured_image || '';
    
    // Update page title
    document.title = `${post.title} - AstraForensics Blog`;
    
    // Update breadcrumb
    document.getElementById('breadcrumbTitle').textContent = post.title;
    
    // Update post header
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postAuthor').textContent = post.author || 'Kartik Goyal';
    document.getElementById('postDate').textContent = formatDate(post.date);
    document.getElementById('postDescription').textContent = post.description || '';
    
    // Update featured image
    const postImage = document.getElementById('postImage');
    postImage.src = post.featured_image || 'images/uploads/default-blog.jpg';
    postImage.alt = post.title;
    
    // Update tags
    const tagsContainer = document.getElementById('postTags');
    if (post.tags) {
        tagsContainer.innerHTML = formatTags(post.tags);
    }
    
    // Parse and display markdown content
    const postBody = document.getElementById('postBody');
    postBody.innerHTML = marked.parse(post.body);
    
    // Add syntax highlighting for code blocks
    postBody.querySelectorAll('pre code').forEach((block) => {
        block.classList.add('code-block');
    });
    
    // Setup share buttons
    setupShareButtons(post.title, slug);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTags(tags) {
    if (!tags) return '';
    
    let tagArray = [];
    if (typeof tags === 'string') {
        tags = tags.replace(/[\[\]]/g, '');
        tagArray = tags.split(',').map(tag => tag.trim());
    } else if (Array.isArray(tags)) {
        tagArray = tags;
    }
    
    return tagArray
        .filter(tag => tag)
        .map(tag => `<span class="tag"><i class="fas fa-tag"></i> ${tag}</span>`)
        .join('');
}

function setupShareButtons(title, slug) {
    const url = encodeURIComponent(`https://astraforensics.in/blog-post.html?post=${slug}`);
    const text = encodeURIComponent(title);
    
    document.getElementById('shareTwitter').href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    document.getElementById('shareLinkedIn').href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
}

async function loadRelatedPosts(currentTags) {
    if (!currentTags) return;
    
    const relatedSection = document.getElementById('relatedPosts');
    const relatedGrid = document.getElementById('relatedPostsGrid');
    
    try {
        // Fetch all blog posts
        const response = await fetch('https://api.github.com/repos/Gailplugger/astra-new-site/contents/blog');
        const files = await response.json();
        const mdFiles = files.filter(file => file.name.endsWith('.md'));
        
        // Get current post slug
        const urlParams = new URLSearchParams(window.location.search);
        const currentSlug = urlParams.get('post');
        
        // Fetch and parse posts
        const postPromises = mdFiles
            .filter(file => file.name.replace('.md', '') !== currentSlug)
            .slice(0, 3)
            .map(async (file) => {
                const contentResponse = await fetch(file.download_url);
                const content = await contentResponse.text();
                const post = parseMarkdownPost(content);
                post.slug = file.name.replace('.md', '');
                return post;
            });
        
        const posts = await Promise.all(postPromises);
        
        if (posts.length > 0) {
            relatedGrid.innerHTML = posts.map(post => `
                <article class="related-post-card">
                    <a href="blog-post.html?post=${post.slug}">
                        <div class="related-post-image">
                            <img src="${post.featured_image || 'images/uploads/default-blog.jpg'}" alt="${post.title}">
                        </div>
                        <div class="related-post-content">
                            <h4>${post.title}</h4>
                            <span class="related-post-date">
                                <i class="far fa-calendar"></i> ${formatDate(post.date)}
                            </span>
                        </div>
                    </a>
                </article>
            `).join('');
            
            relatedSection.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error loading related posts:', error);
    }
}
