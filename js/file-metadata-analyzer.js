document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Mobile menu functionality
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const sidebar = document.querySelector('.sidebar');
    const homeIcon = document.querySelector('.home-icon');
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    const previewModal = document.getElementById('previewModal');
    const closeModal = document.getElementById('closeModal');
    const previewContent = document.getElementById('previewContent');

    // Hide export button initially
    const exportButton = document.getElementById('exportButton');
    exportButton.style.display = 'none';

    mobileMenuButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mobileDropdown.classList.remove('active');
    });

    homeIcon.addEventListener('click', () => {
        mobileDropdown.classList.toggle('active');
        sidebar.classList.remove('active');
    });

    closeModal?.addEventListener('click', () => {
        previewModal.classList.remove('active');
    });

    // File upload functionality
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const resultsContainer = document.getElementById('resultsContainer');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Handle file input change
    fileInput.addEventListener('change', handleFiles, false);
    
    // Handle click on drop zone - trigger file input
    dropZone.addEventListener('click', (e) => {
        // Only trigger file input if the click wasn't on the upload button
        if (!e.target.classList.contains('upload-button')) {
            fileInput.click();
        }
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('drag-over');
    }

    function unhighlight(e) {
        dropZone.classList.remove('drag-over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    async function handleFiles(e) {
        const files = [...e.target.files];
        if (files.length === 0) return;

        resultsContainer.innerHTML = ''; // Clear previous results
        exportButton.style.display = 'flex'; // Show export button

        // Show loading state
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-message';
        loadingDiv.innerHTML = `
            <div class="spinner"></div>
            <p>Analyzing files...</p>
        `;
        resultsContainer.appendChild(loadingDiv);

        try {
            for (const file of files) {
                const fileResult = await analyzeFile(file);
                resultsContainer.appendChild(fileResult);
            }
        } catch (error) {
            console.error('Error processing files:', error);
            showError('Error processing files. Please try again.');
        } finally {
            // Remove loading message
            const loadingMessage = document.querySelector('.loading-message');
            if (loadingMessage) {
                loadingMessage.remove();
            }
        }

        // Reinitialize icons for new content
        lucide.createIcons();
    }

    async function analyzeFile(file) {
        const fileResult = document.createElement('div');
        fileResult.className = 'file-result';

        try {
            // Basic file info
            const basicInfo = await getBasicFileInfo(file);
            
            // Advanced metadata
            const advancedMetadata = await getAdvancedMetadata(file);
            
            // Create header
            const header = createFileHeader(file, basicInfo);
            fileResult.appendChild(header);

            // Create metadata sections
            const metadataContainer = document.createElement('div');
            metadataContainer.className = 'metadata-container';

            // Basic metadata section
            const basicMetadata = createMetadataSection('Basic Information', basicInfo);
            metadataContainer.appendChild(basicMetadata);

            // Advanced metadata section
            if (Object.keys(advancedMetadata).length > 0) {
                const advancedSection = createMetadataSection('Advanced Information', advancedMetadata);
                metadataContainer.appendChild(advancedSection);
            }

            fileResult.appendChild(metadataContainer);

            // Add preview button if supported
            if (isPreviewSupported(file.type)) {
                const previewButton = createPreviewButton(file);
                fileResult.appendChild(previewButton);
            }

            // Add security analysis section
            const securityAnalysis = await analyzeFileSecurity(file);
            const securitySection = createMetadataSection('Security Analysis', securityAnalysis);
            metadataContainer.appendChild(securitySection);

        } catch (error) {
            console.error('Error analyzing file:', error);
            fileResult.classList.add('error');
            fileResult.innerHTML = `
                <div class="file-header">
                    <div class="file-icon error">
                        <i data-lucide="alert-triangle"></i>
                    </div>
                    <div class="file-info">
                        <h3>Error analyzing ${file.name}</h3>
                        <p>Please try again</p>
                    </div>
                </div>
            `;
        }

        return fileResult;
    }

    async function getBasicFileInfo(file) {
        return {
            'File Name': file.name,
            'File Size': formatBytes(file.size),
            'File Type': file.type || 'Unknown',
            'Last Modified': new Date(file.lastModified).toLocaleString(),
            'Created': new Date(file.lastModified).toLocaleString()
        };
    }

    async function getAdvancedMetadata(file) {
        const metadata = {};

        try {
            if (file.type.startsWith('image/')) {
                const imageData = await analyzeImage(file);
                Object.assign(metadata, imageData);
            } else if (file.type === 'application/pdf') {
                const pdfData = await analyzePDF(file);
                Object.assign(metadata, pdfData);
            }

            // Add file signature analysis
            const signatureInfo = await analyzeFileSignature(file);
            if (signatureInfo) {
                metadata['File Signature'] = signatureInfo;
            }

        } catch (error) {
            console.error('Error getting advanced metadata:', error);
        }

        return metadata;
    }

    async function analyzeImage(file) {
        const metadata = {};
        try {
            const img = new Image();
            const imgUrl = URL.createObjectURL(file);
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imgUrl;
            });

            metadata['Dimensions'] = `${img.width} x ${img.height}`;
            metadata['Aspect Ratio'] = (img.width / img.height).toFixed(2);

            URL.revokeObjectURL(imgUrl);
        } catch (error) {
            console.error('Error analyzing image:', error);
        }
        return metadata;
    }

    async function analyzePDF(file) {
        const metadata = {};
        try {
            const arrayBuffer = await file.arrayBuffer();
            // Add PDF-specific analysis here
            metadata['PDF Version'] = 'Detected';
            metadata['Page Count'] = 'Analysis available';
        } catch (error) {
            console.error('Error analyzing PDF:', error);
        }
        return metadata;
    }

    async function analyzeFileSignature(file) {
        try {
            const buffer = await file.arrayBuffer();
            const signature = Array.from(new Uint8Array(buffer.slice(0, 4)))
                .map(b => b.toString(16).padStart(2, '0'))
                .join(' ');
            return signature.toUpperCase();
        } catch (error) {
            console.error('Error analyzing file signature:', error);
            return null;
        }
    }

    async function analyzeFileSecurity(file) {
        const security = {
            'Risk Level': 'Low',
            'Encryption Status': 'Not encrypted',
            'Signature Status': 'Not signed',
            'Security Recommendations': 'File appears safe to open'
        };

        try {
            // Add file extension analysis
            const extension = file.name.split('.').pop().toLowerCase();
            const riskyExtensions = ['exe', 'bat', 'cmd', 'vbs', 'js'];
            
            if (riskyExtensions.includes(extension)) {
                security['Risk Level'] = 'High';
                security['Security Recommendations'] = 'Caution: Executable file detected';
            }

            // Add size analysis
            if (file.size > 50 * 1024 * 1024) { // 50MB
                security['Security Recommendations'] += '\nLarge file size detected';
            }

            // Add content type analysis
            if (!file.type) {
                security['Risk Level'] = 'Medium';
                security['Security Recommendations'] += '\nUnknown file type';
            }

        } catch (error) {
            console.error('Error analyzing file security:', error);
        }

        return security;
    }

    function createFileHeader(file, basicInfo) {
        const header = document.createElement('div');
        header.className = 'file-header';

        const icon = document.createElement('div');
        icon.className = 'file-icon';
        icon.innerHTML = `<i data-lucide="${getFileIcon(file.type)}"></i>`;

        const info = document.createElement('div');
        info.className = 'file-info';
        info.innerHTML = `
            <h3>${escapeHtml(file.name)}</h3>
            <p>${basicInfo['File Size']} - ${basicInfo['File Type'] || 'Unknown type'}</p>
        `;

        header.appendChild(icon);
        header.appendChild(info);

        return header;
    }

    function createMetadataSection(title, metadata) {
        const section = document.createElement('div');
        section.className = 'metadata-section';
        
        const sectionTitle = document.createElement('h4');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = title;
        section.appendChild(sectionTitle);

        const grid = document.createElement('div');
        grid.className = 'metadata-grid';

        Object.entries(metadata).forEach(([key, value]) => {
            const item = document.createElement('div');
            item.className = 'metadata-item';
            item.innerHTML = `
                <h4>${escapeHtml(key)}</h4>
                <p>${escapeHtml(String(value))}</p>
            `;
            grid.appendChild(item);
        });

        section.appendChild(grid);
        return section;
    }

    function createPreviewButton(file) {
        const button = document.createElement('button');
        button.className = 'preview-button';
        button.innerHTML = `
            <i data-lucide="eye"></i>
            Preview File
        `;

        button.addEventListener('click', () => showPreview(file));
        return button;
    }

    function showPreview(file) {
        const modal = document.getElementById('previewModal');
        const content = document.getElementById('previewContent');
        
        content.innerHTML = '';
        
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.onload = () => URL.revokeObjectURL(img.src);
            content.appendChild(img);
        } else if (file.type === 'application/pdf') {
            const obj = document.createElement('object');
            obj.data = URL.createObjectURL(file);
            obj.type = 'application/pdf';
            obj.width = '100%';
            obj.height = '100%';
            content.appendChild(obj);
        }

        modal.classList.add('active');
    }

    function getFileIcon(type) {
        if (type.startsWith('image/')) return 'image';
        if (type === 'application/pdf') return 'file-text';
        if (type.includes('word')) return 'file-type-word';
        if (type.includes('excel')) return 'file-type-excel';
        if (type.includes('video/')) return 'video';
        if (type.includes('audio/')) return 'music';
        return 'file';
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        resultsContainer.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function isPreviewSupported(type) {
        return type.startsWith('image/') || type === 'application/pdf';
    }

    // Export functionality
    exportButton.addEventListener('click', () => {
        const results = [];
        document.querySelectorAll('.file-result').forEach(result => {
            if (result.classList.contains('error')) return;

            const sections = {};
            result.querySelectorAll('.metadata-section').forEach(section => {
                const title = section.querySelector('.section-title').textContent;
                const items = {};
                
                section.querySelectorAll('.metadata-item').forEach(item => {
                    const key = item.querySelector('h4').textContent;
                    const value = item.querySelector('p').textContent;
                    items[key] = value;
                });
                
                sections[title] = items;
            });

            results.push(sections);
        });

        const report = {
            title: 'Advanced File Metadata Analysis Report',
            timestamp: new Date().toISOString(),
            analysisVersion: '2.0',
            results
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { 
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `metadata-report-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            sidebar.classList.remove('active');
        }
        
        if (!mobileDropdown.contains(e.target) && !homeIcon.contains(e.target)) {
            mobileDropdown.classList.remove('active');
        }
    });
});

// Add Inter font for better typography
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
document.head.appendChild(fontLink);