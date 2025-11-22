// ============================================
// AUTHENTICATION SYSTEM
// Simple client-side authentication
// ============================================

// CREDENTIALS - Change these for security!
const ADMIN_USERNAME = "kartikgoyal";
const ADMIN_PASSWORD = "K7RTK@2580";

// Check if user is authenticated
function isAuthenticated() {
    const authStatus = localStorage.getItem('admin_authenticated');
    const authTime = localStorage.getItem('admin_auth_time');
    const authUser = localStorage.getItem('admin_username');
    
    // Check if authentication exists and is valid (24 hours)
    if (authStatus === 'true' && authUser && authTime) {
        const loginTime = new Date(authTime);
        const currentTime = new Date();
        const hoursSinceLogin = (currentTime - loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 24) {
            return true;
        } else {
            // Session expired
            logout();
            return false;
        }
    }
    
    return false;
}

// Get current username
function getUsername() {
    return localStorage.getItem('admin_username') || 'Unknown';
}

// Login function
function login(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_username', username);
        localStorage.setItem('admin_auth_time', new Date().toISOString());
        return true;
    }
    return false;
}

// Logout function
function logout() {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_auth_time');
    window.location.href = 'index.html';
}

// Initialize login page
if (document.getElementById('loginForm')) {
    // Check if already logged in
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
    
    // Handle login form submission
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        const loginBtn = document.getElementById('loginBtn');
        const btnText = document.getElementById('loginBtnText');
        const btnLoader = document.getElementById('loginBtnLoader');
        
        // Show loading state
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        errorMessage.style.display = 'none';
        
        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (login(username, password)) {
            // Success
            errorMessage.style.display = 'none';
            window.location.href = 'dashboard.html';
        } else {
            // Failed
            errorMessage.textContent = 'Invalid username or password';
            errorMessage.style.display = 'block';
            loginBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            
            // Shake animation
            document.querySelector('.login-card').classList.add('shake');
            setTimeout(() => {
                document.querySelector('.login-card').classList.remove('shake');
            }, 500);
        }
    });
}

// Initialize authenticated pages
if (document.getElementById('logoutBtn')) {
    // Check if authenticated
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
    }
    
    // Display username
    const userEl = document.getElementById('adminUser');
    if (userEl) {
        userEl.textContent = getUsername();
    }
    
    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    });
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = savedTheme === 'light' ? '🌙' : '☀️';
        }
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            icon.textContent = newTheme === 'light' ? '🌙' : '☀️';
        });
    }
}
