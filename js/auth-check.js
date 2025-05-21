// auth-check.js - Add this to all protected pages
document.addEventListener('DOMContentLoaded', function() {
    // Define protected pages that require authentication
    const protectedPages = [
      'dashboard.html',
      'tool-dashboard.html',
      'reports.html',
      'user-cyber-laws.html',
      'profile.html',
      'phishing-detection.html',
      'social-engineering.html',
      'wifi-security.html',
      'passord-checker.html',
      'privacy-analyzer.html',
      'malware.html',
      'image-metadata.html',
      'report-history.html',
      'report-statistics.html',
    ];
    
    // Check if current page is protected
    const currentPage = window.location.pathname.split('/').pop();
    const isProtectedPage = protectedPages.includes(currentPage);
    
    if (isProtectedPage) {
      // Function to verify if user is authenticated
      const checkAuth = async () => {
        // Check for Supabase session
        const supabase = window.supabase.createClient(
          'https://arhsghqcdocpquqkzxwh.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyaHNnaHFjZG9jcHF1cWt6eHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDU4NTUsImV4cCI6MjA2MTA4MTg1NX0.J80PQNykHjA5zAtffWDx0TRjd98fIX0cP_bzHFa5CK8'
        );
  
        try {
          // Get session from Supabase
          const { data, error } = await supabase.auth.getSession();
          
          if (error || !data.session) {
            // No valid session found
            console.log('No valid session found, redirecting to login');
            window.location.href = 'login.html';
            return false;
          }
          
          // Session exists, user is authenticated
          console.log('User authenticated:', data.session.user.email);
          return true;
        } catch (err) {
          console.error('Auth check error:', err);
          window.location.href = 'login.html';
          return false;
        }
      };
  
      // Perform authentication check
      checkAuth();
    }
  });