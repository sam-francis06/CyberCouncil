// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Get DOM elements
    const usernameInput = document.getElementById('username');
    const searchBtn = document.getElementById('searchBtn');
    const resultsGrid = document.getElementById('resultsGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const exportBtn = document.getElementById('exportBtn');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const sidebar = document.querySelector('.sidebar');
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    const homeIcon = document.querySelector('.home-icon');

    // Social media platforms to check
    const platforms = [
        {
            name: 'Twitter',
            url: 'https://twitter.com/{username}',
            icon: 'twitter',
            color: '#1DA1F2'
        },
        {
            name: 'Instagram',
            url: 'https://instagram.com/{username}',
            icon: 'instagram',
            color: '#E1306C'
        },
        {
            name: 'Facebook',
            url: 'https://facebook.com/{username}',
            icon: 'facebook',
            color: '#4267B2'
        },
        {
            name: 'LinkedIn',
            url: 'https://linkedin.com/in/{username}',
            icon: 'linkedin',
            color: '#0A66C2'
        },
        {
            name: 'GitHub',
            url: 'https://github.com/{username}',
            icon: 'github',
            color: '#333333'
        },
        {
            name: 'YouTube',
            url: 'https://youtube.com/@{username}',
            icon: 'youtube',
            color: '#FF0000'
        },
        {
            name: 'TikTok',
            url: 'https://tiktok.com/@{username}',
            icon: 'music',
            color: '#000000'
        },
        {
            name: 'Reddit',
            url: 'https://reddit.com/user/{username}',
            icon: 'message-circle',
            color: '#FF4500'
        },
        {
            name: 'Pinterest',
            url: 'https://pinterest.com/{username}',
            icon: 'image',
            color: '#E60023'
        },
        {
            name: 'Twitch',
            url: 'https://twitch.tv/{username}',
            icon: 'twitch',
            color: '#9146FF'
        },
        {
            name: 'Medium',
            url: 'https://medium.com/@{username}',
            icon: 'book-open',
            color: '#000000'
        },
        {
            name: 'Discord',
            url: 'https://discord.com/users/{username}',
            icon: 'message-square',
            color: '#5865F2'
        }
    ];

    // Search results storage
    let searchResults = [];

    // Mobile menu toggle
    if (mobileMenuButton && sidebar) {
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            // Close dropdown if open
            if (mobileDropdown) {
                mobileDropdown.classList.remove('active');
            }
        });
    }

    // Home icon dropdown toggle
    if (homeIcon && mobileDropdown) {
        homeIcon.addEventListener('click', () => {
            mobileDropdown.classList.toggle('active');
            // Close sidebar if open
            if (sidebar) {
                sidebar.classList.remove('active');
            }
        });
    }

    // Close sidebar and dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar && !sidebar.contains(e.target) && 
            mobileMenuButton && !mobileMenuButton.contains(e.target)) {
            sidebar.classList.remove('active');
        }
        
        if (mobileDropdown && !mobileDropdown.contains(e.target) && 
            homeIcon && !homeIcon.contains(e.target)) {
            mobileDropdown.classList.remove('active');
        }
    });

    // Add event listener for search button
    searchBtn.addEventListener('click', performSearch);
    
    // Add event listener for Enter key in input field
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Add event listener for export button
    exportBtn.addEventListener('click', exportResults);

    // Function to perform the username search
    function performSearch() {
        const username = usernameInput.value.trim();
        
        if (!username) {
            alert('Please enter a username to search');
            return;
        }

        // Clear previous results
        resultsGrid.innerHTML = '';
        searchResults = [];
        
        // Show loading spinner
        loadingSpinner.classList.add('active');
        
        // Disable export button until search completes
        exportBtn.disabled = true;
        
        // Set delay between requests to avoid rate limiting
        const delay = 300;
        let completedRequests = 0;
        
        // Search each platform
        platforms.forEach((platform, index) => {
            setTimeout(() => {
                checkUsername(username, platform).then(result => {
                    searchResults.push(result);
                    displayResult(result);
                    
                    completedRequests++;
                    if (completedRequests === platforms.length) {
                        // Hide loading spinner when all requests are done
                        loadingSpinner.classList.remove('active');
                        // Enable export button
                        exportBtn.disabled = false;
                    }
                });
            }, index * delay);
        });
    }

    // Function to check username availability on a platform
    async function checkUsername(username, platform) {
        const url = platform.url.replace('{username}', username);
        
        try {
            // In a real implementation, this would be a server-side check
            // For demo purposes, we'll simulate API responses with random results
            // In production, you'd replace this with actual API calls to check availability
            
            const randomValue = Math.random();
            let status, message;
            
            // Simulate different results
            if (randomValue < 0.6) {
                // Username found
                status = 'found';
                message = `Username "${username}" found on ${platform.name}`;
            } else if (randomValue < 0.9) {
                // Username not found
                status = 'not-found';
                message = `Username "${username}" not found on ${platform.name}`;
            } else {
                // Error checking
                status = 'error';
                message = `Error checking ${platform.name}. Service may be unavailable.`;
            }
            
            return {
                platform: platform.name,
                username: username,
                url: url,
                status: status,
                message: message,
                icon: platform.icon,
                color: platform.color,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            return {
                platform: platform.name,
                username: username,
                url: url,
                status: 'error',
                message: `Error checking ${platform.name}: ${error.message}`,
                icon: platform.icon,
                color: platform.color,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Function to display a single result
    function displayResult(result) {
        const card = document.createElement('div');
        card.className = 'platform-card';
        card.style.animationDelay = `${Math.random() * 0.5}s`;
        
        // Determine status class
        let statusClass, statusText;
        switch(result.status) {
            case 'found':
                statusClass = 'status-found';
                statusText = 'Found';
                break;
            case 'not-found':
                statusClass = 'status-not-found';
                statusText = 'Not Found';
                break;
            default:
                statusClass = 'status-error';
                statusText = 'Error';
        }
        
        card.innerHTML = `
            <div class="platform-header">
                <div class="platform-icon" style="background-color: ${result.color}">
                    <i data-lucide="${result.icon}"></i>
                </div>
                <div class="platform-name">${result.platform}</div>
            </div>
            <div class="platform-status">
                <div class="status-indicator ${statusClass}"></div>
                <span>${statusText}</span>
            </div>
            <div class="platform-details">
                ${result.message}
            </div>
            ${result.status === 'found' ? 
                `<a href="${result.url}" target="_blank" class="platform-link">
                    View Profile <i data-lucide="external-link"></i>
                </a>` : ''}
        `;
        
        resultsGrid.appendChild(card);
        
        // Initialize Lucide icons in the new card
        if (window.lucide) {
            lucide.createIcons({
                attrs: {
                    'stroke-width': 1.5,
                    'class': ''
                },
                elements: [card]
            });
        }
    }

    // Function to export results
    function exportResults() {
        if (searchResults.length === 0) {
            alert('No results to export');
            return;
        }
        
        const username = searchResults[0].username;
        const timestamp = new Date().toLocaleString().replace(/[/\\:*?"<>|]/g, '-');
        const filename = `username-lookup-${username}-${timestamp}.json`;
        
        // Create report object
        const report = {
            username: username,
            searchDate: new Date().toISOString(),
            results: searchResults
        };
        
        // Create a blob with the JSON data
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        
        // Create an anchor element and trigger a download
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        
        // Clean up
        URL.revokeObjectURL(a.href);
    }

    // Show a placeholder when page loads
    function showPlaceholder() {
        resultsGrid.innerHTML = `
            <div class="placeholder-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i data-lucide="search" style="width: 3rem; height: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>Enter a username to search across platforms</h3>
                <p>Results will appear here after your search</p>
            </div>
        `;
        
        if (window.lucide) {
            lucide.createIcons({
                elements: [resultsGrid]
            });
        }
    }

    // Initialize with placeholder
    showPlaceholder();
});

// Add Inter font for better typography
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
document.head.appendChild(fontLink);