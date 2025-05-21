// Initialize Lucide icons
lucide.createIcons();

// File type signatures with descriptions
const fileSignatures = {
    'image/jpeg': {
        signatures: [[0xFF, 0xD8, 0xFF]],
        description: 'JPEG Image File'
    },
    'image/png': {
        signatures: [[0x89, 0x50, 0x4E, 0x47]],
        description: 'PNG Image File'
    },
    'application/pdf': {
        signatures: [[0x25, 0x50, 0x44, 0x46]],
        description: 'PDF Document'
    },
    'image/gif': {
        signatures: [[0x47, 0x49, 0x46, 0x38]],
        description: 'GIF Image File'
    },
    'image/webp': {
        signatures: [[0x52, 0x49, 0x46, 0x46]],
        description: 'WebP Image File'
    },
    'application/zip': {
        signatures: [[0x50, 0x4B, 0x03, 0x04]],
        description: 'ZIP Archive'
    },
    'audio/mpeg': {
        signatures: [[0x49, 0x44, 0x33], [0xFF, 0xFB]],
        description: 'MP3 Audio File'
    },
    'video/mp4': {
        signatures: [[0x66, 0x74, 0x79, 0x70]],
        description: 'MP4 Video File'
    },
    'application/x-msdownload': {
        signatures: [[0x4D, 0x5A]],
        description: 'Windows Executable'
    }
};

// Setup drag and drop
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const resultsContainer = document.getElementById('resultsContainer');
const clearResultsBtn = document.getElementById('clearResults');

// Event listeners for drag and drop
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
fileInput.addEventListener('change', handleFiles, false);
clearResultsBtn.addEventListener('click', clearResults);

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

function clearResults() {
    resultsContainer.innerHTML = `
        <div class="no-files">
            <i data-lucide="inbox"></i>
            <p>No files analyzed yet</p>
            <span>Upload files to begin analysis</span>
        </div>
    `;
    lucide.createIcons();
}

async function handleFiles(e) {
    const files = [...e.target.files];
    
    if (resultsContainer.querySelector('.no-files')) {
        resultsContainer.innerHTML = '';
    }

    for (const file of files) {
        if (file.size > 100 * 1024 * 1024) { // 100MB limit
            showError(`File ${file.name} exceeds 100MB limit`);
            continue;
        }
        
        const result = await validateFile(file);
        displayResult(result);
    }
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'file-result error';
    errorElement.innerHTML = `
        <div class="file-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626)">
            <i data-lucide="alert-triangle"></i>
        </div>
        <div class="file-info">
            <div class="file-name">Error</div>
            <div class="file-type">${message}</div>
        </div>
    `;
    resultsContainer.appendChild(errorElement);
    lucide.createIcons();
}

async function validateFile(file) {
    const buffer = await readFileHeader(file);
    const fileType = await detectFileType(buffer);
    
    return {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || 'Unknown',
        validatedType: fileType,
        description: fileSignatures[fileType]?.description || 'Unknown File Type',
        isValid: fileType === file.type
    };
}

function readFileHeader(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const array = new Uint8Array(reader.result);
            resolve(array);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file.slice(0, 16));
    });
}

async function detectFileType(buffer) {
    for (const [type, info] of Object.entries(fileSignatures)) {
        for (const signature of info.signatures) {
            if (matchSignature(buffer, signature)) {
                return type;
            }
        }
    }
    return 'Unknown';
}

function matchSignature(buffer, signature) {
    return signature.every((byte, i) => buffer[i] === byte);
}

function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function displayResult(result) {
    const resultElement = document.createElement('div');
    resultElement.className = 'file-result';
    
    resultElement.innerHTML = `
        <div class="file-icon">
            <i data-lucide="file-type"></i>
        </div>
        <div class="file-info">
            <div class="file-name">${result.name}</div>
            <div class="file-type">
                <span>Size: ${result.size}</span>
                <span>Type: ${result.description}</span>
            </div>
        </div>
        <span class="validation-status ${result.isValid ? 'status-valid' : 'status-invalid'}">
            <i data-lucide="${result.isValid ? 'check-circle' : 'alert-triangle'}"></i>
            ${result.isValid ? 'Valid' : 'Invalid'}
        </span>
    `;

    resultsContainer.appendChild(resultElement);
    lucide.createIcons();

    // Add animation
    resultElement.style.opacity = '0';
    resultElement.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
        resultElement.style.transition = 'all 0.3s ease';
        resultElement.style.opacity = '1';
        resultElement.style.transform = 'translateY(0)';
    });
}



// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !mobileMenuButton.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// Initialize page with smooth fade-in effect
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.main-content');
    mainContent.style.opacity = '0';
    
    requestAnimationFrame(() => {
        mainContent.style.transition = 'opacity 0.5s ease';
        mainContent.style.opacity = '1';
    });
});