// Medimate Integration Examples - Real Data Display Functions
// Updated to work with the actual backend API

// ===========================================
// DISPLAY FUNCTIONS FOR HEALTHCARE FACILITIES
// ===========================================

function displayHospitals(hospitals) {
    const container = document.getElementById('hospitals-list');
    if (!container) return;
    
    container.innerHTML = '<h3>🏥 Nearby Hospitals</h3>';
    
    if (!hospitals || hospitals.length === 0) {
        container.innerHTML += '<p class="no-results">No hospitals found in your area.</p>';
        return;
    }
    
    hospitals.forEach(hospital => {
        const hospitalCard = document.createElement('div');
        hospitalCard.className = 'facility-card';
        hospitalCard.innerHTML = `
            <div class="facility-header">
                <h4>${hospital.name}</h4>
                <div class="facility-tags">
                    <span class="facility-type">${hospital.type}</span>
                    <span class="distance">${hospital.distance ? hospital.distance.toFixed(1) + ' km' : 'Distance unknown'}</span>
                    ${hospital.emergency_services ? '<span class="emergency-tag">⚡ Emergency</span>' : ''}
                </div>
            </div>
            <p><strong>📍 Address:</strong> ${hospital.address}</p>
            <p><strong>📞 Phone:</strong> ${hospital.phone || 'Not available'}</p>
            ${hospital.specialties ? `<p><strong>🏥 Specialties:</strong> ${hospital.specialties}</p>` : ''}
            ${hospital.bed_count ? `<p><strong>🛏️ Beds:</strong> ${hospital.bed_count}</p>` : ''}
            <p><strong>⭐ Rating:</strong> ${hospital.rating || 'Not rated'}/5.0</p>
            <div class="facility-actions">
                <button class="btn-route" onclick="getDirections('${hospital.address}')">🗺️ Get Directions</button>
                <button class="btn-call" onclick="makeCall('${hospital.phone}')">📞 Call</button>
                <button class="btn-book" onclick="bookAppointment(${hospital.id})">📅 Book Appointment</button>
            </div>
        `;
        container.appendChild(hospitalCard);
    });
}

function displayPharmacies(pharmacies) {
    const container = document.getElementById('pharmacies-list');
    if (!container) return;
    
    container.innerHTML = '<h3>💊 Nearby Pharmacies</h3>';
    
    if (!pharmacies || pharmacies.length === 0) {
        container.innerHTML += '<p class="no-results">No pharmacies found in your area.</p>';
        return;
    }
    
    pharmacies.forEach(pharmacy => {
        const pharmacyCard = document.createElement('div');
        pharmacyCard.className = 'facility-card';
        pharmacyCard.innerHTML = `
            <div class="facility-header">
                <h4>${pharmacy.name}</h4>
                <div class="facility-tags">
                    <span class="distance">${pharmacy.distance ? pharmacy.distance.toFixed(1) + ' km' : 'Distance unknown'}</span>
                    ${pharmacy.delivery_available ? '<span class="delivery-tag">🚚 Home Delivery</span>' : ''}
                </div>
            </div>
            <p><strong>📍 Address:</strong> ${pharmacy.address}</p>
            <p><strong>📞 Phone:</strong> ${pharmacy.phone || 'Not available'}</p>
            <p><strong>🕐 Hours:</strong> ${pharmacy.hours || 'Contact for hours'}</p>
            <p><strong>⭐ Rating:</strong> ${pharmacy.rating || 'Not rated'}/5.0</p>
            <div class="facility-actions">
                <button class="btn-route" onclick="getDirections('${pharmacy.address}')">🗺️ Get Directions</button>
                <button class="btn-call" onclick="makeCall('${pharmacy.phone}')">📞 Call</button>
                ${pharmacy.delivery_available ? `<button class="btn-order" onclick="orderMedicine(${pharmacy.id})">🛒 Order Medicine</button>` : ''}
            </div>
        `;
        container.appendChild(pharmacyCard);
    });
}

function displayHealthWorkers(workers) {
    const container = document.getElementById('health-workers-list');
    if (!container) return;
    
    container.innerHTML = '<h3>👩‍⚕️ Nearby Health Workers</h3>';
    
    if (!workers || workers.length === 0) {
        container.innerHTML += '<p class="no-results">No health workers found in your area.</p>';
        return;
    }
    
    workers.forEach(worker => {
        const workerCard = document.createElement('div');
        workerCard.className = 'facility-card';
        workerCard.innerHTML = `
            <div class="facility-header">
                <h4>${worker.name}</h4>
                <div class="facility-tags">
                    <span class="facility-type">${worker.specialization}</span>
                    <span class="distance">${worker.distance ? worker.distance.toFixed(1) + ' km' : 'Distance unknown'}</span>
                </div>
            </div>
            <p><strong>🎓 Qualification:</strong> ${worker.qualification || 'Not specified'}</p>
            <p><strong>📍 Address:</strong> ${worker.address}</p>
            <p><strong>📞 Phone:</strong> ${worker.phone || 'Not available'}</p>
            <p><strong>🕐 Availability:</strong> ${worker.availability || 'Contact for availability'}</p>
            <p><strong>💼 Experience:</strong> ${worker.experience_years || 'Not specified'} years</p>
            <p><strong>⭐ Rating:</strong> ${worker.rating || 'Not rated'}/5.0</p>
            <div class="facility-actions">
                <button class="btn-route" onclick="getDirections('${worker.address}')">🗺️ Get Directions</button>
                <button class="btn-call" onclick="makeCall('${worker.phone}')">📞 Call</button>
                <button class="btn-contact" onclick="contactHealthWorker(${worker.id})">💬 Contact</button>
            </div>
        `;
        container.appendChild(workerCard);
    });
}

function displayEmergencyServices(services) {
    const container = document.getElementById('emergency-services');
    if (!container) return;
    
    container.innerHTML = '<h3>🚨 Emergency Services</h3>';
    
    if (!services || services.length === 0) {
        container.innerHTML += '<p class="no-results">No emergency services information available.</p>';
        return;
    }
    
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'facility-card emergency-service';
        serviceCard.innerHTML = `
            <div class="facility-header">
                <h4>${service.service_name}</h4>
                <div class="facility-tags">
                    ${service.available_24x7 ? '<span class="emergency-tag">24/7</span>' : ''}
                    <span class="response-time">⏱️ ${service.response_time_minutes} min response</span>
                </div>
            </div>
            <p><strong>📞 Emergency Number:</strong> <a href="tel:${service.phone}" class="emergency-phone">${service.phone}</a></p>
            <p><strong>ℹ️ Description:</strong> ${service.description}</p>
            <p><strong>📍 Coverage:</strong> ${service.coverage_area}</p>
            <div class="facility-actions">
                <button class="btn-call emergency-call" onclick="makeEmergencyCall('${service.phone}')">🚨 Call Emergency</button>
            </div>
        `;
        container.appendChild(serviceCard);
    });
}

function displaySearchResults(results) {
    const container = document.getElementById('hospitals-list') || 
                     document.getElementById('pharmacies-list') || 
                     document.getElementById('health-workers-list');
    
    if (!container) return;
    
    container.innerHTML = '<h3>🔍 Search Results</h3>';
    
    if (!results || results.length === 0) {
        container.innerHTML += '<p class="no-results">No results found for your search.</p>';
        return;
    }
    
    results.forEach(result => {
        const resultCard = document.createElement('div');
        resultCard.className = 'facility-card';
        
        let facilityIcon = '🏢';
        if (result.facility_type === 'hospital') facilityIcon = '🏥';
        if (result.facility_type === 'pharmacy') facilityIcon = '💊';
        if (result.facility_type === 'health_worker') facilityIcon = '👩‍⚕️';
        
        resultCard.innerHTML = `
            <div class="facility-header">
                <h4>${facilityIcon} ${result.name}</h4>
                <div class="facility-tags">
                    <span class="facility-type">${result.facility_type.replace('_', ' ')}</span>
                    ${result.distance ? `<span class="distance">${result.distance.toFixed(1)} km</span>` : ''}
                </div>
            </div>
            <p><strong>📍 Address:</strong> ${result.address}</p>
            <p><strong>📞 Phone:</strong> ${result.phone || 'Not available'}</p>
            ${result.specialties ? `<p><strong>🏥 Specialties:</strong> ${result.specialties}</p>` : ''}
            ${result.specialization ? `<p><strong>🎯 Specialization:</strong> ${result.specialization}</p>` : ''}
            <div class="facility-actions">
                <button class="btn-route" onclick="getDirections('${result.address}')">🗺️ Get Directions</button>
                <button class="btn-call" onclick="makeCall('${result.phone}')">📞 Call</button>
            </div>
        `;
        container.appendChild(resultCard);
    });
}

// ===========================================
// DISPLAY FUNCTIONS FOR DISEASE ALERTS
// ===========================================

function displayActiveAlerts(alerts) {
    const container = document.getElementById('active-alerts');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!alerts || alerts.length === 0) {
        container.innerHTML = '<p class="no-results">No active disease alerts at the moment.</p>';
        return;
    }
    
    alerts.forEach(alert => {
        const alertCard = document.createElement('div');
        alertCard.className = `alert-card ${alert.alert_level}`;
        alertCard.innerHTML = `
            <div class="alert-header">
                <h4>${alert.disease_name}</h4>
                <span class="alert-level ${alert.alert_level}">${alert.alert_level.toUpperCase()}</span>
            </div>
            <p><strong>📝 Description:</strong> ${alert.description}</p>
            <p><strong>🤒 Symptoms:</strong> ${alert.symptoms}</p>
            <p><strong>🛡️ Prevention:</strong> ${alert.prevention}</p>
            <p><strong>💊 Treatment:</strong> ${alert.treatment}</p>
            <p><strong>📍 Affected Areas:</strong> ${alert.affected_areas}</p>
            <p><strong>📅 Season:</strong> ${alert.season}</p>
            <div class="alert-actions">
                <button class="btn-call" onclick="consultDoctor()">👩‍⚕️ Consult Doctor</button>
                <button class="btn-route" onclick="findNearbyHospitals()">🏥 Find Hospital</button>
            </div>
        `;
        container.appendChild(alertCard);
    });
}

function displaySeasonalDiseases(diseases) {
    const container = document.getElementById('seasonal-diseases');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!diseases || diseases.length === 0) {
        container.innerHTML = '<p class="no-results">No seasonal disease information available.</p>';
        return;
    }
    
    diseases.forEach(disease => {
        const diseaseCard = document.createElement('div');
        diseaseCard.className = `disease-card ${disease.alert_level}`;
        diseaseCard.innerHTML = `
            <div class="disease-header">
                <h4>${disease.disease_name}</h4>
                <span class="severity ${disease.alert_level}">${disease.alert_level} Risk</span>
            </div>
            <p><strong>📝 Description:</strong> ${disease.description}</p>
            <p><strong>🤒 Symptoms:</strong> ${disease.symptoms}</p>
            <p><strong>🛡️ Prevention:</strong> ${disease.prevention}</p>
            <p><strong>📍 Areas:</strong> ${disease.affected_areas}</p>
            <button class="btn-details" onclick="showDiseaseDetails(${disease.id})">ℹ️ More Details</button>
        `;
        container.appendChild(diseaseCard);
    });
}

function displayPreventiveGuidelines(guidelines) {
    const container = document.getElementById('prevention-guidelines');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!guidelines || guidelines.length === 0) {
        container.innerHTML = '<p class="no-results">No guidelines available.</p>';
        return;
    }
    
    guidelines.forEach(guideline => {
        const guidelineCard = document.createElement('div');
        guidelineCard.className = 'guideline-card';
        guidelineCard.innerHTML = `
            <h4>💡 ${guideline.title}</h4>
            <p>${guideline.description}</p>
        `;
        container.appendChild(guidelineCard);
    });
}

// ===========================================
// ACTION FUNCTIONS
// ===========================================

function getDirections(address) {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
    showMessage(`Opening directions to ${address}`, 'success');
}

function makeCall(phoneNumber) {
    if (phoneNumber && phoneNumber !== 'Not available') {
        window.location.href = `tel:${phoneNumber}`;
        showMessage(`Calling ${phoneNumber}`, 'success');
    } else {
        showMessage('Phone number not available', 'error');
    }
}

function makeEmergencyCall(phoneNumber) {
    const confirmed = confirm(`🚨 EMERGENCY CALL\n\nAre you sure you want to call ${phoneNumber}?\n\nThis will dial emergency services immediately.`);
    if (confirmed) {
        window.location.href = `tel:${phoneNumber}`;
    }
}

function bookAppointment(facilityId) {
    showMessage('Appointment booking feature coming soon!', 'info');
    console.log(`Booking appointment for facility ID: ${facilityId}`);
}

function orderMedicine(pharmacyId) {
    showMessage('Medicine ordering feature coming soon!', 'info');
    console.log(`Ordering medicine from pharmacy ID: ${pharmacyId}`);
}

function contactHealthWorker(workerId) {
    showMessage('Direct messaging feature coming soon!', 'info');
    console.log(`Contacting health worker ID: ${workerId}`);
}

function consultDoctor() {
    showMessage('Online consultation feature coming soon!', 'info');
    // In a real app, this would open a telemedicine interface
}

function showDiseaseDetails(diseaseId) {
    showMessage('Detailed disease information feature coming soon!', 'info');
    console.log(`Showing details for disease ID: ${diseaseId}`);
}

// ===========================================
// INITIALIZATION FUNCTIONS
// ===========================================

function initializeLocationServices() {
    console.log('📍 Location services initialized');
    // Location services are now handled by the MedimateAPI class
    return true;
}

function initializeSeasonalDiseases() {
    console.log('🦠 Seasonal disease monitoring initialized');
    // Load current seasonal diseases on initialization
    loadCurrentSeasonalDiseases();
    return true;
}

function initializeOfflineMode() {
    console.log('📡 Offline mode initialized');
    // Offline functionality is handled by the service worker and MedimateAPI
    return true;
}

async function loadCurrentSeasonalDiseases() {
    try {
        const response = await window.MedimateAPI.getCurrentSeasonalDiseases();
        if (response.success && response.data.diseases) {
            displaySeasonalDiseases(response.data.diseases);
        }
    } catch (error) {
        console.warn('Could not load seasonal diseases:', error.message);
    }
}

async function loadActiveAlerts() {
    try {
        const response = await window.MedimateAPI.getActiveAlerts();
        if (response.success && response.data.alerts) {
            displayActiveAlerts(response.data.alerts);
        }
    } catch (error) {
        console.warn('Could not load active alerts:', error.message);
    }
}

// Helper functions for tab-specific actions
function makeEmergencyCall(phoneNumber) {
    const confirmed = confirm(`🚨 EMERGENCY CALL\n\nAre you sure you want to call ${phoneNumber}?\n\nThis will dial emergency services immediately.`);
    if (confirmed) {
        window.location.href = `tel:${phoneNumber}`;
        showMessage(`Calling emergency service: ${phoneNumber}`, 'success');
    }
}

function closeModal() {
    const modal = document.getElementById('disease-modal');
    if (modal) modal.style.display = 'none';
}

function closeFacilityModal() {
    const modal = document.getElementById('facility-modal');
    if (modal) modal.style.display = 'none';
}

// ===========================================
// GLOBAL INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all services
    initializeLocationServices();
    initializeSeasonalDiseases();
    initializeOfflineMode();
    
    // Load initial data after a short delay to ensure backend is ready
    setTimeout(() => {
        loadActiveAlerts();
    }, 2000);
});

console.log('✅ Integration examples loaded with real data display functions');
