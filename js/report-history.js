document.addEventListener('DOMContentLoaded', () => {
    const reportsList = document.querySelector('.reports-list');
    const reports = JSON.parse(localStorage.getItem('cyberReports') || '[]');

    if (reports.length === 0) {
        reportsList.innerHTML = `
            <div class="empty-state">
                <i class="ph ph-file-x"></i>
                <h3>No Reports Found</h3>
                <p>You haven't submitted any cyber crime reports yet.</p>
                <a href="reports.html" class="primary-button">
                    <i class="ph ph-plus"></i>
                    File New Report
                </a>
            </div>
        `;
        return;
    }

    // Sort reports by date, newest first
    reports.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    reports.forEach(report => {
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card';
        reportCard.innerHTML = `
            <div class="report-header">
                <div class="report-type ${report.type}">
                    <i class="ph ph-warning"></i>
                    ${report.type.replace('-', ' ').toUpperCase()}
                </div>
                <div class="report-date">
                    <i class="ph ph-calendar"></i>
                    ${new Date(report.date).toLocaleDateString()}
                </div>
            </div>
            <div class="report-content">
                <h3>Incident Description</h3>
                <p>${report.description}</p>
                ${report.urls ? `
                    <div class="report-urls">
                        <h4>Related URLs</h4>
                        <p>${report.urls}</p>
                    </div>
                ` : ''}
            </div>
            <div class="report-footer">
                <div class="report-status">
                    <i class="ph ph-${report.reportedToAuthorities ? 'check-circle' : 'x-circle'}"></i>
                    ${report.reportedToAuthorities ? 'Reported to Authorities' : 'Not Reported to Authorities'}
                </div>
                ${report.financialImpact ? `
                    <div class="financial-impact">
                        <i class="ph ph-currency-inr"></i>
                        Impact: ₹${report.financialImpact.toLocaleString()}
                    </div>
                ` : ''}
            </div>
        `;
        reportsList.appendChild(reportCard);
    });
});