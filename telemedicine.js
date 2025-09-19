// ===== TELEMEDICINE FUNCTIONALITY =====

// Mock data for doctors and appointments
let doctors = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "General Medicine",
        avatar: "SJ",
        rating: 4.8,
        experience: "12 years",
        status: "online",
        price: 80,
        nextAvailable: "Today 2:00 PM",
        languages: ["Hindi", "English", "Punjabi"],
        qualifications: ["MBBS", "MD"],
        consultationCount: 1250
    },
    {
        id: 2,
        name: "Dr. Rajesh Kumar",
        specialty: "Cardiology",
        avatar: "RK",
        rating: 4.9,
        experience: "15 years",
        status: "busy",
        price: 100,
        nextAvailable: "Tomorrow 10:00 AM",
        languages: ["Hindi", "English"],
        qualifications: ["MBBS", "DM Cardiology"],
        consultationCount: 980
    },
    {
        id: 3,
        name: "Dr. Priya Sharma",
        specialty: "Pediatrics",
        avatar: "PS",
        rating: 4.7,
        experience: "8 years",
        status: "online",
        price: 75,
        nextAvailable: "Today 4:30 PM",
        languages: ["Hindi", "English", "Punjabi"],
        qualifications: ["MBBS", "MD Pediatrics"],
        consultationCount: 750
    },
    {
        id: 4,
        name: "Dr. Amit Singh",
        specialty: "Dermatology",
        avatar: "AS",
        rating: 4.6,
        experience: "10 years",
        status: "offline",
        price: 90,
        nextAvailable: "Tomorrow 3:00 PM",
        languages: ["Hindi", "English"],
        qualifications: ["MBBS", "MD Dermatology"],
        consultationCount: 620
    }
];

let appointments = [
    {
        id: 1,
        doctorId: 1,
        doctorName: "Dr. Sarah Johnson",
        specialty: "General Medicine",
        date: "2024-01-15",
        time: "14:00",
        status: "confirmed",
        type: "Follow-up",
        complaint: "Check-up for diabetes management"
    },
    {
        id: 2,
        doctorId: 3,
        doctorName: "Dr. Priya Sharma",
        specialty: "Pediatrics",
        date: "2024-01-16",
        time: "10:30",
        status: "scheduled",
        type: "General Consultation",
        complaint: "Child vaccination consultation"
    }
];

let consultations = [
    {
        id: 1,
        doctorName: "Dr. Sarah Johnson",
        specialty: "General Medicine",
        date: "2024-01-10",
        time: "15:30",
        duration: "25 minutes",
        diagnosis: "Hypertension management",
        prescription: "Available in medical history"
    },
    {
        id: 2,
        doctorName: "Dr. Rajesh Kumar",
        specialty: "Cardiology",
        date: "2024-01-08",
        time: "11:00",
        duration: "30 minutes",
        diagnosis: "Routine cardiac check-up",
        prescription: "Continue current medication"
    }
];

// Booking modal state
let currentBookingStep = 1;
let selectedDoctor = null;
let selectedDate = null;
let selectedTime = null;

// Video call state
let isCallActive = false;
let isMuted = false;
let isVideoOn = true;
let isChatOpen = false;
let callTimer = null;
let callStartTime = null;

// Initialize telemedicine when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Ensure all modals are hidden on page load
    const bookingModal = document.getElementById('bookingModal');
    const videoCallModal = document.getElementById('videoCallModal');
    
    if (bookingModal) {
        bookingModal.style.display = 'none';
    }
    if (videoCallModal) {
        videoCallModal.style.display = 'none';
    }
    
    // Only initialize telemedicine data if we're viewing the telemedicine section
    // Check if current section is telemedicine
    const currentSection = document.querySelector('.content-section:not([style*="display: none"])');
    if (currentSection && currentSection.id === 'telemedicine') {
        loadDoctors();
        loadAppointments();
        loadConsultations();
        setMinDate();
    }
});

// Initialize telemedicine section when navigated to
function initializeTelemedicineSection() {
    if (document.getElementById('doctors-grid')) {
        loadDoctors();
        loadAppointments();
        loadConsultations();
        setMinDate();
    }
}

// Call this when telemedicine tab is clicked
window.initializeTelemedicine = initializeTelemedicineSection;

// ===== DOCTOR MANAGEMENT =====

function loadDoctors() {
    const doctorsGrid = document.getElementById('doctors-grid');
    if (!doctorsGrid) return;

    doctorsGrid.innerHTML = doctors.map(doctor => `
        <div class="doctor-card" data-specialty="${doctor.specialty.toLowerCase()}" data-status="${doctor.status}">
            <div class="doctor-header">
                <div class="doctor-avatar">${doctor.avatar}</div>
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <p class="doctor-specialty">${doctor.specialty}</p>
                </div>
            </div>
            
            <div class="doctor-status">
                <span class="status-indicator ${doctor.status}"></span>
                <span class="status-text">${getStatusText(doctor.status)}</span>
            </div>
            
            <div class="doctor-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span>${doctor.rating} (${doctor.consultationCount} reviews)</span>
            </div>
            
            <div class="doctor-details">
                <p><strong>Experience:</strong> ${doctor.experience}</p>
                <p><strong>Next Available:</strong> ${doctor.nextAvailable}</p>
                <p><strong>Consultation Fee:</strong> ₹${doctor.price}</p>
                <p><strong>Languages:</strong> ${doctor.languages.join(', ')}</p>
            </div>
            
            <div class="doctor-actions">
                <button class="book-btn" onclick="bookWithDoctor(${doctor.id})">
                    Book Consultation
                </button>
                ${doctor.status === 'online' ? `
                    <button class="instant-btn" onclick="startInstantConsultation(${doctor.id})">
                        Start Now
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    switch(status) {
        case 'online': return 'Available Now';
        case 'busy': return 'In Consultation';
        case 'offline': return 'Offline';
        default: return 'Unknown';
    }
}

function filterDoctors() {
    const specialtyFilter = document.getElementById('specialty-filter').value;
    const availabilityFilter = document.getElementById('availability-filter').value;
    const doctorCards = document.querySelectorAll('.doctor-card');

    doctorCards.forEach(card => {
        const specialty = card.dataset.specialty;
        const status = card.dataset.status;
        
        let showCard = true;
        
        if (specialtyFilter !== 'all' && specialty !== specialtyFilter) {
            showCard = false;
        }
        
        if (availabilityFilter === 'online' && status !== 'online') {
            showCard = false;
        } else if (availabilityFilter === 'today' && status === 'offline') {
            showCard = false;
        }
        
        card.style.display = showCard ? 'block' : 'none';
    });
}

// ===== BOOKING FUNCTIONALITY =====

function showBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('show');
    currentBookingStep = 1;
    showStep(1);
    loadDoctorSelection();
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('show');
    resetBookingForm();
}

function bookWithDoctor(doctorId) {
    selectedDoctor = doctors.find(d => d.id === doctorId);
    showBookingModal();
    // Pre-select the doctor
    setTimeout(() => {
        const doctorOption = document.querySelector(`[data-doctor-id="${doctorId}"]`);
        if (doctorOption) {
            selectDoctor(doctorOption);
            nextStep();
        }
    }, 100);
}

function loadDoctorSelection() {
    const doctorSelection = document.getElementById('doctor-selection');
    if (!doctorSelection) return;

    doctorSelection.innerHTML = doctors.map(doctor => `
        <div class="doctor-option" data-doctor-id="${doctor.id}" onclick="selectDoctor(this)">
            <div class="doctor-header">
                <div class="doctor-avatar">${doctor.avatar}</div>
                <div class="doctor-info">
                    <h4>${doctor.name}</h4>
                    <p class="doctor-specialty">${doctor.specialty}</p>
                </div>
            </div>
            <div class="doctor-price">₹${doctor.price}</div>
            <div class="doctor-status">
                <span class="status-indicator ${doctor.status}"></span>
                <span>${getStatusText(doctor.status)}</span>
            </div>
        </div>
    `).join('');
}

function selectDoctor(element) {
    // Remove previous selection
    document.querySelectorAll('.doctor-option').forEach(opt => opt.classList.remove('selected'));
    
    // Select current doctor
    element.classList.add('selected');
    
    const doctorId = parseInt(element.dataset.doctorId);
    selectedDoctor = doctors.find(d => d.id === doctorId);
}

function nextStep() {
    if (currentBookingStep === 1 && !selectedDoctor) {
        alert('Please select a doctor first.');
        return;
    }
    
    if (currentBookingStep === 2 && (!selectedDate || !selectedTime)) {
        alert('Please select date and time.');
        return;
    }
    
    currentBookingStep++;
    showStep(currentBookingStep);
}

function prevStep() {
    currentBookingStep--;
    showStep(currentBookingStep);
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => s.style.display = 'none');
    
    // Show current step
    document.getElementById(`step${step}`).style.display = 'block';
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const bookBtn = document.getElementById('book-btn');
    
    prevBtn.style.display = step === 1 ? 'none' : 'inline-block';
    nextBtn.style.display = step === 3 ? 'none' : 'inline-block';
    bookBtn.style.display = step === 3 ? 'inline-block' : 'none';
}

function setMinDate() {
    const dateInput = document.getElementById('consultation-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

function loadAvailableSlots() {
    const dateInput = document.getElementById('consultation-date');
    const timeSlotsContainer = document.getElementById('time-slots');
    
    if (!dateInput || !timeSlotsContainer) return;
    
    selectedDate = dateInput.value;
    
    // Mock available time slots
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00'
    ];
    
    // Randomly mark some slots as unavailable
    const unavailableSlots = ['10:30', '14:30', '16:00'];
    
    timeSlotsContainer.innerHTML = timeSlots.map(time => `
        <div class="time-slot ${unavailableSlots.includes(time) ? 'unavailable' : ''}" 
             onclick="selectTimeSlot(this, '${time}')" 
             data-time="${time}">
            ${time}
        </div>
    `).join('');
}

function selectTimeSlot(element, time) {
    if (element.classList.contains('unavailable')) return;
    
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
    
    // Select current slot
    element.classList.add('selected');
    selectedTime = time;
}

function confirmBooking() {
    const complaint = document.getElementById('chief-complaint').value;
    const consultationType = document.getElementById('consultation-type').value;
    const medicalHistory = document.getElementById('medical-history').value;
    
    if (!complaint.trim()) {
        alert('Please describe your chief complaint.');
        return;
    }
    
    // Create new appointment
    const newAppointment = {
        id: appointments.length + 1,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: selectedDate,
        time: selectedTime,
        status: 'scheduled',
        type: consultationType,
        complaint: complaint,
        medicalHistory: medicalHistory
    };
    
    appointments.push(newAppointment);
    
    // Show success message
    alert(`Consultation booked successfully!\\n\\nDoctor: ${selectedDoctor.name}\\nDate: ${selectedDate}\\nTime: ${selectedTime}\\n\\nYou will receive a confirmation SMS shortly.`);
    
    // Close modal and refresh appointments
    closeBookingModal();
    loadAppointments();
}

function resetBookingForm() {
    currentBookingStep = 1;
    selectedDoctor = null;
    selectedDate = null;
    selectedTime = null;
    
    // Clear form fields
    document.getElementById('chief-complaint').value = '';
    document.getElementById('consultation-type').selectedIndex = 0;
    document.getElementById('medical-history').value = '';
    document.getElementById('consultation-date').value = '';
}

// ===== INSTANT CONSULTATION =====

function findInstantDoctor() {
    const onlineDoctors = doctors.filter(d => d.status === 'online');
    
    if (onlineDoctors.length === 0) {
        alert('No doctors are currently available for instant consultation. Please book a scheduled appointment.');
        return;
    }
    
    // Select first available doctor
    const doctor = onlineDoctors[0];
    
    if (confirm(`Dr. ${doctor.name} (${doctor.specialty}) is available now.\\nConsultation fee: ₹${doctor.price}\\n\\nStart video consultation?`)) {
        startVideoCall(doctor);
    }
}

function startInstantConsultation(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (doctor.status !== 'online') {
        alert('This doctor is currently not available for instant consultation.');
        return;
    }
    
    if (confirm(`Start instant consultation with Dr. ${doctor.name}?\\nFee: ₹${doctor.price}`)) {
        startVideoCall(doctor);
    }
}

// ===== VIDEO CALL FUNCTIONALITY =====

function startVideoCall(doctor) {
    document.getElementById('doctor-name').textContent = doctor.name;
    document.getElementById('video-doctor-name').textContent = doctor.name;
    document.getElementById('video-doctor-avatar').textContent = doctor.avatar;
    
    const modal = document.getElementById('videoCallModal');
    modal.classList.add('show');
    
    isCallActive = true;
    callStartTime = new Date();
    startCallTimer();
    
    // Simulate call connection
    setTimeout(() => {
        document.querySelector('.call-status').textContent = 'Connected';
        document.querySelector('.call-status').style.background = '#27ae60';
    }, 2000);
}

function endCall() {
    if (confirm('Are you sure you want to end the call?')) {
        const modal = document.getElementById('videoCallModal');
        modal.classList.remove('show');
        isCallActive = false;
        
        if (callTimer) {
            clearInterval(callTimer);
            callTimer = null;
        }
        
        // Reset call state
        isMuted = false;
        isVideoOn = true;
        isChatOpen = false;
        
        // Show consultation summary
        showConsultationSummary();
    }
}

function startCallTimer() {
    callTimer = setInterval(() => {
        if (!isCallActive) return;
        
        const elapsed = new Date() - callStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        document.getElementById('call-timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('mute-btn');
    
    if (isMuted) {
        muteBtn.classList.add('muted');
        muteBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    } else {
        muteBtn.classList.remove('muted');
        muteBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }
}

function toggleVideo() {
    isVideoOn = !isVideoOn;
    const videoBtn = document.getElementById('video-btn');
    
    if (!isVideoOn) {
        videoBtn.classList.add('muted');
        videoBtn.innerHTML = '<i class="fas fa-video-slash"></i>';
    } else {
        videoBtn.classList.remove('muted');
        videoBtn.innerHTML = '<i class="fas fa-video"></i>';
    }
}

function toggleScreenShare() {
    const screenShareBtn = document.getElementById('screen-share-btn');
    screenShareBtn.classList.toggle('active');
    
    if (screenShareBtn.classList.contains('active')) {
        alert('Screen sharing started');
    } else {
        alert('Screen sharing stopped');
    }
}

function toggleChat() {
    isChatOpen = !isChatOpen;
    const chatPanel = document.getElementById('chat-panel');
    const chatBtn = document.getElementById('chat-btn');
    
    if (isChatOpen) {
        chatPanel.classList.add('open');
        chatBtn.classList.add('active');
    } else {
        chatPanel.classList.remove('open');
        chatBtn.classList.remove('active');
    }
}

function sendMessage(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message patient';
    messageElement.textContent = message;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    chatInput.value = '';
    
    // Simulate doctor response
    setTimeout(() => {
        const doctorMessage = document.createElement('div');
        doctorMessage.className = 'chat-message doctor';
        doctorMessage.textContent = 'Thank you for the information. I\'ll review this.';
        
        chatMessages.appendChild(doctorMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 2000);
}

function showConsultationSummary() {
    const duration = Math.floor((new Date() - callStartTime) / 60000);
    alert(`Consultation completed!\\n\\nDuration: ${duration} minutes\\n\\nA summary and prescription will be sent to your email and available in your medical history.`);
    
    // Add to consultations history
    consultations.unshift({
        id: consultations.length + 1,
        doctorName: document.getElementById('doctor-name').textContent,
        specialty: "General Medicine",
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        duration: `${duration} minutes`,
        diagnosis: "Consultation completed via video call",
        prescription: "Available in medical history"
    });
    
    loadConsultations();
}

// ===== APPOINTMENTS MANAGEMENT =====

function loadAppointments() {
    const appointmentsList = document.getElementById('appointments-list');
    if (!appointmentsList) return;

    if (appointments.length === 0) {
        appointmentsList.innerHTML = `
            <div class="no-appointments">
                <p>No upcoming appointments</p>
                <button onclick="showBookingModal()" class="book-now-btn">Book Your First Consultation</button>
            </div>
        `;
        return;
    }

    appointmentsList.innerHTML = appointments.map(appointment => `
        <div class="appointment-card">
            <div class="appointment-header">
                <div class="appointment-time">
                    ${formatDate(appointment.date)} at ${formatTime(appointment.time)}
                </div>
                <span class="appointment-status status-${appointment.status}">
                    ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
            </div>
            
            <div class="appointment-details">
                <h4>${appointment.doctorName}</h4>
                <p class="specialty">${appointment.specialty}</p>
                <p class="complaint"><strong>Concern:</strong> ${appointment.complaint}</p>
                <p class="type"><strong>Type:</strong> ${appointment.type}</p>
            </div>
            
            <div class="appointment-actions">
                <button onclick="rescheduleAppointment(${appointment.id})" class="reschedule-btn">
                    Reschedule
                </button>
                <button onclick="cancelAppointment(${appointment.id})" class="cancel-btn">
                    Cancel
                </button>
                ${appointment.status === 'confirmed' ? `
                    <button onclick="joinConsultation(${appointment.id})" class="join-btn">
                        Join Call
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function showMyAppointments() {
    document.getElementById('telemedicine').scrollIntoView({ behavior: 'smooth' });
    document.querySelector('.appointments-section').scrollIntoView({ behavior: 'smooth' });
}

function showAllAppointments() {
    // This would typically open a dedicated appointments page
    alert('Opening full appointments view...');
}

function rescheduleAppointment(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (confirm(`Reschedule appointment with ${appointment.doctorName}?`)) {
        // Open booking modal with pre-filled data
        selectedDoctor = doctors.find(d => d.id === appointment.doctorId);
        showBookingModal();
    }
}

function cancelAppointment(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (confirm(`Cancel appointment with ${appointment.doctorName} on ${formatDate(appointment.date)}?`)) {
        const index = appointments.findIndex(a => a.id === appointmentId);
        appointments.splice(index, 1);
        loadAppointments();
        alert('Appointment cancelled successfully.');
    }
}

function joinConsultation(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    
    startVideoCall(doctor);
}

// ===== CONSULTATIONS HISTORY =====

function loadConsultations() {
    const consultationsList = document.getElementById('consultations-list');
    if (!consultationsList) return;

    if (consultations.length === 0) {
        consultationsList.innerHTML = `
            <div class="no-consultations">
                <p>No previous consultations</p>
            </div>
        `;
        return;
    }

    consultationsList.innerHTML = consultations.slice(0, 3).map(consultation => `
        <div class="consultation-card">
            <div class="consultation-header">
                <div class="consultation-date">
                    ${formatDate(consultation.date)} at ${consultation.time}
                </div>
                <div class="consultation-duration">${consultation.duration}</div>
            </div>
            
            <div class="consultation-details">
                <h4>${consultation.doctorName}</h4>
                <p class="specialty">${consultation.specialty}</p>
                <p class="diagnosis"><strong>Diagnosis:</strong> ${consultation.diagnosis}</p>
                <p class="prescription"><strong>Prescription:</strong> ${consultation.prescription}</p>
            </div>
            
            <div class="consultation-actions">
                <button onclick="viewConsultationDetails(${consultation.id})" class="view-details-btn">
                    View Details
                </button>
                <button onclick="downloadPrescription(${consultation.id})" class="download-btn">
                    Download Prescription
                </button>
            </div>
        </div>
    `).join('');
}

function showMedicalHistory() {
    alert('Opening medical history...\n\nThis would show:\n- All past consultations\n- Prescriptions\n- Lab reports\n- Medical documents\n- Health timeline');
}

function viewConsultationDetails(consultationId) {
    const consultation = consultations.find(c => c.id === consultationId);
    alert(`Consultation Details:\n\nDoctor: ${consultation.doctorName}\nDate: ${formatDate(consultation.date)}\nTime: ${consultation.time}\nDuration: ${consultation.duration}\n\nDiagnosis: ${consultation.diagnosis}\nPrescription: ${consultation.prescription}`);
}

function downloadPrescription(consultationId) {
    alert('Prescription download started...\n\nThe prescription will be downloaded as a PDF file.');
}

// ===== UTILITY FUNCTIONS =====

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

// ===== EVENT LISTENERS =====

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const bookingModal = document.getElementById('bookingModal');
    const videoCallModal = document.getElementById('videoCallModal');
    
    if (event.target === bookingModal && bookingModal.classList.contains('show')) {
        closeBookingModal();
    }
    
    // Don't close video call modal by clicking outside during active call
    if (event.target === videoCallModal && !isCallActive && videoCallModal.classList.contains('show')) {
        endCall();
    }
});

// Handle escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const bookingModal = document.getElementById('bookingModal');
        if (bookingModal && bookingModal.classList.contains('show')) {
            closeBookingModal();
        }
    }
});

// Export functions for global access
window.telemedicine = {
    showBookingModal,
    closeBookingModal,
    bookWithDoctor,
    findInstantDoctor,
    startInstantConsultation,
    filterDoctors,
    showMyAppointments,
    showMedicalHistory,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    toggleChat,
    sendMessage,
    sendChatMessage,
    endCall,
    nextStep,
    prevStep,
    confirmBooking,
    loadAvailableSlots,
    selectTimeSlot,
    selectDoctor,
    rescheduleAppointment,
    cancelAppointment,
    joinConsultation,
    viewConsultationDetails,
    downloadPrescription,
    showAllAppointments
};
