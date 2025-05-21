// Phishing Detection Tool JavaScript

// DOM Elements
const urlInput = document.getElementById('url-input');
const emailInput = document.getElementById('email-input');
const analyzeUrlBtn = document.getElementById('analyze-url');
const analyzeEmailBtn = document.getElementById('analyze-email');
const urlScanList = document.getElementById('url-scan-list');
const emailScanList = document.getElementById('email-scan-list');
const resultContainer = document.getElementById('result-container');
const resultLoading = document.getElementById('result-loading');
const resultData = document.getElementById('result-data');
const closeResultsBtn = document.getElementById('close-results');

// Store recent scans
let recentUrlScans = JSON.parse(localStorage.getItem('recentUrlScans')) || [];
let recentEmailScans = JSON.parse(localStorage.getItem('recentEmailScans')) || [];

// Current result for PDF generation
let currentResult = null;
let currentScanType = null;

// Initialize the page
function initPage() {
    // Load recent scans
    renderRecentScans();
    
    // Add event listeners
    analyzeUrlBtn.addEventListener('click', handleUrlAnalysis);
    analyzeEmailBtn.addEventListener('click', handleEmailAnalysis);
    closeResultsBtn.addEventListener('click', closeResults);
    
    // Add input validation
    urlInput.addEventListener('input', validateUrlInput);
    
    // Add event listeners to scan lists
    urlScanList.addEventListener('click', (e) => {
        const scanItem = e.target.closest('.scan-item');
        if (scanItem) {
            const index = scanItem.dataset.index;
            if (index !== undefined) {
                showSavedResult(recentUrlScans[index], 'url');
            }
        }
    });
    
    emailScanList.addEventListener('click', (e) => {
        const scanItem = e.target.closest('.scan-item');
        if (scanItem) {
            const index = scanItem.dataset.index;
            if (index !== undefined) {
                showSavedResult(recentEmailScans[index], 'email');
            }
        }
    });

    // Add event listener for download report button
    document.addEventListener('click', (e) => {
        if (e.target.closest('.download-report-btn')) {
            downloadPdfReport();
        }
    });
}

// Validate URL input
function validateUrlInput() {
    const value = urlInput.value.trim();
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
        urlInput.value = 'https://' + value;
    }
}

// Handle URL Analysis
function handleUrlAnalysis() {
    const url = urlInput.value.trim();
    
    if (!url) {
        showToast('Please enter a URL to analyze', 'warning');
        return;
    }
    
    // Show loading state
    showLoading();
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        const result = analyzeUrl(url);
        displayResult(result, 'url');
        
        // Save to recent scans
        saveRecentScan(result, 'url');
        renderRecentScans();
    }, 2000); // Simulate 2 second analysis
}

// Handle Email Analysis
function handleEmailAnalysis() {
    const email = emailInput.value.trim();
    
    if (!email) {
        showToast('Please enter email content to analyze', 'warning');
        return;
    }
    
    // Show loading state
    showLoading();
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        const result = analyzeEmail(email);
        displayResult(result, 'email');
        
        // Save to recent scans
        saveRecentScan(result, 'email');
        renderRecentScans();
    }, 2500); // Simulate 2.5 second analysis
}

// Show loading state
function showLoading() {
    resultContainer.style.display = 'block';
    resultLoading.style.display = 'flex';
    resultData.style.display = 'none';
    
    // Scroll to result container
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// Close results
function closeResults() {
    resultContainer.style.display = 'none';
}

// Save recent scan
function saveRecentScan(result, type) {
    const scan = {
        ...result,
        timestamp: new Date().toISOString()
    };
    
    if (type === 'url') {
        recentUrlScans.unshift(scan);
        if (recentUrlScans.length > 5) {
            recentUrlScans.pop();
        }
        localStorage.setItem('recentUrlScans', JSON.stringify(recentUrlScans));
    } else {
        recentEmailScans.unshift(scan);
        if (recentEmailScans.length > 5) {
            recentEmailScans.pop();
        }
        localStorage.setItem('recentEmailScans', JSON.stringify(recentEmailScans));
    }
}

// Render recent scans
function renderRecentScans() {
    renderScanList(urlScanList, recentUrlScans, 'url');
    renderScanList(emailScanList, recentEmailScans, 'email');
}

// Render a scan list
function renderScanList(container, scans, type) {
    if (scans.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="ph ph-clock-countdown"></i>
                <p>Your recent ${type} scans will appear here</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    scans.forEach((scan, index) => {
        const date = new Date(scan.timestamp);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let statusClass = '';
        if (scan.riskLevel === 'Safe') {
            statusClass = 'safe';
        } else if (scan.riskLevel === 'Suspicious') {
            statusClass = 'suspicious';
        } else if (scan.riskLevel === 'Dangerous') {
            statusClass = 'dangerous';
        }
        
        html += `
            <div class="scan-item" data-index="${index}">
                <div class="scan-info">
                    <div class="scan-status ${statusClass}"></div>
                    <div class="scan-text">${scan.target}</div>
                </div>
                <div class="scan-time">${timeString}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Show saved result
function showSavedResult(result, type) {
    displayResult(result, type);
}

// Display result
function displayResult(result, type) {
    resultLoading.style.display = 'none';
    resultData.style.display = 'block';
    
    // Store current result for PDF generation
    currentResult = result;
    currentScanType = type;
    
    let riskClass = '';
    let riskIcon = '';
    
    if (result.riskLevel === 'Safe') {
        riskClass = 'safe';
        riskIcon = 'ph-check-circle';
    } else if (result.riskLevel === 'Suspicious') {
        riskClass = 'suspicious';
        riskIcon = 'ph-warning-circle';
    } else if (result.riskLevel === 'Dangerous') {
        riskClass = 'dangerous';
        riskIcon = 'ph-x-circle';
    }
    
    let detailsHtml = '';
    
    if (type === 'url') {
        detailsHtml = `
            <div class="detail-section">
                <h3><i class="ph ph-link"></i> URL Analysis</h3>
                <div class="detail-item">
                    <div class="detail-label">Domain Age</div>
                    <div class="detail-value ${result.domainAge < 30 ? 'suspicious' : 'safe'}">${result.domainAge} days</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">SSL Certificate</div>
                    <div class="detail-value ${result.sslValid ? 'safe' : 'dangerous'}">${result.sslValid ? 'Valid' : 'Invalid or Missing'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Suspicious TLD</div>
                    <div class="detail-value ${result.suspiciousTld ? 'dangerous' : 'safe'}">${result.suspiciousTld ? 'Yes' : 'No'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Redirect Count</div>
                    <div class="detail-value ${result.redirectCount > 3 ? 'suspicious' : 'safe'}">${result.redirectCount}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Blacklist Status</div>
                    <div class="detail-value ${result.blacklisted ? 'dangerous' : 'safe'}">${result.blacklisted ? 'Blacklisted' : 'Not Blacklisted'}</div>
                </div>
            </div>
        `;
    } else {
        detailsHtml = `
            <div class="detail-section">
                <h3><i class="ph ph-envelope"></i> Email Analysis</h3>
                <div class="detail-item">
                    <div class="detail-label">Suspicious Links</div>
                    <div class="detail-value ${result.suspiciousLinks > 0 ? 'dangerous' : 'safe'}">${result.suspiciousLinks} detected</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Spoofed Sender</div>
                    <div class="detail-value ${result.spoofedSender ? 'dangerous' : 'safe'}">${result.spoofedSender ? 'Yes' : 'No'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Urgency Language</div>
                    <div class="detail-value ${result.urgencyScore > 70 ? 'dangerous' : result.urgencyScore > 40 ? 'suspicious' : 'safe'}">${result.urgencyScore}% (${result.urgencyScore > 70 ? 'High' : result.urgencyScore > 40 ? 'Medium' : 'Low'})</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Sensitive Data Requests</div>
                    <div class="detail-value ${result.sensitiveRequests ? 'dangerous' : 'safe'}">${result.sensitiveRequests ? 'Yes' : 'No'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Grammar/Spelling</div>
                    <div class="detail-value ${result.grammarScore < 60 ? 'suspicious' : 'safe'}">${result.grammarScore}% accuracy</div>
                </div>
            </div>
        `;
    }
    
    resultData.innerHTML = `
        <div class="result-summary ${riskClass}">
            <div class="result-icon ${riskClass}">
                <i class="ph ${riskIcon}"></i>
            </div>
            <div class="result-text">
                <h3>${result.riskLevel} ${type === 'url' ? 'URL' : 'Email'}</h3>
                <p>${result.summary}</p>
            </div>
        </div>
        
        <div class="result-details">
            ${detailsHtml}
            
            <div class="detail-section">
                <h3><i class="ph ph-info"></i> Recommendations</h3>
                <ul class="recommendations-list">
                    ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div class="result-actions">
            <button class="action-button primary download-report-btn">
                <i class="ph ph-download-simple"></i>
                Download Report
            </button>
            <button class="action-button secondary">
                <i class="ph ph-share-network"></i>
                Share Results
            </button>
        </div>
    `;
}

// Download PDF Report
function downloadPdfReport() {
    if (!currentResult) {
        showToast('No report data available to download', 'warning');
        return;
    }

    showToast('Generating detailed PDF report...', 'info');

    // Load the phishing report script if not already loaded
    if (!window.PhishingReport) {
        const reportScript = document.createElement('script');
        reportScript.src = 'phishing-report.js';
        reportScript.onload = () => {
            generateDetailedReport();
        };
        reportScript.onerror = () => {
            showToast('Failed to load report generator', 'error');
            fallbackReportGeneration();
        };
        document.head.appendChild(reportScript);
    } else {
        generateDetailedReport();
    }
}

// Generate a detailed report using the PhishingReport module
function generateDetailedReport() {
    window.PhishingReport.generateDetailedReport(currentResult, currentScanType)
        .then(filename => {
            showToast(`Report "${filename}" downloaded successfully!`, 'success');
        })
        .catch(error => {
            console.error('Error generating detailed report:', error);
            showToast('Error generating report, using fallback method', 'warning');
            fallbackReportGeneration();
        });
}

// Fallback report generation method (original implementation)
function fallbackReportGeneration() {
    // Load the required libraries
    const jspdfScript = document.createElement('script');
    jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    
    const html2canvasScript = document.createElement('script');
    html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    
    document.head.appendChild(jspdfScript);
    document.head.appendChild(html2canvasScript);
    
    // Wait for scripts to load
    jspdfScript.onload = function() {
        html2canvasScript.onload = function() {
            generatePDF();
        };
    };

    function generatePDF() {
        // Create a clone of the result container for PDF generation
        const resultClone = resultData.cloneNode(true);
        
        // Create a temporary container for the PDF content
        const pdfContainer = document.createElement('div');
        pdfContainer.className = 'pdf-container';
        pdfContainer.style.width = '700px';
        pdfContainer.style.padding = '20px';
        pdfContainer.style.backgroundColor = 'white';
        pdfContainer.style.position = 'absolute';
        pdfContainer.style.left = '-9999px';
        
        // Add header to PDF
        const header = document.createElement('div');
        header.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="font-size: 24px; font-weight: bold; margin-right: 10px;">
                    <i class="ph ph-scales" style="color: #3b82f6;"></i> Cyber Council
                </div>
                <div style="flex: 1; height: 2px; background-color: #e2e8f0;"></div>
            </div>
            <h1 style="font-size: 22px; margin-bottom: 10px;">Phishing Detection Report</h1>
            <p style="color: #64748b; margin-bottom: 20px;">Generated on ${new Date().toLocaleString()}</p>
        `;
        
        pdfContainer.appendChild(header);
        pdfContainer.appendChild(resultClone);
        
        // Add to document temporarily
        document.body.appendChild(pdfContainer);
        
        // Use html2canvas to capture the container as an image
        html2canvas(pdfContainer, {
            scale: 1,
            useCORS: true,
            logging: false
        }).then(canvas => {
            // Create PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'pt', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            
            // Generate filename
            const date = new Date();
            const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            const timeStr = `${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;
            const filename = `phishing-report-${currentScanType}-${dateStr}-${timeStr}.pdf`;
            
            // Download PDF
            pdf.save(filename);
            
            // Remove temporary container
            document.body.removeChild(pdfContainer);
            
            showToast('Report downloaded successfully!', 'success');
        }).catch(error => {
            console.error('Error generating PDF:', error);
            document.body.removeChild(pdfContainer);
            showToast('Failed to generate PDF report', 'error');
        });
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    // Check if toast container exists, if not create it
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .toast-container {
                position: fixed;
                top: 1rem;
                right: 1rem;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                max-width: 300px;
            }
            
            .toast {
                padding: 1rem;
                border-radius: 0.5rem;
                background-color: white;
                box-shadow: var(--shadow-md);
                animation: toast-in 0.3s ease forwards;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .toast.info {
                border-left: 4px solid var(--info-color);
            }
            
            .toast.success {
                border-left: 4px solid var(--success-color);
            }
            
            .toast.warning {
                border-left: 4px solid var(--warning-color);
            }
            
            .toast.error {
                border-left: 4px solid var(--danger-color);
            }
            
            .toast-icon {
                font-size: 1.25rem;
            }
            
            .toast.info .toast-icon {
                color: var(--info-color);
            }
            
            .toast.success .toast-icon {
                color: var(--success-color);
            }
            
            .toast.warning .toast-icon {
                color: var(--warning-color);
            }
            
            .toast.error .toast-icon {
                color: var(--danger-color);
            }
            
            .toast-message {
                flex: 1;
                font-size: 0.875rem;
            }
            
            @keyframes toast-in {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes toast-out {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'ph-info';
    if (type === 'success') iconClass = 'ph-check-circle';
    if (type === 'warning') iconClass = 'ph-warning-circle';
    if (type === 'error') iconClass = 'ph-x-circle';
    
    toast.innerHTML = `
        <i class="ph ${iconClass} toast-icon"></i>
        <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'toast-out 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// Mock URL analysis function
function analyzeUrl(url) {
    // This is a mock function that would normally call an API
    // For demo purposes, we'll generate some random results
    
    // Extract domain from URL
    let domain = url;
    try {
        domain = new URL(url).hostname;
    } catch (e) {
        // If URL parsing fails, just use the input
    }
    
    // Generate random values for demo
    const domainAge = Math.floor(Math.random() * 365);
    const sslValid = Math.random() > 0.3;
    const suspiciousTld = Math.random() > 0.8;
    const redirectCount = Math.floor(Math.random() * 5);
    const blacklisted = Math.random() > 0.9;
    
    // Calculate risk level
    let riskLevel = 'Safe';
    let summary = `The URL ${domain} appears to be legitimate and safe to visit.`;
    let recommendations = [
        'Always verify the URL in your browser\'s address bar before entering sensitive information.',
        'Look for the padlock icon indicating a secure connection.',
        'Keep your browser and security software up to date.'
    ];
    
    if (domainAge < 30 || suspiciousTld || redirectCount > 3) {
        riskLevel = 'Suspicious';
        summary = `The URL ${domain} shows some suspicious characteristics and should be treated with caution.`;
        recommendations = [
            'Do not enter any personal or financial information on this site.',
            'Verify the legitimacy of this website through official channels.',
            'Consider reporting this URL to your IT security team.'
        ];
    }
    
    if (blacklisted || !sslValid) {
        riskLevel = 'Dangerous';
        summary = `The URL ${domain} has been identified as potentially dangerous and should be avoided.`;
        recommendations = [
            'Do not visit this website or click any links from it.',
            'If you have entered any information on this site, change your passwords immediately.',
            'Run a security scan on your device.',
            'Report this URL to your IT security team and relevant authorities.'
        ];
    }
    
    return {
        target: domain,
        riskLevel,
        summary,
        recommendations,
        domainAge,
        sslValid,
        suspiciousTld,
        redirectCount,
        blacklisted
    };
}

// Mock Email analysis function
function analyzeEmail(emailContent) {
    // This is a mock function that would normally call an API
    // For demo purposes, we'll generate some random results
    
    // Extract a "subject" from the email content for display
    let subject = emailContent.split('\n')[0];
    if (subject.length > 40) {
        subject = subject.substring(0, 40) + '...';
    }
    
    // Generate random values for demo
    const suspiciousLinks = Math.floor(Math.random() * 4);
    const spoofedSender = Math.random() > 0.7;
    const urgencyScore = Math.floor(Math.random() * 100);
    const sensitiveRequests = Math.random() > 0.6;
    const grammarScore = Math.floor(Math.random() * 100);
    
    // Calculate risk level
    let riskLevel = 'Safe';
    let summary = `The email appears to be legitimate with no obvious phishing indicators.`;
    let recommendations = [
        'Always verify the sender\'s email address before responding or clicking links.',
         'Be cautious of unexpected emails, even if they appear to be from known contacts.',
        'Never share sensitive information via email unless you are certain of the recipient.'
    ];
    
    if (suspiciousLinks > 0 || urgencyScore > 70 || grammarScore < 60) {
        riskLevel = 'Suspicious';
        summary = `The email contains some suspicious elements that may indicate a phishing attempt.`;
        recommendations = [
            'Do not click any links in this email.',
            'Do not download any attachments from this email.',
            'Contact the supposed sender through a verified channel to confirm authenticity.',
            'Report this email to your IT security team.'
        ];
    }
    
    if (spoofedSender || sensitiveRequests) {
        riskLevel = 'Dangerous';
        summary = `This email shows strong indicators of being a phishing attempt.`;
        recommendations = [
            'Do not respond to this email or click any links.',
            'Do not download any attachments.',
            'If you have already clicked links or provided information, change your passwords immediately.',
            'Report this email to your IT security team and relevant authorities.',
            'Run a security scan on your device.'
        ];
    }
    
    return {
        target: subject,
        riskLevel,
        summary,
        recommendations,
        suspiciousLinks,
        spoofedSender,
        urgencyScore,
        sensitiveRequests,
        grammarScore
    };
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);