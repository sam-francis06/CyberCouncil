// Phishing Report Generator
// This module creates detailed, professional PDF reports for phishing detection results

class PhishingReport {
    /**
     * Generate a detailed PDF report for phishing analysis results
     * @param {Object} result - The phishing analysis result
     * @param {String} type - The type of analysis ('url' or 'email')
     * @returns {Promise<string>} - Promise resolving to the filename of the saved PDF
     */
    static async generateDetailedReport(result, type) {
        // Load required libraries dynamically
        await this.loadDependencies();
        
        // Create the PDF document
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Set document properties
        pdf.setProperties({
            title: `Phishing Analysis Report - ${new Date().toLocaleDateString()}`,
            subject: `${type === 'url' ? 'URL' : 'Email'} Phishing Analysis`,
            author: 'Cyber Council Security Suite',
            keywords: 'phishing, security, analysis, report',
            creator: 'Cyber Council Phishing Detection Tool'
        });
        
        // Generate the report content
        await this.generateReportContent(pdf, result, type);
        
        // Generate filename
        const date = new Date();
        const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const timeStr = `${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;
        const filename = `phishing-report-${type}-${dateStr}-${timeStr}.pdf`;
        
        // Save the PDF
        pdf.save(filename);
        
        return filename;
    }
    
    /**
     * Load required dependencies for PDF generation
     * @returns {Promise} - Promise resolving when dependencies are loaded
     */
    static loadDependencies() {
        return new Promise((resolve, reject) => {
            // Check if dependencies are already loaded
            if (window.jspdf && window.html2canvas) {
                resolve();
                return;
            }
            
            // Load jsPDF
            const jspdfScript = document.createElement('script');
            jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            document.head.appendChild(jspdfScript);
            
            // Load html2canvas
            const html2canvasScript = document.createElement('script');
            html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            document.head.appendChild(html2canvasScript);
            
            // Wait for both scripts to load
            let loadedCount = 0;
            const checkLoaded = () => {
                loadedCount++;
                if (loadedCount === 2) {
                    resolve();
                }
            };
            
            jspdfScript.onload = checkLoaded;
            html2canvasScript.onload = checkLoaded;
            
            jspdfScript.onerror = () => reject(new Error('Failed to load jsPDF'));
            html2canvasScript.onerror = () => reject(new Error('Failed to load html2canvas'));
            
            // Set a timeout in case scripts don't load
            setTimeout(() => {
                if (loadedCount < 2) {
                    reject(new Error('Timeout loading dependencies'));
                }
            }, 10000);
        });
    }
    
    /**
     * Generate the content for the PDF report
     * @param {Object} pdf - The jsPDF document object
     * @param {Object} result - The phishing analysis result
     * @param {String} type - The type of analysis ('url' or 'email')
     * @returns {Promise} - Promise resolving when content generation is complete
     */
    static async generateReportContent(pdf, result, type) {
        // Set default font
        pdf.setFont('helvetica');
        
        // Add report header
        this.addReportHeader(pdf, result, type);
        
        // Add executive summary
        let yPos = this.addExecutiveSummary(pdf, result, type);
        
        // Add detailed analysis - pass the current Y position
        yPos = this.addDetailedAnalysis(pdf, result, type, yPos);
        
        // Add recommendations
        this.addRecommendations(pdf, result);
        
        // Add footer to all pages
        this.addFooter(pdf);
    }
    
    /**
     * Add the report header to the PDF
     * @param {Object} pdf - The jsPDF document object
     * @param {Object} result - The phishing analysis result
     * @param {String} type - The type of analysis ('url' or 'email')
     */
    static addReportHeader(pdf, result, type) {
        // Add logo and title
        pdf.setFillColor(59, 130, 246); // Primary blue color
        pdf.rect(0, 0, 210, 40, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Cyber Council SECURITY', 20, 20);
        
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Phishing Detection Report', 20, 30);
        
        // Add report metadata
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        pdf.text('Report Generated:', 20, 50);
        pdf.setFont('helvetica', 'normal');
        pdf.text(date, 70, 50);
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('Analysis Type:', 20, 57);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${type === 'url' ? 'URL' : 'Email'} Analysis`, 70, 57);
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('Target:', 20, 64);
        pdf.setFont('helvetica', 'normal');
        
        // Handle long targets with text wrapping
        const targetText = result.target;
        if (targetText.length > 40) {
            const splitTarget = pdf.splitTextToSize(targetText, 120);
            pdf.text(splitTarget, 70, 64);
        } else {
            pdf.text(targetText, 70, 64);
        }
        
        // Add risk level indicator
        let riskColor;
        if (result.riskLevel === 'Safe') {
            riskColor = [16, 185, 129]; // Green
        } else if (result.riskLevel === 'Suspicious') {
            riskColor = [245, 158, 11]; // Amber
        } else {
            riskColor = [239, 68, 68]; // Red
        }
        
        pdf.setFillColor(...riskColor);
        pdf.roundedRect(140, 45, 50, 25, 3, 3, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('RISK LEVEL', 150, 55);
        
        pdf.setFontSize(16);
        pdf.text(result.riskLevel.toUpperCase(), 150, 63);
        
        // Add horizontal line
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.5);
        pdf.line(20, 75, 190, 75);
    }
    
    /**
     * Add the executive summary section to the PDF
     * @param {Object} pdf - The jsPDF document object
     * @param {Object} result - The phishing analysis result
     * @param {String} type - The type of analysis ('url' or 'email')
     * @returns {Number} - The new Y position after adding content
     */
    static addExecutiveSummary(pdf, result, type) {
        let yPos = 85;
        
        // Section title
        pdf.setTextColor(59, 130, 246); // Primary blue
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EXECUTIVE SUMMARY', 20, yPos);
        yPos += 10;
        
        // Summary content
        pdf.setTextColor(30, 41, 59); // Dark text
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        const summaryText = pdf.splitTextToSize(result.summary, 170);
        pdf.text(summaryText, 20, yPos);
        yPos += (summaryText.length * 6) + 5;
        
        // Add key findings box
        pdf.setFillColor(248, 250, 252); // Light background
        pdf.setDrawColor(226, 232, 240); // Border color
        
        // Calculate the height needed for key findings
        let keyFindings = [];
        if (type === 'url') {
            keyFindings = [
                `Domain Age: ${result.domainAge} days ${result.domainAge < 30 ? '(Recently registered domains are often used for phishing)' : ''}`,
                `SSL Certificate: ${result.sslValid ? 'Valid' : 'Invalid or Missing'} ${!result.sslValid ? '(Lack of encryption is a security risk)' : ''}`,
                `Suspicious TLD: ${result.suspiciousTld ? 'Yes' : 'No'} ${result.suspiciousTld ? '(Uncommon domain extensions are often used in phishing)' : ''}`,
                `Blacklist Status: ${result.blacklisted ? 'Blacklisted' : 'Not Blacklisted'}`
            ];
        } else {
            keyFindings = [
                `Suspicious Links: ${result.suspiciousLinks} detected`,
                `Spoofed Sender: ${result.spoofedSender ? 'Yes' : 'No'}`,
                `Urgency Language: ${result.urgencyScore}% (${result.urgencyScore > 70 ? 'High' : result.urgencyScore > 40 ? 'Medium' : 'Low'})`,
                `Sensitive Data Requests: ${result.sensitiveRequests ? 'Yes' : 'No'}`
            ];
        }
        
        // Calculate box height based on content
        const boxHeight = 15 + (keyFindings.length * 7) + 5;
        
        pdf.roundedRect(20, yPos, 170, boxHeight, 3, 3, 'FD');
        
        pdf.setTextColor(59, 130, 246); // Primary blue
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('KEY FINDINGS', 25, yPos + 10);
        
        pdf.setTextColor(30, 41, 59); // Dark text
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        keyFindings.forEach((finding, index) => {
            // Split long findings into multiple lines if needed
            const findingText = pdf.splitTextToSize(`• ${finding}`, 160);
            pdf.text(findingText, 25, yPos + 20 + (index * 7));
            
            // If this finding has multiple lines, adjust for the next finding
            if (findingText.length > 1) {
                yPos += (findingText.length - 1) * 5;
            }
        });
        
        yPos += boxHeight + 10; // Add more space after the box
        
        // Add horizontal line
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.5);
        pdf.line(20, yPos, 190, yPos);
        
        yPos += 10; // Add space after the line
        
        return yPos;
    }
    
    /**
     * Add the detailed analysis section to the PDF
     * @param {Object} pdf - The jsPDF document object
     * @param {Object} result - The phishing analysis result
     * @param {String} type - The type of analysis ('url' or 'email')
     * @param {Number} startY - The starting Y position
     * @returns {Number} - The new Y position after adding content
     */
    static addDetailedAnalysis(pdf, result, type, startY) {
        let yPos = startY;
        
        // Check if we need to add a new page
        if (yPos > 220) {
            pdf.addPage();
            yPos = 20;
        }
        
        // Section title
        pdf.setTextColor(59, 130, 246); // Primary blue
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('DETAILED ANALYSIS', 20, yPos);
        yPos += 10;
        
        // Analysis content based on type
        if (type === 'url') {
            yPos = this.addUrlAnalysis(pdf, result, yPos);
        } else {
            yPos = this.addEmailAnalysis(pdf, result, yPos);
        }
        
        return yPos;
    }
    
    /**
     * Add URL-specific analysis details
     * @param {Object} pdf - The jsPDF document object
     * @param {Object} result - The phishing analysis result
     * @param {Number} startY - The starting Y position
     * @returns {Number} - The new Y position after adding content
     */
    static addUrlAnalysis(pdf, result, startY) {
        let yPos = startY;
        
        // Create analysis table
        const tableData = [
            ['Factor', 'Value', 'Risk Level', 'Details'],
            ['Domain Age', `${result.domainAge} days`, this.getRiskLevelText(result.domainAge < 30), 'Domains registered recently are often used for phishing campaigns'],
            ['SSL Certificate', result.sslValid ? 'Valid' : 'Invalid/Missing', this.getRiskLevelText(!result.sslValid), 'Secure connections protect data in transit'],
            ['Suspicious TLD', result.suspiciousTld ? 'Yes' : 'No', this.getRiskLevelText(result.suspiciousTld), 'Uncommon domain extensions may indicate phishing'],
            ['Redirect Count', `${result.redirectCount}`, this.getRiskLevelText(result.redirectCount > 3), 'Multiple redirects can hide the true destination'],
            ['Blacklist Status', result.blacklisted ? 'Blacklisted' : 'Not Blacklisted', this.getRiskLevelText(result.blacklisted), 'Domains on security blacklists pose high risk']
        ];
        
        // Check if table will fit on current page
        const estimatedTableHeight = tableData.length * 10 + 10; // Rough estimate
        if (yPos + estimatedTableHeight > 270) {
            pdf.addPage();
            yPos = 20;
        }
        
        // Draw table
        yPos = this.drawTable(pdf, tableData, 20, yPos, [30, 40, 30, 70]);
        
        // Add technical details section
        yPos += 15;
        
        // Check if we need to add a new page
        if (yPos > 250) {
            pdf.addPage();
            yPos = 20;
        }
        
        pdf.setTextColor(59, 130, 246);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Technical Details', 20, yPos);
        yPos += 8;
        
        pdf.setTextColor(30, 41, 59);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        const technicalDetails = [
            `• Domain: ${result.target}`,
            `• Analysis Date: ${new Date().toLocaleDateString()}`,
            `• Analysis Method: AI-powered heuristic analysis and reputation checking`,
            `• Security Score: ${this.calculateSecurityScore(result, 'url')}/100`
        ];
        
        technicalDetails.forEach(detail => {
            const detailText = pdf.splitTextToSize(detail, 170);
            pdf.text(detailText, 20, yPos);
            yPos += detailText.length * 6;
        });
        
        return yPos;
    }
    
    /**
     * Add email-specific analysis details
     * @param {Object} pdf - The jsPDF document object
     * @param {Object} result - The phishing analysis result
     * @param {Number} startY - The starting Y position
     * @returns {Number} - The new Y position after adding content
     */
    static addEmailAnalysis(pdf, result, startY) {
        let yPos = startY;
        
        // Create analysis table
        const tableData = [
            ['Factor', 'Value', 'Risk Level', 'Details'],
            ['Suspicious Links', `${result.suspiciousLinks} detected`, this.getRiskLevelText(result.suspiciousLinks > 0), 'Links may lead to malicious websites'],
            ['Spoofed Sender', result.spoofedSender ? 'Yes' : 'No', this.getRiskLevelText(result.spoofedSender), 'Sender address may be falsified'],
            ['Urgency Language', `${result.urgencyScore}%`, this.getRiskLevelText(result.urgencyScore > 70, result.urgencyScore > 40), 'Creating urgency is a common phishing tactic'],
            ['Sensitive Requests', result.sensitiveRequests ? 'Yes' : 'No', this.getRiskLevelText(result.sensitiveRequests), 'Requests for sensitive data indicate phishing'],
            ['Grammar/Spelling', `${result.grammarScore}%`, this.getRiskLevelText(result.grammarScore < 60), 'Poor language quality often indicates phishing']
        ];
        
        // Check if table will fit on current page
        const estimatedTableHeight = tableData.length * 10 + 10; // Rough estimate
        if (yPos + estimatedTableHeight > 270) {
            pdf.addPage();
            yPos = 20;
        }
        
        // Draw table
        yPos = this.drawTable(pdf, tableData, 20, yPos, [40, 30, 30, 70]);
        
        // Add technical details section
        yPos += 15;
        
        // Check if we need to add a new page
        if (yPos > 250) {
            pdf.addPage();
            yPos = 20;
        }
        
        pdf.setTextColor(59, 130, 246);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Technical Details', 20, yPos);
        yPos += 8;
        
        pdf.setTextColor(30, 41, 59);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        const technicalDetails = [
            `• Email Subject: ${result.target}`,
            `• Analysis Date: ${new Date().toLocaleDateString()}`,
            `• Analysis Method: AI-powered content and behavioral analysis`,
            `• Security Score: ${this.calculateSecurityScore(result, 'email')}/100`
        ];
        
        technicalDetails.forEach(detail => {
            const detailText = pdf.splitTextToSize(detail, 170);
            pdf.text(detailText, 20, yPos);
            yPos += detailText.length * 6;
        });
        
        return yPos;
    }
    
    /**
     * Add recommendations section to the PDF
     * @param {Object} pdf - The jsPDF document object
     * @param {Object} result - The phishing analysis result
     */
    static addRecommendations(pdf, result) {
        // Add a new page for recommendations
        pdf.addPage();
        let yPos = 20;
        
        // Section title
        pdf.setTextColor(59, 130, 246); // Primary blue
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('RECOMMENDATIONS & NEXT STEPS', 20, yPos);
        yPos += 10;
        
        // Add recommendations box
        pdf.setFillColor(248, 250, 252); // Light background
        pdf.setDrawColor(226, 232, 240); // Border color
        
        // Calculate the height needed for recommendations
        let totalRecommendationHeight = 20; // Start with padding
        
        // Pre-calculate the height needed for each recommendation
        const recommendationHeights = result.recommendations.map(recommendation => {
            const recText = pdf.splitTextToSize(`${recommendation}`, 160);
            return recText.length * 6;
        });
        
        // Sum up all heights
        totalRecommendationHeight += recommendationHeights.reduce((sum, height) => sum + height, 0);
        
        // Draw the box
        pdf.roundedRect(20, yPos, 170, totalRecommendationHeight, 3, 3, 'FD');
        
        pdf.setTextColor(30, 41, 59); // Dark text
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Recommended Actions:', 25, yPos + 10);
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Start position for first recommendation
        let recYPos = yPos + 20;
        
        // Add each recommendation with proper spacing
        result.recommendations.forEach((recommendation, index) => {
            const recText = pdf.splitTextToSize(`${index + 1}. ${recommendation}`, 160);
            pdf.text(recText, 25, recYPos);
            recYPos += recText.length * 6 + 2; // Add a little extra space between items
        });
        
        yPos += totalRecommendationHeight + 15;
        
        // Check if we need a new page for security tips
        if (yPos > 220) {
            pdf.addPage();
            yPos = 20;
        }
        
        // Add general security tips
        pdf.setTextColor(59, 130, 246); // Primary blue
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('General Security Best Practices', 20, yPos);
        yPos += 10;
        
        pdf.setTextColor(30, 41, 59); // Dark text
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        const securityTips = [
            'Always verify the sender\'s email address before responding or clicking links.',
            'Check for HTTPS and the padlock icon before entering sensitive information on websites.',
            'Use unique, strong passwords for each of your accounts.',
            'Enable two-factor authentication (2FA) whenever possible.',
            'Keep your operating system, browsers, and security software up to date.',
            'Be cautious of unexpected emails or messages, even if they appear to be from known contacts.',
            'Hover over links to preview the URL before clicking.',
            'Report suspected phishing attempts to your IT department or relevant authorities.'
        ];
        
        // Calculate if all tips will fit on the current page
        const estimatedTipsHeight = securityTips.length * 8 + 10;
        if (yPos + estimatedTipsHeight > 270) {
            pdf.addPage();
            yPos = 20;
            
            // Re-add the section title on the new page
            pdf.setTextColor(59, 130, 246);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('General Security Best Practices', 20, yPos);
            yPos += 10;
            
            pdf.setTextColor(30, 41, 59);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
        }
        
        securityTips.forEach((tip, index) => {
            const tipText = pdf.splitTextToSize(`• ${tip}`, 170);
            
            // Check if this tip will fit on the current page
            if (yPos + (tipText.length * 6) > 270) {
                pdf.addPage();
                yPos = 20;
            }
            
            pdf.text(tipText, 20, yPos);
            yPos += tipText.length * 6 + 2; // Add a little extra space between items
        });
    }
    
    /**
     * Add footer to all pages of the PDF
     * @param {Object} pdf - The jsPDF document object
     */
    static addFooter(pdf) {
        const pageCount = pdf.internal.getNumberOfPages();
        
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            
            // Add footer line
            pdf.setDrawColor(226, 232, 240);
            pdf.setLineWidth(0.5);
            pdf.line(20, 280, 190, 280);
            
            // Add footer text
            pdf.setTextColor(100, 116, 139); // Slate gray
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            
            // Left side - company info
            pdf.text('Cyber Council Security Suite | Generated by Phishing Detection Tool', 20, 287);
            
            // Right side - page numbers
            pdf.text(`Page ${i} of ${pageCount}`, 170, 287);
        }
    }
    
    /**
     * Draw a table in the PDF
     * @param {Object} pdf - The jsPDF document object
     * @param {Array} data - 2D array of table data
     * @param {Number} x - X position
     * @param {Number} y - Y position
     * @param {Array} colWidths - Array of column widths
     * @returns {Number} - The Y position after the table
     */
    static drawTable(pdf, data, x, y, colWidths) {
        // Calculate the total width of the table
        const tableWidth = colWidths.reduce((a, b) => a + b, 0);
        
        // Determine the row height based on content
        const calculateRowHeight = (rowData, colWidths) => {
            let maxLines = 1;
            rowData.forEach((cell, i) => {
                if (typeof cell === 'string') {
                    const cellText = pdf.splitTextToSize(cell, colWidths[i] - 4);
                    maxLines = Math.max(maxLines, cellText.length);
                }
            });
            return Math.max(10, maxLines * 6); // Minimum 10mm, or 6mm per line
        };
        
        let currentY = y;
        
        // Table header
        pdf.setFillColor(59, 130, 246); // Primary blue
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        
        const headerHeight = calculateRowHeight(data[0], colWidths);
        
        // Draw header background
        pdf.rect(x, currentY, tableWidth, headerHeight, 'F');
        
        // Draw header cells
        let currentX = x;
        data[0].forEach((cell, i) => {
            const cellText = pdf.splitTextToSize(cell, colWidths[i] - 4);
            pdf.text(cellText, currentX + 2, currentY + 6); // Adjust vertical position for text
            
            // Draw vertical line after each cell (except the last one)
            if (i < data[0].length - 1) {
                pdf.setDrawColor(255, 255, 255);
                pdf.line(currentX + colWidths[i], currentY, currentX + colWidths[i], currentY + headerHeight);
            }
            
            currentX += colWidths[i];
        });
        currentY += headerHeight;
        
        // Table body
        pdf.setTextColor(30, 41, 59);
        pdf.setFont('helvetica', 'normal');
        
        // Draw alternating rows
        for (let i = 1; i < data.length; i++) {
            const rowHeight = calculateRowHeight(data[i], colWidths);
            
            // Check if we need to add a new page
            if (currentY + rowHeight > 270) {
                pdf.addPage();
                currentY = 20;
                
                // Redraw header on new page
                currentX = x;
                pdf.setFillColor(59, 130, 246);
                pdf.setTextColor(255, 255, 255);
                pdf.setFont('helvetica', 'bold');
                
                // Draw header background
                pdf.rect(x, currentY, tableWidth, headerHeight, 'F');
                
                // Draw header cells
                data[0].forEach((cell, j) => {
                    const cellText = pdf.splitTextToSize(cell, colWidths[j] - 4);
                    pdf.text(cellText, currentX + 2, currentY + 6);
                    
                    // Draw vertical line after each cell (except the last one)
                    if (j < data[0].length - 1) {
                        pdf.setDrawColor(255, 255, 255);
                        pdf.line(currentX + colWidths[j], currentY, currentX + colWidths[j], currentY + headerHeight);
                    }
                    
                    currentX += colWidths[j];
                });
                currentY += headerHeight;
                
                pdf.setTextColor(30, 41, 59);
                pdf.setFont('helvetica', 'normal');
            }
            
            // Set alternating row background
            if (i % 2 === 0) {
                pdf.setFillColor(248, 250, 252); // Light blue for even rows
            } else {
                pdf.setFillColor(255, 255, 255); // White for odd rows
            }
            
            // Draw row background
            pdf.rect(x, currentY, tableWidth, rowHeight, 'F');
            
            // Draw cells
            currentX = x;
            data[i].forEach((cell, j) => {
                // Special formatting for risk level column
                if (j === 2) { // Risk Level column
                    if (cell === 'High Risk') {
                        pdf.setTextColor(239, 68, 68); // Red
                        pdf.setFont('helvetica', 'bold');
                    } else if (cell === 'Medium Risk') {
                        pdf.setTextColor(245, 158, 11); // Amber
                        pdf.setFont('helvetica', 'bold');
                    } else if (cell === 'Low Risk') {
                        pdf.setTextColor(16, 185, 129); // Green
                        pdf.setFont('helvetica', 'bold');
                    }
                }
                
                // Handle text that might be too long
                const cellText = pdf.splitTextToSize(cell, colWidths[j] - 4);
                
                // Calculate vertical centering for the text
                const textHeight = cellText.length * 6;
                const verticalOffset = (rowHeight - textHeight) / 2 + 6;
                
                pdf.text(cellText, currentX + 2, currentY + verticalOffset);
                
                // Draw vertical line after each cell (except the last one)
                if (j < data[i].length - 1) {
                    pdf.setDrawColor(226, 232, 240);
                    pdf.line(currentX + colWidths[j], currentY, currentX + colWidths[j], currentY + rowHeight);
                }
                
                // Reset text color and font
                pdf.setTextColor(30, 41, 59);
                pdf.setFont('helvetica', 'normal');
                
                currentX += colWidths[j];
            });
            
            // Draw horizontal line after each row
            pdf.setDrawColor(226, 232, 240);
            pdf.line(x, currentY + rowHeight, x + tableWidth, currentY + rowHeight);
            
            currentY += rowHeight;
        }
        
        // Draw table border
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.1);
        pdf.rect(x, y, tableWidth, currentY - y);
        
        return currentY + 5;
    }
    
    /**
     * Get risk level text based on condition
     * @param {Boolean} highRiskCondition - Condition for high risk
     * @param {Boolean} mediumRiskCondition - Condition for medium risk (optional)
     * @returns {String} - Risk level text
     */
    static getRiskLevelText(highRiskCondition, mediumRiskCondition = false) {
        if (highRiskCondition) {
            return 'High Risk';
        } else if (mediumRiskCondition) {
            return 'Medium Risk';
        } else {
            return 'Low Risk';
        }
    }
    
    /**
     * Calculate security score based on analysis results
     * @param {Object} result - The phishing analysis result
     * @param {String} type - The type of analysis ('url' or 'email')
     * @returns {Number} - Security score (0-100)
     */
    static calculateSecurityScore(result, type) {
        let score = 100;
        
        if (type === 'url') {
            // Domain age (newer domains are riskier)
            if (result.domainAge < 30) {
                score -= 20;
            } else if (result.domainAge < 90) {
                score -= 10;
            }
            
            // SSL Certificate
            if (!result.sslValid) {
                score -= 25;
            }
            
            // Suspicious TLD
            if (result.suspiciousTld) {
                score -= 15;
            }
            
            // Redirect count
            if (result.redirectCount > 3) {
                score -= 15;
            } else if (result.redirectCount > 1) {
                score -= 5;
            }
            
            // Blacklist status
            if (result.blacklisted) {
                score -= 30;
            }
        } else {
            // Suspicious links
            if (result.suspiciousLinks > 2) {
                score -= 30;
            } else if (result.suspiciousLinks > 0) {
                score -= 15;
            }
            
            // Spoofed sender
            if (result.spoofedSender) {
                score -= 25;
            }
            
            // Urgency language
            if (result.urgencyScore > 70) {
                score -= 20;
            } else if (result.urgencyScore > 40) {
                score -= 10;
            }
            
            // Sensitive data requests
            if (result.sensitiveRequests) {
                score -= 25;
            }
            
            // Grammar/spelling
            if (result.grammarScore < 60) {
                score -= 15;
            } else if (result.grammarScore < 80) {
                score -= 5;
            }
        }
        
        // Ensure score is between 0 and 100
        return Math.max(0, Math.min(100, score));
    }
}

// Export the PhishingReport class
window.PhishingReport = PhishingReport;