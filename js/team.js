// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add hover effect for cards
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseout', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
});

// Intersection Observer for slide-in animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add slide-in class and observe all major sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('slide-in');
    observer.observe(section);
});

// Add slide-in to cards with delay
document.querySelectorAll('.card, .feature-card, .stat-card, .testimonial-card').forEach((card, index) => {
    card.classList.add('slide-in');
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
});

// Floating animation for icons
document.querySelectorAll('.icon-container').forEach(icon => {
    icon.classList.add('animate-float');
});

// Add pulse animation to CTA buttons
document.querySelectorAll('.cta-button.primary').forEach(button => {
    button.classList.add('animate-pulse');
});

// Add Inter font for better typography
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
document.head.appendChild(fontLink);