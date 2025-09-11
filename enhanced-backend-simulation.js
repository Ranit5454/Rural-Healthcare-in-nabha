// Enhanced Backend Simulation for Medimate Platform
// Provides full authentication and healthcare platform functionality without Node.js

class EnhancedMedimateBackend {
    constructor() {
        this.isInitialized = false;
        this.users = new Map();
        this.sessions = new Map();
        this.appointments = new Map();
        this.familyMembers = new Map();
        this.prescriptions = new Map();
        this.chatMessages = new Map();
        this.notifications = new Map();
        this.healthRecords = new Map();
        this.paymentHistory = new Map();
        this.fileUploads = new Map();
        
        // Core healthcare data
        this.hospitals = [];
        this.pharmacies = [];
        this.healthWorkers = [];
        this.diseaseAlerts = [];
        this.emergencyServices = [];
        
        this.initialize();
    }

    // Initialize the backend with sample data
    async initialize() {
        if (this.isInitialized) return;

        console.log('🔄 Initializing Enhanced Medimate Backend...');

        // Initialize users with comprehensive data
        this.initializeUsers();
        
        // Initialize healthcare infrastructure
        this.initializeHealthcareData();
        
        // Initialize sample appointments and records
        this.initializeSampleData();
        
        this.isInitialized = true;
        console.log('✅ Enhanced Backend initialized successfully');
    }

    // Initialize sample users with detailed profiles
    initializeUsers() {
        const users = [
            {
                id: 'user_1',
                firstName: 'Dr. Rajesh',
                lastName: 'Sharma',
                email: 'dr.sharma@medimate.com',
                phone: '+91-98765-43210',
                password: 'password123',
                role: 'doctor',
                accountType: 'doctor',
                specialization: 'General Medicine',
                experience: '15 years',
                qualifications: ['MBBS', 'MD Internal Medicine'],
                licenseNumber: 'DMC12345',
                hospitalAffiliation: 'Civil Hospital Ludhiana',
                consultationFee: 500,
                availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                availableTimeSlots: ['09:00-12:00', '15:00-18:00'],
                languages: ['English', 'Hindi', 'Punjabi'],
                profilePicture: '👨‍⚕️',
                isActive: true,
                isVerified: true,
                location: {
                    city: 'Ludhiana',
                    state: 'Punjab',
                    coordinates: { lat: 30.9010, lng: 75.8573 }
                },
                createdAt: new Date('2024-01-15'),
                lastLogin: new Date()
            },
            {
                id: 'user_2',
                firstName: 'Gurpreet',
                lastName: 'Singh',
                email: 'patient@test.com',
                phone: '+91-98765-12345',
                password: 'password123',
                role: 'patient',
                accountType: 'patient',
                age: 35,
                gender: 'Male',
                bloodGroup: 'B+',
                address: 'Model Town, Ludhiana',
                city: 'Ludhiana',
                pincode: '141002',
                emergencyContact: {
                    name: 'Simran Singh',
                    phone: '+91-98765-67890',
                    relationship: 'Wife'
                },
                medicalHistory: ['Diabetes Type 2', 'Hypertension'],
                allergies: ['Penicillin'],
                currentMedications: ['Metformin 500mg', 'Amlodipine 5mg'],
                preferredLanguage: 'punjabi',
                profilePicture: '👤',
                isActive: true,
                isVerified: true,
                location: {
                    city: 'Ludhiana',
                    state: 'Punjab',
                    coordinates: { lat: 30.8850, lng: 75.8380 }
                },
                createdAt: new Date('2024-02-10'),
                lastLogin: new Date()
            },
            {
                id: 'user_3',
                firstName: 'Sister Maria',
                lastName: 'Kaur',
                email: 'nurse.maria@medimate.com',
                phone: '+91-98765-55555',
                password: 'password123',
                role: 'nurse',
                accountType: 'nurse',
                specialization: 'Community Health',
                experience: '8 years',
                qualifications: ['GNM', 'BSc Nursing'],
                licenseNumber: 'NRC67890',
                workLocation: 'PHC Jagraon',
                languages: ['English', 'Hindi', 'Punjabi'],
                profilePicture: '👩‍⚕️',
                isActive: true,
                isVerified: true,
                location: {
                    city: 'Jagraon',
                    state: 'Punjab',
                    coordinates: { lat: 30.7867, lng: 75.4730 }
                },
                createdAt: new Date('2024-01-20'),
                lastLogin: new Date()
            },
            {
                id: 'user_4',
                firstName: 'Admin',
                lastName: 'Punjab Health',
                email: 'admin@punjabhealth.gov.in',
                phone: '+91-98765-00000',
                password: 'password123',
                role: 'admin',
                accountType: 'admin',
                department: 'Punjab Department of Health',
                designation: 'District Health Officer',
                area: 'Ludhiana District',
                profilePicture: '👨‍💼',
                isActive: true,
                isVerified: true,
                location: {
                    city: 'Ludhiana',
                    state: 'Punjab',
                    coordinates: { lat: 30.9010, lng: 75.8573 }
                },
                createdAt: new Date('2024-01-01'),
                lastLogin: new Date()
            }
        ];

        users.forEach(user => {
            this.users.set(user.email, user);
            if (user.phone) {
                this.users.set(user.phone, user);
            }
        });

        console.log(`📊 Initialized ${users.length} sample users`);
    }

    // Initialize healthcare infrastructure data
    initializeHealthcareData() {
        // Hospitals
        this.hospitals = [
            {
                id: 'hosp_1',
                name: 'Civil Hospital Ludhiana',
                type: 'Government Hospital',
                address: 'Civil Lines, Ludhiana',
                city: 'Ludhiana',
                pincode: '141001',
                phone: '+91-161-2444444',
                email: 'civil.ludhiana@punjabhealth.gov.in',
                website: 'www.civilhospitalludhiana.org',
                coordinates: { lat: 30.9010, lng: 75.8573 },
                specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Orthopedics'],
                facilities: ['Emergency 24x7', 'ICU', 'Blood Bank', 'Pharmacy', 'Laboratory'],
                bedCapacity: 500,
                availableBeds: 125,
                rating: 4.2,
                isEmergency: true,
                operatingHours: '24x7'
            },
            {
                id: 'hosp_2',
                name: 'Apollo Hospital Ludhiana',
                type: 'Private Hospital',
                address: 'Sherpur Chowk, Ludhiana',
                city: 'Ludhiana',
                pincode: '141010',
                phone: '+91-161-5050505',
                email: 'info@apolloludhiana.com',
                website: 'www.apollohospitals.com',
                coordinates: { lat: 30.8850, lng: 75.8380 },
                specialties: ['Cardiology', 'Neurology', 'Oncology', 'Gastroenterology', 'Nephrology'],
                facilities: ['Emergency 24x7', 'ICU', 'NICU', 'Cath Lab', 'MRI', 'CT Scan'],
                bedCapacity: 300,
                availableBeds: 45,
                rating: 4.6,
                isEmergency: true,
                operatingHours: '24x7'
            },
            {
                id: 'hosp_3',
                name: 'PHC Jagraon',
                type: 'Primary Health Center',
                address: 'Main Road, Jagraon',
                city: 'Jagraon',
                pincode: '142026',
                phone: '+91-161-2700100',
                email: 'phc.jagraon@punjabhealth.gov.in',
                coordinates: { lat: 30.7867, lng: 75.4730 },
                specialties: ['General Medicine', 'Maternal Health', 'Child Health', 'Immunization'],
                facilities: ['OPD', 'Minor Surgery', 'Laboratory', 'Pharmacy'],
                bedCapacity: 30,
                availableBeds: 12,
                rating: 3.8,
                isEmergency: false,
                operatingHours: '9:00 AM - 5:00 PM'
            }
        ];

        // Pharmacies
        this.pharmacies = [
            {
                id: 'pharm_1',
                name: 'Apollo Pharmacy',
                address: 'Model Town, Ludhiana',
                city: 'Ludhiana',
                phone: '+91-161-4040404',
                coordinates: { lat: 30.8850, lng: 75.8380 },
                operatingHours: '8:00 AM - 10:00 PM',
                services: ['Prescription Medicines', 'OTC Drugs', 'Health Products', 'Home Delivery'],
                rating: 4.3,
                isOpen24x7: false,
                hasHomeDelivery: true,
                acceptsInsurance: true
            },
            {
                id: 'pharm_2',
                name: 'MedPlus Pharmacy',
                address: 'Civil Lines, Ludhiana',
                city: 'Ludhiana',
                phone: '+91-161-3030303',
                coordinates: { lat: 30.9010, lng: 75.8573 },
                operatingHours: '24x7',
                services: ['Emergency Medicines', 'Prescription Drugs', 'Medical Equipment'],
                rating: 4.1,
                isOpen24x7: true,
                hasHomeDelivery: true,
                acceptsInsurance: true
            }
        ];

        // Health Workers
        this.healthWorkers = [
            {
                id: 'hw_1',
                name: 'ASHA Kuldeep Kaur',
                role: 'ASHA Worker',
                area: 'Ward 15, Ludhiana',
                phone: '+91-98765-11111',
                specialization: 'Maternal Health, Immunization',
                coordinates: { lat: 30.8850, lng: 75.8380 },
                languages: ['Punjabi', 'Hindi'],
                availability: 'Mon-Sat 9AM-6PM'
            },
            {
                id: 'hw_2',
                name: 'ANM Rajwinder Singh',
                role: 'ANM (Auxiliary Nurse Midwife)',
                area: 'Jagraon Block',
                phone: '+91-98765-22222',
                specialization: 'Community Health, Family Planning',
                coordinates: { lat: 30.7867, lng: 75.4730 },
                languages: ['Punjabi', 'Hindi', 'English'],
                availability: 'Mon-Fri 9AM-5PM'
            }
        ];

        // Disease Alerts
        this.diseaseAlerts = [
            {
                id: 'alert_1',
                diseaseName: 'Dengue Fever',
                alertLevel: 'HIGH',
                affectedAreas: ['Ludhiana', 'Jalandhar', 'Patiala'],
                description: 'Rising cases of dengue fever reported in urban areas',
                symptoms: ['High fever', 'Severe headache', 'Joint pain', 'Rash'],
                prevention: [
                    'Remove stagnant water around homes',
                    'Use mosquito repellents',
                    'Wear full sleeve clothes',
                    'Keep surroundings clean'
                ],
                issuedDate: new Date('2024-11-15'),
                expiryDate: new Date('2024-12-15'),
                issuedBy: 'Punjab Department of Health',
                contactInfo: '+91-161-2444444'
            },
            {
                id: 'alert_2',
                diseaseName: 'H1N1 Influenza',
                alertLevel: 'MEDIUM',
                affectedAreas: ['Amritsar', 'Ludhiana'],
                description: 'Seasonal flu cases on the rise, vaccination recommended',
                symptoms: ['Fever', 'Cough', 'Sore throat', 'Body aches'],
                prevention: [
                    'Get vaccinated',
                    'Wash hands frequently',
                    'Avoid crowded places',
                    'Cover mouth while coughing'
                ],
                issuedDate: new Date('2024-11-10'),
                expiryDate: new Date('2024-12-31'),
                issuedBy: 'Punjab Department of Health',
                contactInfo: '+91-161-2444444'
            }
        ];

        // Emergency Services
        this.emergencyServices = [
            {
                id: 'emerg_1',
                serviceName: 'Ambulance Service',
                number: '108',
                type: 'Medical Emergency',
                description: 'Free emergency ambulance service',
                responseTime: '15 minutes',
                coverage: 'Punjab State',
                isAvailable24x7: true
            },
            {
                id: 'emerg_2',
                serviceName: 'Fire Brigade',
                number: '101',
                type: 'Fire Emergency',
                description: 'Fire emergency services',
                responseTime: '10 minutes',
                coverage: 'District Level',
                isAvailable24x7: true
            },
            {
                id: 'emerg_3',
                serviceName: 'Police Emergency',
                number: '100',
                type: 'Security Emergency',
                description: 'Police emergency response',
                responseTime: '12 minutes',
                coverage: 'District Level',
                isAvailable24x7: true
            },
            {
                id: 'emerg_4',
                serviceName: 'Poison Control',
                number: '1066',
                type: 'Poison Emergency',
                description: 'Poison emergency helpline',
                responseTime: '5 minutes',
                coverage: 'National',
                isAvailable24x7: true
            }
        ];

        console.log('🏥 Healthcare infrastructure data initialized');
    }

    // Initialize sample appointments and records
    initializeSampleData() {
        // Sample appointments
        const appointments = [
            {
                id: 'appt_1',
                patientId: 'user_2',
                doctorId: 'user_1',
                appointmentDate: '2024-11-25',
                timeSlot: '10:00 AM',
                status: 'Scheduled',
                type: 'Consultation',
                symptoms: 'Diabetes check-up',
                notes: 'Regular follow-up for diabetes management'
            },
            {
                id: 'appt_2',
                patientId: 'user_2',
                doctorId: 'user_1',
                appointmentDate: '2024-11-20',
                timeSlot: '3:00 PM',
                status: 'Completed',
                type: 'Follow-up',
                symptoms: 'Blood pressure monitoring',
                prescription: 'Continue current medications'
            }
        ];

        appointments.forEach(appt => {
            this.appointments.set(appt.id, appt);
        });

        console.log('📅 Sample appointments initialized');
    }

    // Authentication Methods
    async authenticateUser(email, password) {
        const user = this.users.get(email);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.password !== password) {
            throw new Error('Invalid credentials');
        }

        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }

        // Generate session
        const sessionId = this.generateSessionId();
        const token = this.generateToken(user.id);
        
        const session = {
            sessionId,
            userId: user.id,
            email: user.email,
            token,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            isActive: true
        };

        this.sessions.set(sessionId, session);
        this.sessions.set(token, session);

        return {
            success: true,
            token,
            sessionId,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                accountType: user.accountType,
                profilePicture: user.profilePicture,
                specialization: user.specialization,
                location: user.location
            },
            message: 'Login successful'
        };
    }

    async registerUser(userData) {
        const { email, phone, password, firstName, lastName, role } = userData;

        if (this.users.has(email)) {
            throw new Error('Email already exists');
        }

        if (phone && this.users.has(phone)) {
            throw new Error('Phone number already exists');
        }

        const userId = this.generateUserId();
        const user = {
            id: userId,
            firstName,
            lastName,
            email,
            phone,
            password, // In real app, this would be hashed
            role: role || 'patient',
            accountType: role || 'patient',
            profilePicture: this.getRoleAvatar(role || 'patient'),
            isActive: true,
            isVerified: false,
            location: {
                city: 'Ludhiana',
                state: 'Punjab',
                coordinates: { lat: 30.9010, lng: 75.8573 }
            },
            createdAt: new Date(),
            lastLogin: null
        };

        this.users.set(email, user);
        if (phone) {
            this.users.set(phone, user);
        }

        return {
            success: true,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            message: 'User registered successfully'
        };
    }

    validateToken(token) {
        const session = this.sessions.get(token);
        if (!session) {
            throw new Error('Invalid token');
        }

        if (session.expiresAt < new Date()) {
            this.sessions.delete(token);
            this.sessions.delete(session.sessionId);
            throw new Error('Token expired');
        }

        if (!session.isActive) {
            throw new Error('Session inactive');
        }

        return {
            success: true,
            userId: session.userId,
            email: session.email
        };
    }

    logout(token) {
        const session = this.sessions.get(token);
        if (session) {
            this.sessions.delete(token);
            this.sessions.delete(session.sessionId);
        }
        return { success: true, message: 'Logged out successfully' };
    }

    // Healthcare Data Methods
    getHospitals(filters = {}) {
        let hospitals = [...this.hospitals];

        if (filters.city) {
            hospitals = hospitals.filter(h => h.city.toLowerCase().includes(filters.city.toLowerCase()));
        }

        if (filters.specialty) {
            hospitals = hospitals.filter(h => 
                h.specialties.some(s => s.toLowerCase().includes(filters.specialty.toLowerCase()))
            );
        }

        if (filters.emergency) {
            hospitals = hospitals.filter(h => h.isEmergency);
        }

        // Calculate distances if user location provided
        if (filters.userLocation) {
            hospitals = hospitals.map(h => ({
                ...h,
                distance: this.calculateDistance(
                    filters.userLocation.lat, filters.userLocation.lng,
                    h.coordinates.lat, h.coordinates.lng
                )
            })).sort((a, b) => a.distance - b.distance);
        }

        return {
            success: true,
            data: hospitals,
            count: hospitals.length
        };
    }

    getPharmacies(filters = {}) {
        let pharmacies = [...this.pharmacies];

        if (filters.city) {
            pharmacies = pharmacies.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
        }

        if (filters.is24x7) {
            pharmacies = pharmacies.filter(p => p.isOpen24x7);
        }

        if (filters.homeDelivery) {
            pharmacies = pharmacies.filter(p => p.hasHomeDelivery);
        }

        return {
            success: true,
            data: pharmacies,
            count: pharmacies.length
        };
    }

    getHealthWorkers(filters = {}) {
        let workers = [...this.healthWorkers];

        if (filters.area) {
            workers = workers.filter(w => w.area.toLowerCase().includes(filters.area.toLowerCase()));
        }

        if (filters.role) {
            workers = workers.filter(w => w.role.toLowerCase().includes(filters.role.toLowerCase()));
        }

        return {
            success: true,
            data: workers,
            count: workers.length
        };
    }

    getDiseaseAlerts(filters = {}) {
        let alerts = [...this.diseaseAlerts];

        if (filters.level) {
            alerts = alerts.filter(a => a.alertLevel === filters.level.toUpperCase());
        }

        if (filters.area) {
            alerts = alerts.filter(a => 
                a.affectedAreas.some(area => area.toLowerCase().includes(filters.area.toLowerCase()))
            );
        }

        // Filter out expired alerts
        alerts = alerts.filter(a => new Date(a.expiryDate) > new Date());

        return {
            success: true,
            data: alerts,
            count: alerts.length
        };
    }

    getEmergencyServices() {
        return {
            success: true,
            data: this.emergencyServices,
            count: this.emergencyServices.length
        };
    }

    // User Management Methods
    getUserAppointments(userId) {
        const appointments = Array.from(this.appointments.values())
            .filter(a => a.patientId === userId || a.doctorId === userId);

        return {
            success: true,
            data: appointments,
            count: appointments.length
        };
    }

    bookAppointment(appointmentData) {
        const appointmentId = this.generateAppointmentId();
        const appointment = {
            id: appointmentId,
            ...appointmentData,
            status: 'Scheduled',
            createdAt: new Date()
        };

        this.appointments.set(appointmentId, appointment);

        return {
            success: true,
            appointment,
            message: 'Appointment booked successfully'
        };
    }

    // Utility Methods
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateToken(userId) {
        return 'token_' + userId + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateAppointmentId() {
        return 'appt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getRoleAvatar(role) {
        const avatars = {
            doctor: '👨‍⚕️',
            nurse: '👩‍⚕️',
            patient: '👤',
            admin: '👨‍💼'
        };
        return avatars[role] || '👤';
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Symptom Checker Integration Methods
    analyzeSymptoms(analysisData, userId = null) {
        // Use medical knowledge base for analysis if available
        if (window.medicalKB) {
            const results = window.medicalKB.analyzeSymptomsAI(
                analysisData.symptoms || [],
                analysisData.severities || {},
                analysisData.duration,
                analysisData.ageGroup,
                analysisData.gender,
                analysisData.chronicConditions || []
            );

            // Save assessment if user is logged in
            if (userId) {
                this.saveSymptomAssessmentInternal({
                    userId,
                    symptoms: analysisData.symptoms,
                    severities: analysisData.severities,
                    duration: analysisData.duration,
                    results: results,
                    timestamp: new Date()
                });
            }

            return {
                success: true,
                analysis: results,
                timestamp: new Date().toISOString(),
                userId: userId
            };
        } else {
            throw new Error('Medical knowledge base not available');
        }
    }

    saveSymptomAssessment(assessmentData, userId) {
        return this.saveSymptomAssessmentInternal({
            userId,
            ...assessmentData,
            timestamp: new Date()
        });
    }

    saveSymptomAssessmentInternal(assessment) {
        const assessmentId = this.generateAssessmentId();
        const assessmentWithId = {
            id: assessmentId,
            ...assessment
        };

        if (!this.symptomAssessments) {
            this.symptomAssessments = new Map();
        }

        this.symptomAssessments.set(assessmentId, assessmentWithId);

        // Also store in user's assessment history
        if (!this.userAssessmentHistory) {
            this.userAssessmentHistory = new Map();
        }

        if (!this.userAssessmentHistory.has(assessment.userId)) {
            this.userAssessmentHistory.set(assessment.userId, []);
        }

        this.userAssessmentHistory.get(assessment.userId).push(assessmentWithId);

        return {
            success: true,
            assessmentId,
            message: 'Assessment saved successfully'
        };
    }

    getSymptomHistory(userId) {
        if (!this.userAssessmentHistory) {
            this.userAssessmentHistory = new Map();
        }

        const history = this.userAssessmentHistory.get(userId) || [];

        // Sort by timestamp (newest first)
        const sortedHistory = history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return {
            success: true,
            data: {
                assessments: sortedHistory,
                count: sortedHistory.length
            },
            userId: userId
        };
    }

    generateAssessmentId() {
        return 'assessment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // AI Symptom Checker Methods
    async analyzeSymptoms(symptomData, userId = null) {
        console.log('🤖 Analyzing symptoms:', symptomData);
        
        // Simulate AI analysis with realistic results
        const analysisResult = {
            success: true,
            data: {
                confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
                emergencyAlert: this.checkEmergencySymptoms(symptomData),
                possibleConditions: this.generatePossibleConditions(symptomData),
                recommendations: this.generateRecommendations(symptomData),
                timestamp: new Date().toISOString(),
                userId: userId
            }
        };
        
        // Save to user's assessment history if logged in
        if (userId) {
            this.saveAssessmentToHistory(userId, symptomData, analysisResult.data);
        }
        
        return analysisResult;
    }
    
    checkEmergencySymptoms(symptomData) {
        const emergencySymptoms = [
            'severe-chest-pain', 'difficulty-breathing', 'severe-abdominal-pain',
            'high-fever', 'severe-headache', 'loss-of-consciousness'
        ];
        
        const hasEmergencySymptom = symptomData.symptoms?.some(s => 
            emergencySymptoms.includes(s) || 
            (symptomData.severities && symptomData.severities[s] >= 4)
        );
        
        return hasEmergencySymptom ? {
            isEmergency: true,
            message: 'Seek immediate medical attention',
            urgency: 'immediate',
            instructions: 'Contact emergency services or visit the nearest hospital immediately'
        } : null;
    }
    
    generatePossibleConditions(symptomData) {
        const conditions = [
            {
                condition: 'Common Cold',
                probability: Math.floor(Math.random() * 30) + 70,
                description: 'Viral infection affecting the upper respiratory tract.',
                urgency: 'routine'
            },
            {
                condition: 'Gastroenteritis',
                probability: Math.floor(Math.random() * 25) + 60,
                description: 'Inflammation of the stomach and intestines.',
                urgency: 'soon'
            },
            {
                condition: 'Stress Response',
                probability: Math.floor(Math.random() * 20) + 50,
                description: 'Physical symptoms related to psychological stress.',
                urgency: 'routine'
            }
        ];
        
        // Sort by probability
        return conditions.sort((a, b) => b.probability - a.probability);
    }
    
    generateRecommendations(symptomData) {
        return [
            {
                category: 'Immediate Care',
                items: [
                    'Rest and stay well-hydrated',
                    'Monitor your symptoms closely',
                    'Take over-the-counter medications if needed'
                ]
            },
            {
                category: 'When to Seek Help',
                items: [
                    'If symptoms worsen or persist beyond 3-5 days',
                    'If you develop severe symptoms',
                    'If you have difficulty breathing'
                ]
            },
            {
                category: 'Prevention',
                items: [
                    'Practice good hygiene',
                    'Get adequate rest',
                    'Maintain a healthy diet'
                ]
            }
        ];
    }
    
    async saveSymptomAssessment(assessmentData, userId) {
        const assessment = {
            id: 'assessment_' + Date.now(),
            userId: userId,
            symptoms: assessmentData.symptoms,
            severities: assessmentData.severities,
            duration: assessmentData.duration,
            additionalInfo: assessmentData.additionalInfo,
            results: assessmentData.results,
            timestamp: new Date().toISOString()
        };
        
        // Store assessment
        if (!this.userAssessments) {
            this.userAssessments = new Map();
        }
        
        if (!this.userAssessments.has(userId)) {
            this.userAssessments.set(userId, []);
        }
        
        this.userAssessments.get(userId).push(assessment);
        
        console.log('💾 Assessment saved for user:', userId);
        
        return {
            success: true,
            data: {
                message: 'Assessment saved successfully',
                assessmentId: assessment.id
            }
        };
    }
    
    saveAssessmentToHistory(userId, symptomData, results) {
        if (!this.userAssessments) {
            this.userAssessments = new Map();
        }
        
        if (!this.userAssessments.has(userId)) {
            this.userAssessments.set(userId, []);
        }
        
        const assessment = {
            id: 'auto_assessment_' + Date.now(),
            userId: userId,
            symptoms: symptomData.symptoms || [],
            severities: symptomData.severities || {},
            duration: symptomData.duration,
            additionalInfo: symptomData.additionalInfo || {},
            results: results,
            timestamp: new Date().toISOString()
        };
        
        this.userAssessments.get(userId).push(assessment);
    }
    
    async getSymptomHistory(userId) {
        if (!this.userAssessments || !this.userAssessments.has(userId)) {
            return {
                success: true,
                data: {
                    assessments: [],
                    total: 0
                }
            };
        }
        
        const assessments = this.userAssessments.get(userId);
        
        return {
            success: true,
            data: {
                assessments: assessments.slice(-10), // Last 10 assessments
                total: assessments.length
            }
        };
    }

    // API Request Method (used by auth.js and other modules)
    async makeRequest(endpoint, method = 'GET', data = null) {
        console.log(`📡 Enhanced Backend makeRequest: ${method} ${endpoint}`, data);
        
        try {
            // Use the simulateEnhancedAPI function
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            if (data && method !== 'GET') {
                options.body = JSON.stringify(data);
            }
            
            const result = await window.simulateEnhancedAPI(endpoint, options);
            return result;
            
        } catch (error) {
            console.error('❌ makeRequest Error:', error.message);
            throw error;
        }
    }

    // Health Status Check
    getHealthStatus() {
        return {
            success: true,
            status: 'Enhanced Backend Simulation Running',
            version: '2.0.0',
            features: [
                'Authentication',
                'User Management',
                'Healthcare Data',
                'Appointments',
                'Disease Alerts',
                'Emergency Services',
                'AI Symptom Checker'
            ],
            timestamp: new Date().toISOString(),
            data: {
                totalUsers: this.users.size,
                totalHospitals: this.hospitals.length,
                totalPharmacies: this.pharmacies.length,
                activeAlerts: this.diseaseAlerts.filter(a => new Date(a.expiryDate) > new Date()).length
            }
        };
    }
}

// Create and initialize the enhanced backend
window.enhancedBackend = new EnhancedMedimateBackend();

// Enhanced API Simulation Function
window.simulateEnhancedAPI = async function(endpoint, options = {}) {
    const backend = window.enhancedBackend;
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : null;
    const headers = options.headers || {};

    console.log(`📡 Enhanced API Call: ${method} ${endpoint}`, body);

    try {
        // Authentication endpoints
        if (endpoint === '/api/auth/login' && method === 'POST') {
            return await backend.authenticateUser(body.email, body.password);
        }

        if (endpoint === '/api/auth/register' && method === 'POST') {
            return await backend.registerUser(body);
        }

        if (endpoint === '/api/auth/validate' && method === 'GET') {
            const token = headers['Authorization']?.split(' ')[1];
            return backend.validateToken(token);
        }

        if (endpoint === '/api/auth/logout' && method === 'POST') {
            const token = headers['Authorization']?.split(' ')[1];
            return backend.logout(token);
        }

        // Healthcare data endpoints
        if (endpoint === '/api/hospitals' && method === 'GET') {
            return backend.getHospitals();
        }

        if (endpoint === '/api/pharmacies' && method === 'GET') {
            return backend.getPharmacies();
        }

        if (endpoint === '/api/health-workers' && method === 'GET') {
            return backend.getHealthWorkers();
        }

        if (endpoint === '/api/disease-alerts' && method === 'GET') {
            return backend.getDiseaseAlerts();
        }

        if (endpoint === '/api/emergency-services' && method === 'GET') {
            return backend.getEmergencyServices();
        }

        // Health status
        if (endpoint === '/api/health' && method === 'GET') {
            return backend.getHealthStatus();
        }

        // AI Symptom Checker endpoints
        if (endpoint === '/api/symptom-checker/analyze' && method === 'POST') {
            const token = headers['Authorization']?.split(' ')[1];
            const session = backend.sessions.get(token);
            return backend.analyzeSymptoms(body, session?.userId);
        }

        if (endpoint === '/api/symptom-checker/save-assessment' && method === 'POST') {
            const token = headers['Authorization']?.split(' ')[1];
            const session = backend.sessions.get(token);
            if (!session) throw new Error('Unauthorized');
            return backend.saveSymptomAssessment(body, session.userId);
        }

        if (endpoint.startsWith('/api/symptom-checker/history') && method === 'GET') {
            const token = headers['Authorization']?.split(' ')[1];
            const session = backend.sessions.get(token);
            if (!session) throw new Error('Unauthorized');
            return backend.getSymptomHistory(session.userId);
        }

        // User-specific endpoints
        if (endpoint.startsWith('/api/user/appointments') && method === 'GET') {
            const token = headers['Authorization']?.split(' ')[1];
            const session = backend.sessions.get(token);
            if (!session) throw new Error('Unauthorized');
            return backend.getUserAppointments(session.userId);
        }

        if (endpoint === '/api/appointments/book' && method === 'POST') {
            const token = headers['Authorization']?.split(' ')[1];
            const session = backend.sessions.get(token);
            if (!session) throw new Error('Unauthorized');
            return backend.bookAppointment({ ...body, patientId: session.userId });
        }

        // Search endpoints
        if (endpoint.startsWith('/api/search/')) {
            const searchType = endpoint.split('/')[3];
            const query = new URLSearchParams(endpoint.split('?')[1] || '');
            
            switch (searchType) {
                case 'hospitals':
                    return backend.getHospitals({
                        city: query.get('city'),
                        specialty: query.get('specialty'),
                        emergency: query.get('emergency') === 'true'
                    });
                case 'pharmacies':
                    return backend.getPharmacies({
                        city: query.get('city'),
                        is24x7: query.get('is24x7') === 'true'
                    });
                case 'health-workers':
                    return backend.getHealthWorkers({
                        area: query.get('area'),
                        role: query.get('role')
                    });
            }
        }

        throw new Error(`Endpoint not found: ${endpoint}`);

    } catch (error) {
        console.error('❌ Enhanced API Error:', error.message);
        throw error;
    }
};

// Override fetch for automatic API simulation
const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
    // Check if this is a medimate API call
    if (typeof url === 'string' && (url.includes('localhost:3000/api') || url.startsWith('/api'))) {
        const endpoint = url.replace('http://localhost:3000', '').split('?')[0];
        console.log('🔄 Intercepting API call:', endpoint);
        
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(async () => {
                try {
                    const result = await simulateEnhancedAPI(endpoint, options);
                    resolve({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve(result),
                        text: () => Promise.resolve(JSON.stringify(result))
                    });
                } catch (error) {
                    resolve({
                        ok: false,
                        status: error.message.includes('not found') ? 404 : 
                               error.message.includes('Unauthorized') ? 401 : 500,
                        json: () => Promise.resolve({ error: error.message }),
                        text: () => Promise.resolve(JSON.stringify({ error: error.message }))
                    });
                }
            }, 100 + Math.random() * 300); // Random delay 100-400ms
        });
    }

    // For non-API calls, use original fetch
    return originalFetch.apply(this, arguments);
};

console.log('🚀 Enhanced Medimate Backend Simulation Loaded Successfully!');
console.log('📊 Backend Status:', window.enhancedBackend.getHealthStatus());
