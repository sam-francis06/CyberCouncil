// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  
  // Get DOM elements
  const urlInput = document.getElementById('urlInput');
  const checkButton = document.getElementById('checkButton');
  const bulkUrls = document.getElementById('bulkUrls');
  const bulkCheckButton = document.getElementById('bulkCheckButton');
  const resultsContainer = document.getElementById('resultsContainer');
  const clearResults = document.getElementById('clearResults');
  
  // Add event listeners
  checkButton.addEventListener('click', () => checkSingleUrl());
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkSingleUrl();
  });
  bulkCheckButton.addEventListener('click', () => checkBulkUrls());
  clearResults.addEventListener('click', clearResultsContainer);
  
  // Check single URL function
  async function checkSingleUrl() {
    const url = urlInput.value.trim();
    
    if (!url) {
      showNotification('Please enter a URL', 'error');
      return;
    }
    
    if (!isValidUrl(url)) {
      showNotification('Please enter a valid URL including http:// or https://', 'error');
      return;
    }
    
    // Set button to loading state
    checkButton.classList.add('loading');
    checkButton.disabled = true;
    
    try {
      const result = await checkUrl(url);
      addResultToContainer(result);
      urlInput.value = '';
    } catch (error) {
      console.error('Error checking URL:', error);
      addResultToContainer({
        url: url,
        status: 'Error',
        statusCode: 'N/A',
        responseTime: 0,
        error: error.message
      });
    } finally {
      // Reset button state
      checkButton.classList.remove('loading');
      checkButton.disabled = false;
    }
  }
  
  // Check bulk URLs function
  async function checkBulkUrls() {
    const urls = bulkUrls.value.trim().split('\n').filter(url => url.trim() !== '');
    
    if (urls.length === 0) {
      showNotification('Please enter at least one URL', 'error');
      return;
    }
    
    // Set button to loading state
    bulkCheckButton.classList.add('loading');
    bulkCheckButton.disabled = true;
    
    // Check each URL
    const invalidUrls = [];
    const validUrls = [];
    
    urls.forEach(url => {
      url = url.trim();
      if (isValidUrl(url)) {
        validUrls.push(url);
      } else {
        invalidUrls.push(url);
      }
    });
    
    if (invalidUrls.length > 0) {
      showNotification(`${invalidUrls.length} invalid URL(s) found and will be skipped`, 'warning');
    }
    
    // Process valid URLs
    for (const url of validUrls) {
      // Create placeholder result item
      const placeholderId = `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const placeholderElement = createPlaceholderResult(url, placeholderId);
      resultsContainer.prepend(placeholderElement);
      
      try {
        const result = await checkUrl(url);
        updatePlaceholderResult(placeholderId, result);
      } catch (error) {
        console.error('Error checking URL:', error);
        updatePlaceholderResult(placeholderId, {
          url: url,
          status: 'Error',
          statusCode: 'N/A',
          responseTime: 0,
          error: error.message
        });
      }
    }
    
    // Reset button state and clear input
    bulkCheckButton.classList.remove('loading');
    bulkCheckButton.disabled = false;
    bulkUrls.value = '';
  }
  
  // Function to check URL status using a proxy
  async function checkUrl(url) {
    const startTime = Date.now();
    
    try {
      // Using a proxy service since direct fetch won't work due to CORS
      // In a real implementation, you would use your own backend service
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      let status = 'Unknown';
      let statusCode = 'N/A';
      
      if (response.ok) {
        if (data.status.http_code >= 200 && data.status.http_code < 300) {
          status = 'Online';
          statusCode = data.status.http_code;
        } else if (data.status.http_code >= 300 && data.status.http_code < 400) {
          status = 'Redirect';
          statusCode = data.status.http_code;
        } else if (data.status.http_code >= 400 && data.status.http_code < 500) {
          status = 'Client Error';
          statusCode = data.status.http_code;
        } else if (data.status.http_code >= 500) {
          status = 'Server Error';
          statusCode = data.status.http_code;
        }
      } else {
        status = 'Error';
        statusCode = 'N/A';
      }
      
      return {
        url: url,
        status: status,
        statusCode: statusCode,
        responseTime: responseTime,
        timestamp: new Date().toLocaleString()
      };
    } catch (error) {
      // If the proxy fails, try direct fetch as fallback (might fail due to CORS)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;
        
        return {
          url: url,
          status: 'Online',  // If no-cors request completes, site is likely online
          statusCode: 'N/A', // We can't access status code in no-cors mode
          responseTime: responseTime,
          timestamp: new Date().toLocaleString()
        };
      } catch (directError) {
        // If both methods fail, return error
        throw new Error('Unable to connect to website');
      }
    }
  }
  
  // Create placeholder result item for bulk checking
  function createPlaceholderResult(url, id) {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item checking';
    resultItem.id = id;
    resultItem.innerHTML = `
      <div class="result-info">
        <div class="result-url">${url}</div>
        <div class="response-time">Checking...</div>
      </div>
      <div class="result-status">
        <i data-lucide="loader"></i>
        Checking
      </div>
    `;
    return resultItem;
  }
  
  // Update placeholder with actual result
  function updatePlaceholderResult(id, result) {
    const resultItem = document.getElementById(id);
    if (!resultItem) return;
    
    resultItem.className = 'result-item';
    resultItem.innerHTML = createResultItemContent(result);
    lucide.createIcons({ 
      attrs: { width: '16px', height: '16px' },
      element: resultItem 
    });
  }
  
  // Add result to container
  function addResultToContainer(result) {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    resultItem.innerHTML = createResultItemContent(result);
    resultsContainer.prepend(resultItem);
    
    // Initialize icons in the newly added element
    lucide.createIcons({ 
      attrs: { width: '16px', height: '16px' },
      element: resultItem 
    });
  }
  
  // Create HTML content for result item
  function createResultItemContent(result) {
    let statusClass = 'status-warning';
    let statusIcon = 'alert-triangle';
    
    if (result.status === 'Online') {
      statusClass = 'status-success';
      statusIcon = 'check-circle';
    } else if (result.status === 'Error' || result.status === 'Server Error' || result.status === 'Client Error') {
      statusClass = 'status-error';
      statusIcon = 'x-circle';
    } else if (result.status === 'Redirect') {
      statusClass = 'status-warning';
      statusIcon = 'alert-triangle';
    }
    
    return `
      <div class="result-info">
        <div class="result-url">${result.url}</div>
        <div class="response-time">
          Response time: ${result.responseTime}ms | 
          ${result.timestamp || new Date().toLocaleString()}
        </div>
      </div>
      <div class="result-status ${statusClass}">
        <i data-lucide="${statusIcon}"></i>
        ${result.status} ${result.statusCode !== 'N/A' ? `(${result.statusCode})` : ''}
      </div>
    `;
  }
  
  // Clear results container
  function clearResultsContainer() {
    resultsContainer.innerHTML = '';
  }
  
  // Check if URL is valid
  function isValidUrl(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch (error) {
      return false;
    }
  }
  
  // Show notification (could be integrated with a toast library in a real app)
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i data-lucide="${type === 'error' ? 'alert-circle' : type === 'warning' ? 'alert-triangle' : 'info'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Initialize icon
    lucide.createIcons({ element: notification });
    
    // Show notification with animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Add notification style
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: white;
      border-radius: 8px;
      padding: 12px 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      display: flex;
      align-items: center;
      max-width: 350px;
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    .notification.show {
      transform: translateX(0);
      opacity: 1;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .notification-info {
      border-left: 4px solid var(--primary-color);
    }
    
    .notification-error {
      border-left: 4px solid #ef4444;
    }
    
    .notification-warning {
      border-left: 4px solid #f59e0b;
    }
  `;
  document.head.appendChild(style);
});