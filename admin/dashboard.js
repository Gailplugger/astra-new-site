// Check authentication
if (localStorage.getItem('astraAdmin') !== 'authenticated') {
    window.location.href = 'login.html';
}

// Global state
let allPosts = [];
let currentEditingPost = null;
let uploadedImagePath = '';

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    loadUserInfo();
    loadGitHubSettings();
    await loadPosts();
    initializeEventListeners();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('postDate').value = today;
});

// Load user info
function loadUserInfo() {
    const username = localStorage.getItem('astraAdminUser') || 'Admin';
    document.getElementById('userName').textContent = username.charAt(0).toUpperCase() + username.slice(1);
}

// Load GitHub settings from localStorage
function loadGitHubSettings() {
    const token = localStorage.getItem('github_token');
    const owner = localStorage.getItem('github_owner');
    const repo = localStorage.getItem('github_repo');
    const branch = localStorage.getItem('github_branch');

    if (token) document.getElementById('githubToken').value = token;
    if (owner) document.getElementById('githubOwner').value = owner;
    if (repo) document.getElementById('githubRepo').value = repo;
    if (branch) document.getElementById('githubBranch').value = branch;
}

// Save GitHub settings
function saveGitHubSettings() {
    const token = document.getElementById('githubToken').value;
    const owner = document.getElementById('githubOwner').value;
    const repo = document.getElementById('githubRepo').value;
    const branch = document.getElementById('githubBranch').value;

    if (token) localStorage.setItem('github_token', token);
    if (owner) localStorage.setItem('github_owner', owner);
    if (repo) localStorage.setItem('github_repo', repo);
    if (branch) localStorage.setItem('github_branch', branch);

    showToast('Settings saved successfully!', 'success');
}

// Initialize event listeners
function initializeEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Navigation
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.getAttribute('data-view');
            switchView(view);
        });
    });

    // New post buttons
    document.getElementById('newPostBtn').addEventListener('click', (e) => {
        e.preventDefault();
        openNewPostModal();
    });
    document.getElementById('topNewPostBtn').addEventListener('click', openNewPostModal);

    // Modal controls
    document.getElementById('closeModalBtn').addEventListener('click', closePostModal);
    document.getElementById('cancelModalBtn').addEventListener('click', closePostModal);
    document.getElementById('postModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closePostModal();
    });

    // Delete modal controls
    document.getElementById('closeDeleteModalBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);

    // Form submission
    document.getElementById('postForm').addEventListener('submit', handleSavePost);

    // Image upload
    document.getElementById('imageUpload').addEventListener('click', () => {
        document.getElementById('imageInput').click();
    });
    document.getElementById('imageInput').addEventListener('change', handleImageSelect);

    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Refresh posts
    document.getElementById('refreshPostsBtn').addEventListener('click', async () => {
        await loadPosts();
        showToast('Posts refreshed!', 'success');
    });

    // Save settings
    document.getElementById('saveSettingsBtn').addEventListener('click', saveGitHubSettings);
}

// Switch views
function switchView(view) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`.nav-item[data-view="${view}"]`)?.classList.add('active');

    // Hide all views
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('postsView').style.display = 'none';
    document.getElementById('settingsView').style.display = 'none';

    // Show selected view
    if (view === 'dashboard') {
        document.getElementById('pageTitle').textContent = 'Dashboard';
        document.getElementById('dashboardView').style.display = 'block';
    } else if (view === 'posts') {
        document.getElementById('pageTitle').textContent = 'All Posts';
        document.getElementById('postsView').style.display = 'block';
        renderAllPosts();
    } else if (view === 'settings') {
        document.getElementById('pageTitle').textContent = 'Settings';
        document.getElementById('settingsView').style.display = 'block';
    }
}

// Load posts
async function loadPosts() {
    try {
        allPosts = await listPosts();
        updateDashboardStats();
        renderRecentPosts();
        renderAllPosts();
    } catch (error) {
        console.error('Error loading posts:', error);
        showToast('Failed to load posts. Check GitHub settings.', 'error');
    }
}

// Update dashboard stats
function updateDashboardStats() {
    document.getElementById('totalPosts').textContent = allPosts.length;
    document.getElementById('publishedPosts').textContent = allPosts.length;
    document.getElementById('totalImages').textContent = '-';
    
    if (allPosts.length > 0) {
        const latestDate = allPosts[0].name.substring(0, 10);
        document.getElementById('lastUpdated').textContent = formatDate(latestDate);
    }
}

// Render recent posts (top 5)
function renderRecentPosts() {
    const recentPosts = allPosts.slice(0, 5);
    const container = document.getElementById('recentPostsList');
    
    if (recentPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p>No posts yet. Create your first post!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = recentPosts.map(post => `
        <div class="post-item">
            <div class="post-info">
                <div class="post-title">${extractTitle(post.name)}</div>
                <div class="post-meta">${formatDate(extractDate(post.name))}</div>
            </div>
            <div class="post-actions">
                <button class="btn btn-secondary btn-sm" onclick="editPost('${post.name}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="showDeleteModal('${post.name}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Render all posts
function renderAllPosts() {
    const container = document.getElementById('allPostsList');
    
    if (allPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p>No posts found. Create your first post!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = allPosts.map(post => `
        <div class="post-item" data-filename="${post.name}">
            <div class="post-info">
                <div class="post-title">${extractTitle(post.name)}</div>
                <div class="post-meta">${formatDate(extractDate(post.name))} • ${post.size} bytes</div>
            </div>
            <div class="post-actions">
                <button class="btn btn-secondary btn-sm" onclick="editPost('${post.name}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="showDeleteModal('${post.name}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Handle search
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const items = document.querySelectorAll('#allPostsList .post-item');
    
    items.forEach(item => {
        const title = item.querySelector('.post-title').textContent.toLowerCase();
        item.style.display = title.includes(query) ? 'flex' : 'none';
    });
}

// Open new post modal
function openNewPostModal() {
    currentEditingPost = null;
    document.getElementById('modalTitle').textContent = 'Create New Post';
    document.getElementById('saveButtonText').textContent = 'Publish Post';
    document.getElementById('postForm').reset();
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('postDate').value = today;
    document.getElementById('postAuthor').value = 'Astra Forensics';
    
    // Clear image preview
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('uploadText').style.display = 'block';
    uploadedImagePath = '';
    
    document.getElementById('postModal').classList.add('active');
}

// Edit post
async function editPost(filename) {
    try {
        showToast('Loading post...', 'success');
        const post = await getPost(filename);
        const { frontmatter, body } = parseFrontmatter(post.content);

        currentEditingPost = {
            filename: filename,
            sha: post.sha
        };

        document.getElementById('modalTitle').textContent = 'Edit Post';
        document.getElementById('saveButtonText').textContent = 'Update Post';
        document.getElementById('postTitle').value = frontmatter.title || '';
        document.getElementById('postDate').value = frontmatter.date || '';
        document.getElementById('postAuthor').value = frontmatter.author || 'Astra Forensics';
        document.getElementById('postImage').value = frontmatter.image || '';
        document.getElementById('postContent').value = body;
        document.getElementById('postFilename').value = filename;
        document.getElementById('postSha').value = post.sha;

        // Show image preview if exists
        if (frontmatter.image) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${frontmatter.image}" alt="Preview">`;
            preview.style.display = 'block';
            document.getElementById('uploadText').style.display = 'none';
        }

        document.getElementById('postModal').classList.add('active');
    } catch (error) {
        console.error('Error loading post:', error);
        showToast('Failed to load post', 'error');
    }
}

// Close post modal
function closePostModal() {
    document.getElementById('postModal').classList.remove('active');
    currentEditingPost = null;
}

// Handle image select
function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB', 'error');
        return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        preview.style.display = 'block';
        document.getElementById('uploadText').style.display = 'none';
    };
    reader.readAsDataURL(file);

    // Upload image
    uploadImageToGitHub(file);
}

// Upload image to GitHub
async function uploadImageToGitHub(file) {
    try {
        showToast('Uploading image...', 'success');
        
        const reader = new FileReader();
        reader.onload = async function(e) {
            const base64Content = e.target.result;
            const timestamp = Date.now();
            const filename = `${timestamp}-${file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase()}`;
            
            try {
                const imagePath = await uploadImage(filename, base64Content);
                uploadedImagePath = imagePath;
                document.getElementById('postImage').value = imagePath;
                showToast('Image uploaded successfully!', 'success');
            } catch (error) {
                console.error('Upload error:', error);
                showToast('Failed to upload image', 'error');
            }
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Error uploading image:', error);
        showToast('Failed to upload image', 'error');
    }
}

// Handle save post
async function handleSavePost(e) {
    e.preventDefault();

    const title = document.getElementById('postTitle').value.trim();
    const date = document.getElementById('postDate').value;
    const author = document.getElementById('postAuthor').value.trim();
    const image = document.getElementById('postImage').value.trim();
    const content = document.getElementById('postContent').value.trim();

    if (!title || !date || !author || !content) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    const saveButton = document.getElementById('savePostBtn');
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<span class="loading"></span> Saving...';
    saveButton.disabled = true;

    try {
        const frontmatter = generateFrontmatter(title, date, author, image);
        const fullContent = frontmatter + content;

        if (currentEditingPost) {
            // Update existing post
            await updatePost(
                currentEditingPost.filename,
                fullContent,
                currentEditingPost.sha,
                `Update: ${title}`
            );
            showToast('Post updated successfully!', 'success');
        } else {
            // Create new post
            const filename = generateFilename(title, date);
            await createPost(filename, fullContent, `Create: ${title}`);
            showToast('Post published successfully!', 'success');
        }

        closePostModal();
        await loadPosts();
    } catch (error) {
        console.error('Error saving post:', error);
        showToast('Failed to save post: ' + error.message, 'error');
    } finally {
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
    }
}

// Show delete modal
function showDeleteModal(filename) {
    const title = extractTitle(filename);
    document.getElementById('deletePostTitle').textContent = title;
    document.getElementById('deleteModal').setAttribute('data-filename', filename);
    document.getElementById('deleteModal').classList.add('active');
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
}

// Confirm delete
async function confirmDelete() {
    const modal = document.getElementById('deleteModal');
    const filename = modal.getAttribute('data-filename');
    
    const deleteButton = document.getElementById('confirmDeleteBtn');
    const originalText = deleteButton.innerHTML;
    deleteButton.innerHTML = '<span class="loading"></span> Deleting...';
    deleteButton.disabled = true;

    try {
        // Get post SHA
        const post = await getPost(filename);
        await deletePost(filename, post.sha, `Delete: ${extractTitle(filename)}`);
        
        showToast('Post deleted successfully!', 'success');
        closeDeleteModal();
        await loadPosts();
    } catch (error) {
        console.error('Error deleting post:', error);
        showToast('Failed to delete post: ' + error.message, 'error');
    } finally {
        deleteButton.innerHTML = originalText;
        deleteButton.disabled = false;
    }
}

// Logout
function logout() {
    localStorage.removeItem('astraAdmin');
    localStorage.removeItem('astraAdminUser');
    localStorage.removeItem('astraLoginTime');
    window.location.href = 'login.html';
}

// Utility functions
function extractTitle(filename) {
    // Remove date (YYYY-MM-DD-) and .md extension
    return filename
        .substring(11) // Remove date
        .replace('.md', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

function extractDate(filename) {
    return filename.substring(0, 10); // YYYY-MM-DD
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span style="font-size: 20px;">${type === 'success' ? '✓' : '✗'}</span>
        <span class="toast-message">${message}</span>
    `;
    
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Make functions globally accessible
window.editPost = editPost;
window.showDeleteModal = showDeleteModal;
