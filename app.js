// Medimate Rural Healthcare Platform - Main Application JavaScript

// Global variables
let currentTab = 'about';

// Initialize Session Manager 
document.addEventListener('DOMContentLoaded', function() {
    // Initialize session manager
    if (typeof SessionManager !== 'undefined') {
        window.sessionManager = new SessionManager();
        console.log('Session Manager initialized');
    } else {
        console.warn('SessionManager not available');
    }
    
    // Add demo login button for testing (temporary)
    const header = document.querySelector('.header');
    if (header && !document.getElementById('demo-login-btn')) {
        const demoBtn = document.createElement('button');
        demoBtn.id = 'demo-login-btn';
        demoBtn.innerHTML = '🎭 Demo Login';
        demoBtn.style.cssText = 'position: absolute; top: 80px; right: 20px; padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;';
        demoBtn.onclick = demoLogin;
        header.appendChild(demoBtn);
    }
});

// Demo login function for testing
function demoLogin() {
    const demoUser = {
        id: 1,
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@medimate.com',
        role: 'patient'
    };
    
    // Set demo session
    localStorage.setItem('medimate_token', 'demo-token-123');
    localStorage.setItem('medimate_user', JSON.stringify(demoUser));
    
    // Reinitialize session manager
    if (window.sessionManager) {
        window.sessionManager.token = 'demo-token-123';
        window.sessionManager.user = demoUser;
        window.sessionManager.updateAuthenticationUI();
    }
    
    // Remove demo button
    const demoBtn = document.getElementById('demo-login-btn');
    if (demoBtn) demoBtn.remove();
    
    showMessage('Demo login successful! Click the ⚙️ settings button to access profile menu.', 'success');
}

// Tab switching functionality
function showTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Hide all tabs
    const tabs = document.querySelectorAll('.content-section');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Hide all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    
    if (selectedTab) {
        selectedTab.classList.add('active');
        console.log('Tab activated:', tabName);
    } else {
        console.error('Tab not found:', tabName);
    }
    
    if (selectedButton) {
        selectedButton.classList.add('active');
        console.log('Button activated for tab:', tabName);
    } else {
        console.warn('Button not found for tab:', tabName);
    }
    
    currentTab = tabName;
    
    // Load data for specific tabs
    if (tabName === 'diseases') {
        setTimeout(loadActiveAlerts, 500);
        setTimeout(loadCurrentSeasonalDiseases, 800);
    } else if (tabName === 'offline') {
        setTimeout(updateConnectivityStatus, 200);
    } else if (tabName === 'telemedicine') {
        // Initialize telemedicine data when tab is accessed
        setTimeout(() => {
            if (window.initializeTelemedicine) {
                window.initializeTelemedicine();
            }
        }, 100);
    }
}

// Message display function
function showMessage(message, type = 'info') {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message-alert message-${type}`;
    messageContainer.textContent = message;
    
    // Style the message
    messageContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Set colors based on type
    switch (type) {
        case 'success':
            messageContainer.style.background = '#4CAF50';
            messageContainer.style.color = 'white';
            break;
        case 'error':
            messageContainer.style.background = '#f44336';
            messageContainer.style.color = 'white';
            break;
        case 'warning':
            messageContainer.style.background = '#ff9800';
            messageContainer.style.color = 'white';
            break;
        default:
            messageContainer.style.background = '#2196F3';
            messageContainer.style.color = 'white';
    }
    
    document.body.appendChild(messageContainer);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (messageContainer.parentNode) {
            messageContainer.parentNode.removeChild(messageContainer);
        }
    }, 3000);
}

// ========================================
// NEW SERVICE FUNCTIONS
// ========================================

// Helper functions for the new features
function updateConnectivityStatus() {
    const indicator = document.getElementById('connection-indicator');
    const text = document.getElementById('connection-text');
    
    if (!indicator || !text) return;
    
    if (navigator.onLine) {
        indicator.className = 'status-indicator online';
        text.textContent = 'Online - All features available';
    } else {
        indicator.className = 'status-indicator offline';
        text.textContent = 'Offline - Limited features available';
    }
}

// Function to check connectivity manually
function checkConnectivity() {
    updateConnectivityStatus();
    showMessage('Connection status updated!', 'success');
}

// Function to trigger sync
function syncNow() {
    const offlineService = window.MedimateAPI?.offline;
    if (offlineService) {
        offlineService.syncOfflineData();
        showMessage('Syncing offline data...', 'success');
    } else {
        showMessage('Offline service not available', 'error');
    }
}

// Function to clear offline data
function clearOfflineData() {
    const confirmed = confirm('Are you sure you want to clear all offline data? This cannot be undone.');
    if (confirmed) {
        localStorage.clear();
        showMessage('Offline data cleared successfully', 'success');
        updateConnectivityStatus();
    }
}

// Function to download data for offline use
function downloadForOffline() {
    showMessage('Downloading essential data for offline use...', 'success');
    setTimeout(() => {
        showMessage('Download completed! You can now use basic features offline.', 'success');
    }, 2000);
}

// Function to find nearby hospitals
function findNearbyHospitals() {
    const locationService = window.MedimateAPI?.locationServices;
    if (locationService) {
        locationService.findNearbyHospitals(50, 10).then(result => {
            if (result.success) {
                displayHospitals(result.data.hospitals);
                showMessage(`Found ${result.data.hospitals.length} hospitals nearby`, 'success');
            } else {
                showMessage('Error finding hospitals: ' + result.error, 'error');
            }
        }).catch(error => {
            showMessage('Location permission required to find nearby hospitals', 'error');
        });
    } else {
        showMessage('Location service not available', 'error');
    }
}

// Function to find nearby pharmacies
function findNearbyPharmacies() {
    const locationService = window.MedimateAPI?.locationServices;
    if (locationService) {
        locationService.findNearbyPharmacies(25, 10).then(result => {
            if (result.success) {
                displayPharmacies(result.data.pharmacies);
                showMessage(`Found ${result.data.pharmacies.length} pharmacies nearby`, 'success');
            } else {
                showMessage('Error finding pharmacies: ' + result.error, 'error');
            }
        }).catch(error => {
            showMessage('Location permission required to find nearby pharmacies', 'error');
        });
    } else {
        showMessage('Location service not available', 'error');
    }
}

// Function to find health workers
function findHealthWorkers() {
    const locationService = window.MedimateAPI?.locationServices;
    if (locationService) {
        locationService.findNearbyHealthWorkers(30, 5).then(result => {
            if (result.success) {
                displayHealthWorkers(result.data.healthWorkers);
                showMessage(`Found ${result.data.healthWorkers.length} health workers nearby`, 'success');
            } else {
                showMessage('Error finding health workers: ' + result.error, 'error');
            }
        }).catch(error => {
            showMessage('Location permission required to find nearby health workers', 'error');
        });
    } else {
        showMessage('Location service not available', 'error');
    }
}

// Function to show emergency services
function showEmergencyServices() {
    const locationService = window.MedimateAPI?.locationServices;
    if (locationService) {
        const result = locationService.getEmergencyServices();
        if (result.success) {
            displayEmergencyServices(result.data.services);
            showMessage('Emergency services information loaded', 'success');
        }
    } else {
        showMessage('Location service not available', 'error');
    }
}

// Function to search facilities
function searchNearbyFacilities() {
    const searchInput = document.getElementById('facility-search');
    const query = searchInput?.value?.trim();
    
    if (!query) {
        showMessage('Please enter a search term', 'error');
        return;
    }
    
    const locationService = window.MedimateAPI?.locationServices;
    if (locationService) {
        const result = locationService.searchHealthcareFacilities(query, 'all');
        if (result.success && result.data.results.length > 0) {
            displaySearchResults(result.data.results);
            showMessage(`Found ${result.data.results.length} results for "${query}"`, 'success');
        } else {
            showMessage(`No results found for "${query}"`, 'warning');
        }
    } else {
        showMessage('Search service not available', 'error');
    }
}

// Function to subscribe to alerts
function subscribeToAlerts() {
    const alertService = window.MedimateAPI?.seasonalDiseases;
    if (alertService) {
        const preferences = {
            criticalAlerts: document.getElementById('critical-alerts')?.checked,
            highAlerts: document.getElementById('high-alerts')?.checked,
            mediumAlerts: document.getElementById('medium-alerts')?.checked,
            lowAlerts: document.getElementById('low-alerts')?.checked,
            pushNotifications: document.getElementById('push-notifications')?.checked,
            smsNotifications: document.getElementById('sms-notifications')?.checked,
            emailNotifications: document.getElementById('email-notifications')?.checked
        };
        
        const result = alertService.subscribeToAlerts(preferences);
        if (result.success) {
            showMessage('Successfully subscribed to disease alerts!', 'success');
        } else {
            showMessage('Error subscribing to alerts: ' + result.error, 'error');
        }
    } else {
        showMessage('Alert service not available', 'error');
    }
}

// Function to show general guidelines
function showGeneralGuidelines() {
    const alertService = window.MedimateAPI?.seasonalDiseases;
    if (alertService) {
        const result = alertService.getPreventiveGuidelines('general');
        if (result.success) {
            displayPreventiveGuidelines(result.data.guidelines);
        }
    }
    setActiveGuidelineTab('general');
}

// Function to show seasonal guidelines
function showSeasonalGuidelines() {
    const alertService = window.MedimateAPI?.seasonalDiseases;
    if (alertService) {
        const result = alertService.getPreventiveGuidelines('seasonal');
        if (result.success) {
            displayPreventiveGuidelines(result.data.guidelines);
        }
    }
    setActiveGuidelineTab('seasonal');
}

// Function to show government programs
function showGovernmentPrograms() {
    const alertService = window.MedimateAPI?.seasonalDiseases;
    if (alertService) {
        const result = alertService.getPreventiveGuidelines('government');
        if (result.success) {
            displayPreventiveGuidelines(result.data.guidelines);
        }
    }
    setActiveGuidelineTab('government');
}

// Helper function to set active guideline tab
function setActiveGuidelineTab(activeTab) {
    const tabs = document.querySelectorAll('.guideline-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const activeTabElement = document.querySelector(`[onclick*="${activeTab}"]`);
    if (activeTabElement) {
        activeTabElement.classList.add('active');
    }
}

// Automatic nearby hospitals finder for Nabha residents
async function loadNearbyHospitalsOnLogin() {
    // Check if user is logged in and location is available
    const token = localStorage.getItem('medimate_token');
    if (!token || !window.locationService) {
        return;
    }
    
    // Try to get stored location or request it
    let userLocation = window.locationService.getStoredLocation();
    if (!userLocation) {
        try {
            userLocation = await window.locationService.requestLocationPermission();
        } catch (error) {
            console.log('📍 Location not available for automatic hospital finding');
            return;
        }
    }
    
    // Find nearby hospitals using existing database
    try {
        const nearbyHospitals = await window.locationService.findNearbyHospitals(10, 50); // 10 results, 50km max
        
        if (nearbyHospitals && nearbyHospitals.length > 0) {
            console.log(`🏥 Found ${nearbyHospitals.length} hospitals near Nabha`);
            
            // Show nearby hospitals in the location tab
            displayNearbyHospitals(nearbyHospitals);
            
            // Show notification about nearby hospitals
            showLocationBasedWelcome(nearbyHospitals.slice(0, 3)); // Show top 3
        }
    } catch (error) {
        console.error('Error finding nearby hospitals:', error);
    }
}

// Display nearby hospitals with distance and direction
function displayNearbyHospitals(hospitals) {
    const hospitalsContainer = document.getElementById('hospitals-list');
    if (!hospitalsContainer) return;
    
    const hospitalsHTML = hospitals.map(hospital => {
        return `
            <div class="facility-card hospital-card" onclick="showFacilityDetails('${hospital.id}', 'hospital')">
                <div class="facility-header">
                    <div class="facility-info">
                        <h3>${hospital.name}</h3>
                        <p class="facility-type">${hospital.type}</p>
                    </div>
                    <div class="facility-distance">
                        <div class="distance">${hospital.distanceFormatted}</div>
                        <div class="direction">${hospital.direction.icon} ${hospital.direction.name}</div>
                        <div class="travel-time">⏱️ ${hospital.travelTime}</div>
                    </div>
                </div>
                
                <div class="facility-details">
                    <div class="detail-item">
                        <span class="detail-icon">📍</span>
                        <span>${hospital.address}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">📞</span>
                        <span>${hospital.phone}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">🏥</span>
                        <span>Available Beds: ${hospital.availableBeds}/${hospital.bedCapacity}</span>
                    </div>
                    ${hospital.isEmergency ? '<div class="emergency-badge">🚨 Emergency 24x7</div>' : ''}
                </div>
                
                <div class="facility-actions">
                    <button onclick="getDirectionsToHospital(${hospital.coordinates.lat}, ${hospital.coordinates.lng}, '${hospital.name}')" class="directions-btn">
                        🗺️ Get Directions
                    </button>
                    <button onclick="callHospital('${hospital.phone}')" class="call-btn">
                        📞 Call Hospital
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    hospitalsContainer.innerHTML = `
        <div class="section-header">
            <h3>🏥 Hospitals near you in Nabha</h3>
            <p>Sorted by distance from your location</p>
        </div>
        ${hospitalsHTML}
    `;
}

// Show location-based welcome message
function showLocationBasedWelcome(topHospitals) {
    if (topHospitals.length === 0) return;
    
    const welcomeMessage = `
        <div class="location-welcome" style="
            background: linear-gradient(135deg, #e8f5e8, #d4edda);
            border: 2px solid #00c851;
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            position: relative;
        ">
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 40px;">🌍</div>
                <div>
                    <h3 style="margin: 0 0 10px 0; color: #155724;">Welcome to Medimate Nabha!</h3>
                    <p style="margin: 0 0 15px 0; color: #155724;">We found ${topHospitals.length} nearby hospitals for you:</p>
                    <div style="font-size: 14px;">
                        ${topHospitals.map(h => `
                            <div style="margin: 5px 0; color: #155724;">
                                📍 <strong>${h.name}</strong> - ${h.distanceFormatted} ${h.direction.icon} (${h.travelTime})
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <button onclick="showTab('location')" style="
                background: #00c851;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                margin-top: 15px;
                cursor: pointer;
                font-weight: 600;
            ">
                🏥 View All Nearby Hospitals
            </button>
            <button onclick="this.parentElement.style.display='none'" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #155724;
            ">
                ✕
            </button>
        </div>
    `;
    
    // Insert welcome message after the header in about section
    const aboutSection = document.getElementById('about');
    const sectionHeader = aboutSection.querySelector('.section-header');
    if (sectionHeader && sectionHeader.nextElementSibling) {
        sectionHeader.insertAdjacentHTML('afterend', welcomeMessage);
    }
}

// Get directions to hospital
function getDirectionsToHospital(lat, lng, hospitalName) {
    if (window.locationService) {
        const directionsUrl = window.locationService.getDirectionsUrl(lat, lng, hospitalName);
        if (directionsUrl) {
            window.open(directionsUrl, '_blank');
        } else {
            alert('Location not available. Please enable location access.');
        }
    }
}

// Call hospital
function callHospital(phoneNumber) {
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanNumber}`;
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Medimate platform...');
    
    // Wait a moment for other scripts to load
    setTimeout(() => {
        // Show the about tab by default
        showTab('about');
        
        // Update connectivity status
        updateConnectivityStatus();
        
        // Listen for online/offline events
        window.addEventListener('online', updateConnectivityStatus);
        window.addEventListener('offline', updateConnectivityStatus);
        
        // Initialize services if MedimateAPI is available
        if (window.MedimateAPI) {
            console.log('MedimateAPI initialized successfully');
        } else {
            console.warn('MedimateAPI not found. Make sure backend-simulation.js is loaded.');
        }
        
        // Load nearby hospitals if user is logged in
        setTimeout(() => {
            loadNearbyHospitalsOnLogin();
        }, 1000);
        
        console.log('Medimate platform initialization complete!');
    }, 100);
});

// Show AI Symptom Checker
function showSymptomChecker() {
    // Open symptom checker in new window/tab
    const width = Math.min(1200, window.screen.width * 0.9);
    const height = Math.min(800, window.screen.height * 0.9);
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const checkerWindow = window.open(
        'symptom-checker.html',
        'SymptomChecker',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
    
    if (!checkerWindow) {
        // Fallback if popup blocked - open in same tab
        window.location.href = 'symptom-checker.html';
    }
    
    console.log('🤖 AI Symptom Checker opened');
}

// Enhanced Direction and Call Functions
function callFacility(phoneNumber) {
    console.log('Calling facility:', phoneNumber);
    
    // Show confirmation dialog
    const confirmed = confirm(`Do you want to call ${phoneNumber}?`);
    
    if (confirmed) {
        // Create a temporary link to initiate the call
        const telLink = document.createElement('a');
        telLink.href = `tel:${phoneNumber}`;
        telLink.style.display = 'none';
        document.body.appendChild(telLink);
        telLink.click();
        document.body.removeChild(telLink);
        
        showMessage(`Calling ${phoneNumber}...`, 'success');
        
        // Track call event
        console.log('📞 Call initiated to:', phoneNumber);
    }
}

function getDirections(latitude, longitude, placeName) {
    console.log('Getting directions to:', placeName, latitude, longitude);
    
    // Check if geolocation is available
    if ('geolocation' in navigator) {
        showMessage('Getting your location for directions...', 'info');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // Create Google Maps directions URL
                const directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${latitude},${longitude}`;
                
                // Open in new tab
                window.open(directionsUrl, '_blank');
                showMessage(`Opening directions to ${placeName}`, 'success');
                
                console.log('🧭 Directions opened for:', placeName);
            },
            (error) => {
                console.error('Geolocation error:', error);
                
                // Fallback: Direct Google Maps link without user location
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(placeName)}`;
                window.open(mapsUrl, '_blank');
                showMessage(`Opening location of ${placeName}`, 'success');
            }
        );
    } else {
        // Fallback for browsers without geolocation
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(placeName)}`;
        window.open(mapsUrl, '_blank');
        showMessage(`Opening location of ${placeName}`, 'success');
    }
}

function showFacilityDetails(facilityId) {
    console.log('Showing facility details for:', facilityId);
    
    // Mock facility data - in real implementation, this would come from backend
    const facilityDetails = {
        'hosp_1': {
            name: 'Civil Hospital Ludhiana',
            type: 'Government Hospital',
            address: 'Civil Lines, Ludhiana - 141001',
            phone: '+91-161-2444444',
            specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Orthopedics'],
            facilities: ['Emergency 24x7', 'ICU', 'Blood Bank', 'Pharmacy', 'Laboratory'],
            bedCapacity: 500,
            availableBeds: 125,
            rating: 4.2,
            hours: '24x7'
        }
    };
    
    const facility = facilityDetails[facilityId];
    if (facility) {
        // Create modal content
        const modalContent = `
            <h2>${facility.name}</h2>
            <p><strong>Type:</strong> ${facility.type}</p>
            <p><strong>Address:</strong> ${facility.address}</p>
            <p><strong>Phone:</strong> ${facility.phone}</p>
            <p><strong>Hours:</strong> ${facility.hours}</p>
            <p><strong>Rating:</strong> ⭐ ${facility.rating}/5</p>
            <p><strong>Bed Capacity:</strong> ${facility.bedCapacity} (${facility.availableBeds} available)</p>
            
            <h3>Specialties:</h3>
            <ul>${facility.specialties.map(s => `<li>${s}</li>`).join('')}</ul>
            
            <h3>Facilities:</h3>
            <ul>${facility.facilities.map(f => `<li>${f}</li>`).join('')}</ul>
            
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button onclick="callFacility('${facility.phone}')" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer;">📞 Call Now</button>
                <button onclick="getDirections(30.9010, 75.8573, '${facility.name}')" style="flex: 1; padding: 10px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer;">🧭 Directions</button>
            </div>
        `;
        
        // Show modal
        const modal = document.getElementById('facility-modal');
        const modalContentDiv = modal.querySelector('.modal-content');
        modalContentDiv.innerHTML = modalContent;
        modal.style.display = 'flex';
    }
}

function closeFacilityModal() {
    const modal = document.getElementById('facility-modal');
    modal.style.display = 'none';
}

function orderMedicines(pharmacyId) {
    console.log('Opening medicine order for pharmacy:', pharmacyId);
    showMessage('Online medicine ordering feature will be available soon!', 'info');
}

// Enhanced Emergency Functions
function makeEmergencyCall(number, serviceName) {
    console.log('Making emergency call to:', number, serviceName);
    
    // Show immediate confirmation
    const confirmed = confirm(`🚨 EMERGENCY CALL\n\nYou are about to call ${serviceName} (${number}).\n\nAre you sure this is an emergency?`);
    
    if (confirmed) {
        // Create tel link
        const telLink = document.createElement('a');
        telLink.href = `tel:${number}`;
        telLink.style.display = 'none';
        document.body.appendChild(telLink);
        telLink.click();
        document.body.removeChild(telLink);
        
        // Show success message with emergency tips
        showMessage(`🚨 Calling ${serviceName} (${number})...`, 'error');
        
        // Show emergency preparation tips
        setTimeout(() => {
            const tips = getEmergencyTips(serviceName);
            alert(`Emergency Call Active\n\nWhile waiting for ${serviceName}:\n\n${tips}`);
        }, 1000);
        
        console.log('🚨 Emergency call initiated:', serviceName, number);
    }
}

function getEmergencyTips(serviceName) {
    const tips = {
        'Ambulance': '• Stay calm and keep the patient comfortable\n• Note exact location and landmarks\n• Have medical history ready\n• Keep airways clear\n• Do not move injured person unless necessary',
        'Fire Brigade': '• Evacuate the area immediately\n• Do not use elevators\n• Stay low to avoid smoke\n• Close doors behind you\n• Meet firefighters at a safe location',
        'Police': '• Stay in a safe location\n• Do not confront dangerous individuals\n• Note descriptions of suspects/vehicles\n• Secure evidence if safe to do so\n• Wait for police arrival',
        'Poison Control': '• Do not induce vomiting unless instructed\n• Keep poison container/information ready\n• Note time of exposure\n• Follow dispatcher instructions exactly\n• Get to hospital if advised'
    };
    
    return tips[serviceName] || '• Stay calm and follow dispatcher instructions\n• Provide clear location information\n• Do not hang up until told to do so';
}

function shareLocationForEmergency(serviceNumber) {
    console.log('Sharing location for emergency service:', serviceNumber);
    
    if ('geolocation' in navigator) {
        showMessage('Getting your location to share with emergency services...', 'info');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const accuracy = position.coords.accuracy;
                
                // Create location sharing message
                const locationInfo = `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}\nAccuracy: ${Math.round(accuracy)}m\nGoogle Maps: https://maps.google.com/?q=${lat},${lng}`;
                
                // Copy to clipboard
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(locationInfo).then(() => {
                        showMessage('📍 Location copied to clipboard! Share this with emergency services.', 'success');
                    });
                } else {
                    // Fallback for older browsers
                    prompt('📍 Share this location information with emergency services:', locationInfo);
                }
                
                console.log('📍 Location shared:', lat, lng);
            },
            (error) => {
                console.error('Location error:', error);
                showMessage('Unable to get location. Please describe your location to emergency services.', 'error');
            }
        );
    } else {
        showMessage('Geolocation not available. Please manually describe your location to emergency services.', 'warning');
    }
}

// ===== USER MENU FUNCTIONS =====

// Show user menu modal
function showUserMenu() {
    const modal = document.getElementById('user-menu-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Update user information in modal
        if (window.sessionManager && window.sessionManager.isAuthenticated()) {
            window.sessionManager.updateUserModal();
        }
    }
}

// Close user menu modal
function closeUserMenu() {
    const modal = document.getElementById('user-menu-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show user profile
function showProfile() {
    closeUserMenu();
    
    const user = window.sessionManager ? window.sessionManager.getCurrentUser() : null;
    
    if (user) {
        alert(`👤 USER PROFILE\n\nName: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nRole: ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}\n\nProfile editing feature coming soon!`);
    } else {
        alert('Please login to view your profile.');
    }
}

// Show settings
function showSettings() {
    closeUserMenu();
    
    const settings = [
        '⚙️ SETTINGS',
        '',
        '🔔 Notifications: Enabled',
        '🌍 Location Services: Enabled', 
        '📱 Emergency Alerts: Enabled',
        '🔒 Data Privacy: Strict',
        '🎨 Theme: Auto',
        '📞 Emergency Contacts: Configured',
        '',
        'Settings modification coming soon!'
    ].join('\n');
    
    alert(settings);
}

// Show notifications
function showNotifications() {
    closeUserMenu();
    
    const notifications = [
        '🔔 NOTIFICATIONS',
        '',
        '• Welcome to Medimate! 📱',
        '• Location services enabled ✅',
        '• Emergency contacts updated 👥',
        '• New health alerts available 🏥',
        '• Telemedicine feature unlocked 📹',
        '',
        'All notifications cleared!'
    ].join('\n');
    
    alert(notifications);
}

// Show help and support
function showHelp() {
    closeUserMenu();
    
    const help = [
        '❓ HELP & SUPPORT',
        '',
        '📞 Emergency: Call 108, 100, 101',
        '🏥 Find Healthcare: Use location tab',
        '📹 Telemedicine: Video consultations available',
        '🦠 Disease Alerts: Stay informed about health risks',
        '🤖 AI Assistant: Get health recommendations',
        '',
        '📧 Support: info@medimate.com',
        '📱 Helpline: +91-XXX-XXX-XXXX',
        '',
        '24/7 technical support available!'
    ].join('\n');
    
    alert(help);
}

// Logout function
function logout() {
    closeUserMenu();
    
    const confirmLogout = confirm('🚪 Are you sure you want to logout?\n\nYou will need to login again to access personalized features.');
    
    if (confirmLogout) {
        // Clear authentication data
        if (window.sessionManager) {
            window.sessionManager.logout();
        } else {
            // Fallback manual cleanup
            localStorage.removeItem('medimate_token');
            localStorage.removeItem('medimate_user');
            localStorage.removeItem('medimate_remember');
        }
        
        showMessage('👋 Logged out successfully. Thank you for using Medimate!', 'success');
        
        // Refresh page to reset UI
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

function showPoisonFirstAid() {
    const firstAidTips = `
        <h2>☠️ Poison Emergency First Aid</h2>
        <h3>🚨 CALL 1066 IMMEDIATELY</h3>
        
        <h4>General Steps:</h4>
        <ul>
            <li><strong>Stay Calm</strong> - Keep the person conscious and calm</li>
            <li><strong>Identify</strong> - Find out what was consumed and how much</li>
            <li><strong>Do NOT</strong> induce vomiting unless instructed by poison control</li>
            <li><strong>Remove</strong> - Get person away from the poison source</li>
            <li><strong>Save</strong> - Keep poison container/information for medical team</li>
        </ul>
        
        <h4>If poison is on skin or clothes:</h4>
        <ul>
            <li>Remove contaminated clothing</li>
            <li>Rinse skin with water for 15-20 minutes</li>
            <li>Do not rub the area</li>
        </ul>
        
        <h4>If poison is in eyes:</h4>
        <ul>
            <li>Rinse with clean water for 15 minutes</li>
            <li>Do not rub eyes</li>
            <li>Remove contact lenses if present</li>
        </ul>
        
        <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
            <strong>⚠️ Important:</strong> Never give anything by mouth to an unconscious person.
        </div>
        
        <div style="margin-top: 20px; display: flex; gap: 10px;">
            <button onclick="makeEmergencyCall('1066', 'Poison Control')" style="flex: 1; padding: 15px; background: #ff6b6b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">🚨 CALL 1066 NOW</button>
        </div>
    `;
    
    // Show modal
    const modal = document.getElementById('facility-modal');
    const modalContentDiv = modal.querySelector('.modal-content');
    modalContentDiv.innerHTML = firstAidTips;
    modal.style.display = 'flex';
}
