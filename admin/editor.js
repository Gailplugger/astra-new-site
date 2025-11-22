// ============================================
// POST EDITOR FUNCTIONALITY
// ============================================

// Check authentication
if (!isAuthenticated()) {
    window.location.href = 'index.html';
}

// Display username
document.getElementById('adminUser').textContent = getUsername();

// Set today's date as default
document.getElementById('postDate').value = new Date().toISOString().split('T')[0];

// ============================================
// SLUG PREVIEW
// ============================================

document.getElementById('postTitle').addEventListener('input', (e) => {
    const slug = generateSlug(e.target.value || 'title');
    document.getElementById('slugPreview').textContent = slug;
});

// ============================================
// IMAGE UPLOAD
// ============================================

const uploadArea = document.getElementById('imageUploadArea');
const fileInput = document.getElementById('coverImageInput');
const preview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const uploadPrompt = document.getElementById('uploadPrompt');
const removeBtn = document.getElementById('removeImage');
const urlInput = document.getElementById('coverImageUrl');

// Click to upload
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// File selected
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be less than 5MB', 'error');
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = async (e) => {
        previewImg.src = e.target.result;
        uploadPrompt.style.display = 'none';
        preview.style.display = 'block';
        
        // Upload to GitHub
        showToast('Uploading image...', 'success');
        try {
            const timestamp = Date.now();
            const safeFilename = file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase();
            const filename = `${timestamp}-${safeFilename}`;
            
            const imageUrl = await uploadImage(filename, e.target.result);
            urlInput.value = imageUrl;
            showToast('Image uploaded successfully!', 'success');
        } catch (error) {
            showToast('Upload failed: ' + error.message, 'error');
            console.error('Upload error:', error);
        }
    };
    reader.readAsDataURL(file);
});

// Remove image
removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    preview.style.display = 'none';
    uploadPrompt.style.display = 'block';
    fileInput.value = '';
    urlInput.value = '';
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#667eea';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e5e7eb';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e5e7eb';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change'));
    }
});

// ============================================
// MARKDOWN TOOLBAR
// ============================================

const toolbar = document.querySelectorAll('.toolbar-btn');
const textarea = document.getElementById('postContent');
const markdownPreview = document.getElementById('markdownPreview');
let previewMode = false;

toolbar.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.getAttribute('data-action');
        
        if (action === 'preview') {
            previewMode = !previewMode;
            if (previewMode) {
                // Show preview
                if (typeof marked !== 'undefined') {
                    markdownPreview.innerHTML = marked.parse(textarea.value);
                } else {
                    markdownPreview.textContent = textarea.value;
                }
                textarea.style.display = 'none';
                markdownPreview.style.display = 'block';
                btn.style.background = '#667eea';
                btn.style.color = 'white';
            } else {
                // Show editor
                textarea.style.display = 'block';
                markdownPreview.style.display = 'none';
                btn.style.background = '';
                btn.style.color = '';
            }
            return;
        }
        
        insertMarkdown(action);
    });
});

function insertMarkdown(action) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let replacement = '';
    let cursorOffset = 0;
    
    switch (action) {
        case 'bold':
            replacement = `**${selectedText || 'bold text'}**`;
            cursorOffset = selectedText ? replacement.length : 2;
            break;
        case 'italic':
            replacement = `*${selectedText || 'italic text'}*`;
            cursorOffset = selectedText ? replacement.length : 1;
            break;
        case 'heading':
            replacement = `## ${selectedText || 'Heading'}`;
            cursorOffset = selectedText ? replacement.length : 3;
            break;
        case 'link':
            replacement = `[${selectedText || 'link text'}](url)`;
            cursorOffset = selectedText ? replacement.length - 4 : replacement.length - 4;
            break;
        case 'image':
            replacement = `![alt text](image-url)`;
            cursorOffset = 11;
            break;
        case 'code':
            replacement = `\`\`\`\n${selectedText || 'code'}\n\`\`\``;
            cursorOffset = selectedText ? replacement.length - 4 : 4;
            break;
        case 'list':
            replacement = `- ${selectedText || 'list item'}`;
            cursorOffset = replacement.length;
            break;
    }
    
    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
}

// ============================================
// DRAFT SAVING
// ============================================

function saveDraft() {
    const draft = {
        title: document.getElementById('postTitle').value,
        date: document.getElementById('postDate').value,
        description: document.getElementById('postDescription').value,
        tags: document.getElementById('postTags').value,
        coverImage: document.getElementById('coverImageUrl').value,
        content: document.getElementById('postContent').value
    };
    
    localStorage.setItem('post_draft', JSON.stringify(draft));
    showToast('Draft saved!', 'success');
}

// Auto-save draft every 30 seconds
setInterval(() => {
    if (document.getElementById('postContent').value.trim()) {
        saveDraft();
    }
}, 30000);

// Load draft on new post page
if (document.getElementById('isEditMode').value === 'false') {
    const draft = localStorage.getItem('post_draft');
    if (draft) {
        const confirmed = confirm('Found a saved draft. Would you like to load it?');
        if (confirmed) {
            const data = JSON.parse(draft);
            document.getElementById('postTitle').value = data.title || '';
            document.getElementById('postDate').value = data.date || '';
            document.getElementById('postDescription').value = data.description || '';
            document.getElementById('postTags').value = data.tags || '';
            document.getElementById('coverImageUrl').value = data.coverImage || '';
            document.getElementById('postContent').value = data.content || '';
            
            if (data.coverImage) {
                previewImg.src = data.coverImage;
                uploadPrompt.style.display = 'none';
                preview.style.display = 'block';
            }
            
            // Update slug preview
            if (data.title) {
                document.getElementById('slugPreview').textContent = generateSlug(data.title);
            }
        }
    }
}

// ============================================
// FORM SUBMISSION
// ============================================

document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('postTitle').value.trim();
    const date = document.getElementById('postDate').value;
    const description = document.getElementById('postDescription').value.trim();
    const tags = document.getElementById('postTags').value.trim();
    const coverImage = document.getElementById('coverImageUrl').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const isEditMode = document.getElementById('isEditMode').value === 'true';
    const existingSlug = document.getElementById('postSlug').value;
    const existingSha = document.getElementById('postSha').value;
    
    // Validation
    if (!title || !date || !content) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Generate slug
    const slug = isEditMode && existingSlug ? existingSlug : generateSlug(title);
    
    // Generate full content with frontmatter
    const fullContent = generateFrontmatter(title, date, description, tags, coverImage) + content;
    
    // Show loading
    const btnText = document.getElementById('publishBtnText');
    const btnLoader = document.getElementById('publishBtnLoader');
    const publishBtn = document.getElementById('publishBtn');
    
    publishBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    
    try {
        if (isEditMode && existingSha) {
            // Update existing post
            console.log('Updating post with SHA:', existingSha);
            await updatePost(slug, fullContent, existingSha, `Update: ${title}`);
            showToast('Post updated successfully!', 'success');
        } else {
            // Create new post (will auto-update if exists)
            console.log('Creating new post:', slug);
            await createPost(slug, fullContent, `Create: ${title}`);
            showToast('Post published successfully!', 'success');
        }
        
        // Clear draft
        localStorage.removeItem('post_draft');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        console.error('Publish error:', error);
        
        // Better error messages
        let errorMsg = error.message;
        if (errorMsg.includes('sha')) {
            errorMsg = 'File already exists. Please edit the existing post instead of creating a new one.';
        } else if (errorMsg.includes('401')) {
            errorMsg = 'Invalid GitHub token. Please reconfigure in dashboard.';
        } else if (errorMsg.includes('404')) {
            errorMsg = 'Repository or folder not found. Check your GitHub settings.';
        }
        
        showToast('Failed to publish: ' + errorMsg, 'error');
        
        publishBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});

// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
