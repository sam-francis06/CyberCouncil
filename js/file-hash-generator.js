document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const hashResults = document.getElementById('hashResults');
    const progressBar = document.getElementById('progressBar');
    const progressFill = progressBar.querySelector('.progress-fill');
    const progressText = progressBar.querySelector('.progress-text');
    const verifySection = document.getElementById('verifySection');
    const batchSection = document.getElementById('batchSection');
    const exportButton = document.getElementById('exportButton');
    
    let currentMode = 'generate';
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    
    // Initialize Lucide icons
    lucide.createIcons();

    // Mode switching
    document.querySelectorAll('.mode-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.mode-button').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            currentMode = button.dataset.mode;
            
            verifySection.style.display = currentMode === 'verify' ? 'block' : 'none';
            batchSection.style.display = currentMode === 'batch' ? 'block' : 'none';
            hashResults.innerHTML = '';
        });
    });

    // Previous drag and drop code remains unchanged
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
        });
    });

    dropZone.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);

    function handleDrop(e) {
        const files = e.dataTransfer.files;
        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    async function handleFiles(files) {
        hashResults.innerHTML = '';
        const totalFiles = files.length;
        let processedFiles = 0;
        
        progressBar.classList.add('active');
        
        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                showError(`File ${file.name} exceeds maximum size of 100MB`);
                continue;
            }
            
            const fileResult = document.createElement('div');
            fileResult.className = 'hash-result';
            
            fileResult.innerHTML = `
                <h4>
                    <i data-lucide="file"></i>
                    ${file.name}
                    <span class="file-size">(${formatFileSize(file.size)})</span>
                </h4>
            `;
            
            const selectedAlgorithms = getSelectedAlgorithms();
            
            for (const algorithm of selectedAlgorithms) {
                try {
                    updateProgress(processedFiles / totalFiles * 100);
                    const hash = await calculateHash(file, algorithm);
                    
                    if (currentMode === 'verify') {
                        const verifyHash = document.getElementById('verifyHash').value.toLowerCase();
                        const verifyAlgorithm = document.getElementById('verifyAlgorithm').value;
                        
                        if (algorithm === verifyAlgorithm && hash === verifyHash) {
                            fileResult.classList.add('verified');
                            fileResult.innerHTML += `
                                <div class="verification-badge success">Hash Verified ✓</div>
                            `;
                        } else if (algorithm === verifyAlgorithm) {
                            fileResult.classList.add('mismatch');
                            fileResult.innerHTML += `
                                <div class="verification-badge error">Hash Mismatch ✗</div>
                            `;
                        }
                    }
                    
                    const hashDiv = document.createElement('div');
                    hashDiv.className = 'hash-value';
                    hashDiv.innerHTML = `
                        <span>${algorithm}: ${hash}</span>
                        <button class="copy-button" onclick="copyToClipboard('${hash}', this)">
                            <i data-lucide="copy"></i>
                        </button>
                    `;
                    fileResult.appendChild(hashDiv);
                } catch (error) {
                    console.error(`Error calculating ${algorithm} hash:`, error);
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'hash-value error';
                    errorDiv.innerHTML = `
                        <span>${algorithm}: Failed to calculate hash</span>
                    `;
                    fileResult.appendChild(errorDiv);
                }
            }
            
            hashResults.appendChild(fileResult);
            lucide.createIcons();
            processedFiles++;
        }
        
        updateProgress(100);
        setTimeout(() => {
            progressBar.classList.remove('active');
            progressFill.style.width = '0%';
        }, 1000);
    }

    function getSelectedAlgorithms() {
        return Array.from(document.querySelectorAll('.algorithm-toggle input:checked'))
            .map(input => {
                switch (input.value) {
                    case 'sha1': return 'SHA-1';
                    case 'sha256': return 'SHA-256';
                    case 'sha512': return 'SHA-512';
                    default: return null;
                }
            })
            .filter(algorithm => algorithm !== null);
    }

    async function calculateHash(file, algorithm) {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    function updateProgress(percent) {
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `${Math.round(percent)}%`;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'hash-result error';
        errorDiv.innerHTML = `
            <div class="verification-badge error">${message}</div>
        `;
        hashResults.appendChild(errorDiv);
    }

    // Export functionality
    exportButton.addEventListener('click', () => {
        const results = [];
        document.querySelectorAll('.hash-result').forEach(result => {
            const fileName = result.querySelector('h4').textContent.trim();
            const hashes = {};
            result.querySelectorAll('.hash-value:not(.error)').forEach(hashDiv => {
                const [algorithm, hash] = hashDiv.querySelector('span').textContent.split(': ');
                hashes[algorithm] = hash;
            });
            results.push({ fileName, ...hashes });
        });

        if (results.length === 0) {
            showError('No results to export');
            return;
        }

        const csv = convertToCSV(results);
        downloadCSV(csv, 'hash_results.csv');
    });

    function convertToCSV(results) {
        const headers = ['File Name', 'SHA-1', 'SHA-256', 'SHA-512'];
        const rows = results.map(result => [
            result.fileName,
            result['SHA-1'] || '',
            result['SHA-256'] || '',
            result['SHA-512'] || ''
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    function downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
});

async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        const icon = button.querySelector('i');
        icon.setAttribute('data-lucide', 'check');
        lucide.createIcons();
        
        setTimeout(() => {
            icon.setAttribute('data-lucide', 'copy');
            lucide.createIcons();
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}