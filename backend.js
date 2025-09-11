// Medimate Backend API Integration
// Real API calls to the Express.js server

class MedimateAPI {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('medimate_token') || null;
        this.userLocation = null;
        
        // Initialize location services
        this.initializeLocation();
        
        console.log('✅ MedimateAPI initialized with real backend connection');
    }

    // ===========================================
    // UTILITY METHODS
    // ===========================================

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            },
            ...options
        };

        try {
            console.log(`📡 Making API request to: ${url}`);
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('❌ API Request failed:', error);
            throw error;
        }
    }

    async initializeLocation() {
        try {
            const position = await this.getCurrentPosition();
            this.userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            console.log('📍 User location obtained:', this.userLocation);
        } catch (error) {
            console.warn('⚠️ Could not get user location:', error.message);
            // Default to Nabha coordinates
            this.userLocation = {
                latitude: 30.3746,
                longitude: 76.1437
            };
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                { timeout: 10000, enableHighAccuracy: true }
            );
        });
    }

    // ===========================================
    // AUTHENTICATION METHODS
    // ===========================================

    async login(email, phone) {
        try {
            const response = await this.makeRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, phone })
            });

            if (response.success) {
                this.token = response.token;
                localStorage.setItem('medimate_token', this.token);
                localStorage.setItem('medimate_user', JSON.stringify(response.user));
                return response;
            }
        } catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('medimate_token');
        localStorage.removeItem('medimate_user');
        console.log('👋 User logged out');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('medimate_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // ===========================================
    // LOCATION-BASED SERVICES
    // ===========================================

    async findNearbyHospitals(radius = 50, limit = 10) {
        if (!this.userLocation) {
            throw new Error('Location not available');
        }

        try {
            const response = await this.makeRequest(
                `/hospitals/nearby?lat=${this.userLocation.latitude}&lon=${this.userLocation.longitude}&radius=${radius}&limit=${limit}`
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to find hospitals: ${error.message}`);
        }
    }

    async findNearbyPharmacies(radius = 25, limit = 10) {
        if (!this.userLocation) {
            throw new Error('Location not available');
        }

        try {
            const response = await this.makeRequest(
                `/pharmacies/nearby?lat=${this.userLocation.latitude}&lon=${this.userLocation.longitude}&radius=${radius}&limit=${limit}`
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to find pharmacies: ${error.message}`);
        }
    }

    async findNearbyHealthWorkers(radius = 30, limit = 5) {
        if (!this.userLocation) {
            throw new Error('Location not available');
        }

        try {
            const response = await this.makeRequest(
                `/healthworkers/nearby?lat=${this.userLocation.latitude}&lon=${this.userLocation.longitude}&radius=${radius}&limit=${limit}`
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to find health workers: ${error.message}`);
        }
    }

    async searchHealthcareFacilities(query, type = 'all') {
        const params = new URLSearchParams({ query, type });
        if (this.userLocation) {
            params.append('lat', this.userLocation.latitude);
            params.append('lon', this.userLocation.longitude);
        }

        try {
            const response = await this.makeRequest(`/search/facilities?${params}`);
            return response;
        } catch (error) {
            throw new Error(`Search failed: ${error.message}`);
        }
    }

    async getEmergencyServices() {
        try {
            const response = await this.makeRequest('/emergency/services');
            return response;
        } catch (error) {
            throw new Error(`Failed to get emergency services: ${error.message}`);
        }
    }

    // ===========================================
    // DISEASE ALERTS & MONITORING
    // ===========================================

    async getActiveAlerts() {
        try {
            const response = await this.makeRequest('/alerts/active');
            return response;
        } catch (error) {
            throw new Error(`Failed to get alerts: ${error.message}`);
        }
    }

    async getCurrentSeasonalDiseases(season = null) {
        const params = season ? `?season=${season}` : '';
        try {
            const response = await this.makeRequest(`/diseases/seasonal${params}`);
            return response;
        } catch (error) {
            throw new Error(`Failed to get seasonal diseases: ${error.message}`);
        }
    }

    async subscribeToAlerts(preferences) {
        try {
            const response = await this.makeRequest('/alerts/subscribe', {
                method: 'POST',
                body: JSON.stringify({ preferences })
            });
            return response;
        } catch (error) {
            throw new Error(`Failed to subscribe: ${error.message}`);
        }
    }

    async getPreventiveGuidelines(type) {
        try {
            const response = await this.makeRequest(`/guidelines/${type}`);
            return response;
        } catch (error) {
            throw new Error(`Failed to get guidelines: ${error.message}`);
        }
    }

    // ===========================================
    // USER PROFILE MANAGEMENT
    // ===========================================

    async getUserProfile() {
        try {
            const response = await this.makeRequest('/user/profile');
            return response;
        } catch (error) {
            throw new Error(`Failed to get profile: ${error.message}`);
        }
    }

    async updateUserProfile(profileData) {
        try {
            const response = await this.makeRequest('/user/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
            return response;
        } catch (error) {
            throw new Error(`Failed to update profile: ${error.message}`);
        }
    }

    // ===========================================
    // MEDICAL RECORDS
    // ===========================================

    async getMedicalRecords() {
        try {
            const response = await this.makeRequest('/user/records');
            return response;
        } catch (error) {
            throw new Error(`Failed to get medical records: ${error.message}`);
        }
    }

    async addMedicalRecord(recordData) {
        try {
            const response = await this.makeRequest('/user/records', {
                method: 'POST',
                body: JSON.stringify(recordData)
            });
            return response;
        } catch (error) {
            throw new Error(`Failed to add medical record: ${error.message}`);
        }
    }

    // ===========================================
    // OFFLINE FUNCTIONALITY
    // ===========================================

    async syncOfflineData() {
        console.log('🔄 Syncing offline data...');
        // In a real implementation, this would sync cached data with the server
        return { success: true, message: 'Sync completed' };
    }

    isOnline() {
        return navigator.onLine;
    }

    // ===========================================
    // HEALTH CHECK
    // ===========================================

    async healthCheck() {
        try {
            const response = await this.makeRequest('/health');
            console.log('💚 Backend health check passed:', response);
            return response;
        } catch (error) {
            console.error('❤️ Backend health check failed:', error);
            throw error;
        }
    }
}

// Initialize the global API instance
window.MedimateAPI = new MedimateAPI();

// Service-specific interfaces for backward compatibility
window.MedimateAPI.locationServices = {
    async findNearbyHospitals(radius, limit) {
        return window.MedimateAPI.findNearbyHospitals(radius, limit);
    },
    async findNearbyPharmacies(radius, limit) {
        return window.MedimateAPI.findNearbyPharmacies(radius, limit);
    },
    async findNearbyHealthWorkers(radius, limit) {
        return window.MedimateAPI.findNearbyHealthWorkers(radius, limit);
    },
    searchHealthcareFacilities(query, type) {
        return window.MedimateAPI.searchHealthcareFacilities(query, type);
    },
    getEmergencyServices() {
        return window.MedimateAPI.getEmergencyServices();
    }
};

window.MedimateAPI.seasonalDiseases = {
    getActiveAlerts() {
        return window.MedimateAPI.getActiveAlerts();
    },
    getCurrentSeasonalDiseases(season) {
        return window.MedimateAPI.getCurrentSeasonalDiseases(season);
    },
    subscribeToAlerts(preferences) {
        return window.MedimateAPI.subscribeToAlerts(preferences);
    },
    getPreventiveGuidelines(type) {
        return window.MedimateAPI.getPreventiveGuidelines(type);
    }
};

window.MedimateAPI.offline = {
    syncOfflineData() {
        return window.MedimateAPI.syncOfflineData();
    },
    isOnline() {
        return window.MedimateAPI.isOnline();
    }
};

// Auto-check backend health on load
setTimeout(async () => {
    try {
        await window.MedimateAPI.healthCheck();
        showMessage('✅ Connected to Medimate backend server!', 'success');
    } catch (error) {
        showMessage('⚠️ Backend server not running. Please start the server with "npm start"', 'warning');
        console.log('💡 To start the backend server:');
        console.log('1. Open terminal in your project directory');
        console.log('2. Run: npm install');
        console.log('3. Run: npm run init-db');
        console.log('4. Run: npm start');
    }
}, 1000);
