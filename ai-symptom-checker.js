// AI Symptom Checker Engine
// Intelligent diagnostic system with emergency detection and treatment recommendations

class AISymptomChecker {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 4;
        this.selectedCategory = null;
        this.selectedSymptoms = new Set();
        this.symptomSeverities = new Map();
        this.additionalInfo = {};
        this.analysisResults = null;
        this.isAnalyzing = false;
        
        this.initialize();
    }

    initialize() {
        console.log('🤖 Initializing AI Symptom Checker...');
        
        // Wait for medical knowledge base to load
        if (window.medicalKB) {
            this.setupEventListeners();
            this.updateNavigationButtons();
            console.log('✅ AI Symptom Checker initialized');
        } else {
            setTimeout(() => this.initialize(), 500);
        }
    }

    // Setup all event listeners
    setupEventListeners() {
        // Category selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectCategory(card.dataset.category);
            });
        });

        // Symptom selection (dynamic)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.symptom-item')) {
                this.toggleSymptom(e.target.closest('.symptom-item'));
            }
        });

        // Form inputs
        const inputs = ['age-group', 'gender', 'symptom-duration'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.additionalInfo[id] = e.target.value;
                });
            }
        });

        // Chronic conditions
        document.querySelectorAll('[data-condition]').forEach(item => {
            item.addEventListener('click', () => this.toggleChronicCondition(item));
        });
    }

    // Select symptom category
    selectCategory(category) {
        // Update UI
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('selected');
        
        this.selectedCategory = category;
        this.populateSymptoms(category);
        
        console.log(`📋 Selected category: ${category}`);
    }

    // Populate symptoms for selected category
    populateSymptoms(category) {
        const symptoms = window.medicalKB.getSymptomsByCategory(category);
        const symptomsGrid = document.getElementById('symptoms-grid');
        
        if (!symptomsGrid || !symptoms) {
            console.error('Symptoms grid or symptoms not found');
            return;
        }

        symptomsGrid.innerHTML = '';
        
        symptoms.forEach(symptom => {
            const symptomItem = document.createElement('div');
            symptomItem.className = 'symptom-item';
            symptomItem.dataset.symptomId = symptom.id;
            
            symptomItem.innerHTML = `
                <input type="checkbox" class="symptom-checkbox" id="symptom-${symptom.id}">
                <label for="symptom-${symptom.id}">${symptom.name}</label>
            `;
            
            symptomsGrid.appendChild(symptomItem);
        });

        console.log(`📊 Loaded ${symptoms.length} symptoms for ${category}`);
    }

    // Toggle symptom selection
    toggleSymptom(symptomItem) {
        const checkbox = symptomItem.querySelector('.symptom-checkbox');
        const symptomId = symptomItem.dataset.symptomId;
        
        if (!symptomId) return;

        checkbox.checked = !checkbox.checked;
        
        if (checkbox.checked) {
            symptomItem.classList.add('selected');
            this.selectedSymptoms.add(symptomId);
        } else {
            symptomItem.classList.remove('selected');
            this.selectedSymptoms.delete(symptomId);
            this.symptomSeverities.delete(symptomId);
        }

        console.log(`${checkbox.checked ? '✅' : '❌'} Symptom: ${symptomId}`);
    }

    // Toggle chronic condition
    toggleChronicCondition(item) {
        const checkbox = item.querySelector('.symptom-checkbox');
        const condition = item.dataset.condition;
        
        if (!condition) return;

        checkbox.checked = !checkbox.checked;
        
        if (checkbox.checked) {
            item.classList.add('selected');
            if (!this.additionalInfo.chronicConditions) {
                this.additionalInfo.chronicConditions = [];
            }
            this.additionalInfo.chronicConditions.push(condition);
        } else {
            item.classList.remove('selected');
            if (this.additionalInfo.chronicConditions) {
                this.additionalInfo.chronicConditions = 
                    this.additionalInfo.chronicConditions.filter(c => c !== condition);
            }
        }
    }

    // Generate severity assessment sliders
    generateSeveritySliders() {
        const container = document.getElementById('severity-assessments');
        if (!container) return;

        container.innerHTML = '';

        Array.from(this.selectedSymptoms).forEach(symptomId => {
            const symptom = window.medicalKB.symptoms.get(symptomId);
            if (!symptom) return;

            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'severity-slider';
            sliderContainer.innerHTML = `
                <label class="severity-label">${symptom.name} - How severe is this symptom?</label>
                <div class="slider-container">
                    <input type="range" class="severity-input" 
                           min="1" max="5" value="2" 
                           data-symptom="${symptomId}"
                           oninput="updateSeverityValue('${symptomId}', this.value)">
                    <div class="severity-labels">
                        <span>Mild</span>
                        <span>Moderate</span>
                        <span>Severe</span>
                        <span>Very Severe</span>
                        <span>Extreme</span>
                    </div>
                </div>
                <div class="severity-value" id="severity-value-${symptomId}">Moderate (2/5)</div>
            `;

            container.appendChild(sliderContainer);
            this.symptomSeverities.set(symptomId, 2);
        });

        console.log(`📊 Generated severity sliders for ${this.selectedSymptoms.size} symptoms`);
    }

    // Update severity value
    updateSeverityValue(symptomId, value) {
        this.symptomSeverities.set(symptomId, parseInt(value));
        
        const valueElement = document.getElementById(`severity-value-${symptomId}`);
        if (valueElement) {
            const levels = ['', 'Mild', 'Moderate', 'Severe', 'Very Severe', 'Extreme'];
            valueElement.textContent = `${levels[value]} (${value}/5)`;
            
            // Color code based on severity
            valueElement.style.color = value >= 4 ? '#e74c3c' : value >= 3 ? '#f39c12' : '#27ae60';
        }
    }

    // Navigation functions
    nextStep() {
        if (this.isAnalyzing) return;

        // Validate current step
        if (!this.validateCurrentStep()) {
            return;
        }

        if (this.currentStep < this.maxSteps) {
            this.currentStep++;
            this.updateStepDisplay();
            this.handleStepTransition();
        } else {
            // Final step - run analysis
            this.runAIAnalysis();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    // Validate current step before proceeding
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.selectedCategory) {
                    this.showAlert('Please select a symptom category', 'warning');
                    return false;
                }
                break;
            
            case 2:
                if (this.selectedSymptoms.size === 0) {
                    this.showAlert('Please select at least one symptom', 'warning');
                    return false;
                }
                break;
            
            case 3:
                if (!this.additionalInfo['symptom-duration']) {
                    this.showAlert('Please specify how long you have had these symptoms', 'warning');
                    return false;
                }
                break;
            
            case 4:
                if (!this.additionalInfo['age-group']) {
                    this.showAlert('Please select your age group', 'warning');
                    return false;
                }
                break;
        }
        
        return true;
    }

    // Handle transitions between steps
    handleStepTransition() {
        switch (this.currentStep) {
            case 3:
                // Generate severity sliders for selected symptoms
                this.generateSeveritySliders();
                break;
        }
    }

    // Update step display
    updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.step-container').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        this.updateNavigationButtons();
    }

    // Update navigation buttons
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }

        if (nextBtn) {
            if (this.currentStep === this.maxSteps) {
                nextBtn.textContent = '🤖 Analyze Symptoms';
                nextBtn.classList.add('btn-primary');
            } else {
                nextBtn.textContent = 'Next →';
                nextBtn.classList.add('btn-primary');
            }
        }
    }

    // Run AI analysis
    async runAIAnalysis() {
        if (this.isAnalyzing) return;

        this.isAnalyzing = true;
        const nextBtn = document.getElementById('next-btn');
        
        // Show loading state
        if (nextBtn) {
            nextBtn.innerHTML = '<span class="loading-spinner"></span> Analyzing...';
            nextBtn.disabled = true;
        }

        try {
            console.log('🔬 Starting AI symptom analysis...');
            
            // Prepare analysis data
            const analysisData = {
                symptoms: Array.from(this.selectedSymptoms),
                severities: Object.fromEntries(this.symptomSeverities),
                duration: this.additionalInfo['symptom-duration'],
                ageGroup: this.additionalInfo['age-group'],
                gender: this.additionalInfo['gender'],
                chronicConditions: this.additionalInfo.chronicConditions || []
            };

            console.log('📊 Analysis data:', analysisData);

            // Use backend API for analysis
            const token = localStorage.getItem('medimate_token');
            const response = await fetch('/api/symptom-checker/analyze', {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(analysisData)
            });
            
            if (response.ok) {
                const result = await response.json();
                this.analysisResults = result.data;
            } else {
                // Fallback to local analysis
                this.analysisResults = window.medicalKB.analyzeSymptomsAI(
                    analysisData.symptoms,
                    analysisData.severities,
                    analysisData.duration,
                    analysisData.ageGroup,
                    analysisData.gender,
                    analysisData.chronicConditions
                );
            }

            console.log('🎯 AI Analysis Results:', this.analysisResults);

            // Show results
            this.displayResults();
            
            // Navigate to results
            this.currentStep = 5; // Results step
            this.updateStepDisplay();
            
        } catch (error) {
            console.error('❌ Analysis error:', error);
            this.showAlert('An error occurred during analysis. Please try again.', 'error');
        } finally {
            this.isAnalyzing = false;
            if (nextBtn) {
                nextBtn.innerHTML = '🤖 Analyze Symptoms';
                nextBtn.disabled = false;
            }
        }
    }

    // Display analysis results
    displayResults() {
        if (!this.analysisResults) return;

        // Update confidence score for both step and tab views
        ['confidence-score', 'confidence-score-step'].forEach(id => {
            const confidenceElement = document.getElementById(id);
            if (confidenceElement) {
                confidenceElement.textContent = `${this.analysisResults.confidence}% Confidence`;
                
                // Color code confidence
                if (this.analysisResults.confidence >= 80) {
                    confidenceElement.style.background = 'rgba(0, 200, 81, 0.2)';
                    confidenceElement.style.color = '#155724';
                } else if (this.analysisResults.confidence >= 60) {
                    confidenceElement.style.background = 'rgba(255, 193, 7, 0.2)';
                    confidenceElement.style.color = '#856404';
                } else {
                    confidenceElement.style.background = 'rgba(220, 53, 69, 0.2)';
                    confidenceElement.style.color = '#721c24';
                }
            }
        });

        // Display emergency alert if needed
        this.displayEmergencyAlert();

        // Display possible conditions
        this.displayDiagnosis();

        // Display recommendations
        this.displayRecommendations();
    }

    // Display emergency alert
    displayEmergencyAlert() {
        const alertContainers = ['emergency-alert', 'emergency-alert-step'];
        
        alertContainers.forEach(id => {
            const alertContainer = document.getElementById(id);
            if (!alertContainer) return;

            if (this.analysisResults.emergencyAlert) {
                alertContainer.innerHTML = `
                    <div class="emergency-warning">
                        <div class="warning-icon">🚨</div>
                        <h3>MEDICAL EMERGENCY DETECTED</h3>
                        <p>Your symptoms suggest a potential medical emergency. 
                           Seek immediate medical attention.</p>
                        <a href="tel:108" class="emergency-button">
                            📞 Call Emergency Services (108)
                        </a>
                    </div>
                `;
            } else {
                alertContainer.innerHTML = '';
            }
        });
    }

    // Display diagnosis results
    displayDiagnosis() {
        const diagnosisContainers = ['diagnosis-results', 'diagnosis-results-step'];
        
        diagnosisContainers.forEach(id => {
            const diagnosisContainer = document.getElementById(id);
            if (!diagnosisContainer) return;

            this.renderDiagnosisContent(diagnosisContainer);
        });
    }
    
    // Render diagnosis content
    renderDiagnosisContent(diagnosisContainer) {

        if (this.analysisResults.possibleConditions.length === 0) {
            diagnosisContainer.innerHTML = `
                <div class="diagnosis-card">
                    <div class="diagnosis-title">No Specific Condition Identified</div>
                    <div class="diagnosis-description">
                        Based on your symptoms, no specific medical condition could be identified with confidence. 
                        Consider consulting a healthcare provider for further evaluation.
                    </div>
                </div>
            `;
            return;
        }

        let diagnosisHTML = '<div class="diagnosis-cards">';
        
        this.analysisResults.possibleConditions.forEach((condition, index) => {
            const priorityClass = condition.priority === 'high' ? 'high-priority' : 
                                condition.priority === 'medium' ? 'medium-priority' : '';
            
            const urgencyIcon = condition.urgency === 'immediate' ? '🚨' :
                              condition.urgency === 'urgent' ? '⚠️' :
                              condition.urgency === 'soon' ? '⏰' : '📋';

            diagnosisHTML += `
                <div class="diagnosis-card ${priorityClass}">
                    <div class="diagnosis-title">
                        ${urgencyIcon} ${condition.condition}
                    </div>
                    <div class="diagnosis-probability">
                        ${condition.probability}% Match
                    </div>
                    <div class="diagnosis-description">
                        ${condition.description}
                    </div>
                    <div style="margin-top: 10px; font-size: 12px; color: #6c757d;">
                        <strong>Urgency:</strong> ${this.getUrgencyText(condition.urgency)} | 
                        <strong>Symptoms matched:</strong> ${condition.matchedSymptoms}/${condition.totalSymptoms}
                    </div>
                </div>
            `;
        });
        
        diagnosisHTML += '</div>';
        diagnosisContainer.innerHTML = diagnosisHTML;
    }

    // Display recommendations
    displayRecommendations() {
        const recommendationContainers = ['recommendations-section', 'recommendations-section-step'];
        
        recommendationContainers.forEach(id => {
            const recommendationsContainer = document.getElementById(id);
            if (!recommendationsContainer) return;

            this.renderRecommendationsContent(recommendationsContainer);
        });
    }
    
    // Render recommendations content
    renderRecommendationsContent(recommendationsContainer) {

        if (!this.analysisResults.recommendations || this.analysisResults.recommendations.length === 0) {
            recommendationsContainer.innerHTML = `
                <div class="recommendations">
                    <h4>General Recommendations</h4>
                    <ul>
                        <li>Monitor your symptoms closely</li>
                        <li>Rest and stay well-hydrated</li>
                        <li>Consult a healthcare provider if symptoms worsen</li>
                    </ul>
                </div>
            `;
            return;
        }

        let recommendationsHTML = '';
        
        this.analysisResults.recommendations.forEach(recommendation => {
            if (typeof recommendation === 'object' && recommendation.category) {
                recommendationsHTML += `
                    <div class="recommendations">
                        <h4>${recommendation.category}</h4>
                        <ul>
                            ${recommendation.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
        });

        // Add general recommendations if they are strings
        const stringRecommendations = this.analysisResults.recommendations.filter(rec => typeof rec === 'string');
        if (stringRecommendations.length > 0) {
            recommendationsHTML += `
                <div class="recommendations">
                    <h4>General Recommendations</h4>
                    <ul>
                        ${stringRecommendations.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        recommendationsContainer.innerHTML = recommendationsHTML;
    }

    // Get urgency text description
    getUrgencyText(urgency) {
        const urgencyTexts = {
            'immediate': 'Seek immediate medical attention',
            'urgent': 'See doctor within 24 hours',
            'soon': 'Schedule appointment soon',
            'routine': 'Routine follow-up'
        };
        return urgencyTexts[urgency] || 'Monitor symptoms';
    }

    // Reset checker
    resetChecker() {
        this.currentStep = 1;
        this.selectedCategory = null;
        this.selectedSymptoms.clear();
        this.symptomSeverities.clear();
        this.additionalInfo = {};
        this.analysisResults = null;

        // Reset UI
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected');
        });

        document.querySelectorAll('.symptom-item').forEach(item => {
            item.classList.remove('selected');
            const checkbox = item.querySelector('.symptom-checkbox');
            if (checkbox) checkbox.checked = false;
        });

        // Clear form inputs
        ['age-group', 'gender', 'symptom-duration'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });

        // Clear chronic conditions
        document.querySelectorAll('[data-condition]').forEach(item => {
            item.classList.remove('selected');
            const checkbox = item.querySelector('.symptom-checkbox');
            if (checkbox) checkbox.checked = false;
        });

        // Clear results
        ['emergency-alert', 'diagnosis-results', 'recommendations-section'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.innerHTML = '';
        });

        this.updateStepDisplay();
        console.log('🔄 Symptom checker reset');
    }

    // Show alert message
    showAlert(message, type = 'info') {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.right = '20px';
        alert.style.zIndex = '1000';
        alert.style.padding = '15px 20px';
        alert.style.borderRadius = '8px';
        alert.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
        alert.style.minWidth = '300px';
        
        // Style based on type
        if (type === 'success') {
            alert.style.background = '#d4edda';
            alert.style.border = '1px solid #c3e6cb';
            alert.style.color = '#155724';
        } else if (type === 'error') {
            alert.style.background = '#f8d7da';
            alert.style.border = '1px solid #f5c6cb';
            alert.style.color = '#721c24';
        } else if (type === 'warning') {
            alert.style.background = '#fff3cd';
            alert.style.border = '1px solid #ffeaa7';
            alert.style.color = '#856404';
        } else {
            alert.style.background = '#d1ecf1';
            alert.style.border = '1px solid #bee5eb';
            alert.style.color = '#0c5460';
        }
        
        alert.textContent = message;

        document.body.appendChild(alert);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 5000);
    }

    // Show symptom assessment (tab content)
    showSymptomAssessment() {
        // Hide navigation buttons for tab view
        const navButtons = document.querySelector('.navigation-buttons');
        if (navButtons) {
            navButtons.style.display = 'block';
        }

        // Show current step
        this.updateStepDisplay();
    }

    // Load and display medical history
    loadMedicalHistory() {
        const historyMessage = document.getElementById('history-message');
        const historyData = document.getElementById('history-content-data');
        
        // Check if user is authenticated
        const token = localStorage.getItem('medimate_token');
        const user = JSON.parse(localStorage.getItem('medimate_user') || 'null');
        
        if (token && user) {
            // User is logged in - show their medical history
            historyMessage.style.display = 'none';
            historyData.style.display = 'block';
            
            this.displayMedicalProfile(user);
            this.loadAssessmentHistory(user.id);
        } else {
            // User not logged in - show login prompt
            historyMessage.style.display = 'block';
            historyData.style.display = 'none';
        }
        
        // Hide navigation buttons for tab view
        const navButtons = document.querySelector('.navigation-buttons');
        if (navButtons) {
            navButtons.style.display = 'none';
        }
    }

    // Display user medical profile
    displayMedicalProfile(user) {
        const profileContainer = document.getElementById('user-medical-profile');
        if (!profileContainer) return;
        
        const profileHTML = `
            <div class="profile-info">
                <div class="profile-item">
                    <strong>Name:</strong> ${user.firstName} ${user.lastName}
                </div>
                <div class="profile-item">
                    <strong>Email:</strong> ${user.email}
                </div>
                <div class="profile-item">
                    <strong>Role:</strong> ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
                ${user.age ? `<div class="profile-item"><strong>Age:</strong> ${user.age}</div>` : ''}
                ${user.bloodGroup ? `<div class="profile-item"><strong>Blood Group:</strong> ${user.bloodGroup}</div>` : ''}
                ${user.medicalHistory ? `<div class="profile-item"><strong>Medical History:</strong> ${user.medicalHistory.join(', ')}</div>` : ''}
                ${user.allergies ? `<div class="profile-item"><strong>Allergies:</strong> ${user.allergies.join(', ')}</div>` : ''}
            </div>
        `;
        
        profileContainer.innerHTML = profileHTML;
    }

    // Load assessment history
    async loadAssessmentHistory(userId) {
        const historyContainer = document.getElementById('assessment-history-list');
        if (!historyContainer) return;
        
        try {
            // Try to load from enhanced backend
            const token = localStorage.getItem('medimate_token');
            if (!token) {
                throw new Error('No token available');
            }
            
            const response = await fetch('/api/symptom-checker/history', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('📋 Loaded assessment history:', data);
                this.displayAssessmentHistory(data.data.assessments || []);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to load history');
            }
        } catch (error) {
            console.warn('Could not load assessment history:', error);
            // Show appropriate message based on error type
            let message = '';
            if (error.message.includes('token') || error.message.includes('Unauthorized')) {
                message = `
                    <div class="assessment-item">
                        <div class="assessment-summary">🔐 Login Required</div>
                        <div class="assessment-result">Please login to view your assessment history.</div>
                    </div>
                `;
            } else {
                message = `
                    <div class="assessment-item">
                        <div class="assessment-summary">📋 No Previous Assessments</div>
                        <div class="assessment-result">Complete your first symptom assessment to see your history here.</div>
                    </div>
                `;
            }
            historyContainer.innerHTML = message;
        }
    }

    // Display assessment history
    displayAssessmentHistory(assessments) {
        const historyContainer = document.getElementById('assessment-history-list');
        if (!historyContainer) return;
        
        if (assessments.length === 0) {
            historyContainer.innerHTML = `
                <div class="assessment-item">
                    <div class="assessment-summary">No previous assessments</div>
                    <div class="assessment-result">Your completed symptom assessments will appear here.</div>
                </div>
            `;
            return;
        }
        
        const historyHTML = assessments.map(assessment => {
            const date = new Date(assessment.timestamp).toLocaleDateString();
            const topCondition = assessment.results?.possibleConditions?.[0];
            
            return `
                <div class="assessment-item">
                    <div class="assessment-date">${date}</div>
                    <div class="assessment-summary">
                        Symptoms: ${assessment.symptoms?.join(', ') || 'Unknown'}
                    </div>
                    <div class="assessment-result">
                        ${topCondition ? `Top Result: ${topCondition.condition} (${topCondition.probability}%)` : 'Analysis completed'}
                    </div>
                </div>
            `;
        }).join('');
        
        historyContainer.innerHTML = historyHTML;
    }

    // Show analysis results tab
    showAnalysisResults() {
        const analysisMessage = document.getElementById('analysis-message');
        const analysisResults = document.getElementById('analysis-results');
        
        // Hide navigation buttons for tab view
        const navButtons = document.querySelector('.navigation-buttons');
        if (navButtons) {
            navButtons.style.display = 'none';
        }
        
        if (this.analysisResults) {
            // Show completed analysis
            analysisMessage.style.display = 'none';
            analysisResults.style.display = 'block';
            
            // Copy results from step-based analysis
            this.copyAnalysisResults();
        } else {
            // Show message to complete assessment
            analysisMessage.style.display = 'block';
            analysisResults.style.display = 'none';
        }
    }

    // Copy analysis results from step view to tab view
    copyAnalysisResults() {
        // Copy confidence score
        const stepConfidence = document.getElementById('confidence-score-step');
        const tabConfidence = document.getElementById('confidence-score');
        if (stepConfidence && tabConfidence) {
            tabConfidence.textContent = stepConfidence.textContent;
            tabConfidence.style.background = stepConfidence.style.background;
            tabConfidence.style.color = stepConfidence.style.color;
        }
        
        // Copy emergency alert
        const stepEmergency = document.getElementById('emergency-alert-step');
        const tabEmergency = document.getElementById('emergency-alert');
        if (stepEmergency && tabEmergency) {
            tabEmergency.innerHTML = stepEmergency.innerHTML;
        }
        
        // Copy diagnosis results
        const stepDiagnosis = document.getElementById('diagnosis-results-step');
        const tabDiagnosis = document.getElementById('diagnosis-results');
        if (stepDiagnosis && tabDiagnosis) {
            tabDiagnosis.innerHTML = stepDiagnosis.innerHTML;
        }
        
        // Copy recommendations
        const stepRecommendations = document.getElementById('recommendations-section-step');
        const tabRecommendations = document.getElementById('recommendations-section');
        if (stepRecommendations && tabRecommendations) {
            tabRecommendations.innerHTML = stepRecommendations.innerHTML;
        }
    }
}

// Tab switching for symptom checker
function switchCheckerTab(tabName) {
    console.log(`Switching to ${tabName} tab`);
    
    // Update tab buttons
    document.querySelectorAll('.checker-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const activeTabButton = Array.from(document.querySelectorAll('.checker-tab')).find(tab => {
        return tab.textContent.toLowerCase().includes(tabName.toLowerCase()) || 
               (tabName === 'symptoms' && tab.textContent.includes('Symptom')) ||
               (tabName === 'history' && tab.textContent.includes('History')) ||
               (tabName === 'results' && tab.textContent.includes('Analysis'));
    });
    
    if (activeTabButton) {
        activeTabButton.classList.add('active');
    }
    
    // Hide all tab content
    document.querySelectorAll('#step-1, #step-2, #step-3, #step-4, #results-container').forEach(section => {
        section.style.display = 'none';
    });
    
    document.getElementById('history-content')?.style.setProperty('display', 'none');
    document.getElementById('results-content')?.style.setProperty('display', 'none');
    
    // Show appropriate content based on tab
    switch (tabName) {
        case 'symptoms':
            // Show symptom assessment steps
            if (window.aiChecker) {
                window.aiChecker.showSymptomAssessment();
            } else {
                document.getElementById('step-1').style.display = 'block';
            }
            break;
            
        case 'history':
            document.getElementById('history-content').style.display = 'block';
            if (window.aiChecker) {
                window.aiChecker.loadMedicalHistory();
            }
            break;
            
        case 'results':
            document.getElementById('results-content').style.display = 'block';
            if (window.aiChecker) {
                window.aiChecker.showAnalysisResults();
            }
            break;
    }
}

// Global functions for navigation
function nextStep() {
    if (window.aiChecker) {
        window.aiChecker.nextStep();
    }
}

function previousStep() {
    if (window.aiChecker) {
        window.aiChecker.previousStep();
    }
}

function resetChecker() {
    if (window.aiChecker) {
        window.aiChecker.resetChecker();
    }
}

function updateSeverityValue(symptomId, value) {
    if (window.aiChecker) {
        window.aiChecker.updateSeverityValue(symptomId, value);
    }
}

// Save assessment function
async function saveAssessment() {
    if (window.aiChecker && window.aiChecker.analysisResults) {
        const token = localStorage.getItem('medimate_token');
        if (!token) {
            window.aiChecker.showAlert('Please login to save your assessment', 'warning');
            return;
        }
        
        try {
            const assessmentData = {
                symptoms: Array.from(window.aiChecker.selectedSymptoms),
                severities: Object.fromEntries(window.aiChecker.symptomSeverities),
                duration: window.aiChecker.additionalInfo['symptom-duration'],
                additionalInfo: window.aiChecker.additionalInfo,
                results: window.aiChecker.analysisResults
            };
            
            const response = await fetch('/api/symptom-checker/save-assessment', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(assessmentData)
            });
            
            if (response.ok) {
                const result = await response.json();
                window.aiChecker.showAlert('Assessment saved successfully!', 'success');
                console.log('💾 Assessment saved:', result);
            } else {
                throw new Error('Failed to save assessment');
            }
        } catch (error) {
            console.error('Error saving assessment:', error);
            window.aiChecker.showAlert('Failed to save assessment. Please try again.', 'error');
        }
    } else {
        window.aiChecker.showAlert('No assessment to save. Please complete the symptom analysis first.', 'warning');
    }
}

// Share results function
function shareResults() {
    if (window.aiChecker && window.aiChecker.analysisResults) {
        const results = window.aiChecker.analysisResults;
        const topCondition = results.possibleConditions?.[0];
        
        const shareText = `AI Health Assessment Results:
` +
                         `Top Condition: ${topCondition?.condition || 'No specific condition identified'}
` +
                         `Confidence: ${results.confidence}%
` +
                         `${results.emergencyAlert ? 'EMERGENCY: Seek immediate medical attention!' : ''}`;
        
        if (navigator.share) {
            // Use Web Share API if available
            navigator.share({
                title: 'AI Health Assessment Results',
                text: shareText
            }).then(() => {
                window.aiChecker.showAlert('Results shared successfully!', 'success');
            }).catch(() => {
                // Fallback to clipboard
                copyToClipboard(shareText);
            });
        } else {
            // Fallback to clipboard
            copyToClipboard(shareText);
        }
    } else {
        alert('No results to share. Please complete the symptom analysis first.');
    }
}

// Copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            window.aiChecker.showAlert('Results copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback clipboard copy
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        window.aiChecker.showAlert('Results copied to clipboard!', 'success');
    } catch (err) {
        console.error('Could not copy text: ', err);
        window.aiChecker.showAlert('Could not copy results. Please copy manually.', 'warning');
    }
    
    document.body.removeChild(textArea);
}

// Initialize AI symptom checker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for medical knowledge base to be ready
    const initChecker = () => {
        if (window.medicalKB) {
            window.aiChecker = new AISymptomChecker();
            console.log('🤖 AI Symptom Checker ready');
        } else {
            setTimeout(initChecker, 500);
        }
    };
    
    initChecker();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AISymptomChecker;
}
