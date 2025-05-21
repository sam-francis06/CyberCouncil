document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const previewSection = document.getElementById('previewSection');
    const metadataSection = document.getElementById('metadataSection');
    const metadataGrid = document.getElementById('metadataGrid');
    const clearButton = document.getElementById('clearButton');
    const exportJsonButton = document.getElementById('exportJsonButton');
    const exportCsvButton = document.getElementById('exportCsvButton');
    const exportPdfButton = document.getElementById('exportPdfButton');
    const removeMetadataButton = document.getElementById('removeMetadataButton');
    const downloadCleanButton = document.getElementById('downloadCleanButton');
    const riskScore = document.getElementById('riskScore');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    let currentImage = null;
    let currentMetadata = null;

    // Drag and drop handlers
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFileSelect, false);
    clearButton.addEventListener('click', clearImage);
    exportJsonButton.addEventListener('click', exportMetadataJson);
    exportCsvButton.addEventListener('click', exportMetadataCsv);
    exportPdfButton.addEventListener('click', exportMetadataPdf);
    removeMetadataButton.addEventListener('click', removeMetadata);
    downloadCleanButton.addEventListener('click', downloadCleanImage);

    // Tab functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            switchTab(tab);
        });
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
        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                currentImage = file;
                displayImage(file);
                extractMetadata(file);
            } else {
                alert('Please upload an image file.');
            }
        }
    }

    function displayImage(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            previewSection.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    function calculateRiskScore(metadata) {
        let score = 0;
        let risks = [];

        if (metadata['GPS Location']) {
            score += 30;
            risks.push('Location data present');
        }
        if (metadata['Camera Make'] || metadata['Camera Model']) {
            score += 10;
            risks.push('Device information present');
        }
        if (metadata['Date Taken']) {
            score += 5;
            risks.push('Timestamp information present');
        }
        if (metadata['Software']) {
            score += 5;
            risks.push('Software information present');
        }

        const riskLevel = score >= 30 ? 'high' : score >= 15 ? 'medium' : 'low';
        return { score, risks, level: riskLevel };
    }

    function extractMetadata(file) {
        EXIF.getData(file, function() {
            const metadata = {};
            const exifData = EXIF.getAllTags(this);
            
            // Basic file information
            metadata['File Name'] = file.name;
            metadata['File Size'] = formatFileSize(file.size);
            metadata['File Type'] = file.type;
            metadata['Last Modified'] = new Date(file.lastModified).toLocaleString();

            // EXIF data
            if (Object.keys(exifData).length > 0) {
                // Camera data
                if (exifData.Make) metadata['Camera Make'] = exifData.Make;
                if (exifData.Model) metadata['Camera Model'] = exifData.Model;
                if (exifData.Software) metadata['Software'] = exifData.Software;
                
                // Image data
                if (exifData.DateTimeOriginal) metadata['Date Taken'] = exifData.DateTimeOriginal;
                if (exifData.ExposureTime) metadata['Exposure Time'] = `${exifData.ExposureTime.numerator}/${exifData.ExposureTime.denominator} sec`;
                if (exifData.FNumber) metadata['F-Number'] = `f/${exifData.FNumber}`;
                if (exifData.ISO) metadata['ISO'] = exifData.ISO;
                if (exifData.FocalLength) metadata['Focal Length'] = `${exifData.FocalLength}mm`;
                
                // Location data
                if (exifData.GPSLatitude && exifData.GPSLongitude) {
                    const lat = convertDMSToDD(exifData.GPSLatitude, exifData.GPSLatitudeRef);
                    const lng = convertDMSToDD(exifData.GPSLongitude, exifData.GPSLongitudeRef);
                    metadata['GPS Location'] = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                }
            }

            currentMetadata = metadata;
            displayMetadata(metadata);
            updateRiskScore(metadata);
            metadataSection.style.display = 'block';
        });
    }

    function updateRiskScore(metadata) {
        const { score, level, risks } = calculateRiskScore(metadata);
        const riskScoreElement = document.getElementById('riskScore');
        riskScoreElement.textContent = `Risk Score: ${score}`;
        riskScoreElement.className = `risk-score risk-${level}`;

        // Update security tab with risks
        const securityTab = document.getElementById('securityTab');
        securityTab.innerHTML = `
            <div class="metadata-grid">
                <div class="metadata-item">
                    <h4>Risk Level</h4>
                    <p>${level.charAt(0).toUpperCase() + level.slice(1)}</p>
                </div>
                <div class="metadata-item">
                    <h4>Risk Score</h4>
                    <p>${score}/50</p>
                </div>
                <div class="metadata-item">
                    <h4>Identified Risks</h4>
                    <p>${risks.length > 0 ? risks.join(', ') : 'No significant risks detected'}</p>
                </div>
            </div>
        `;
    }

    function displayMetadata(metadata) {
        // Basic tab
        const basicGrid = document.getElementById('basicTab');
        basicGrid.innerHTML = '';
        
        ['File Name', 'File Size', 'File Type', 'Last Modified'].forEach(key => {
            if (metadata[key]) {
                appendMetadataItem(basicGrid, key, metadata[key]);
            }
        });

        // Camera tab
        const cameraGrid = document.getElementById('cameraTab');
        cameraGrid.innerHTML = '<div class="metadata-grid"></div>';
        const cameraMetadataGrid = cameraGrid.querySelector('.metadata-grid');
        
        ['Camera Make', 'Camera Model', 'Software', 'Exposure Time', 'F-Number', 'ISO', 'Focal Length'].forEach(key => {
            if (metadata[key]) {
                appendMetadataItem(cameraMetadataGrid, key, metadata[key]);
            }
        });

        // Location tab
        const locationGrid = document.getElementById('locationTab');
        locationGrid.innerHTML = '<div class="metadata-grid"></div>';
        const locationMetadataGrid = locationGrid.querySelector('.metadata-grid');
        
        if (metadata['GPS Location']) {
            appendMetadataItem(locationMetadataGrid, 'GPS Location', metadata['GPS Location']);
            
            // Add privacy warning
            const warning = document.createElement('div');
            warning.className = 'privacy-alert';
            warning.innerHTML = `
                <h4>Privacy Risk Detected</h4>
                <p>This image contains location data. Consider removing it before sharing to protect your privacy.</p>
            `;
            locationGrid.appendChild(warning);
        } else {
            appendMetadataItem(locationMetadataGrid, 'Location Data', 'No location data found');
        }
    }

    function appendMetadataItem(container, key, value) {
        const item = document.createElement('div');
        item.className = 'metadata-item';
        item.innerHTML = `
            <h4>${key}</h4>
            <p>${value}</p>
        `;
        container.appendChild(item);
    }

    function switchTab(tabName) {
        tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabName);
        });
        
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}Tab`);
        });
    }

    function removeMetadata() {
        if (!currentImage) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            const cleanImageData = piexif.remove(imageData);
            imagePreview.src = cleanImageData;
            
            // Update metadata display
            currentMetadata = {
                'File Name': currentImage.name,
                'File Size': formatFileSize(currentImage.size),
                'File Type': currentImage.type,
                'Last Modified': new Date(currentImage.lastModified).toLocaleString()
            };
            
            displayMetadata(currentMetadata);
            updateRiskScore(currentMetadata);
        };
        reader.readAsDataURL(currentImage);
    }

    function downloadCleanImage() {
        if (!imagePreview.src) return;
        
        const cleanImageData = imagePreview.src;
        const link = document.createElement('a');
        link.href = cleanImageData;
        link.download = `clean_${currentImage.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function clearImage() {
        imagePreview.src = '';
        previewSection.style.display = 'none';
        metadataSection.style.display = 'none';
        fileInput.value = '';
        currentImage = null;
        currentMetadata = null;
    }

    function exportMetadataJson() {
        if (!currentMetadata) return;
        const blob = new Blob([JSON.stringify(currentMetadata, null, 2)], { type: 'application/json' });
        saveFile(blob, 'metadata.json');
    }

    function exportMetadataCsv() {
        if (!currentMetadata) return;
        const csvRows = [
            ['Property', 'Value'],
            ...Object.entries(currentMetadata)
        ];
        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        saveFile(blob, 'metadata.csv');
    }

    function exportMetadataPdf() {
        if (!currentMetadata) return;
        const content = Object.entries(currentMetadata)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        const blob = new Blob([content], { type: 'application/pdf' });
        saveFile(blob, 'metadata.pdf');
    }

    function saveFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function convertDMSToDD(dms, ref) {
        const degrees = dms[0];
        const minutes = dms[1];
        const seconds = dms[2];
        
        let dd = degrees + minutes/60 + seconds/3600;
        if (ref === 'S' || ref === 'W') dd = dd * -1;
        
        return dd;
    }
});