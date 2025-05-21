// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const sidebar = document.querySelector('.sidebar');
    const homeIcon = document.querySelector('.home-icon');
    const mobileDropdown = document.querySelector('.mobile-dropdown');

    // Only add event listeners if elements exist
    if (mobileMenuButton && sidebar) {
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            // Close dropdown if open when sidebar is toggled
            if (mobileDropdown) {
                mobileDropdown.classList.remove('active');
            }
        });
    }

    // Home icon dropdown functionality
    if (homeIcon && mobileDropdown) {
        homeIcon.addEventListener('click', () => {
            mobileDropdown.classList.toggle('active');
            // Close sidebar if open when dropdown is toggled
            if (sidebar) {
                sidebar.classList.remove('active');
            }
            
            // Add a subtle bounce animation to the home icon
            homeIcon.style.transform = 'scale(0.8)';
            setTimeout(() => {
                homeIcon.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    homeIcon.style.transform = '';
                }, 150);
            }, 150);
        });
    }

    // Initialize Lucide icons
    lucide.createIcons();

    // Add loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    document.body.appendChild(loadingIndicator);
    
    // Remove loading indicator after page load
    setTimeout(() => {
        loadingIndicator.style.opacity = '0';
        setTimeout(() => {
            loadingIndicator.remove();
        }, 300);
    }, 1500);

    // Close sidebar and dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar && !sidebar.contains(e.target) && mobileMenuButton && !mobileMenuButton.contains(e.target)) {
            sidebar.classList.remove('active');
        }
        
        if (mobileDropdown && !mobileDropdown.contains(e.target) && homeIcon && !homeIcon.contains(e.target)) {
            mobileDropdown.classList.remove('active');
        }
    });

    // Add hover effect to buttons
    document.querySelectorAll('.primary-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Add subtle pulse animation
            button.style.animation = 'pulse 1.5s infinite';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.animation = 'none';
        });
        
        button.addEventListener('click', () => {
            const toolName = button.closest('.tool-card').querySelector('h3').textContent;
            console.log(`Launching ${toolName}`);
            
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // Show ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            button.appendChild(ripple);
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${event.clientX - rect.left - size/2}px`;
            ripple.style.top = `${event.clientY - rect.top - size/2}px`;
            
            ripple.classList.add('active');
            
            setTimeout(() => {
                ripple.remove();
            }, 500);
        });
    });

    // Add smooth scroll for sidebar links
    document.querySelectorAll('.menu-item').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only add animation, don't prevent default since these are actual links
            const currentActive = document.querySelector('.menu-item.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            this.classList.add('active');
        });
    });

    // Add hover effects for stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '5';
            
            // Add subtle floating animation
            card.style.animation = 'float 3s ease-in-out infinite';
            
            // Enhance shadow depth
            card.style.boxShadow = 'var(--shadow-xl)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
            card.style.animation = 'none';
            card.style.boxShadow = 'var(--shadow)';
        });
    });

    // Add hover effects for tool cards
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '5';
            
            // Add subtle floating animation
            card.style.animation = 'float 4s ease-in-out infinite';
            
            // Enhance shadow depth
            card.style.boxShadow = 'var(--shadow-xl)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
            card.style.animation = 'none';
            card.style.boxShadow = 'var(--shadow)';
        });
    });

    // Initialize page with smooth fade-in effect
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 100);
        
        // Stagger the appearance of stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 150 + (index * 100));
        });
        
        // Stagger the appearance of tool cards
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 450 + (index * 100));
        });
        
        // Add subtle parallax effect to main content on mouse move
        mainContent.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.stat-card, .tool-card');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            cards.forEach(card => {
                const offsetX = (mouseX - 0.5) * 5;
                const offsetY = (mouseY - 0.5) * 5;
                card.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        });
        
        // Reset transform when mouse leaves
        mainContent.addEventListener('mouseleave', () => {
            const cards = document.querySelectorAll('.stat-card, .tool-card');
            cards.forEach(card => {
                card.style.transform = 'translate(0, 0)';
            });
        });
    }
});

// Add ripple effect style
const style = document.createElement('style');
style.textContent = `
.ripple {
    position: absolute;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.5s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(2);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

// Add Inter font for better typography
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
document.head.appendChild(fontLink);