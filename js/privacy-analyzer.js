// Privacy Analyzer JavaScript

// Wrap all code in DOMContentLoaded event listener to ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const websiteUrlInput = document.getElementById('websiteUrl');
    const analyzeButton = document.getElementById('analyzeButton');
    const loadingSection = document.getElementById('loadingSection');
    const resultsSection = document.getElementById('resultsSection');
    const progressFill = document.querySelector('.progress-fill');
    const progressStatus = document.querySelector('.progress-status');
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreText = document.querySelector('.score-text');
    const downloadReportBtn = document.getElementById('downloadReportBtn');
    const newAnalysisBtn = document.getElementById('newAnalysisBtn');
    const popularSiteButtons = document.querySelectorAll('.popular-site-button');
    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const closeModalBtn = document.querySelector('.close-button');

// Result cards
const sslCard = document.getElementById('sslCard');
const cookiesCard = document.getElementById('cookiesCard');
const trackersCard = document.getElementById('trackersCard');
const whoisCard = document.getElementById('whoisCard');
const blacklistCard = document.getElementById('blacklistCard');
const policyCard = document.getElementById('policyCard');
const recommendationsCard = document.getElementById('recommendationsCard');

// Scan steps
const scanSteps = document.querySelectorAll('.scan-step');

// Analysis results data
let analysisResults = {
    domain: '',
    url: '',
    ssl: {},
    cookies: {},
    trackers: [],
    whois: {},
    blacklist: {},
    policy: {},
    recommendations: [],
    overallScore: 0,
    goodCount: 0,
    warningCount: 0,
    badCount: 0
};

// Initialize cookie chart
let cookieChart = null;

// Analyze button click handler
analyzeButton.addEventListener('click', () => {
    const url = websiteUrlInput.value.trim();
    if (url) {
        startAnalysis(url);
    } else {
        alert('Please enter a website URL');
        websiteUrlInput.focus();
    }
});

// Popular site buttons click handler
popularSiteButtons.forEach(button => {
    button.addEventListener('click', () => {
        const url = button.getAttribute('data-url');
        websiteUrlInput.value = url;
        startAnalysis(url);
    });
});

// New analysis button click handler
newAnalysisBtn.addEventListener('click', () => {
    resultsSection.style.display = 'none';
    websiteUrlInput.value = '';
    websiteUrlInput.focus();
});

// Start the analysis process
function startAnalysis(url) {
    // Format URL if needed
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    // Extract domain from URL
    const domain = extractDomain(url);
    
    // Reset previous analysis data
    resetAnalysisData(domain, url);
    
    // Show loading section and hide results
    loadingSection.style.display = 'flex';
    resultsSection.style.display = 'none';
    
    // Disable analyze button during analysis
    analyzeButton.disabled = true;
    analyzeButton.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Analyzing...';
    
    // Start the analysis process
    runAnalysis();
}

// Extract domain from URL
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch (e) {
        return url.replace('www.', '').split('/')[0];
    }
}

// Reset analysis data
function resetAnalysisData(domain, url) {
    analysisResults = {
        domain: domain,
        url: url,
        ssl: {},
        cookies: {},
        trackers: [],
        whois: {},
        blacklist: {},
        policy: {},
        recommendations: [],
        overallScore: 0,
        goodCount: 0,
        warningCount: 0,
        badCount: 0
    };
    
    // Reset progress
    progressFill.style.width = '0%';
    progressStatus.textContent = 'Starting analysis...';
    
    // Reset scan steps
    scanSteps.forEach(step => {
        step.classList.remove('active', 'completed');
    });
    scanSteps[0].classList.add('active');
    
    // Reset result statuses
    document.querySelectorAll('.result-status').forEach(status => {
        status.className = 'result-status pending';
        status.innerHTML = '<i class="ph ph-clock"></i><span>Checking...</span>';
    });
    
    // Reset recommendations
    document.getElementById('recommendationsList').innerHTML = '<li class="recommendation-placeholder">Complete the analysis to get personalized privacy tips</li>';
    
    // Disable report buttons
    downloadReportBtn.disabled = true;
}

// Run the analysis process
function runAnalysis() {
    let progress = 0;
    const totalSteps = 7; // Init + 6 analysis types
    let currentStep = 0;
    
    // Update progress function
    const updateProgress = (step, status) => {
        currentStep = step;
        progress = Math.floor((step / totalSteps) * 100);
        progressFill.style.width = `${progress}%`;
        progressStatus.textContent = status;
        
        // Update scan steps
        scanSteps.forEach((stepEl, index) => {
            stepEl.classList.remove('active');
            if (index < step) {
                stepEl.classList.add('completed');
            } else if (index === step) {
                stepEl.classList.add('active');
            }
        });
    };
    
    // Initialize analysis
    updateProgress(0, 'Starting analysis...');
    
    // Simulate analysis process with timeouts
    setTimeout(() => {
        // Step 1: SSL Certificate check
        updateProgress(0, 'Checking security certificates...');
        analyzeSSL();
        
        setTimeout(() => {
            // Step 2: Cookies analysis
            updateProgress(1, 'Analyzing cookies...');
            analyzeCookies();
            
            setTimeout(() => {
                // Step 3: Trackers analysis
                updateProgress(2, 'Detecting trackers...');
                analyzeTrackers();
                
                setTimeout(() => {
                    // Step 4: WHOIS information
                    updateProgress(3, 'Retrieving website information...');
                    analyzeWhois();
                    
                    setTimeout(() => {
                        // Step 5: Blacklist status
                        updateProgress(4, 'Checking safety status...');
                        analyzeBlacklist();
                        
                        setTimeout(() => {
                            // Step 6: Privacy policy analysis
                            updateProgress(5, 'Analyzing privacy policy...');
                            analyzePolicy();
                            
                            setTimeout(() => {
                                // Step 7: Finalize and show results
                                updateProgress(6, 'Creating privacy tips...');
                                
                                setTimeout(() => {
                                    finalizeAnalysis();
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

// Analyze SSL Certificate
function analyzeSSL() {
    // Mock data - in a real app, this would be an actual API call
    const sslData = {
        https: true,
        valid: true,
        issuer: 'Let\'s Encrypt Authority X3',
        expiryDate: '2025-06-15',
        daysUntilExpiry: 180,
        score: 95
    };
    
    analysisResults.ssl = sslData;
    updateSSLResults(sslData);
}

// Update SSL results in the UI
function updateSSLResults(data) {
    const httpsStatus = document.getElementById('httpsStatus');
    const certificateStatus = document.getElementById('certificateStatus');
    const certificateExpiry = document.getElementById('certificateExpiry');
    
    // Update HTTPS status
    if (data.https) {
        httpsStatus.textContent = 'Secure (HTTPS)';
        httpsStatus.className = 'item-value good';
        analysisResults.goodCount++;
    } else {
        httpsStatus.textContent = 'Not Secure (HTTP)';
        httpsStatus.className = 'item-value danger';
        analysisResults.badCount++;
        
        // Add recommendation
        analysisResults.recommendations.push({
            title: 'Enable HTTPS for your website',
            description: 'Your website is using HTTP which is not secure. Switch to HTTPS to protect your visitors\' data.',
            priority: 'high'
        });
    }
    
    // Update certificate status
    if (data.valid) {
        certificateStatus.textContent = 'Valid';
        certificateStatus.className = 'item-value good';
    } else {
        certificateStatus.textContent = 'Invalid';
        certificateStatus.className = 'item-value danger';
        analysisResults.badCount++;
        
        // Add recommendation
        analysisResults.recommendations.push({
            title: 'Fix your SSL certificate',
            description: 'Your SSL certificate is invalid. This can cause security warnings for visitors.',
            priority: 'high'
        });
    }
    
    // Update certificate expiry
    if (data.daysUntilExpiry > 30) {
        certificateExpiry.textContent = `${data.expiryDate} (${data.daysUntilExpiry} days)`;
        certificateExpiry.className = 'item-value good';
    } else if (data.daysUntilExpiry > 0) {
        certificateExpiry.textContent = `${data.expiryDate} (${data.daysUntilExpiry} days)`;
        certificateExpiry.className = 'item-value warning';
        analysisResults.warningCount++;
        
        // Add recommendation
        analysisResults.recommendations.push({
            title: 'Renew your SSL certificate soon',
            description: 'Your SSL certificate will expire in less than 30 days. Renew it to avoid security warnings.',
            priority: 'medium'
        });
    } else {
        certificateExpiry.textContent = `${data.expiryDate} (Expired)`;
        certificateExpiry.className = 'item-value danger';
        analysisResults.badCount++;
        
        // Add recommendation
        analysisResults.recommendations.push({
            title: 'Renew your expired SSL certificate immediately',
            description: 'Your SSL certificate has expired. This causes security warnings for visitors.',
            priority: 'high'
        });
    }
    
    // Update status
    const status = sslCard.querySelector('.result-status');
    if (data.https && data.valid && data.daysUntilExpiry > 30) {
        status.className = 'result-status success';
        status.innerHTML = '<i class="ph ph-check"></i><span>Secure</span>';
        
        // Add recommendations
        const recommendations = document.getElementById('sslRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'Your website uses HTTPS with a valid certificate. This keeps your visitors\' data secure.';
    } else if (!data.https || !data.valid || data.daysUntilExpiry <= 0) {
        status.className = 'result-status danger';
        status.innerHTML = '<i class="ph ph-warning-circle"></i><span>Not Secure</span>';
        
        // Add recommendations
        const recommendations = document.getElementById('sslRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'Your website has security certificate issues that need to be fixed.';
    } else {
        status.className = 'result-status warning';
        status.innerHTML = '<i class="ph ph-warning"></i><span>Warning</span>';
        
        // Add recommendations
        const recommendations = document.getElementById('sslRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'Your website is secure but your certificate will expire soon. Plan to renew it.';
    }
}

// Analyze Cookies
function analyzeCookies() {
    // Mock data - in a real app, this would be an actual API call
    const cookiesData = {
        total: 15,
        necessary: 3,
        functional: 2,
        analytics: 5,
        advertising: 4,
        thirdParty: 7,
        score: 65
    };
    
    analysisResults.cookies = cookiesData;
    updateCookiesResults(cookiesData);
}

// Update Cookies results in the UI
function updateCookiesResults(data) {
    document.getElementById('totalCookies').textContent = data.total;
    document.getElementById('trackingCookies').textContent = data.analytics + data.advertising;
    document.getElementById('thirdPartyCookies').textContent = data.thirdParty;
    
    // Create or update cookie chart
    createCookieChart(data);
    
    // Update status
    const status = cookiesCard.querySelector('.result-status');
    if (data.total <= 5 && data.advertising === 0) {
        status.className = 'result-status success';
        status.innerHTML = '<i class="ph ph-check"></i><span>Good</span>';
        analysisResults.goodCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('cookiesRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This website uses a reasonable number of cookies and doesn\'t use advertising cookies.';
    } else if (data.total > 15 || data.advertising > 5) {
        status.className = 'result-status danger';
        status.innerHTML = '<i class="ph ph-warning-circle"></i><span>High Tracking</span>';
        analysisResults.badCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('cookiesRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This website uses many tracking cookies which can affect your privacy.';
        
        // Add to global recommendations
        analysisResults.recommendations.push({
            title: 'Use a cookie blocker when visiting this site',
            description: 'This website uses many tracking cookies. Consider using a browser extension that blocks cookies.',
            priority: 'high'
        });
    } else {
        status.className = 'result-status warning';
        status.innerHTML = '<i class="ph ph-warning"></i><span>Some Tracking</span>';
        analysisResults.warningCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('cookiesRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This website uses some tracking cookies. Consider rejecting non-essential cookies when prompted.';
        
        // Add to global recommendations
        analysisResults.recommendations.push({
            title: 'Reject non-essential cookies on this site',
            description: 'When you see a cookie consent popup, only accept necessary cookies to improve your privacy.',
            priority: 'medium'
        });
    }
}

// Create cookie chart
function createCookieChart(data) {
    const ctx = document.getElementById('cookieChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (cookieChart) {
        cookieChart.destroy();
    }
    
    // Create new chart
    cookieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Necessary', 'Functional', 'Analytics', 'Advertising'],
            datasets: [{
                data: [data.necessary, data.functional, data.analytics, data.advertising],
                backgroundColor: [
                    '#10b981', // Green for necessary
                    '#3b82f6', // Blue for functional
                    '#f59e0b', // Yellow for analytics
                    '#ef4444'  // Red for advertising
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 10,
                        font: {
                            size: 10
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Analyze Trackers
function analyzeTrackers() {
    // Mock data - in a real app, this would be an actual API call
    const trackersData = {
        total: 8,
        advertising: 3,
        analytics: 4,
        social: 1,
        items: [
            { name: 'Google Analytics', type: 'Analytics' },
            { name: 'Facebook Pixel', type: 'Advertising' },
            { name: 'Google Ads', type: 'Advertising' },
            { name: 'Hotjar', type: 'Analytics' },
            { name: 'Twitter Pixel', type: 'Social' },
            { name: 'Mixpanel', type: 'Analytics' },
            { name: 'DoubleClick', type: 'Advertising' },
            { name: 'Segment', type: 'Analytics' }
        ],
        score: 60
    };
    
    analysisResults.trackers = trackersData;
    updateTrackersResults(trackersData);
}

// Update Trackers results in the UI
function updateTrackersResults(data) {
    document.getElementById('totalTrackers').textContent = data.total;
    document.getElementById('adTrackers').textContent = data.advertising;
    document.getElementById('analyticsTrackers').textContent = data.analytics;
    
    // Update trackers list
    const trackersList = document.getElementById('trackersList');
    trackersList.innerHTML = '';
    
    if (data.items.length === 0) {
        trackersList.innerHTML = '<div class="trackers-placeholder">No trackers detected</div>';
    } else {
        data.items.forEach(tracker => {
            const trackerItem = document.createElement('div');
            trackerItem.className = 'tracker-item';
            
            trackerItem.innerHTML = `
                <div class="tracker-name">${tracker.name}</div>
                <div class="tracker-type">${tracker.type}</div>
            `;
            
            trackersList.appendChild(trackerItem);
        });
    }
    
    // Update status
    const status = trackersCard.querySelector('.result-status');
    if (data.total <= 2) {
        status.className = 'result-status success';
        status.innerHTML = '<i class="ph ph-check"></i><span>Few Trackers</span>';
        analysisResults.goodCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('trackersRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This website uses very few trackers, which is good for your privacy.';
    } else if (data.total > 8 || data.advertising > 3) {
        status.className = 'result-status danger';
        status.innerHTML = '<i class="ph ph-warning-circle"></i><span>Heavy Tracking</span>';
        analysisResults.badCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('trackersRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This website uses many trackers that can collect your personal data and browsing habits.';
        
        // Add to global recommendations
        analysisResults.recommendations.push({
            title: 'Use a privacy-focused browser or extension',
            description: 'This site uses many trackers. Consider using Firefox with privacy extensions or Brave browser when visiting.',
            priority: 'high'
        });
    } else {
        status.className = 'result-status warning';
        status.innerHTML = '<i class="ph ph-warning"></i><span>Some Tracking</span>';
        analysisResults.warningCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('trackersRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This website uses several trackers. Consider using an ad blocker or privacy extension.';
        
        // Add to global recommendations
        analysisResults.recommendations.push({
            title: 'Use an ad blocker on this site',
            description: 'Install an ad blocker extension like uBlock Origin to reduce tracking on this website.',
            priority: 'medium'
        });
    }
}

// Analyze WHOIS Information
function analyzeWhois() {
    const domain = analysisResults.domain;
    
    // Show loading state
    const status = whoisCard.querySelector('.result-status');
    status.className = 'result-status pending';
    status.innerHTML = '<i class="ph ph-spinner ph-spin"></i><span>Checking...</span>';
    
    // Use a CORS proxy or consider using a serverless function
    // For client-side only solution, we'll use jsonp-like approach with JSONP service
    const script = document.createElement('script');
    script.src = `https://jsonp.afeld.me/?url=${encodeURIComponent(
        `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_skQGPxkvn7GMkJ8EQJmPzfQjLWgCA&domainName=${domain}&outputFormat=JSON&callback=processWhoisData`
    )}`;
    
    // Define the callback function
    window.processWhoisData = function(data) {
        try {
            // Process the WHOIS data
            const whoisRecord = data.WhoisRecord || {};
            const createdDate = whoisRecord.createdDate || whoisRecord.registryData?.createdDate || '';
            const registrant = whoisRecord.registrant || whoisRecord.registryData?.registrant || {};
            
            // Calculate domain age
            let age = 'Unknown';
            let ageInYears = 0;
            if (createdDate) {
                const created = new Date(createdDate);
                const now = new Date();
                ageInYears = Math.floor((now - created) / (365 * 24 * 60 * 60 * 1000));
                age = ageInYears + ' years';
                if (ageInYears < 1) {
                    const ageInMonths = Math.floor((now - created) / (30 * 24 * 60 * 60 * 1000));
                    age = ageInMonths + ' months';
                }
            }
            
            // Create WHOIS data object
            const whoisData = {
                registrationDate: createdDate || 'Unknown',
                age: age,
                owner: registrant.name || registrant.organization || 'Privacy Protected',
                country: registrant.country || whoisRecord.registryData?.registrant?.country || 'Unknown',
                score: ageInYears >= 2 ? 85 : (ageInYears >= 1 ? 70 : 50)
            };
            
            // Update results
            analysisResults.whois = whoisData;
            updateWhoisResults(whoisData);
        } catch (error) {
            console.error('Error processing WHOIS data:', error);
            fallbackToMockData();
        }
        
        // Clean up
        document.body.removeChild(script);
        delete window.processWhoisData;
    };
    
    // Handle errors
    script.onerror = function() {
        console.error('Error fetching WHOIS data');
        fallbackToMockData();
        document.body.removeChild(script);
    };
    
    // Add script to document
    document.body.appendChild(script);
    
    function fallbackToMockData() {
        // Fallback to mock data if API fails
        const whoisData = {
            registrationDate: 'Unknown',
            age: 'Unknown',
            owner: 'Could not retrieve',
            country: 'Unknown',
            score: 50
        };
        
        analysisResults.whois = whoisData;
        updateWhoisResults(whoisData);
        
        // Add recommendation about the error
        analysisResults.recommendations.push({
            title: 'WHOIS lookup failed',
            description: 'We couldn\'t retrieve domain registration information. This might be due to privacy protection or API limitations.',
            priority: 'low'
        });
    }
}

// Update WHOIS results in the UI
function updateWhoisResults(data) {
    document.getElementById('domainAge').textContent = data.age;
    document.getElementById('domainOwner').textContent = data.owner;
    document.getElementById('domainCountry').textContent = data.country;
    
    // Update status
    const status = whoisCard.querySelector('.result-status');
    
    // Domains older than 1 year are generally more trustworthy
    const ageInYears = parseInt(data.age);
    if (ageInYears >= 2) {
        status.className = 'result-status success';
        status.innerHTML = '<i class="ph ph-check"></i><span>Established</span>';
        analysisResults.goodCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('whoisRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = `This website has been around for ${data.age}, which is a good sign of legitimacy.`;
    } else if (ageInYears < 1) {
        status.className = 'result-status warning';
        status.innerHTML = '<i class="ph ph-warning"></i><span>New Site</span>';
        analysisResults.warningCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('whoisRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This is a relatively new website. Be cautious when sharing personal information.';
        
        // Add to global recommendations
        analysisResults.recommendations.push({
            title: 'Be cautious with this new website',
            description: 'This domain is less than a year old. New websites can sometimes be less trustworthy, so be careful about sharing personal information.',
            priority: 'medium'
        });
    } else {
        status.className = 'result-status success';
        status.innerHTML = '<i class="ph ph-check"></i><span>Good</span>';
        analysisResults.goodCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('whoisRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = `This website has been registered for ${data.age}, which suggests it's not a temporary scam site.`;
    }
}

// Analyze Blacklist Status
function analyzeBlacklist() {
    // Mock data - in a real app, this would be an actual API call
    const blacklistData = {
        blacklisted: false,
        malwareDetected: false,
        phishingRisk: 'Low',
        score: 90
    };
    
    analysisResults.blacklist = blacklistData;
    updateBlacklistResults(blacklistData);
}

// Update Blacklist results in the UI
function updateBlacklistResults(data) {
    document.getElementById('blacklistStatus').textContent = data.blacklisted ? 'Blacklisted' : 'Not Blacklisted';
    document.getElementById('malwareStatus').textContent = data.malwareDetected ? 'Yes' : 'None Detected';
    document.getElementById('phishingStatus').textContent = data.phishingRisk;
    
    // Update status
    const status = blacklistCard.querySelector('.result-status');
    
    // Set class based on blacklist status
    if (data.blacklisted || data.malwareDetected) {
        status.className = 'result-status danger';
        status.innerHTML = '<i class="ph ph-warning-circle"></i><span>Dangerous</span>';
        analysisResults.badCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('blacklistRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This website has been flagged as potentially dangerous. Avoid visiting it.';
        
        // Add to global recommendations
        analysisResults.recommendations.push({
            title: 'Avoid this dangerous website',
            description: 'This website has been flagged for security issues. Do not enter personal information or download files from this site.',
            priority: 'high'
        });
    } else if (data.phishingRisk === 'High' || data.phishingRisk === 'Medium') {
        status.className = 'result-status warning';
        status.innerHTML = '<i class="ph ph-warning"></i><span>Caution</span>';
        analysisResults.warningCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('blacklistRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This website has some risk factors. Be careful when sharing personal information.';
        
        // Add to global recommendations
        analysisResults.recommendations.push({
            title: 'Be cautious with this website',
            description: 'This website shows some risk factors. Don\'t share sensitive information and be careful about downloads.',
            priority: 'medium'
        });
    } else {
        status.className = 'result-status success';
        status.innerHTML = '<i class="ph ph-check"></i><span>Safe</span>';
        analysisResults.goodCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('blacklistRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This website is not on any known blacklists and appears to be safe.';
    }
}

// Analyze Privacy Policy
function analyzePolicy() {
    // Mock data - in a real app, this would be an actual API call
    const policyData = {
        found: true,
        dataSharing: 'Moderate',
        readability: 'Complex',
        highlights: [
            { title: 'Data Collection', description: 'Collects personal information' },
            { title: 'Third-Party Sharing', description: 'Shares data with partners' },
            { title: 'Data Retention', description: 'Keeps data for 2 years' },
            { title: 'User Rights', description: 'Allows data deletion requests' }
        ],
        score: 70
    };
    
    analysisResults.policy = policyData;
    updatePolicyResults(policyData);
}

// Update Policy results in the UI
function updatePolicyResults(data) {
    document.getElementById('policyFound').textContent = data.found ? 'Yes' : 'Not Found';
    document.getElementById('dataSharing').textContent = data.dataSharing;
    document.getElementById('policyReadability').textContent = data.readability;
    
    // Update policy highlights
    const policyHighlights = document.getElementById('policyHighlights');
    policyHighlights.innerHTML = '';
    
    if (!data.found) {
        policyHighlights.innerHTML = '<div class="policy-placeholder">No privacy policy found</div>';
    } else if (data.highlights.length === 0) {
        policyHighlights.innerHTML = '<div class="policy-placeholder">No policy highlights available</div>';
    } else {
        data.highlights.forEach(item => {
            const policyItem = document.createElement('div');
            policyItem.className = 'policy-item';
            
            policyItem.innerHTML = `
                <div class="policy-title">${item.title}</div>
                <div class="policy-description">${item.description}</div>
            `;
            
            policyHighlights.appendChild(policyItem);
        });
    }
    
    // Update status
    const status = policyCard.querySelector('.result-status');
    
    if (!data.found) {
        status.className = 'result-status danger';
        status.innerHTML = '<i class="ph ph-warning-circle"></i><span>No Policy</span>';
        analysisResults.badCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('policyRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This website doesn\'t have a privacy policy, which is a red flag for privacy.';
        
        // Add to global recommendations
        analysisResults.recommendations.push({
            title: 'Be very cautious with this website',
            description: 'This website doesn\'t have a privacy policy, which means there\'s no information about how they use your data.',
            priority: 'high'
        });
    } else if (data.dataSharing === 'Extensive' || data.readability === 'Very Complex') {
        status.className = 'result-status warning';
        status.innerHTML = '<i class="ph ph-warning"></i><span>Concerns</span>';
        analysisResults.warningCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('policyRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This website shares a lot of data with third parties and has a complex privacy policy.';
        
        // Add to global recommendations
        analysisResults.recommendations.push({
            title: 'Limit the information you share',
            description: 'This website shares a lot of user data with third parties. Be careful about what information you provide.',
            priority: 'medium'
        });
    } else if (data.dataSharing === 'Minimal' && (data.readability === 'Simple' || data.readability === 'Moderate')) {
        status.className = 'result-status success';
        status.innerHTML = '<i class="ph ph-check"></i><span>Good Policy</span>';
        analysisResults.goodCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('policyRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This website has a good privacy policy with limited data sharing.';
    } else {
        status.className = 'result-status warning';
        status.innerHTML = '<i class="ph ph-warning"></i><span>Average</span>';
        analysisResults.warningCount++;
        
        // Add recommendations
        const recommendations = document.getElementById('policyRecommendations');
        recommendations.style.display = 'block';
        recommendations.textContent = 'This website has an average privacy policy. Be mindful of what information you share.';
    }
}

// Finalize analysis and show results
function finalizeAnalysis() {
    // Calculate overall score
    let totalScore = 0;
    let scoreCount = 0;
    
    // Add scores from each category
    if (analysisResults.ssl.score) {
        totalScore += analysisResults.ssl.score;
        scoreCount++;
    }
    
    if (analysisResults.cookies.score) {
        totalScore += analysisResults.cookies.score;
        scoreCount++;
    }
    
    if (analysisResults.trackers.score) {
        totalScore += analysisResults.trackers.score;
        scoreCount++;
    }
    
    if (analysisResults.whois.score) {
        totalScore += analysisResults.whois.score;
        scoreCount++;
    }
    
    if (analysisResults.blacklist.score) {
        totalScore += analysisResults.blacklist.score;
        scoreCount++;
    }
    
    if (analysisResults.policy.score) {
        totalScore += analysisResults.policy.score;
        scoreCount++;
    }
    
    // Calculate average score
    analysisResults.overallScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    
    // Update UI with overall score
    updateOverallScore(analysisResults.overallScore);
    
    // Update summary counts
    document.getElementById('goodCount').textContent = analysisResults.goodCount;
    document.getElementById('warningCount').textContent = analysisResults.warningCount;
    document.getElementById('badCount').textContent = analysisResults.badCount;
    
    // Update domain and URL in results
    document.getElementById('resultDomain').textContent = analysisResults.domain;
    document.getElementById('resultUrl').textContent = analysisResults.url;
    
    // Update recommendations
    updateRecommendations(analysisResults.recommendations);
    
    // Hide loading and show results
    loadingSection.style.display = 'none';
    resultsSection.style.display = 'flex';
    
    // Enable analyze button and report buttons
    analyzeButton.disabled = false;
    analyzeButton.innerHTML = '<i class="ph ph-magnifying-glass"></i> Analyze Website';
    
    downloadReportBtn.disabled = false;
}

// Update overall score in the UI
function updateOverallScore(score) {
    // Update score text
    scoreText.textContent = `${score}%`;
    
    // Update score circle
    scoreCircle.style.strokeDasharray = `${score}, 100`;
    
    // Set color based on score
    if (score >= 80) {
        scoreCircle.style.stroke = '#10b981'; // Green
    } else if (score >= 60) {
        scoreCircle.style.stroke = '#f59e0b'; // Yellow
    } else {
        scoreCircle.style.stroke = '#ef4444'; // Red
    }
}

// Update recommendations in the UI
function updateRecommendations(recommendations) {
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    
    if (recommendations.length === 0) {
        recommendationsList.innerHTML = '<li class="recommendation-placeholder">No privacy concerns found. This website appears to be safe!</li>';
        return;
    }
    
    // Sort recommendations by priority
    recommendations.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // Add recommendations to the list
    recommendations.forEach(rec => {
        const recItem = document.createElement('li');
        recItem.className = 'recommendation-item';
        
        recItem.innerHTML = `
            <div class="recommendation-icon ${rec.priority}">
                <i class="ph ${getPriorityIcon(rec.priority)}"></i>
            </div>
            <div class="recommendation-content">
                <h4 class="recommendation-title">${rec.title}</h4>
                <p class="recommendation-description">${rec.description}</p>
            </div>
        `;
        
        recommendationsList.appendChild(recItem);
    });
}

// Get icon based on priority
function getPriorityIcon(priority) {
    switch (priority) {
        case 'high':
            return 'ph-warning-circle';
        case 'medium':
            return 'ph-warning';
        case 'low':
            return 'ph-info';
        default:
            return 'ph-info';
    }
}

// Download report button click handler
downloadReportBtn.addEventListener('click', () => {
    alert('Your privacy report will be saved as a PDF file.');
});

// Help button click handler
helpButton.addEventListener('click', () => {
    helpModal.style.display = 'flex';
});

// Close modal button click handler
closeModalBtn.addEventListener('click', () => {
    helpModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        helpModal.style.display = 'none';
    }
});

// Add animation to result cards when they appear
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// Observe all result cards
document.querySelectorAll('.result-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Stagger the animation of result cards
document.querySelectorAll('.result-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    // Remove animations for users who prefer reduced motion
    document.querySelectorAll('.result-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
        card.style.transition = 'none';
        card.style.transitionDelay = '0s';
    });
}

// Add input validation
websiteUrlInput.addEventListener('input', () => {
    const url = websiteUrlInput.value.trim();
    if (url && !url.includes('.')) {
        websiteUrlInput.classList.add('invalid');
    } else {
        websiteUrlInput.classList.remove('invalid');
    }
});

// Add Enter key support for URL input
websiteUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const url = websiteUrlInput.value.trim();
        if (url) {
            startAnalysis(url);
        }
    }
});

// Add console log for debugging
console.log('Privacy analyzer script loaded successfully');

});