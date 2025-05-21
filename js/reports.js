// File upload handling
const fileUpload = document.querySelector('.file-upload');
const fileInput = document.querySelector('#evidence-files');
const uploadPlaceholder = document.querySelector('.upload-placeholder');

fileUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUpload.style.borderColor = 'var(--primary-color)';
    fileUpload.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
});

fileUpload.addEventListener('dragleave', (e) => {
    e.preventDefault();
    fileUpload.style.borderColor = 'var(--border-color)';
    fileUpload.style.backgroundColor = '';
});

fileUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUpload.style.borderColor = 'var(--border-color)';
    fileUpload.style.backgroundColor = '';
    
    const files = e.dataTransfer.files;
    handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    if (files.length > 0) {
        uploadPlaceholder.innerHTML = `
            <i class="ph ph-check-circle"></i>
            <span>${files.length} file(s) selected</span>
        `;
    } else {
        uploadPlaceholder.innerHTML = `
            <i class="ph ph-upload-simple"></i>
            <span>Drop files here or click to upload</span>
        `;
    }
}

// Form submission
const reportForm = document.querySelector('.report-form');

reportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Add loading state to submit button
    const submitButton = reportForm.querySelector('button[type="submit"]');
    const originalContent = submitButton.innerHTML;
    submitButton.innerHTML = `
        <i class="ph ph-circle-notch ph-spin"></i>
        Submitting...
    `;
    submitButton.disabled = true;
    
    // Get form data
    const formData = {
        id: Date.now(),
        type: document.getElementById('incident-type').value,
        date: document.getElementById('incident-date').value,
        description: document.getElementById('incident-description').value,
        urls: document.getElementById('urls').value,
        financialImpact: parseFloat(document.getElementById('financial-impact').value) || 0,
        reportedToAuthorities: document.querySelector('input[name="reported"]:checked')?.value === 'yes',
        submittedAt: new Date().toISOString()
    };

    // Get existing reports or initialize empty array
    const existingReports = JSON.parse(localStorage.getItem('cyberReports') || '[]');
    
    // Add new report
    existingReports.push(formData);
    
    // Save to localStorage
    localStorage.setItem('cyberReports', JSON.stringify(existingReports));
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form and button
        submitButton.innerHTML = `
            <i class="ph ph-check"></i>
            Report Submitted
        `;
        
        setTimeout(() => {
            submitButton.innerHTML = originalContent;
            submitButton.disabled = false;
            reportForm.reset();
            uploadPlaceholder.innerHTML = `
                <i class="ph ph-upload-simple"></i>
                <span>Drop files here or click to upload</span>
            `;
            
            // Redirect to report history
            window.location.href = 'report-history.html';
        }, 2000);
    }, 1500);
});

// Clear form confirmation
const clearButton = document.querySelector('button[type="reset"]');

clearButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (confirm('Are you sure you want to clear the form?')) {
        reportForm.reset();
        uploadPlaceholder.innerHTML = `
            <i class="ph ph-upload-simple"></i>
            <span>Drop files here or click to upload</span>
        `;
    }
});