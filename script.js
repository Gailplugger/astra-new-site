// ===========================
// Mobile Navigation Toggle
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
        
        // Close menu when clicking on a link (except courses link)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Check if it's a courses link
                if (link.getAttribute('href') === 'courses.html' || 
                    link.textContent.includes('Courses') || 
                    link.textContent.includes('OUR COURSES')) {
                    e.preventDefault();
                    showCoursesModal();
                    // Still close mobile menu
                    navMenu.classList.remove('active');
                    const spans = navToggle.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = 'none';
                        span.style.opacity = '1';
                    });
                } else {
                    navMenu.classList.remove('active');
                    const spans = navToggle.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = 'none';
                        span.style.opacity = '1';
                    });
                }
            });
        });
    }
});

// ===========================
// Courses Modal Functionality
// ===========================
function showCoursesModal() {
    const modal = document.getElementById('coursesModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function hideCoursesModal() {
    const modal = document.getElementById('coursesModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('coursesModal');
    const modalClose = document.getElementById('modalClose');
    const modalOkBtn = document.querySelector('.modal-btn-ok');
    
    // Close button
    if (modalClose) {
        modalClose.addEventListener('click', hideCoursesModal);
    }
    
    // OK button
    if (modalOkBtn) {
        modalOkBtn.addEventListener('click', hideCoursesModal);
    }
    
    // Click outside modal to close
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideCoursesModal();
            }
        });
    }
    
    // Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            hideCoursesModal();
        }
    });
    
    // Intercept courses links
    const allCoursesLinks = document.querySelectorAll('a[href*="courses"]');
    allCoursesLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showCoursesModal();
        });
    });
    
    // If we're on the courses page, show modal immediately and redirect
    if (window.location.pathname.includes('courses.html')) {
        showCoursesModal();
        // Optionally redirect after modal is closed
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (modal && !modal.classList.contains('active')) {
                    // Redirect to home after modal is closed
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 300);
                }
            });
        });
        if (modal) {
            observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
        }
    }
});

// ===========================
// Smooth Scroll for Anchor Links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===========================
// Navbar Background on Scroll
// ===========================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 14, 39, 0.98)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 14, 39, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// ===========================
// Contact Form Handling
// ===========================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formMessage = document.getElementById('formMessage');
        const submitBtn = this.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success simulation
            formMessage.className = 'form-message success';
            formMessage.textContent = 'Thank you! Your message has been sent successfully. We\'ll get back to you soon!';
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
            
            // Log form data (for development)
            console.log('Form submitted:', formData);
        }, 2000);
        
        // Error handling example (uncomment to test)
        /*
        setTimeout(() => {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Oops! Something went wrong. Please try again later.';
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }, 2000);
        */
    });
}

// ===========================
// Course Enrollment Buttons
// ===========================
const enrollButtons = document.querySelectorAll('.btn-enroll');
enrollButtons.forEach(button => {
    button.addEventListener('click', function() {
        const courseCard = this.closest('.course-card');
        const courseName = courseCard.querySelector('h3').textContent;
        
        // Show alert (in production, this would redirect to enrollment page)
        alert(`Thank you for your interest in "${courseName}"!\n\nThis feature is coming soon. Please contact us for more information.`);
        
        // Optional: redirect to contact page
        // window.location.href = 'contact.html?course=' + encodeURIComponent(courseName);
    });
});

// ===========================
// Intersection Observer for Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .course-card, .service-card, .value-card, .testimonial-card, .timeline-item, .mvv-card'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// ===========================
// Dynamic Year in Footer
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = `&copy; ${currentYear} AstraForensics. All Rights Reserved.`;
    }
});

// ===========================
// Hero Code Rain Effect (Optional)
// ===========================
const codeRain = document.querySelector('.code-rain');
if (codeRain) {
    const chars = '01'; // Binary characters
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.style.position = 'absolute';
        column.style.left = (i * 20) + 'px';
        column.style.top = '-100%';
        column.style.fontSize = '14px';
        column.style.color = 'rgba(0, 212, 255, 0.3)';
        column.style.fontFamily = 'monospace';
        column.style.animation = `fall ${5 + Math.random() * 10}s linear infinite`;
        column.style.animationDelay = Math.random() * 5 + 's';
        
        let text = '';
        for (let j = 0; j < 50; j++) {
            text += chars[Math.floor(Math.random() * chars.length)] + '<br>';
        }
        column.innerHTML = text;
        
        codeRain.appendChild(column);
    }
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            0% { top: -100%; }
            100% { top: 100%; }
        }
    `;
    document.head.appendChild(style);
}

// ===========================
// Form Validation Enhancement
// ===========================
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.style.borderColor = 'rgba(255, 0, 110, 0.5)';
        } else {
            this.style.borderColor = 'rgba(0, 212, 255, 0.2)';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = 'var(--primary-color)';
    });
});

// ===========================
// Back to Top Button (Optional)
// ===========================
const createBackToTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 20px rgba(0, 212, 255, 0.3);
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
};

// Initialize back to top button
createBackToTopButton();

// ===========================
// Console Welcome Message
// ===========================
console.log('%c🔐 Welcome to AstraForensics! 🔐', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cInterested in cybersecurity? Check out our courses!', 'color: #8338ec; font-size: 14px;');
console.log('%cWebsite built with ❤️ for the cyber community', 'color: #00ff88; font-size: 12px;');
