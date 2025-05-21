// Case Management Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cases from localStorage or use default data
    let cases = JSON.parse(localStorage.getItem('cases')) || [
        {
            id: 'CC-2024-001',
            title: 'Online Banking Fraud',
            description: 'Unauthorized transactions reported through mobile banking app. Customer noticed several suspicious transactions totaling $5,000.',
            priority: 'high',
            officer: 'John Smith',
            status: 'pending',
            category: 'financial-fraud',
            location: 'New York',
            victim: 'Jane Doe',
            evidence: ['Transaction logs', 'Bank statements'],
            assignedTeam: ['Digital Forensics', 'Fraud Unit'],
            updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'CC-2024-002',
            title: 'Social Media Account Hack',
            description: 'Multiple unauthorized posts and messages sent from victim\'s account. The account was used to spread malicious links.',
            priority: 'medium',
            officer: 'Sarah Johnson',
            status: 'in-progress',
            category: 'cybercrime',
            location: 'Los Angeles',
            victim: 'John Wilson',
            evidence: ['Screenshot of posts', 'IP logs'],
            assignedTeam: ['Cybercrime Unit'],
            updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'CC-2024-003',
            title: 'Email Phishing Campaign',
            description: 'Large-scale phishing campaign targeting local businesses. Multiple victims reported receiving sophisticated fraudulent emails.',
            priority: 'high',
            officer: 'Mike Brown',
            status: 'closed',
            category: 'phishing',
            location: 'Chicago',
            victim: 'Multiple Businesses',
            evidence: ['Email headers', 'Phishing templates'],
            assignedTeam: ['Cybercrime Unit', 'Intelligence'],
            updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    // DOM Elements
    const casesGrid = document.getElementById('casesGrid');
    const newCaseBtn = document.getElementById('newCaseBtn');
    const newCaseModal = document.getElementById('newCaseModal');
    const caseDetailsModal = document.getElementById('caseDetailsModal');
    const newCaseForm = document.getElementById('newCaseForm');
    const searchInput = document.querySelector('.search-bar input');
    const statusFilter = document.querySelector('.filter-select:nth-child(1)');
    const priorityFilter = document.querySelector('.filter-select:nth-child(2)');
    const dateFilter = document.querySelector('.date-filter');
    const categoryFilter = document.querySelector('.filter-select:nth-child(3)');

    // Case Categories
    const categories = {
        'financial-fraud': 'Financial Fraud',
        'cybercrime': 'Cybercrime',
        'phishing': 'Phishing Attack',
        'malware': 'Malware Incident',
        'data-breach': 'Data Breach',
        'identity-theft': 'Identity Theft'
    };

    // Render all cases
    function renderCases() {
        casesGrid.innerHTML = '';
        const filteredCases = filterCases();
        
        if (filteredCases.length === 0) {
            casesGrid.innerHTML = `
                <div class="no-cases">
                    <i class="ph ph-folder-notch"></i>
                    <p>No cases found matching your criteria</p>
                </div>
            `;
            return;
        }

        filteredCases.forEach(caseItem => {
            const caseCard = createCaseCard(caseItem);
            casesGrid.appendChild(caseCard);
        });
    }

    // Create case card element
    function createCaseCard(caseItem) {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.innerHTML = `
            <div class="case-header">
                <span class="case-id">#${caseItem.id}</span>
                <span class="priority ${caseItem.priority}">${capitalizeFirst(caseItem.priority)} Priority</span>
            </div>
            <h3 class="case-title">${caseItem.title}</h3>
            <p class="case-description">${caseItem.description}</p>
            <div class="case-meta">
                <span class="category ${caseItem.category}">
                    <i class="ph ph-folder"></i>
                    ${categories[caseItem.category]}
                </span>
                <span class="location">
                    <i class="ph ph-map-pin"></i>
                    ${caseItem.location}
                </span>
            </div>
            <div class="case-details">
                <div class="officer-info">
                    <i class="ph ph-user"></i>
                    <span>Officer: ${caseItem.officer}</span>
                </div>
                <div class="update-info">
                    <i class="ph ph-clock"></i>
                    <span>Updated: ${formatTimeAgo(caseItem.updatedAt)}</span>
                </div>
            </div>
            <div class="assigned-teams">
                ${Array.isArray(caseItem.assignedTeam) ? caseItem.assignedTeam.map(team => `
                    <span class="team-badge">
                        <i class="ph ph-users"></i>
                        ${team}
                    </span>
                `).join('') : ''}
            </div>
            <div class="case-footer">
                <span class="status ${caseItem.status}">${formatStatus(caseItem.status)}</span>
                <button class="view-details-btn" data-case-id="${caseItem.id}">
                    View Details
                    <i class="ph ph-arrow-right"></i>
                </button>
            </div>
        `;

        // Add click handler for view details button
        card.querySelector('.view-details-btn').addEventListener('click', () => {
            showCaseDetails(caseItem);
        });

        return card;
    }

    // Modal functionality
    function showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // New case functionality
    newCaseBtn.addEventListener('click', () => {
        showModal(newCaseModal);
    });

    document.querySelectorAll('.close-modal, #cancelNewCase').forEach(button => {
        button.addEventListener('click', () => {
            hideModal(newCaseModal);
            hideModal(caseDetailsModal);
        });
    });

    newCaseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newCase = {
            id: `CC-2024-${String(cases.length + 1).padStart(3, '0')}`,
            title: document.getElementById('caseTitle').value,
            description: document.getElementById('caseDescription').value,
            priority: document.getElementById('casePriority').value,
            officer: document.getElementById('assignedOfficer').value,
            category: document.getElementById('caseCategory').value,
            location: document.getElementById('caseLocation').value,
            victim: document.getElementById('caseVictim').value,
            evidence: document.getElementById('caseEvidence').value.split(',').map(item => item.trim()),
            assignedTeam: Array.from(document.getElementById('assignedTeam').selectedOptions).map(option => option.value),
            status: 'pending',
            updatedAt: new Date().toISOString()
        };

        cases.unshift(newCase);
        localStorage.setItem('cases', JSON.stringify(cases));
        renderCases();
        hideModal(newCaseModal);
        newCaseForm.reset();

        // Show success notification
        showNotification('Case created successfully', 'success');
    });

    // Case details functionality
    function showCaseDetails(caseItem) {
        const modal = document.getElementById('caseDetailsModal');
        modal.querySelector('.case-id').textContent = `#${caseItem.id}`;
        modal.querySelector('.priority').className = `priority ${caseItem.priority}`;
        modal.querySelector('.priority').textContent = `${capitalizeFirst(caseItem.priority)} Priority`;
        modal.querySelector('.case-title').textContent = caseItem.title;
        modal.querySelector('.case-description').textContent = caseItem.description;
        modal.querySelector('.officer-info span').textContent = `Officer: ${caseItem.officer}`;
        modal.querySelector('.update-info span').textContent = `Updated: ${formatTimeAgo(caseItem.updatedAt)}`;
        modal.querySelector('#caseStatus').value = caseItem.status;

        // Update additional details
        modal.querySelector('.case-category').textContent = categories[caseItem.category];
        modal.querySelector('.case-location').textContent = caseItem.location;
        modal.querySelector('.case-victim').textContent = caseItem.victim;
        modal.querySelector('.case-evidence').innerHTML = (Array.isArray(caseItem.evidence) ? caseItem.evidence : [])
            .map(item => `<li>${item}</li>`)
            .join('');
        modal.querySelector('.assigned-teams').innerHTML = Array.isArray(caseItem.assignedTeam) ? caseItem.assignedTeam
            .map(team => `<span class="team-badge"><i class="ph ph-users"></i>${team}</span>`)
            .join('') : '';

        const updateButton = modal.querySelector('#updateCase');
        updateButton.onclick = () => updateCaseStatus(caseItem.id);

        // Add delete button handler
        const deleteButton = modal.querySelector('#deleteCase');
        deleteButton.onclick = () => showDeleteConfirmation(caseItem.id);

        showModal(modal);
    }

    // Delete confirmation functionality
    function showDeleteConfirmation(caseId) {
        const deleteModal = document.getElementById('deleteConfirmModal');
        const confirmDeleteBtn = document.getElementById('confirmDelete');
        const cancelDeleteBtn = document.getElementById('cancelDelete');
        const closeModalBtn = deleteModal.querySelector('.close-modal');

        // Show the delete confirmation modal
        showModal(deleteModal);

        // Handle delete confirmation
        confirmDeleteBtn.onclick = () => {
            deleteCase(caseId);
            hideModal(deleteModal);
            hideModal(document.getElementById('caseDetailsModal'));
        };

        // Handle cancel and close
        cancelDeleteBtn.onclick = () => hideModal(deleteModal);
        closeModalBtn.onclick = () => hideModal(deleteModal);
    }

    // Delete case functionality
    function deleteCase(caseId) {
        const caseIndex = cases.findIndex(c => c.id === caseId);
        if (caseIndex !== -1) {
            cases.splice(caseIndex, 1);
            localStorage.setItem('cases', JSON.stringify(cases));
            renderCases();
            showNotification('Case deleted successfully', 'success');
        }
    }

    // Update case status
    function updateCaseStatus(caseId) {
        const newStatus = document.getElementById('caseStatus').value;
        const caseIndex = cases.findIndex(c => c.id === caseId);
        if (caseIndex !== -1) {
            cases[caseIndex].status = newStatus;
            cases[caseIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('cases', JSON.stringify(cases));
            renderCases();
            hideModal(caseDetailsModal);
            
            // Show success notification
            showNotification('Case status updated successfully', 'success');
        }
    }

    // Filter cases
    function filterCases() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedStatus = statusFilter.value;
        const selectedPriority = priorityFilter.value;
        const selectedDate = dateFilter.value;
        const selectedCategory = categoryFilter.value;

        return cases.filter(caseItem => {
            const matchesSearch = caseItem.id.toLowerCase().includes(searchTerm) ||
                                caseItem.title.toLowerCase().includes(searchTerm) ||
                                caseItem.officer.toLowerCase().includes(searchTerm) ||
                                caseItem.description.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !selectedStatus || caseItem.status === selectedStatus;
            const matchesPriority = !selectedPriority || caseItem.priority === selectedPriority;
            const matchesDate = !selectedDate || formatDate(caseItem.updatedAt) === selectedDate;
            const matchesCategory = !selectedCategory || caseItem.category === selectedCategory;

            return matchesSearch && matchesStatus && matchesPriority && matchesDate && matchesCategory;
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="ph ${type === 'success' ? 'ph-check-circle' : 'ph-info'}"></i>
            <p>${message}</p>
        `;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Animate out and remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Utility functions
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function formatStatus(status) {
        return status.split('-').map(capitalizeFirst).join(' ');
    }

    function formatTimeAgo(date) {
        const now = new Date();
        const updated = new Date(date);
        const diffHours = Math.floor((now - updated) / (1000 * 60 * 60));
        
        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${Math.floor(diffHours / 24)}d ago`;
    }

    function formatDate(date) {
        return new Date(date).toISOString().split('T')[0];
    }

    // Event listeners for filters
    searchInput.addEventListener('input', renderCases);
    statusFilter.addEventListener('change', renderCases);
    priorityFilter.addEventListener('change', renderCases);
    dateFilter.addEventListener('change', renderCases);
    categoryFilter.addEventListener('change', renderCases);

    // Initialize tooltips
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', e => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.dataset.tooltip;
            document.body.appendChild(tooltip);

            const rect = e.target.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;

            e.target.addEventListener('mouseleave', () => tooltip.remove());
        });
    });

    // Initial render
    renderCases();
});

