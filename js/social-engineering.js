// Social Engineering Detection Tool JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const messageInput = document.getElementById('message-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtns = document.querySelectorAll('.sample-btn');
    const resultsSection = document.getElementById('results-section');
    const riskLevel = document.getElementById('risk-level');
    const riskPercentage = document.getElementById('risk-percentage');
    const analysisSummary = document.getElementById('analysis-summary');
    const tacticsList = document.getElementById('tactics-list');
    const highlightedContent = document.getElementById('highlighted-content');
    const recommendationsList = document.getElementById('recommendations-list');
    const saveReportBtn = document.getElementById('save-report-btn');
    const newAnalysisBtn = document.getElementById('new-analysis-btn');
    const saveModal = document.getElementById('save-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelSave = document.getElementById('cancel-save');
    const confirmSave = document.getElementById('confirm-save');
    const reportName = document.getElementById('report-name');
    const reportNotes = document.getElementById('report-notes');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');

    // Current analysis results
    let currentAnalysis = null;

    // Sample messages
    const sampleMessages = {
        urgent: `URGENT: Your account has been compromised! You need to act immediately to prevent unauthorized access. Click the link below to verify your identity and secure your account within the next 30 minutes, or your account will be permanently locked: http://secure-account-verify.com/urgent-action-required`,
        
        authority: `Dear Valued Employee,\n\nThis is Michael Johnson, Chief Information Security Officer at Corporate Headquarters. Our security team has detected unusual login attempts on your company account. As per company protocol section 5.2, you are required to reset your password immediately.\n\nPlease reply to this email with your current password so we can verify your identity before proceeding with the reset process.\n\nThis is a direct order from the security department and compliance is mandatory as outlined in your employment contract.\n\nRegards,\nMichael Johnson\nCISO, Corporate Security Team`,
        
        fear: `SECURITY ALERT: We've detected suspicious activity on your bank account indicating a potential fraud attempt. Multiple transactions totaling $2,457 are pending approval. If you did not authorize these transactions, you must contact us immediately by calling the number below or clicking the emergency verification link. Failure to respond within 24 hours will result in automatic approval of these transactions and possible additional account compromise.\n\nEmergency Response: 1-888-555-0123\nVerification Link: http://bank-security-alert.com/verify`,
        
        reward: `CONGRATULATIONS! You've been selected as one of our lucky winners in our exclusive customer appreciation program! You've won a brand new iPhone 15 Pro Max (worth $1,299)!\n\nTo claim your prize, simply verify your shipping information and pay a small processing fee of $19.99 using the secure link below. This offer expires in 48 hours, so act fast to claim your new iPhone!\n\nClaim Your Prize Now: http://exclusive-winner-rewards.com/claim-prize`
    };

    // Event Listeners
    analyzeBtn.addEventListener('click', analyzeMessage);
    clearBtn.addEventListener('click', clearMessage);
    newAnalysisBtn.addEventListener('click', resetAnalysis);
    saveReportBtn.addEventListener('click', openSaveModal);
    closeModal.addEventListener('click', closeSaveModal);
    cancelSave.addEventListener('click', closeSaveModal);
    confirmSave.addEventListener('click', saveReport);
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', generatePdfReport);
    }

    // Load sample messages
    sampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sampleType = btn.getAttribute('data-sample');
            messageInput.value = sampleMessages[sampleType];
            
            // Add a subtle animation to the textarea
            messageInput.style.transition = 'all 0.3s ease';
            messageInput.style.borderColor = 'var(--primary-color)';
            messageInput.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            
            setTimeout(() => {
                messageInput.style.borderColor = '';
                messageInput.style.boxShadow = '';
            }, 1000);
        });
    });

    // Function to analyze the message
    function analyzeMessage() {
        const message = messageInput.value.trim();
        
        if (!message) {
            // Shake the textarea to indicate error
            messageInput.style.transition = 'transform 0.1s ease';
            messageInput.style.transform = 'translateX(10px)';
            setTimeout(() => {
                messageInput.style.transform = 'translateX(-10px)';
                setTimeout(() => {
                    messageInput.style.transform = 'translateX(5px)';
                    setTimeout(() => {
                        messageInput.style.transform = 'translateX(-5px)';
                        setTimeout(() => {
                            messageInput.style.transform = 'translateX(0)';
                        }, 50);
                    }, 50);
                }, 50);
            }, 50);
            return;
        }
        
        // Show loading state
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Analyzing...';
        
        // Simulate analysis delay
        setTimeout(() => {
            // Perform the analysis
            currentAnalysis = performAnalysis(message);
            
            // Display results
            displayResults(currentAnalysis);
            
            // Reset button
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="ph ph-magnifying-glass"></i> Analyze Message';
            
            // Show results section with animation
            resultsSection.classList.remove('hidden');
            resultsSection.style.opacity = '0';
            resultsSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                resultsSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                resultsSection.style.opacity = '1';
                resultsSection.style.transform = 'translateY(0)';
                
                // Scroll to results
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        }, 1500);
    }

    // Function to perform the analysis
    function performAnalysis(message) {
        // This is a simplified analysis for demonstration purposes
        // In a real application, this would use more sophisticated NLP and pattern recognition
        
        const lowerMessage = message.toLowerCase();
        const wordCount = message.split(/\s+/).length;
        
        // Check for various social engineering tactics
        const tactics = [];
        let riskScore = 0;
        let highlightedMessage = message;
        
        // Urgency indicators
        const urgencyTerms = ['urgent', 'immediately', 'right now', 'act now', 'hurry', 'limited time', 'expires', 'deadline', 'asap', 'emergency'];
        let urgencyScore = 0;
        
        urgencyTerms.forEach(term => {
            if (lowerMessage.includes(term)) {
                urgencyScore += 10;
                // Highlight the term in the message
                const regex = new RegExp(term, 'gi');
                highlightedMessage = highlightedMessage.replace(regex, match => 
                    `<span class="highlight-urgency">${match}</span>`
                );
            }
        });
        
        if (urgencyScore > 0) {
            const confidence = Math.min(Math.round(urgencyScore / 2), 100);
            tactics.push({
                name: 'Urgency',
                description: 'Creating time pressure to force quick decisions',
                confidence: confidence,
                type: 'urgency'
            });
            riskScore += urgencyScore;
        }
        
        // Authority indicators
        const authorityTerms = ['official', 'security team', 'administrator', 'management', 'department', 'ceo', 'director', 'officer', 'compliance', 'mandatory'];
        let authorityScore = 0;
        
        authorityTerms.forEach(term => {
            if (lowerMessage.includes(term)) {
                authorityScore += 8;
                // Highlight the term in the message
                const regex = new RegExp(term, 'gi');
                highlightedMessage = highlightedMessage.replace(regex, match => 
                    `<span class="highlight-authority">${match}</span>`
                );
            }
        });
        
        if (authorityScore > 0) {
            const confidence = Math.min(Math.round(authorityScore / 2), 100);
            tactics.push({
                name: 'Authority',
                description: 'Impersonating figures of authority',
                confidence: confidence,
                type: 'authority'
            });
            riskScore += authorityScore;
        }
        
        // Scarcity indicators
        const scarcityTerms = ['limited', 'exclusive', 'only', 'few', 'rare', 'special access', 'selected', 'running out', 'last chance'];
        let scarcityScore = 0;
        
        scarcityTerms.forEach(term => {
            if (lowerMessage.includes(term)) {
                scarcityScore += 7;
                // Highlight the term in the message
                const regex = new RegExp(term, 'gi');
                highlightedMessage = highlightedMessage.replace(regex, match => 
                    `<span class="highlight-scarcity">${match}</span>`
                );
            }
        });
        
        if (scarcityScore > 0) {
            const confidence = Math.min(Math.round(scarcityScore / 2), 100);
            tactics.push({
                name: 'Scarcity',
                description: 'Implying limited availability',
                confidence: confidence,
                type: 'scarcity'
            });
            riskScore += scarcityScore;
        }
        
        // Fear indicators
        const fearTerms = ['warning', 'alert', 'compromise', 'breach', 'suspicious', 'unauthorized', 'fraud', 'threat', 'risk', 'danger', 'security issue'];
        let fearScore = 0;
        
        fearTerms.forEach(term => {
            if (lowerMessage.includes(term)) {
                fearScore += 9;
                // Highlight the term in the message
                const regex = new RegExp(term, 'gi');
                highlightedMessage = highlightedMessage.replace(regex, match => 
                    `<span class="highlight-fear">${match}</span>`
                );
            }
        });
        
        if (fearScore > 0) {
            const confidence = Math.min(Math.round(fearScore / 2), 100);
            tactics.push({
                name: 'Fear',
                description: 'Using threats or warnings',
                confidence: confidence,
                type: 'fear'
            });
            riskScore += fearScore;
        }
        
        // Greed/Reward indicators
        const greedTerms = ['free', 'bonus', 'prize', 'winner', 'reward', 'gift', 'discount', 'offer', 'congratulations', 'won', 'claim'];
        let greedScore = 0;
        
        greedTerms.forEach(term => {
            if (lowerMessage.includes(term)) {
                greedScore += 8;
                // Highlight the term in the message
                const regex = new RegExp(term, 'gi');
                highlightedMessage = highlightedMessage.replace(regex, match => 
                    `<span class="highlight-greed">${match}</span>`
                );
            }
        });
        
        if (greedScore > 0) {
            const confidence = Math.min(Math.round(greedScore / 2), 100);
            tactics.push({
                name: 'Greed',
                description: 'Offering rewards or opportunities',
                confidence: confidence,
                type: 'greed'
            });
            riskScore += greedScore;
        }
        
        // Check for URLs and suspicious links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.match(urlRegex) || [];
        
        if (urls.length > 0) {
            riskScore += 15;
            
            // Highlight URLs in the message
            highlightedMessage = highlightedMessage.replace(urlRegex, match => 
                `<span class="highlight-fear">${match}</span>`
            );
            
            tactics.push({
                name: 'Suspicious Links',
                description: 'Contains URLs that may lead to malicious websites',
                confidence: 85,
                type: 'fear'
            });
        }
        
        // Check for requests for personal information
        const infoRequestTerms = ['password', 'credit card', 'account number', 'social security', 'ssn', 'login', 'verify', 'confirm your', 'provide your'];
        let infoRequestScore = 0;
        
        infoRequestTerms.forEach(term => {
            if (lowerMessage.includes(term)) {
                infoRequestScore += 12;
                // Highlight the term in the message
                const regex = new RegExp(term, 'gi');
                highlightedMessage = highlightedMessage.replace(regex, match => 
                    `<span class="highlight-fear">${match}</span>`
                );
            }
        });
        
        if (infoRequestScore > 0) {
            const confidence = Math.min(Math.round(infoRequestScore / 2), 100);
            tactics.push({
                name: 'Information Request',
                description: 'Asking for sensitive personal information',
                confidence: confidence,
                type: 'fear'
            });
            riskScore += infoRequestScore;
        }
        
        // Calculate final risk percentage (cap at 100%)
        const riskPercentage = Math.min(Math.round(riskScore), 100);
        
        // Generate recommendations based on detected tactics
        const recommendations = generateRecommendations(tactics);
        
        // Generate summary based on risk level
        let summary = '';
        if (riskPercentage < 30) {
            summary = 'This message shows few signs of social engineering tactics. However, always remain cautious with any unexpected communications.';
        } else if (riskPercentage < 60) {
            summary = 'This message contains some concerning elements that may indicate social engineering. Proceed with caution and verify the sender through official channels.';
        } else {
            summary = 'This message displays multiple high-risk characteristics of social engineering. It is likely an attempt to manipulate you into taking actions that could compromise your security.';
        }
        
        return {
            riskPercentage,
            summary,
            tactics,
            highlightedMessage,
            recommendations,
            originalMessage: message,
            analysisDate: new Date().toISOString()
        };
    }

    // Function to generate recommendations
    function generateRecommendations(tactics) {
        const recommendations = [
            'Never provide sensitive information in response to unsolicited messages',
            'Verify the sender\'s identity through official channels before taking any action'
        ];
        
        // Add specific recommendations based on detected tactics
        if (tactics.some(t => t.type === 'urgency')) {
            recommendations.push('Be suspicious of messages creating a false sense of urgency');
        }
        
        if (tactics.some(t => t.type === 'authority')) {
            recommendations.push('Contact the supposed authority figure directly using official contact information');
        }
        
        if (tactics.some(t => t.type === 'fear')) {
            recommendations.push('Don\'t let fear drive your actions - take time to verify threats');
        }
        
        if (tactics.some(t => t.name === 'Suspicious Links')) {
            recommendations.push('Never click on suspicious links - hover over links to see the actual URL');
            recommendations.push('Type website addresses directly into your browser instead of clicking links');
        }
        
        if (tactics.some(t => t.name === 'Information Request')) {
            recommendations.push('Legitimate organizations will never ask for passwords or sensitive information via email or message');
        }
        
        if (tactics.some(t => t.type === 'greed')) {
            recommendations.push('Be skeptical of offers that seem too good to be true - they usually are');
        }
        
        return recommendations;
    }

    // Function to display the analysis results
    function displayResults(analysis) {
        // Set risk level
        riskLevel.style.width = '0%';
        setTimeout(() => {
            riskLevel.style.width = `${analysis.riskPercentage}%`;
            
            if (analysis.riskPercentage < 30) {
                riskLevel.className = 'risk-level risk-low';
            } else if (analysis.riskPercentage < 60) {
                riskLevel.className = 'risk-level risk-medium';
            } else {
                riskLevel.className = 'risk-level risk-high';
            }
        }, 100);
        
        // Set risk percentage text with animation
        let currentPercentage = 0;
        const interval = setInterval(() => {
            currentPercentage += 2;
            if (currentPercentage > analysis.riskPercentage) {
                currentPercentage = analysis.riskPercentage;
                clearInterval(interval);
            }
            riskPercentage.textContent = `${currentPercentage}%`;
        }, 20);
        
        // Set summary
        analysisSummary.textContent = analysis.summary;
        
        // Clear and populate tactics list
        tacticsList.innerHTML = '';
        
        if (analysis.tactics.length === 0) {
            tacticsList.innerHTML = '<p>No specific social engineering tactics detected.</p>';
        } else {
            analysis.tactics.forEach((tactic, index) => {
                const tacticItem = document.createElement('div');
                tacticItem.className = 'tactic-item';
                tacticItem.style.opacity = '0';
                tacticItem.style.transform = 'translateX(-20px)';
                
                tacticItem.innerHTML = `
                    <div class="tactic-icon ${tactic.type}">
                        <i class="ph ph-${getTacticIcon(tactic.type)}"></i>
                    </div>
                    <div class="tactic-content">
                        <h4>${tactic.name}</h4>
                        <p>${tactic.description}</p>
                    </div>
                    <span class="tactic-confidence">${tactic.confidence}%</span>
                `;
                
                tacticsList.appendChild(tacticItem);
                
                // Animate in with delay
                setTimeout(() => {
                    tacticItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    tacticItem.style.opacity = '1';
                    tacticItem.style.transform = 'translateX(0)';
                }, 100 + (index * 100));
            });
        }
        
        // Set highlighted content
        highlightedContent.innerHTML = analysis.highlightedMessage;
        
        // Clear and populate recommendations
        recommendationsList.innerHTML = '';
        
        analysis.recommendations.forEach((recommendation, index) => {
            const li = document.createElement('li');
            li.style.opacity = '0';
            li.style.transform = 'translateY(10px)';
            
            li.innerHTML = `
                <i class="ph ph-check-circle"></i>
                <span>${recommendation}</span>
            `;
            
            recommendationsList.appendChild(li);
            
            // Animate in with delay
            setTimeout(() => {
                li.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                li.style.opacity = '1';
                li.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    }

    // Helper function to get icon for tactic type
    function getTacticIcon(type) {
        switch (type) {
            case 'urgency':
                return 'timer';
            case 'authority':
                return 'user-focus';
            case 'scarcity':
                return 'hourglass';
            case 'social-proof':
                return 'users';
            case 'familiarity':
                return 'handshake';
            case 'fear':
                return 'warning-circle';
            case 'greed':
                return 'currency-circle-dollar';
            default:
                return 'info';
        }
    }

    // Function to clear the message input
    function clearMessage() {
        messageInput.value = '';
        messageInput.focus();
    }

    // Function to reset the analysis
    function resetAnalysis() {
        // Hide results section with animation
        resultsSection.style.opacity = '0';
        resultsSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            resultsSection.classList.add('hidden');
            clearMessage();
        }, 300);
    }

    // Function to open the save modal
    function openSaveModal() {
        saveModal.classList.add('active');
        reportName.focus();
        
        // Set default report name
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        reportName.value = `Social Engineering Analysis - ${formattedDate}`;
    }

    // Function to close the save modal
    function closeSaveModal() {
        saveModal.classList.remove('active');
    }

    // Function to save the report
    function saveReport() {
        const name = reportName.value.trim();
        const notes = reportNotes.value.trim();
        
        if (!name) {
            // Shake the input to indicate error
            reportName.style.transition = 'transform 0.1s ease';
            reportName.style.transform = 'translateX(10px)';
            setTimeout(() => {
                reportName.style.transform = 'translateX(-10px)';
                setTimeout(() => {
                    reportName.style.transform = 'translateX(5px)';
                    setTimeout(() => {
                        reportName.style.transform = 'translateX(-5px)';
                        setTimeout(() => {
                            reportName.style.transform = 'translateX(0)';
                        }, 50);
                    }, 50);
                }, 50);
            }, 50);
            return;
        }
        
        // In a real application, this would save the report to a database or file
        // For this demo, we'll just show a success message
        
        // Close the modal
        closeSaveModal();
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.position = 'fixed';
        successMessage.style.bottom = '2rem';
        successMessage.style.right = '2rem';
        successMessage.style.backgroundColor = 'var(--success-color)';
        successMessage.style.color = 'white';
        successMessage.style.padding = '1rem 1.5rem';
        successMessage.style.borderRadius = '0.5rem';
        successMessage.style.boxShadow = 'var(--shadow-md)';
        successMessage.style.zIndex = '100';
        successMessage.style.transform = 'translateY(100px)';
        successMessage.style.opacity = '0';
        successMessage.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        
        successMessage.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="ph ph-check-circle" style="font-size: 1.5rem;"></i>
                <div>
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">Report Saved Successfully</div>
                    <div style="font-size: 0.875rem;">${name}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.style.transform = 'translateY(0)';
            successMessage.style.opacity = '1';
            
            setTimeout(() => {
                successMessage.style.transform = 'translateY(100px)';
                successMessage.style.opacity = '0';
                
                setTimeout(() => {
                    document.body.removeChild(successMessage);
                }, 300);
            }, 3000);
        }, 100);
    }

    // Function to generate and download PDF report
    function generatePdfReport() {
        if (!currentAnalysis) {
            console.error('No analysis results available');
            return;
        }

        // Show loading indicator
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.style.position = 'fixed';
        loadingOverlay.style.top = '0';
        loadingOverlay.style.left = '0';
        loadingOverlay.style.width = '100%';
        loadingOverlay.style.height = '100%';
        loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.alignItems = 'center';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.zIndex = '1000';
        
        loadingOverlay.innerHTML = `
            <div style="background-color: white; padding: 2rem; border-radius: 0.5rem; text-align: center;">
                <i class="ph ph-spinner ph-spin" style="font-size: 2rem; color: var(--primary-color);"></i>
                <p style="margin-top: 1rem; font-weight: 600;">Generating PDF Report...</p>
            </div>
        `;
        
        document.body.appendChild(loadingOverlay);

        try {
            // Create a temporary container for the report
            const reportContainer = document.createElement('div');
            reportContainer.id = 'pdf-report-container';
            reportContainer.style.width = '210mm';
            reportContainer.style.padding = '20mm';
            reportContainer.style.backgroundColor = 'white';
            reportContainer.style.position = 'absolute';
            reportContainer.style.left = '-9999px';
            reportContainer.style.top = '0';
            reportContainer.style.fontFamily = 'Arial, sans-serif';
            
            // Format date
            const analysisDate = new Date(currentAnalysis.analysisDate);
            const formattedDate = analysisDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Get risk level text
            let riskLevelText = 'Low';
            let riskLevelColor = '#10b981';
            if (currentAnalysis.riskPercentage >= 60) {
                riskLevelText = 'High';
                riskLevelColor = '#ef4444';
            } else if (currentAnalysis.riskPercentage >= 30) {
                riskLevelText = 'Medium';
                riskLevelColor = '#f59e0b';
            }

            // Build the report HTML
            reportContainer.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #3b82f6; font-size: 24px; margin-bottom: 5px;">Social Engineering Analysis Report</h1>
                    <p style="color: #64748b; font-size: 14px;">Generated on ${formattedDate}</p>
                </div>

                <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px;">
                    <h2 style="color: #1e293b; font-size: 18px; margin-bottom: 10px;">Risk Assessment</h2>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <div style="font-weight: bold; margin-right: 10px;">Risk Level:</div>
                        <div style="width: 100px; height: 10px; background-color: #e2e8f0; border-radius: 5px; margin-right: 10px; overflow: hidden;">
                            <div style="width: ${currentAnalysis.riskPercentage}%; height: 100%; background-color: ${riskLevelColor};"></div>
                        </div>
                        <div style="font-weight: bold; color: ${riskLevelColor};">${currentAnalysis.riskPercentage}% (${riskLevelText})</div>
                    </div>
                    <div style="font-weight: bold; margin-bottom: 5px;">Summary:</div>
                    <p style="margin: 0; color: #1e293b;">${currentAnalysis.summary}</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h2 style="color: #1e293b; font-size: 18px; margin-bottom: 10px;">Original Message</h2>
                    <div style="padding: 15px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6; font-family: monospace; white-space: pre-wrap; color: #1e293b; font-size: 12px;">
                        ${currentAnalysis.originalMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h2 style="color: #1e293b; font-size: 18px; margin-bottom: 10px;">Detected Tactics</h2>
                    ${currentAnalysis.tactics.length === 0 ? 
                        '<p style="color: #64748b;">No specific social engineering tactics detected.</p>' : 
                        currentAnalysis.tactics.map(tactic => `
                            <div style="margin-bottom: 10px; padding: 10px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid ${getTacticColor(tactic.type)};">
                                <div style="font-weight: bold; color: #1e293b; margin-bottom: 5px;">${tactic.name} (${tactic.confidence}% confidence)</div>
                                <p style="margin: 0; color: #64748b; font-size: 14px;">${tactic.description}</p>
                            </div>
                        `).join('')
                    }
                </div>

                <div style="margin-bottom: 20px;">
                    <h2 style="color: #1e293b; font-size: 18px; margin-bottom: 10px;">Recommendations</h2>
                    <ul style="padding-left: 20px; margin: 0;">
                        ${currentAnalysis.recommendations.map(rec => `
                            <li style="margin-bottom: 8px; color: #1e293b;">${rec}</li>
                        `).join('')}
                    </ul>
                </div>

                <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #64748b; text-align: center;">
                    <p>This report was generated by the Cyber Council Social Engineering Detection Tool.</p>
                    <p>For educational purposes only. Always verify results with security professionals.</p>
                </div>
            `;

            document.body.appendChild(reportContainer);

            // Use html2canvas and jsPDF
            html2canvas(reportContainer, {
                scale: 2,
                logging: false,
                useCORS: true
            }).then(canvas => {
                // Create PDF using jsPDF
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                // Add the canvas as an image to the PDF
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 297; // A4 height in mm
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                // Add new pages if the content is longer than one page
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                // Save the PDF
                const fileName = `Social_Engineering_Analysis_${new Date().toISOString().slice(0, 10)}.pdf`;
                doc.save(fileName);

                // Clean up
                document.body.removeChild(reportContainer);
                document.body.removeChild(loadingOverlay);

                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.style.position = 'fixed';
                successMessage.style.bottom = '2rem';
                successMessage.style.right = '2rem';
                successMessage.style.backgroundColor = 'var(--success-color)';
                successMessage.style.color = 'white';
                successMessage.style.padding = '1rem 1.5rem';
                successMessage.style.borderRadius = '0.5rem';
                successMessage.style.boxShadow = 'var(--shadow-md)';
                successMessage.style.zIndex = '100';
                successMessage.style.transform = 'translateY(100px)';
                successMessage.style.opacity = '0';
                successMessage.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                
                successMessage.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <i class="ph ph-file-pdf" style="font-size: 1.5rem;"></i>
                        <div>
                            <div style="font-weight: 600; margin-bottom: 0.25rem;">PDF Report Downloaded</div>
                            <div style="font-size: 0.875rem;">${fileName}</div>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(successMessage);
                
                setTimeout(() => {
                    successMessage. setTimeout(() => {
                    }
                    )
                    successMessage.style.transform = 'translateY(0)';
                    successMessage.style.opacity = '1';
                    
                    setTimeout(() => {
                        successMessage.style.transform = 'translateY(100px)';
                        successMessage.style.opacity = '0';
                        
                        setTimeout(() => {
                            document.body.removeChild(successMessage);
                        }, 300);
                    }, 3000);
                }, 100);
            }).catch(error => {
                console.error('Error generating PDF:', error);
                document.body.removeChild(reportContainer);
                document.body.removeChild(loadingOverlay);
                
                // Show error message
                alert('Error generating PDF report. Please try again.');
            });
        } catch (error) {
            console.error('Error generating PDF:', error);
            document.body.removeChild(loadingOverlay);
            alert('Error generating PDF report. Please try again.');
        }
    }

    // Helper function to get color for tactic type
    function getTacticColor(type) {
        switch (type) {
            case 'urgency':
                return '#ef4444';
            case 'authority':
                return '#8b5cf6';
            case 'scarcity':
                return '#f59e0b';
            case 'social-proof':
                return '#10b981';
            case 'familiarity':
                return '#3b82f6';
            case 'fear':
                return '#6b7280';
            case 'greed':
                return '#ec4899';
            default:
                return '#3b82f6';
        }
    }

    // Add event listener for clicking outside the modal to close it
    window.addEventListener('click', (e) => {
        if (e.target === saveModal) {
            closeSaveModal();
        }
    });

    // Prevent form submission
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    });
});