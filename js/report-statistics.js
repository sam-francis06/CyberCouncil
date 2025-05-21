document.addEventListener('DOMContentLoaded', () => {
    const reports = JSON.parse(localStorage.getItem('cyberReports') || '[]');
    
    // Update summary statistics
    document.getElementById('total-reports').textContent = reports.length;
    const totalImpact = reports.reduce((sum, report) => sum + (report.financialImpact || 0), 0);
    document.getElementById('total-impact').textContent = `₹${totalImpact.toLocaleString()}`;

    // Prepare data for incident types chart
    const incidentTypes = {};
    reports.forEach(report => {
        incidentTypes[report.type] = (incidentTypes[report.type] || 0) + 1;
    });

    // Create incidents by type chart
    const incidentsCtx = document.getElementById('incidents-chart').getContext('2d');
    new Chart(incidentsCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(incidentTypes).map(type => type.replace('-', ' ').toUpperCase()),
            datasets: [{
                data: Object.values(incidentTypes),
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#ef4444',
                    '#f59e0b',
                    '#8b5cf6',
                    '#ec4899',
                    '#6366f1'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });

    // Prepare data for timeline chart
    const timelineData = {};
    reports.forEach(report => {
        const date = new Date(report.date).toLocaleDateString();
        timelineData[date] = (timelineData[date] || 0) + 1;
    });

    // Create timeline chart
    const timelineCtx = document.getElementById('timeline-chart').getContext('2d');
    new Chart(timelineCtx, {
        type: 'line',
        data: {
            labels: Object.keys(timelineData),
            datasets: [{
                label: 'Reports',
                data: Object.values(timelineData),
                borderColor: '#3b82f6',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
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
});