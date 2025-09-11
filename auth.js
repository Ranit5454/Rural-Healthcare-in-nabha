// Authentication Module for Medimate Platform
// Handles user authentication, registration, and session management

class MedimateAuth {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.token = localStorage.getItem('medimate_token');
        this.user = JSON.parse(localStorage.getItem('medimate_user') || 'null');
        this.initializeEventListeners();
        this.checkBackendConnection();
    }

    // Initialize event listeners for forms
    initializeEventListeners() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Auto-fill demo credentials when clicking demo info
        this.setupDemoCredentials();

        // Real-time validation
        this.setupFormValidation();
    }

    // Setup demo credentials auto-fill
    setupDemoCredentials() {
        const demoCredentials = document.querySelector('.demo-credentials');
        if (demoCredentials) {
            demoCredentials.addEventListener('click', (e) => {
                if (e.target.textContent.includes('dr.sharma@medimate.com')) {
                    document.getElementById('login-email').value = 'dr.sharma@medimate.com';
                    document.getElementById('login-password').value = 'password123';
                } else if (e.target.textContent.includes('patient@test.com')) {
                    document.getElementById('login-email').value = 'patient@test.com';
                    document.getElementById('login-password').value = 'password123';
                }
            });
        }
    }

    // Setup form validation
    setupFormValidation() {
        // Email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateEmail(input));
        });

        // Password validation
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('input', () => this.validatePassword(input));
        });

        // Confirm password validation
        const confirmPassword = document.getElementById('register-confirm');
        if (confirmPassword) {
            confirmPassword.addEventListener('input', () => this.validatePasswordMatch());
        }

        // Phone validation
        const phoneInput = document.getElementById('register-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', () => this.validatePhone(phoneInput));
        }
    }

    // Validate email format
    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.showFieldError(input, 'Please enter a valid email address');
            return false;
        } else {
            this.clearFieldError(input);
            return true;
        }
    }

    // Validate password strength
    validatePassword(input) {
        const password = input.value;
        const minLength = 6;
        
        if (password.length > 0 && password.length < minLength) {
            this.showFieldError(input, `Password must be at least ${minLength} characters long`);
            return false;
        } else {
            this.clearFieldError(input);
            return true;
        }
    }

    // Validate password match
    validatePasswordMatch() {
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm');
        
        if (confirmPassword.value && password !== confirmPassword.value) {
            this.showFieldError(confirmPassword, 'Passwords do not match');
            return false;
        } else {
            this.clearFieldError(confirmPassword);
            return true;
        }
    }

    // Validate phone number
    validatePhone(input) {
        const phone = input.value.trim();
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        
        if (phone && !phoneRegex.test(phone)) {
            this.showFieldError(input, 'Please enter a valid phone number');
            return false;
        } else {
            this.clearFieldError(input);
            return true;
        }
    }

    // Show field error
    showFieldError(input, message) {
        input.classList.add('error');
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // Clear field error
    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    // Check backend connection
    async checkBackendConnection() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Backend connection successful:', data.status);
                if (data.status.includes('Simulation')) {
                    this.showAlert('Running in Enhanced Simulation Mode - All features available!', 'success');
                }
            } else {
                console.warn('⚠️ Backend health check failed');
            }
        } catch (error) {
            console.warn('⚠️ Backend not available, checking for enhanced simulation...');
            // Check if enhanced backend simulation is available
            if (window.enhancedBackend) {
                console.log('✅ Enhanced Backend Simulation available');
                this.showAlert('Enhanced Backend Simulation loaded successfully!', 'success');
            } else {
                this.showAlert('Backend server is not running. Some features may be limited.', 'warning');
            }
        }
    }

    // Handle login form submission
    async handleLogin(event) {
        event.preventDefault();
        
        const loginBtn = document.getElementById('login-btn');
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        const rememberMe = document.getElementById('remember-me').checked;

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validate inputs
        if (!this.validateEmail(emailInput) || !this.validatePassword(passwordInput)) {
            return;
        }

        if (!email || !password) {
            this.showAlert('Please fill in all required fields', 'error');
            return;
        }

        // Show loading state
        this.setButtonLoading(loginBtn, true);

        try {
            // Try enhanced backend first
            let result = null;
            
            if (window.enhancedBackend) {
                console.log('🔄 Using Enhanced Backend for authentication');
                result = await window.enhancedBackend.makeRequest('/api/auth/login', 'POST', { email, password });
            } else {
                // Fallback to original API call
                const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                result = await response.json();
            }

            if (result && result.success) {
                // Store authentication data
                localStorage.setItem('medimate_token', result.token);
                localStorage.setItem('medimate_user', JSON.stringify(result.user));
                
                if (rememberMe) {
                    localStorage.setItem('medimate_remember', 'true');
                }

                this.showAlert('Login successful! Redirecting...', 'success');
                
                // Request location permission
                setTimeout(async () => {
                    try {
                        if (window.locationService) {
                            console.log('🌍 Requesting location for nearby hospitals...');
                            await window.locationService.showLocationPermissionDialog();
                            console.log('✅ Location permission granted');
                        }
                    } catch (error) {
                        console.log('📍 Location permission skipped:', error.message);
                    }
                    
                    // Redirect to main application
                    window.location.href = 'index.html';
                }, 1500);

            } else {
                const message = result?.message || 'Login failed. Please check your credentials.';
                this.showAlert(message, 'error');
            }

        } catch (error) {
            console.error('Login error:', error);
            
            // Final fallback to demo login
            if (this.demoLogin(email, password)) {
                this.showAlert('Demo login successful! Redirecting...', 'success');
                
                setTimeout(async () => {
                    try {
                        if (window.locationService) {
                            await window.locationService.showLocationPermissionDialog();
                        }
                    } catch (error) {
                        console.log('📍 Location permission skipped:', error.message);
                    }
                    
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                this.showAlert('Login failed. Please check your credentials.', 'error');
            }
        } finally {
            this.setButtonLoading(loginBtn, false);
        }
    }

    // Handle registration form submission
    async handleRegister(event) {
        event.preventDefault();
        
        const registerBtn = document.getElementById('register-btn');
        const formData = {
            firstName: document.getElementById('register-first-name').value.trim(),
            lastName: document.getElementById('register-last-name').value.trim(),
            email: document.getElementById('register-email').value.trim(),
            phone: document.getElementById('register-phone').value.trim(),
            password: document.getElementById('register-password').value,
            role: document.getElementById('register-role').value,
            termsAccepted: document.getElementById('terms-agreement').checked
        };

        // Validate all inputs
        if (!this.validateRegistrationForm(formData)) {
            return;
        }

        // Show loading state
        this.setButtonLoading(registerBtn, true);

        try {
            let result = null;
            
            if (window.enhancedBackend) {
                console.log('🔄 Using Enhanced Backend for registration');
                result = await window.enhancedBackend.makeRequest('/api/auth/register', 'POST', formData);
            } else {
                // Fallback to original API call
                const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                result = await response.json();
            }

            if (result && result.success) {
                this.showAlert('Registration successful! Please login with your credentials.', 'success');
                
                // Switch to login tab after successful registration
                setTimeout(() => {
                    switchTab('login');
                    document.getElementById('login-email').value = formData.email;
                }, 2000);

            } else {
                const message = result?.message || 'Registration failed. Please try again.';
                this.showAlert(message, 'error');
            }

        } catch (error) {
            console.error('Registration error:', error);
            
            // For demo purposes, show success even if backend is down
            this.showAlert('Registration successful! (Demo Mode) Please login.', 'success');
            setTimeout(() => {
                switchTab('login');
                document.getElementById('login-email').value = formData.email;
            }, 2000);
            
        } finally {
            this.setButtonLoading(registerBtn, false);
        }
    }

    // Validate registration form
    validateRegistrationForm(formData) {
        let isValid = true;

        // Check required fields
        if (!formData.firstName) {
            this.showFieldError(document.getElementById('register-first-name'), 'First name is required');
            isValid = false;
        }

        if (!formData.lastName) {
            this.showFieldError(document.getElementById('register-last-name'), 'Last name is required');
            isValid = false;
        }

        if (!formData.email) {
            this.showFieldError(document.getElementById('register-email'), 'Email is required');
            isValid = false;
        } else if (!this.validateEmail(document.getElementById('register-email'))) {
            isValid = false;
        }

        if (!formData.phone) {
            this.showFieldError(document.getElementById('register-phone'), 'Phone number is required');
            isValid = false;
        }

        if (!formData.password) {
            this.showFieldError(document.getElementById('register-password'), 'Password is required');
            isValid = false;
        } else if (formData.password.length < 6) {
            this.showFieldError(document.getElementById('register-password'), 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!this.validatePasswordMatch()) {
            isValid = false;
        }

        if (!formData.role) {
            this.showFieldError(document.getElementById('register-role'), 'Please select a user type');
            isValid = false;
        }

        if (!formData.termsAccepted) {
            this.showAlert('Please accept the terms of service to continue', 'error');
            isValid = false;
        }

        return isValid;
    }

    // Demo login for offline testing
    demoLogin(email, password) {
        const demoUsers = {
            'dr.sharma@medimate.com': {
                id: 1,
                firstName: 'Dr. Rajesh',
                lastName: 'Sharma',
                email: 'dr.sharma@medimate.com',
                role: 'doctor',
                specialization: 'General Medicine'
            },
            'patient@test.com': {
                id: 2,
                firstName: 'Gurpreet',
                lastName: 'Singh',
                email: 'patient@test.com',
                role: 'patient',
                location: 'Ludhiana, Punjab'
            }
        };

        if (demoUsers[email] && password === 'password123') {
            // Store demo user data
            localStorage.setItem('medimate_token', 'demo_token_' + Date.now());
            localStorage.setItem('medimate_user', JSON.stringify(demoUsers[email]));
            return true;
        }
        return false;
    }

    // Set button loading state
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            button.dataset.originalText = button.textContent;
            button.textContent = '';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
            }
        }
    }

    // Show alert message
    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alert-container');
        if (!alertContainer) return;

        // Clear existing alerts
        alertContainer.innerHTML = '';

        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = message;

        alertContainer.appendChild(alert);

        // Auto-remove alert after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 5000);
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!(this.token && this.user);
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Logout user
    logout() {
        localStorage.removeItem('medimate_token');
        localStorage.removeItem('medimate_user');
        localStorage.removeItem('medimate_remember');
        window.location.href = 'login.html';
    }

    // Get authentication header for API requests
    getAuthHeader() {
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }
}

// Tab switching functionality
function switchTab(tabName) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const activeTab = Array.from(tabs).find(tab => 
        tab.textContent.toLowerCase().includes(tabName.toLowerCase())
    );
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Update forms
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => form.classList.remove('active'));
    
    const targetForm = document.getElementById(`${tabName}-form`);
    if (targetForm) {
        targetForm.classList.add('active');
    }

    // Clear any existing alerts
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        alertContainer.innerHTML = '';
    }
}

// Forgot password functionality
function showForgotPassword() {
    const email = document.getElementById('login-email').value;
    let message = 'Password reset functionality is currently being developed. ';
    
    if (email) {
        message += `When ready, reset instructions will be sent to ${email}.`;
    } else {
        message += 'Please enter your email address first.';
    }
    
    auth.showAlert(message, 'info');
}

// Initialize authentication when DOM is loaded
let auth;
document.addEventListener('DOMContentLoaded', () => {
    auth = new MedimateAuth();
    
    // Auto-redirect if already authenticated
    if (auth.isAuthenticated() && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MedimateAuth;
}
