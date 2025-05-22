// auth-check.js - Add this to all protected pages
document.addEventListener('DOMContentLoaded', function() {
    // Define protected pages that require authentication
    const protectedPages = [
      'police-dashboard',
      'police-tool-dashboard',
      'case-management',
      'cyber-laws.html',
      'police-profile.html',
      'file-hash-generator',
      'file-metadata-analyzer',
      'file-type-validator',
      'metadata',
      'url-status-checker',
      'user-ip-display',
      'username-lookup',
      'police-dashboard.html',
      'police-tool-dashboard.html',
      'case-management.html',
      'cyber-laws.html',
      'police-profile.html',
      'file-hash-generator.html',
      'file-metadata-analyzer.html',
      'file-type-validator.html',
      'metadata.html',
      'url-status-checker.html',
      'user-ip-display.html',
      'username-lookup.html'
    ];
    
    // Check if current page is protected
    const currentPage = window.location.pathname.split('/').pop();
    const isProtectedPage = protectedPages.includes(currentPage);
    
    if (isProtectedPage) {
      // Check for police_userid in localStorage
      const policeUserId = localStorage.getItem('police_userid');
      if (!policeUserId) {
        // Not logged in, redirect to police login page
        window.location.href = 'police-login.html';
      }
      // else, user is authenticated, allow access
    }
  });
