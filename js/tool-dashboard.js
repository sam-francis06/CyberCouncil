// Mobile menu functionality
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const sidebar = document.querySelector('.sidebar');
const homeIcon = document.querySelector('.home-icon');
const mobileDropdown = document.querySelector('.mobile-dropdown');

mobileMenuButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    // Close dropdown if open when sidebar is toggled
    mobileDropdown.classList.remove('active');
});

// Home icon dropdown functionality
homeIcon.addEventListener('click', () => {
    mobileDropdown.classList.toggle('active');
    // Close sidebar if open when dropdown is toggled
    sidebar.classList.remove('active');
    
    // Add a subtle bounce animation to the home icon
    homeIcon.style.transform = 'scale(0.8)';
    setTimeout(() => {
        homeIcon.style.transform = 'scale(1.1)';
        setTimeout(() => {
            homeIcon.style.transform = '';
        }, 150);
    }, 150);
});

// Close sidebar and dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !mobileMenuButton.contains(e.target)) {
        sidebar.classList.remove('active');
    }
    
    if (!mobileDropdown.contains(e.target) && !homeIcon.contains(e.target)) {
        mobileDropdown.classList.remove('active');
    }
});

// Add staggered animation to dropdown menu items
function animateDropdownItems() {
    const dropdownItems = document.querySelectorAll('.mobile-nav-link');
    dropdownItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.transitionDelay = `${index * 0.05}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 50);
    });
}

// Reset dropdown items animation when dropdown is closed
function resetDropdownItemsAnimation() {
    const dropdownItems = document.querySelectorAll('.mobile-nav-link');
    dropdownItems.forEach(item => {
        item.style.opacity = '';
        item.style.transform = '';
        item.style.transition = '';
        item.style.transitionDelay = '';
    });
}

// Observe dropdown visibility changes
const dropdownObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active')) {
            animateDropdownItems();
        } else {
            resetDropdownItemsAnimation();
        }
    });
});

dropdownObserver.observe(mobileDropdown, { attributes: true, attributeFilter: ['class'] });

// Navigation handler for menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        // Remove active class from all menu items
        document.querySelectorAll('.menu-item').forEach(menuItem => {
            menuItem.classList.remove('active');
        });
        
        // Add active class to clicked item
        item.classList.add('active');
        
        const route = item.getAttribute('href');
        if (route) {
            // Allow default navigation
            return true;
        }
    });
});

// Navigation handler for nav links and mobile nav links
document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const route = link.getAttribute('href');
        if (route) {
            // Allow default navigation
            return true;
        }
    });
});

// Add click handlers for all primary buttons with ripple effect
document.querySelectorAll('.primary-button').forEach(button => {
    button.addEventListener('click', (e) => {
        // Create ripple effect
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '1px';
        ripple.style.height = '1px';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        ripple.style.transform = 'scale(0)';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.animation = 'ripple 0.6s linear';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Navigate to the tool page
        const route = button.getAttribute('data-route');
        if (route) {
            window.location.href = route + ".html";
        }
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(100);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add staggered animation to stat cards
document.querySelectorAll('.stat-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    card.style.transitionDelay = `${index * 0.1}s`;
    
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
});

// Add hover effect to tool cards
document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.tool-icon');
        icon.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.tool-icon');
        icon.style.transform = '';
    });
});

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    // Remove animations for users who prefer reduced motion
    document.querySelectorAll('.stat-card, .tool-card').forEach(
    )
}

