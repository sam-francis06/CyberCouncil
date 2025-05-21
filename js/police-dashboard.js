//Mobile menu fucntionality
const homeIcon = document.querySelector('.home-icon');
const mobileDropdown = document.querySelector('.mobile-dropdown');

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

// Initialize Lucide icons
lucide.createIcons();

// Add loading indicator
document.addEventListener('DOMContentLoaded', () => {
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
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileDropdown.contains(e.target) && !homeIcon.contains(e.target)) {
        mobileDropdown.classList.remove('active');
    }
});

// Get cases from localStorage
const cases = JSON.parse(localStorage.getItem('cases')) || [];

// Update case statistics
updateCaseStats(cases);

// Initialize charts
initializeCharts(cases);

// Display recent cases
displayRecentCases(cases);

// Listen for changes in localStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'cases') {
        const updatedCases = JSON.parse(e.newValue) || [];
        updateCaseStats(updatedCases);
        initializeCharts(updatedCases);
        displayRecentCases(updatedCases);
    }
});

// Add smooth animations for cards
const cards = document.querySelectorAll('.stat-card, .dashboard-card');
cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100 * index);
});

function updateCaseStats(cases) {
    const pendingCases = cases.filter(c => c.status === 'pending').length;
    const inProgressCases = cases.filter(c => c.status === 'in-progress').length;
    const closedCases = cases.filter(c => c.status === 'closed').length;
    const totalCases = cases.length;

    document.getElementById('pendingCases').textContent = pendingCases;
    document.getElementById('inProgressCases').textContent = inProgressCases;
    document.getElementById('closedCases').textContent = closedCases;
    document.getElementById('totalCases').textContent = totalCases;
}

function initializeCharts(cases) {
    // Case Status Distribution Chart
    const statusCtx = document.getElementById('caseStatusChart').getContext('2d');
    const statusData = {
        pending: cases.filter(c => c.status === 'pending').length,
        inProgress: cases.filter(c => c.status === 'in-progress').length,
        closed: cases.filter(c => c.status === 'closed').length
    };

    if (window.statusChart instanceof Chart) {
        window.statusChart.destroy();
    }

    window.statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Pending', 'In Progress', 'Closed'],
            datasets: [{
                data: [statusData.pending, statusData.inProgress, statusData.closed],
                backgroundColor: ['#f59e0b', '#3b82f6', '#10b981']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Priority Distribution Chart
    const priorityCtx = document.getElementById('priorityChart').getContext('2d');
    const priorityData = {
        high: cases.filter(c => c.priority === 'high').length,
        medium: cases.filter(c => c.priority === 'medium').length,
        low: cases.filter(c => c.priority === 'low').length
    };

    if (window.priorityChart instanceof Chart) {
        window.priorityChart.destroy();
    }

    window.priorityChart = new Chart(priorityCtx, {
        type: 'pie',
        data: {
            labels: ['High', 'Medium', 'Low'],
            datasets: [{
                data: [priorityData.high, priorityData.medium, priorityData.low],
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Officer Workload Chart
    const officerWorkload = {};
    cases.forEach(c => {
        officerWorkload[c.officer] = (officerWorkload[c.officer] || 0) + 1;
    });

    const workloadCtx = document.getElementById('officerWorkloadChart').getContext('2d');

    if (window.workloadChart instanceof Chart) {
        window.workloadChart.destroy();
    }

    window.workloadChart = new Chart(workloadCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(officerWorkload),
            datasets: [{
                label: 'Assigned Cases',
                data: Object.values(officerWorkload),
                backgroundColor: '#3b82f6'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function displayRecentCases(cases) {
    const recentCasesList = document.getElementById('recentCasesList');
    const sortedCases = [...cases].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const recentCases = sortedCases.slice(0, 5);

    recentCasesList.innerHTML = recentCases.map(c => `
        <div class="recent-case-item">
            <div class="case-info">
                <span class="case-title">${c.title}</span>
                <span class="case-meta">Officer: ${c.officer} | Updated: ${formatTimeAgo(c.updatedAt)}</span>
            </div>
            <span class="case-status ${c.status}">${formatStatus(c.status)}</span>
        </div>
    `).join('');
}

function formatTimeAgo(date) {
    const now = new Date();
    const updated = new Date(date);
    const diffHours = Math.floor((now - updated) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
}

function formatStatus(status) {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Add Inter font for better typography
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
document.head.appendChild(fontLink);