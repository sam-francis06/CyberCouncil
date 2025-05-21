document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const startScanButton = document.getElementById('startScanButton');
    const scanningAnimation = document.getElementById('scanningAnimation');
    const scanResults = document.getElementById('scanResults');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const securityScore = document.getElementById('securityScore');
    const scoreCircle = document.querySelector('.score-circle');
    const downloadReportButton = document.getElementById('downloadReportButton');
    const rescanButton = document.getElementById('rescanButton');
    
    // Result elements
    const publicIpCard = document.getElementById('publicIpCard');
    const encryptionCard = document.getElementById('encryptionCard');
    const devicesCard = document.getElementById('devicesCard');
    const portsCard = document.getElementById('portsCard');
    const routerCard = document.getElementById('routerCard');
    const ssidCard = document.getElementById('ssidCard');
    
    // Result data elements
    const publicIp = document.getElementById('publicIp');
    const encryptionType = document.getElementById('encryptionType');
    const deviceCount = document.getElementById('deviceCount');
    const portStatus = document.getElementById('portStatus');
    const routerStatus = document.getElementById('routerStatus');
    const ssidName = document.getElementById('ssidName');
    
    // Start scan button click handler
    startScanButton.addEventListener('click', startScan);
    rescanButton.addEventListener('click', startScan);
    
    // Download report button click handler
    downloadReportButton.addEventListener('click', downloadPDFReport);
    
    // Function to start the scan
    function startScan() {
        // Hide results and show scanning animation
        scanResults.classList.add('hidden');
        scanningAnimation.classList.remove('hidden');
        
        // Reset progress
        let progress = 0;
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
        
        // Reset all cards
        resetCards();
        
        // Start real scans
        performRealScans();
        
        // Simulate progress for visual feedback
        const progressInterval = setInterval(() => {
            progress += 1;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    // Hide scanning animation and show results
                    scanningAnimation.classList.add('hidden');
                    scanResults.classList.remove('hidden');
                    setTimeout(() => {
                        scanResults.classList.add('visible');
                        animateSecurityScore();
                    }, 100);
                }, 500);
            }
        }, 100); // Update every 100ms for a total of ~10 seconds
    }
    
    // Function to reset all result cards
    function resetCards() {
        const cards = [publicIpCard, encryptionCard, devicesCard, portsCard, routerCard, ssidCard];
        cards.forEach(card => {
            card.classList.remove('success', 'warning', 'danger', 'info');
            const status = card.querySelector('.result-status');
            status.textContent = 'Checking...';
            const recommendation = card.querySelector('.result-recommendation');
            recommendation.classList.add('hidden');
            recommendation.classList.remove('visible');
        });
        
        // Reset data fields
        publicIp.textContent = '-';
        encryptionType.textContent = '-';
        deviceCount.textContent = '-';
        portStatus.textContent = '-';
        routerStatus.textContent = '-';
        ssidName.textContent = '-';
    }
    
    // Function to perform real network scans
    async function performRealScans() {
        // Run all scans in parallel
        await Promise.all([
            checkPublicIP(),
            checkNetworkConnection(),
            checkWebRTC(),
            checkHTTPS(),
            checkDNS(),
            checkConnectionSpeed()
        ]);
    }
    
    // Check public IP using a real API
    async function checkPublicIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            
            publicIp.textContent = data.ip;
            
            // Check if IP is in a known range for VPNs or Tor
            const isVPN = await checkIfVPN(data.ip);
            
            if (isVPN) {
                publicIpCard.classList.add('success');
                publicIpCard.querySelector('.result-status').textContent = 'Protected';
                publicIpCard.querySelector('.result-recommendation p').textContent = 
                    'Your connection appears to be using a VPN or proxy, which adds a layer of privacy.';
            } else {
                publicIpCard.classList.add('info');
                publicIpCard.querySelector('.result-status').textContent = 'Exposed';
                publicIpCard.querySelector('.result-recommendation p').textContent = 
                    'Your real IP address is visible. Consider using a VPN for additional privacy.';
            }
        } catch (error) {
            console.error('Error checking public IP:', error);
            publicIp.textContent = 'Unable to detect';
            publicIpCard.classList.add('warning');
            publicIpCard.querySelector('.result-status').textContent = 'Check Failed';
            publicIpCard.querySelector('.result-recommendation p').textContent = 
                'Could not check your public IP. This might be due to network restrictions or privacy tools.';
        }
        
        // Show recommendation
        setTimeout(() => {
            publicIpCard.querySelector('.result-recommendation').classList.remove('hidden');
            publicIpCard.querySelector('.result-recommendation').classList.add('visible');
        }, 500);
    }
    
    // Check if an IP is likely a VPN/proxy
    async function checkIfVPN(ip) {
        // This is a simplified check - in a real app you'd use a VPN detection API
        // For demo purposes, we'll do a basic check for common VPN/proxy patterns
        
        try {
            // Check if IP belongs to known VPN providers (simplified)
            const response = await fetch(`https://ipinfo.io/${ip}/json`);
            const data = await response.json();
            
            // Check organization or ASN for common VPN providers
            const org = (data.org || '').toLowerCase();
            const vpnKeywords = ['vpn', 'proxy', 'hosting', 'cloud', 'anonymous', 'tor', 'exit'];
            
            return vpnKeywords.some(keyword => org.includes(keyword));
        } catch (error) {
            console.error('Error checking VPN status:', error);
            return false;
        }
    }
    
    // Check network connection type and security
    async function checkNetworkConnection() {
        // Get connection information if available
        if ('connection' in navigator) {
            const connection = navigator.connection || 
                               navigator.mozConnection || 
                               navigator.webkitConnection;
            
            if (connection) {
                // Check connection type
                const type = connection.type || 'unknown';
                const effectiveType = connection.effectiveType || 'unknown';
                
                // Determine if WiFi or cellular
                let connectionType = 'Unknown';
                if (type === 'wifi') {
                    connectionType = 'WiFi';
                    encryptionType.textContent = 'WPA/WPA2 (likely)';
                } else if (type === 'cellular') {
                    connectionType = `Cellular (${effectiveType})`;
                    encryptionType.textContent = 'Cellular Encryption';
                } else if (type === 'ethernet') {
                    connectionType = 'Wired Ethernet';
                    encryptionType.textContent = 'Wired Connection';
                } else {
                    encryptionType.textContent = 'Unknown';
                }
                
                // Set security status based on connection type
                if (connectionType === 'WiFi') {
                    // For WiFi, we can't directly check encryption, so we assume WPA2
                    encryptionCard.classList.add('info');
                    encryptionCard.querySelector('.result-status').textContent = 'Likely Secure';
                    encryptionCard.querySelector('.result-recommendation p').textContent = 
                        'You\'re on WiFi. Most modern networks use WPA2 or WPA3, but we can\'t detect the exact encryption. Ensure your network uses at least WPA2.';
                } else if (connectionType === 'Wired Ethernet') {
                    encryptionCard.classList.add('success');
                    encryptionCard.querySelector('.result-status').textContent = 'Secure';
                    encryptionCard.querySelector('.result-recommendation p').textContent = 
                        'Wired connections are generally more secure than wireless. Your connection is likely well-protected.';
                } else if (connectionType.includes('Cellular')) {
                    encryptionCard.classList.add('success');
                    encryptionCard.querySelector('.result-status').textContent = 'Secure';
                    encryptionCard.querySelector('.result-recommendation p').textContent = 
                        'Cellular connections use strong encryption. Your mobile data is well-protected.';
                } else {
                    encryptionCard.classList.add('warning');
                    encryptionCard.querySelector('.result-status').textContent = 'Unknown';
                    encryptionCard.querySelector('.result-recommendation p').textContent = 
                        'Could not determine your connection type. Be cautious when transmitting sensitive information.';
                }
            } else {
                setDefaultEncryptionStatus();
            }
        } else {
            setDefaultEncryptionStatus();
        }
        
        // Show recommendation
        setTimeout(() => {
            encryptionCard.querySelector('.result-recommendation').classList.remove('hidden');
            encryptionCard.querySelector('.result-recommendation').classList.add('visible');
        }, 500);
    }
    
    function setDefaultEncryptionStatus() {
        encryptionType.textContent = 'Cannot detect';
        encryptionCard.classList.add('warning');
        encryptionCard.querySelector('.result-status').textContent = 'Unknown';
        encryptionCard.querySelector('.result-recommendation p').textContent = 
            'Could not detect your network encryption. Ensure you\'re using WPA2 or WPA3 for WiFi networks.';
    }
    
    // Check WebRTC for potential IP leaks
    async function checkWebRTC() {
        try {
            // Create a simple peer connection to check WebRTC
            const pc = new RTCPeerConnection({
                iceServers: []
            });
            
            // Count local IP addresses found
            let localIPs = new Set();
            
            // Listen for candidate events
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    // Extract IP from candidate string
                    const match = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(event.candidate.candidate);
                    if (match) {
                        const ip = match[1];
                        if (!ip.startsWith('0.0.0.0') && !localIPs.has(ip)) {
                            localIPs.add(ip);
                        }
                    }
                }
            };
            
            // Create a data channel and offer to trigger candidates
            pc.createDataChannel('');
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            // Wait a bit for candidates to be gathered
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Close the connection
            pc.close();
            
            // Update device count with the number of local IPs found
            const count = localIPs.size || 'Unknown';
            deviceCount.textContent = count;
            
            if (count === 'Unknown') {
                devicesCard.classList.add('warning');
                devicesCard.querySelector('.result-status').textContent = 'Cannot Detect';
                devicesCard.querySelector('.result-recommendation p').textContent = 
                    'Could not detect devices on your network. This might be due to browser privacy settings.';
            } else if (count > 5) {
                devicesCard.classList.add('warning');
                devicesCard.querySelector('.result-status').textContent = 'Many Devices';
                devicesCard.querySelector('.result-recommendation p').textContent = 
                    `Detected ${count} IP addresses on your network. Verify all devices are authorized.`;
            } else {
                devicesCard.classList.add('success');
                devicesCard.querySelector('.result-status').textContent = 'Normal';
                devicesCard.querySelector('.result-recommendation p').textContent = 
                    `Detected ${count} IP addresses on your network, which is a normal amount.`;
            }
        } catch (error) {
            console.error('Error checking WebRTC:', error);
            deviceCount.textContent = 'Cannot detect';
            devicesCard.classList.add('info');
            devicesCard.querySelector('.result-status').textContent = 'Protected';
            devicesCard.querySelector('.result-recommendation p').textContent = 
                'WebRTC detection blocked. Your browser may have privacy protections enabled.';
        }
        
        // Show recommendation
        setTimeout(() => {
            devicesCard.querySelector('.result-recommendation').classList.remove('hidden');
            devicesCard.querySelector('.result-recommendation').classList.add('visible');
        }, 500);
    }
    
    // Check if connection is using HTTPS
    async function checkHTTPS() {
        const isSecure = window.location.protocol === 'https:';
        
        if (isSecure) {
            portsCard.classList.add('success');
            portsCard.querySelector('.result-status').textContent = 'Secure';
            portStatus.textContent = 'HTTPS Enabled';
            portsCard.querySelector('.result-recommendation p').textContent = 
                'Your connection to this website is encrypted with HTTPS, which helps protect against eavesdropping.';
        } else {
            portsCard.classList.add('danger');
            portsCard.querySelector('.result-status').textContent = 'Insecure';
            portStatus.textContent = 'HTTP (Unencrypted)';
            portsCard.querySelector('.result-recommendation p').textContent = 
                'Your connection to this website is not encrypted. Always use HTTPS for sensitive information.';
        }
        
        // Show recommendation
        setTimeout(() => {
            portsCard.querySelector('.result-recommendation').classList.remove('hidden');
            portsCard.querySelector('.result-recommendation').classList.add('visible');
        }, 500);
    }
    
    // Check DNS security
    async function checkDNS() {
        try {
            // Try to detect DNS over HTTPS (DoH) or DNS over TLS (DoT)
            // This is a simplified check - we can't directly detect DNS settings from the browser
            
            // Check if we can resolve a DoH test domain
            const dohTestStart = performance.now();
            await fetch('https://1.1.1.1/dns-query?name=example.com', {
                headers: {
                    'Accept': 'application/dns-json'
                }
            });
            const dohTestTime = performance.now() - dohTestStart;
            
            // If the DoH request was fast, it might be enabled
            const isDohLikely = dohTestTime < 300; // Less than 300ms suggests DoH might be configured
            
            if (isDohLikely) {
                routerCard.classList.add('success');
                routerCard.querySelector('.result-status').textContent = 'Enhanced Security';
                routerStatus.textContent = 'DNS Security Detected';
                routerCard.querySelector('.result-recommendation p').textContent = 
                    'Your connection appears to use secure DNS (DoH or DoT), which protects against DNS spoofing attacks.';
            } else {
                routerCard.classList.add('info');
                routerCard.querySelector('.result-status').textContent = 'Standard Security';
                routerStatus.textContent = 'Standard DNS';
                routerCard.querySelector('.result-recommendation p').textContent = 
                    'Consider enabling DNS over HTTPS (DoH) or DNS over TLS (DoT) for enhanced privacy and security.';
            }
        } catch (error) {
            console.error('Error checking DNS:', error);
            routerCard.classList.add('warning');
            routerCard.querySelector('.result-status').textContent = 'Check Failed';
            routerStatus.textContent = 'Unable to Verify';
            routerCard.querySelector('.result-recommendation p').textContent = 
                'Could not check DNS security. Ensure your router firmware is updated and consider using secure DNS.';
        }
        
        // Show recommendation
        setTimeout(() => {
            routerCard.querySelector('.result-recommendation').classList.remove('hidden');
            routerCard.querySelector('.result-recommendation').classList.add('visible');
        }, 500);
    }
    
    // Check connection speed and quality
    async function checkConnectionSpeed() {
        try {
            // Get connection information if available
            let connectionQuality = 'Unknown';
            let networkName = 'Unknown Network';
            
            if ('connection' in navigator) {
                const connection = navigator.connection || 
                                   navigator.mozConnection || 
                                   navigator.webkitConnection;
                
                if (connection) {
                    // Check connection type and quality
                    const type = connection.type || 'unknown';
                    const effectiveType = connection.effectiveType || 'unknown';
                    const downlink = connection.downlink || 0;
                    
                    if (type === 'wifi') {
                        networkName = 'WiFi Network';
                        
                        // Estimate connection quality based on downlink speed
                        if (downlink >= 10) {
                            connectionQuality = 'Excellent';
                        } else if (downlink >= 5) {
                            connectionQuality = 'Good';
                        } else if (downlink >= 2) {
                            connectionQuality = 'Fair';
                        } else {
                            connectionQuality = 'Poor';
                        }
                    } else if (type === 'cellular') {
                        networkName = `Cellular (${effectiveType})`;
                        connectionQuality = effectiveType === '4g' ? 'Good' : 'Variable';
                    } else if (type === 'ethernet') {
                        networkName = 'Wired Connection';
                        connectionQuality = 'Excellent';
                    }
                }
            }
            
            // Try to get actual network name if available
            if ('getNetworkInformation' in navigator) {
                try {
                    // This API is not widely supported, so we're using a try/catch
                    const networkInfo = await navigator.getNetworkInformation();
                    if (networkInfo && networkInfo.type === 'wifi' && networkInfo.ssid) {
                        networkName = networkInfo.ssid;
                    }
                } catch (e) {
                    // API not available, use the default value
                }
            }
            
            // Update SSID information
            ssidName.textContent = networkName;
            
            // Set status based on connection quality
            if (connectionQuality === 'Excellent' || connectionQuality === 'Good') {
                ssidCard.classList.add('success');
                ssidCard.querySelector('.result-status').textContent = connectionQuality;
                ssidCard.querySelector('.result-recommendation p').textContent = 
                    'Your network connection quality is good. This suggests a stable and well-configured network.';
            } else if (connectionQuality === 'Fair') {
                ssidCard.classList.add('info');
                ssidCard.querySelector('.result-status').textContent = connectionQuality;
                ssidCard.querySelector('.result-recommendation p').textContent = 
                    'Your connection quality is fair. Consider positioning closer to your WiFi router or checking for interference.';
            } else if (connectionQuality === 'Poor') {
                ssidCard.classList.add('warning');
                ssidCard.querySelector('.result-status').textContent = connectionQuality;
                ssidCard.querySelector('.result-recommendation p').textContent = 
                    'Your connection quality is poor. This could affect security features that require stable connectivity.';
            } else {
                ssidCard.classList.add('info');
                ssidCard.querySelector('.result-status').textContent = 'Unknown';
                ssidCard.querySelector('.result-recommendation p').textContent = 
                    'Could not determine your network quality. Ensure your connection is stable for security features to work properly.';
            }
        } catch (error) {
            console.error('Error checking connection speed:', error);
            ssidCard.classList.add('info');
            ssidCard.querySelector('.result-status').textContent = 'Unknown';
            ssidName.textContent = 'Cannot detect';
            ssidCard.querySelector('.result-recommendation p').textContent = 
                'Could not detect your network name or quality. This is normal due to browser privacy restrictions.';
        }
        
        // Show recommendation
        setTimeout(() => {
            ssidCard.querySelector('.result-recommendation').classList.remove('hidden');
            ssidCard.querySelector('.result-recommendation').classList.add('visible');
        }, 500);
    }
    
    // Function to animate the security score
    function animateSecurityScore() {
        // Calculate overall score based on individual results
        let score = 0;
        let totalPoints = 0;
        
        // Add points for each secure aspect
        if (publicIpCard.classList.contains('success')) {
            score += 15;
            totalPoints += 15;
        } else if (publicIpCard.classList.contains('info')) {
            score += 10;
            totalPoints += 15;
        } else if (publicIpCard.classList.contains('warning')) {
            score += 5;
            totalPoints += 15;
        } else if (publicIpCard.classList.contains('danger')) {
            score += 0;
            totalPoints += 15;
        }
        
        if (encryptionCard.classList.contains('success')) {
            score += 25;
            totalPoints += 25;
        } else if (encryptionCard.classList.contains('info')) {
            score += 20;
            totalPoints += 25;
        } else if (encryptionCard.classList.contains('warning')) {
            score += 15;
            totalPoints += 25;
        } else if (encryptionCard.classList.contains('danger')) {
            score += 5;
            totalPoints += 25;
        }
        
        if (devicesCard.classList.contains('success')) {
            score += 10;
            totalPoints += 10;
        } else if (devicesCard.classList.contains('info')) {
            score += 8;
            totalPoints += 10;
        } else if (devicesCard.classList.contains('warning')) {
            score += 5;
            totalPoints += 10;
        } else if (devicesCard.classList.contains('danger')) {
            score += 0;
            totalPoints += 10;
        }
        
        if (portsCard.classList.contains('success')) {
            score += 20;
            totalPoints += 20;
        } else if (portsCard.classList.contains('info')) {
            score += 15;
            totalPoints += 20;
        } else if (portsCard.classList.contains('warning')) {
            score += 10;
            totalPoints += 20;
        } else if (portsCard.classList.contains('danger')) {
            score += 5;
            totalPoints += 20;
        }
        
        if (routerCard.classList.contains('success')) {
            score += 20;
            totalPoints += 20;
        } else if (routerCard.classList.contains('info')) {
            score += 15;
            totalPoints += 20;
        } else if (routerCard.classList.contains('warning')) {
            score += 10;
            totalPoints += 20;
        } else if (routerCard.classList.contains('danger')) {
            score += 5;
            totalPoints += 20;
        }
        
        if (ssidCard.classList.contains('success')) {
            score += 10;
            totalPoints += 10;
        } else if (ssidCard.classList.contains('info')) {
            score += 8;
            totalPoints += 10;
        } else if (ssidCard.classList.contains('warning')) {
            score += 5;
            totalPoints += 10;
        } else if (ssidCard.classList.contains('danger')) {
            score += 0;
            totalPoints += 10;
        }
        
        // Calculate percentage
        const finalScore = Math.round((score / totalPoints) * 100);
        
        // Animate the score counting up
        let currentScore = 0;
        const scoreInterval = setInterval(() => {
            if (currentScore >= finalScore) {
                clearInterval(scoreInterval);
                scoreCircle.classList.add('filled');
            } else {
                currentScore += 1;
                securityScore.textContent = currentScore;
            }
        }, 30);
    }
    
    // Function to download a PDF report
    function downloadPDFReport() {
        // Load jsPDF libraries
        import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
            .then(() => {
                import('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js')
                    .then(() => {
                        generatePDFReport();
                    })
                    .catch(error => {
                        console.error('Error loading jspdf-autotable:', error);
                        alert('Could not load PDF generation library. Please try again later.');
                    });
            })
            .catch(error => {
                console.error('Error loading jsPDF:', error);
                alert('Could not load PDF generation library. Please try again later.');
            });
    }
    
    function generatePDFReport() {
        const { jsPDF } = window.jspdf;
        
        // Create a new PDF document
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Get current date and time
        const reportDate = new Date().toLocaleString();
        const score = securityScore.textContent;
        
        // Add logo and header
        addReportHeader(doc, reportDate, score);
        
        // Add summary section
        addSummarySection(doc, score);
        
        // Add detailed results
        addDetailedResults(doc);
        
        // Add security recommendations
        addSecurityRecommendations(doc);
        
        // Add footer
        addReportFooter(doc);
        
        // Save the PDF
        doc.save(`WiFi-Security-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    }
    
    function addReportHeader(doc, reportDate, score) {
        // Set blue color for header
        doc.setFillColor(59, 130, 246); // Primary blue color
        doc.rect(0, 0, 210, 40, 'F');
        
        // Add white text for header
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text('WiFi Security Report', 105, 20, { align: 'center' });
        
        // Add date and score
        doc.setFontSize(12);
        doc.text(`Generated: ${reportDate}`, 105, 30, { align: 'center' });
        
        // Add score circle
        doc.setFillColor(255, 255, 255);
        doc.circle(180, 20, 12, 'F');
        
        // Add score text
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(14);
        doc.text(score, 180, 20, { align: 'center' });
        doc.setFontSize(8);
        doc.text('SCORE', 180, 25, { align: 'center' });
        
        // Reset text color for rest of document
        doc.setTextColor(0, 0, 0);
    }
    
    function addSummarySection(doc, score) {
        // Add summary title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Security Summary', 14, 50);
        
        // Add horizontal line
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.5);
        doc.line(14, 53, 196, 53);
        
        // Add summary text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        
        let summaryText = '';
        if (score >= 80) {
            summaryText = 'Your network security is strong. Continue maintaining good security practices to keep your network protected.';
        } else if (score >= 60) {
            summaryText = 'Your network has adequate security, but there are areas that need improvement to enhance protection.';
        } else {
            summaryText = 'Your network has significant security vulnerabilities that need immediate attention.';
        }
        
        const splitSummary = doc.splitTextToSize(summaryText, 180);
        doc.text(splitSummary, 14, 60);
        
        // Add score gauge
        addScoreGauge(doc, score, 14, 75, 180, 15);
    }
    
    function addScoreGauge(doc, score, x, y, width, height) {
        // Draw gauge background
        doc.setFillColor(230, 230, 230);
        doc.roundedRect(x, y, width, height, 3, 3, 'F');
        
        // Calculate width based on score
        const scoreWidth = (score / 100) * width;
        
        // Determine color based on score
        let fillColor;
        if (score >= 80) {
            fillColor = [16, 185, 129]; // Green
        } else if (score >= 60) {
            fillColor = [245, 158, 11]; // Orange
        } else {
            fillColor = [239, 68, 68]; // Red
        }
        
        // Draw score fill
        doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
        doc.roundedRect(x, y, scoreWidth, height, 3, 3, 'F');
        
        // Add labels
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        
        if (scoreWidth > 30) {
            doc.text(`${score}%`, x + 10, y + height/2 + 1);
        }
        
        // Add scale markers
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text('0', x, y + height + 6);
        doc.text('50', x + width/2, y + height + 6);
        doc.text('100', x + width, y + height + 6);
        
        // Add scale label
        doc.setFontSize(9);
        doc.text('Poor', x + 5, y + height + 12);
        doc.text('Average', x + width/2 - 10, y + height + 12);
        doc.text('Excellent', x + width - 20, y + height + 12);
        
        // Reset text color
        doc.setTextColor(0, 0, 0);
    }
    
    function addDetailedResults(doc) {
        // Start position after summary
        let yPos = 105;
        
        // Add section title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Detailed Security Analysis', 14, yPos);
        
        // Add horizontal line
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.5);
        doc.line(14, yPos + 3, 196, yPos + 3);
        
        yPos += 10;
        
        // Create table data
        const tableData = [
            // Public IP
            [
                {
                    content: 'Public IP Security',
                    styles: { fontStyle: 'bold', fillColor: getStatusColor(publicIpCard) }
                },
                {
                    content: publicIpCard.querySelector('.result-status').textContent,
                    styles: { fontStyle: 'bold', fillColor: getStatusColor(publicIpCard) }
                }
            ],
            [
                { content: 'IP Address:', styles: { fontStyle: 'bold' } },
                { content: publicIp.textContent }
            ],
            [
                { content: 'Recommendation:', styles: { fontStyle: 'bold' } },
                { content: publicIpCard.querySelector('.result-recommendation p').textContent }
            ],
            // Empty row for spacing
            [{ content: '', colSpan: 2 }],
            
            // WiFi Encryption
            [
                {
                    content: 'Network Security',
                    styles: { fontStyle: 'bold', fillColor: getStatusColor(encryptionCard) }
                },
                {
                    content: encryptionCard.querySelector('.result-status').textContent,
                    styles: { fontStyle: 'bold', fillColor: getStatusColor(encryptionCard) }
                }
            ],
            [
                { content: 'Connection Type:', styles: { fontStyle: 'bold' } },
                { content: encryptionType.textContent }
            ],
            [
                { content: 'Recommendation:', styles: { fontStyle: 'bold' } },
                { content: encryptionCard.querySelector('.result-recommendation p').textContent }
            ],
            // Empty row for spacing
            [{ content: '', colSpan: 2 }],
            
            // Connected Devices
            [
                {
                    content: 'Network Devices',
                    styles: { fontStyle: 'bold', fillColor: getStatusColor(devicesCard) }
                },
                {
                    content: devicesCard.querySelector('.result-status').textContent,
                    styles: { fontStyle: 'bold', fillColor: getStatusColor(devicesCard) }
                }
            ],
            [
                { content: 'Detected IPs:', styles: { fontStyle: 'bold' } },
                { content: deviceCount.textContent }
            ],
            [
                { content: 'Recommendation:', styles: { fontStyle: 'bold' } },
                { content: devicesCard.querySelector('.result-recommendation p').textContent }
            ]
        ];
        
        // Add first table
        doc.autoTable({
            startY: yPos,
            body: tableData,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 5
            },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 130 }
            },
            margin: { left: 14, right: 14 },
            headStyles: {
                fillColor: [59, 130, 246]
            }
        });
        
        // Get the final Y position
        yPos = doc.lastAutoTable.finalY + 10;
        
        // Check if we need a new page
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        // Create second table data
        const tableData2 = [
            // Port Security
            [
                {
                    content: 'Connection Security',
                    styles: { fontStyle: 'bold', fillColor: getStatusColor(portsCard) }
                },
                {
                    content: portsCard.querySelector('.result-status').textContent,
                    styles: { fontStyle: 'bold', fillColor: getStatusColor(portsCard) }
                }
            ],
            [
                { content: 'Status:', styles: { fontStyle: 'bold' } },
                { content: portStatus.textContent }
            ],
            [
                { content: 'Recommendation:', styles: { fontStyle: 'bold' } },
                { content: portsCard.querySelector('.result-recommendation p').textContent }
            ],
            // Empty row for spacing
            [{ content: '', colSpan: 2 }],
            
            // Router Security
            [
                {
                    content: 'DNS Security',
                    styles: { fontStyle: 'bold', fillColor: getStatusColor(routerCard) }
                },
                {
                    content: routerCard.querySelector('.result-status').textContent,
                    styles: { fontStyle: 'bold', fillColor: getStatusColor(routerCard) }
                }
            ],
            [
                { content: 'Status:', styles: { fontStyle: 'bold' } },
                { content: routerStatus.textContent }
            ],
            [
                { content: 'Recommendation:', styles: { fontStyle: 'bold' } },
                { content: routerCard.querySelector('.result-recommendation p').textContent }
            ],
            // Empty row for spacing
            [{ content: '', colSpan: 2 }],
            
            // Network Name
            [
                {
                    content: 'Connection Quality',
                    styles: { fontStyle: 'bold', fillColor: getStatusColor(ssidCard) }
                },
                {
                    content: ssidCard.querySelector('.result-status').textContent,
                    styles: { fontStyle: 'bold', fillColor: getStatusColor(ssidCard) }
                }
            ],
            [
                { content: 'Network:', styles: { fontStyle: 'bold' } },
                { content: ssidName.textContent }
            ],
            [
                { content: 'Recommendation:', styles: { fontStyle: 'bold' } },
                { content: ssidCard.querySelector('.result-recommendation p').textContent }
            ]
        ];
        
        // Add second table
        doc.autoTable({
            startY: yPos,
            body: tableData2,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 5
            },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 130 }
            },
            margin: { left: 14, right: 14 },
            headStyles: {
                fillColor: [59, 130, 246]
            }
        });
        
        // Get the final Y position
        yPos = doc.lastAutoTable.finalY + 10;
        
        return yPos;
    }
    
    function addSecurityRecommendations(doc) {
        // Check if we need a new page
        if (doc.lastAutoTable.finalY > 220) {
            doc.addPage();
            yPos = 20;
        } else {
            yPos = doc.lastAutoTable.finalY + 15;
        }
        
        // Add section title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Security Recommendations', 14, yPos);
        
        // Add horizontal line
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.5);
        doc.line(14, yPos + 3, 196, yPos + 3);
        
        yPos += 15;
        
        // Get security tips
        const securityTips = [];
        document.querySelectorAll('.security-tips li').forEach(tip => {
            securityTips.push([tip.textContent]);
        });
        
        // Add security tips table
        doc.autoTable({
            startY: yPos,
            body: securityTips,
            theme: 'striped',
            styles: {
                fontSize: 10,
                cellPadding: 5
            },
            margin: { left: 14, right: 14 },
            headStyles: {
                fillColor: [59, 130, 246]
            },
            head: [['Recommended Security Practices']]
        });
    }
    
    function addReportFooter(doc) {
        const pageCount = doc.internal.getNumberOfPages();
        
        // Add footer to each page
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            // Add footer line
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(14, 280, 196, 280);
            
            // Add footer text
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text('Generated by Cyber Council WiFi Security Scanner', 105, 287, { align: 'center' });
            doc.text(`Page ${i} of ${pageCount}`, 196, 287, { align: 'right' });
        }
    }
    
    // Helper function to get status color for PDF
    function getStatusColor(card) {
        if (card.classList.contains('success')) {
            return [16, 185, 129, 0.2]; // Green with opacity
        } else if (card.classList.contains('warning')) {
            return [245, 158, 11, 0.2]; // Orange with opacity
        } else if (card.classList.contains('danger')) {
            return [239, 68, 68, 0.2]; // Red with opacity
        } else if (card.classList.contains('info')) {
            return [59, 130, 246, 0.2]; // Blue with opacity
        }
        return [240, 240, 240]; // Default light gray
    }
});