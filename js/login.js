// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
});

// Form submission handling
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Here you would normally handle authentication
    // For demo purposes, just show a success message
    const statusMsg = document.getElementById('status-msg');
    statusMsg.innerHTML = 'Login successful!';
    statusMsg.className = 'status-message success';
});

// Forgot password modal handling
const forgotLink = document.getElementById('forgot-password-link');
const modal = document.getElementById('forgot-password-modal');
const cancelBtn = document.getElementById('cancel-reset');

forgotLink.addEventListener('click', function(e) {
    e.preventDefault();
    modal.style.display = 'flex';
});

cancelBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;

themeToggle.addEventListener('click', () => {
    if (htmlElement.getAttribute('data-theme') === 'light') {
        htmlElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    }
});