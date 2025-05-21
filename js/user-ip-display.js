// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});

// DOM Elements
const ipInput = document.getElementById('ip-input');
const searchBtn = document.getElementById('search-btn');
const refreshBtn = document.getElementById('refresh-btn');
const copyBtn = document.getElementById('copy-btn');
const ipAddressElement = document.getElementById('ip-address');
const locationElement = document.getElementById('location');
const ispElement = document.getElementById('isp');
const timezoneElement = document.getElementById('timezone');
const mapContainer = document.getElementById('map');

// Map variables
let map;
let marker;
let userIP = '';

// Initialize the application
function initApp() {
    // Create map
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Setup event listeners
    searchBtn.addEventListener('click', searchIP);
    ipInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') searchIP();
    });
    refreshBtn.addEventListener('click', refreshData);
    copyBtn.addEventListener('click', copyIPToClipboard);

    // Get client IP initially
    fetchClientIP();
}

// Fetch client IP on initial load
async function fetchClientIP() {
    setLoading(true);
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        userIP = data.ip;
        ipInput.value = userIP;
        fetchIPDetails(userIP);
    } catch (error) {
        console.error('Error fetching client IP:', error);
        showError('Failed to fetch your IP address. Please enter manually.');
        setLoading(false);
    }
}

// Search IP when button clicked
function searchIP() {
    const ip = ipInput.value.trim();
    if (!ip) {
        showToast('Please enter an IP address', 'alert-circle');
        return;
    }
    
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ip)) {
        showToast('Please enter a valid IPv4 address', 'alert-triangle');
        return;
    }
    
    userIP = ip;
    fetchIPDetails(ip);
}

// Fetch IP details from API
async function fetchIPDetails(ip) {
    setLoading(true);
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        
        if (data.error) {
            showError(`API Error: ${data.reason || 'Unknown error'}`);
            return;
        }
        
        updateUI(data);
        updateMap(data.latitude, data.longitude, data.city);
    } catch (error) {
        console.error('Error fetching IP details:', error);
        showError('Failed to fetch IP details. Please try again later.');
    } finally {
        setLoading(false);
    }
}

// Update UI with IP data
function updateUI(data) {
    ipAddressElement.textContent = data.ip || 'N/A';
    locationElement.textContent = data.city && data.country_name ? 
        `${data.city}, ${data.region || ''}, ${data.country_name}` : 'N/A';
    ispElement.textContent = data.org || 'N/A';
    timezoneElement.textContent = data.timezone || 'N/A';
}

// Update map with location
function updateMap(lat, lng, city) {
    if (!lat || !lng) {
        // If no location data, show world map
        map.setView([0, 0], 2);
        if (marker) map.removeLayer(marker);
        return;
    }
    
    // Update map view to IP location
    map.setView([lat, lng], 10);
    
    // Remove existing marker if any
    if (marker) map.removeLayer(marker);
    
    // Add new marker
    marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`<b>${city || 'Location'}</b><br>Latitude: ${lat}<br>Longitude: ${lng}`).openPopup();
}

// Refresh data
function refreshData() {
    if (userIP) {
        fetchIPDetails(userIP);
        showToast('Data refreshed', 'refresh-cw');
    } else {
        fetchClientIP();
    }
}

// Copy IP to clipboard
function copyIPToClipboard() {
    const ip = ipAddressElement.textContent;
    if (ip && ip !== 'Loading...' && ip !== 'N/A') {
        navigator.clipboard.writeText(ip)
            .then(() => showToast('IP copied to clipboard', 'check'))
            .catch(err => showError('Failed to copy: ' + err));
    } else {
        showToast('No IP address to copy', 'alert-circle');
    }
}

// Show loading state
function setLoading(isLoading) {
    const loadingText = 'Loading...';
    if (isLoading) {
        ipAddressElement.textContent = loadingText;
        locationElement.textContent = loadingText;
        ispElement.textContent = loadingText;
        timezoneElement.textContent = loadingText;
        searchBtn.disabled = true;
    } else {
        searchBtn.disabled = false;
    }
}

// Show error in UI
function showError(message) {
    ipAddressElement.textContent = 'Error';
    locationElement.textContent = message;
    ispElement.textContent = 'N/A';
    timezoneElement.textContent = 'N/A';
    showToast(message, 'alert-circle');
}

// Show toast notification
function showToast(message, icon) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) document.body.removeChild(existingToast);
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i data-lucide="${icon || 'info'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    lucide.createIcons();
    
    // Show the toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);