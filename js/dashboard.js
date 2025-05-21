// Mobile menu functionality
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const homeIcon = document.querySelector('.home-icon');
const mobileDropdown = document.querySelector('.mobile-dropdown');


mobileMenuButton.addEventListener('click', () => {
    mobileDropdown.classList.remove('active');  
});

// Home icon dropdown functionality
homeIcon.addEventListener('click', () => {
    mobileDropdown.classList.toggle('active');
    
    // Add a subtle bounce animation to the home icon
    homeIcon.style.transform = 'scale(0.8)';
    setTimeout(() => {
        homeIcon.style.transform = 'scale(1.1)';
        setTimeout(() => {
            homeIcon.style.transform = '';
        }, 150);
    }, 150);
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileDropdown.contains(e.target) && !homeIcon.contains(e.target)) {
        mobileDropdown.classList.remove('active');
    }
});

// Add hover effects to cards
document.querySelectorAll('.action-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.action-icon');
        icon.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.action-icon');
        icon.style.transform = '';
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '1px';
        ripple.style.height = '1px';
        ripple.style.background = 'rgba(255, 255, 255, 0.7)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.animation = 'ripple 0.6s linear';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation styles
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

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 12h18M3 6h18M3 18h18" /></svg>';
    
    const topBar = document.querySelector('.top-bar');
    if (topBar) {
      topBar.insertBefore(menuToggle, topBar.firstChild);
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    menuToggle.addEventListener('click', function() {
      const sidebar = document.querySelector('.sidebar');
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    });
    
    overlay.addEventListener('click', function() {
      const sidebar = document.querySelector('.sidebar');
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  });