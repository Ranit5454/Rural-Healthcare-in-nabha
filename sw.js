// Service Worker for Medimate Platform
// Handles caching, offline functionality, and background sync

const CACHE_NAME = 'medimate-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Resources to cache immediately
const CORE_RESOURCES = [
    '/',
    '/index.html',
    '/app.js',
    '/backend.js',
    '/style.css',
    '/offline.html',
    '/manifest.json'
];

// API endpoints to cache responses for
const API_CACHE_PATTERNS = [
    '/api/appointments',
    '/api/prescriptions',
    '/api/doctors',
    '/api/health-monitoring',
    '/api/user/profile'
];

// Install event - cache core resources
self.addEventListener('install', event => {
    console.log('📦 Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📋 Caching core resources');
                return cache.addAll(CORE_RESOURCES);
            })
            .then(() => {
                console.log('✅ Core resources cached successfully');
                // Force the waiting service worker to become the active one
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Failed to cache core resources:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('🔄 Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated');
                // Take control of all pages immediately
                return self.clients.claim();
            })
    );
});

// Fetch event - handle network requests
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Handle different types of requests
    if (request.method === 'GET') {
        if (isAPIRequest(url.pathname)) {
            // API requests - cache-first strategy
            event.respondWith(handleAPIRequest(request));
        } else if (isStaticResource(url.pathname)) {
            // Static resources - cache-first strategy
            event.respondWith(handleStaticResource(request));
        } else if (isPageRequest(request)) {
            // Page requests - network-first strategy
            event.respondWith(handlePageRequest(request));
        }
    } else {
        // POST, PUT, DELETE requests
        event.respondWith(handleDataRequest(request));
    }
});

// Background sync event
self.addEventListener('sync', event => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'medimate-background-sync') {
        event.waitUntil(performBackgroundSync());
    }
});

// Push notification event
self.addEventListener('push', event => {
    console.log('📱 Push notification received');
    
    const options = {
        body: 'You have a new notification from Medimate',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/'
        },
        actions: [
            {
                action: 'open',
                title: 'Open App',
                icon: '/icon-32x32.png'
            }
        ]
    };
    
    if (event.data) {
        const pushData = event.data.json();
        options.body = pushData.body || options.body;
        options.title = pushData.title || 'Medimate';
        options.data = pushData.data || options.data;
    }
    
    event.waitUntil(
        self.registration.showNotification('Medimate', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', event => {
    console.log('📱 Notification clicked');
    
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then(clientList => {
            // Check if app is already open
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // Open new window if app is not open
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Helper functions

// Check if request is for API
function isAPIRequest(pathname) {
    return pathname.startsWith('/api/');
}

// Check if request is for static resource
function isStaticResource(pathname) {
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
    return staticExtensions.some(ext => pathname.endsWith(ext));
}

// Check if request is for a page
function isPageRequest(request) {
    return request.destination === 'document' || 
           request.headers.get('accept')?.includes('text/html');
}

// Handle API requests with cache-first strategy
async function handleAPIRequest(request) {
    const cache = await caches.open(CACHE_NAME);
    
    try {
        // Try network first for API requests to get fresh data
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        // If network fails, try cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            console.log('📋 Serving API response from cache:', request.url);
            return cachedResponse;
        }
        
        // Return offline response if nothing else works
        return createOfflineAPIResponse();
        
    } catch (error) {
        console.log('🔴 Network failed, trying cache for API:', request.url);
        
        // Network failed, try cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            console.log('📋 Serving API response from cache:', request.url);
            return cachedResponse;
        }
        
        // Return offline response
        return createOfflineAPIResponse();
    }
}

// Handle static resources with cache-first strategy
async function handleStaticResource(request) {
    const cache = await caches.open(CACHE_NAME);
    
    // Try cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        console.log('📋 Serving static resource from cache:', request.url);
        return cachedResponse;
    }
    
    try {
        // Try network if not in cache
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache the response
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('🔴 Failed to load static resource:', request.url);
        return new Response('Resource not available offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Handle page requests with network-first strategy
async function handlePageRequest(request) {
    const cache = await caches.open(CACHE_NAME);
    
    try {
        // Try network first for pages
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful page responses
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        // If network response is not ok, try cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            console.log('📋 Serving page from cache:', request.url);
            return cachedResponse;
        }
        
        // Return offline page
        return caches.match(OFFLINE_URL);
        
    } catch (error) {
        console.log('🔴 Network failed for page, trying cache:', request.url);
        
        // Network failed, try cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            console.log('📋 Serving page from cache:', request.url);
            return cachedResponse;
        }
        
        // Return offline page
        return caches.match(OFFLINE_URL);
    }
}

// Handle data requests (POST, PUT, DELETE)
async function handleDataRequest(request) {
    try {
        // Try to make the request
        const response = await fetch(request);
        
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        
        return response;
        
    } catch (error) {
        console.log('🔴 Data request failed, queuing for sync:', request.url);
        
        // Store the request for background sync
        await queueFailedRequest(request);
        
        // Return a response indicating the request will be retried
        return new Response(JSON.stringify({
            success: false,
            message: 'Request queued for sync when online',
            offline: true
        }), {
            status: 202,
            statusText: 'Accepted',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

// Queue failed requests for background sync
async function queueFailedRequest(request) {
    try {
        const requestData = {
            url: request.url,
            method: request.method,
            headers: Object.fromEntries(request.headers.entries()),
            body: request.method !== 'GET' ? await request.text() : null,
            timestamp: Date.now()
        };
        
        // Store in IndexedDB
        const db = await openSyncDB();
        const transaction = db.transaction(['sync_queue'], 'readwrite');
        const store = transaction.objectStore('sync_queue');
        
        await store.add(requestData);
        
        console.log('📋 Request queued for sync:', requestData);
        
    } catch (error) {
        console.error('❌ Failed to queue request for sync:', error);
    }
}

// Perform background sync
async function performBackgroundSync() {
    console.log('🔄 Performing background sync...');
    
    try {
        const db = await openSyncDB();
        const transaction = db.transaction(['sync_queue'], 'readwrite');
        const store = transaction.objectStore('sync_queue');
        
        const request = store.getAll();
        const queuedRequests = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        
        console.log(`📋 Found ${queuedRequests.length} requests to sync`);
        
        for (const requestData of queuedRequests) {
            try {
                // Recreate the request
                const fetchOptions = {
                    method: requestData.method,
                    headers: requestData.headers
                };
                
                if (requestData.body) {
                    fetchOptions.body = requestData.body;
                }
                
                // Try to send the request
                const response = await fetch(requestData.url, fetchOptions);
                
                if (response.ok) {
                    // Remove from queue on success
                    await store.delete(requestData.id);
                    console.log('✅ Synced request:', requestData.url);
                } else {
                    console.log('❌ Failed to sync request:', requestData.url, response.status);
                }
                
            } catch (error) {
                console.log('❌ Error syncing request:', requestData.url, error);
            }
        }
        
        console.log('✅ Background sync completed');
        
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// Open sync database
async function openSyncDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('MedimateSyncDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains('sync_queue')) {
                const store = db.createObjectStore('sync_queue', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                
                store.createIndex('timestamp', 'timestamp', { unique: false });
                store.createIndex('url', 'url', { unique: false });
            }
        };
    });
}

// Create offline API response
function createOfflineAPIResponse() {
    const offlineResponse = {
        success: false,
        message: 'This feature is not available offline',
        offline: true,
        data: null
    };
    
    return new Response(JSON.stringify(offlineResponse), {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// Preload critical resources
async function preloadCriticalResources() {
    const cache = await caches.open(CACHE_NAME);
    
    const criticalResources = [
        '/api/user/profile',
        '/api/appointments?limit=10',
        '/api/prescriptions?status=active'
    ];
    
    for (const resource of criticalResources) {
        try {
            const response = await fetch(resource);
            if (response.ok) {
                await cache.put(resource, response);
                console.log('📋 Preloaded critical resource:', resource);
            }
        } catch (error) {
            console.log('❌ Failed to preload resource:', resource);
        }
    }
}

// Message handling for communication with main thread
self.addEventListener('message', event => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'PRELOAD_CRITICAL':
            event.waitUntil(preloadCriticalResources());
            break;
            
        case 'CLEAR_CACHE':
            event.waitUntil(
                caches.delete(CACHE_NAME).then(() => {
                    console.log('🗑️ Cache cleared');
                })
            );
            break;
            
        case 'GET_CACHE_SIZE':
            event.waitUntil(
                getCacheSize().then(size => {
                    event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
                })
            );
            break;
    }
});

// Get cache size
async function getCacheSize() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        
        let totalSize = 0;
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
        
        return totalSize;
    } catch (error) {
        console.error('❌ Error calculating cache size:', error);
        return 0;
    }
}

console.log('🚀 Medimate Service Worker loaded');
// Medimate - Enhanced Animation Effects
// Add this to your existing app.js file or create a new animations.js file

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all animation effects
    initializeRippleEffects();
    initializeScrollAnimations();
    initializeHeaderScrollEffect();
    initializeTabAnimations();
    initializeCardInteractions();
    
});

// Ripple Effect for clickable elements
function initializeRippleEffects() {
    const clickableElements = document.querySelectorAll(
        '.feature-card, .emergency-card, .tab-btn, .search-btn, .filter-btn, ' +
        '.sync-btn, .clear-btn, .download-btn, .subscribe-btn, .refresh-btn, ' +
        '.login-btn, .menu-option, .facility-item, .guideline-tab'
    );
    
    clickableElements.forEach(element => {
        element.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });
    });
}

// Create ripple effect
function createRippleEffect(element, event) {
    // Remove existing ripples
    const existingRipples = element.querySelectorAll('.ripple');
    existingRipples.forEach(ripple => ripple.remove());
    
    // Create new ripple
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        pointer-events: none;
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// Add ripple animation keyframes
function addRippleStyles() {
    if (document.getElementById('ripple-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .ripple {
            animation: ripple-animation 0.6s linear;
        }
    `;
    document.head.appendChild(style);
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Add stagger effect for grid items
                if (entry.target.parentElement.classList.contains('features-grid') ||
                    entry.target.parentElement.classList.contains('emergency-grid')) {
                    addStaggerAnimation(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll(
        '.feature-card, .emergency-card, .content-section, ' +
        '.section-header, .facility-item'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Add stagger animation to grid items
function addStaggerAnimation(element) {
    const siblings = Array.from(element.parentElement.children);
    const index = siblings.indexOf(element);
    element.style.animationDelay = `${index * 0.1}s`;
}

// Header scroll effect
function initializeHeaderScrollEffect() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (!header) return;
        
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.style.transform = 'translateY(-10px)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        } else {
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Enhanced tab animations
function initializeTabAnimations() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
        
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.transform = 'translateY(0) scale(1)';
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            this.style.transform = 'translateY(-3px) scale(1.05)';
            
            // Add pulse effect
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'activeTabShift 3s ease-in-out infinite, pulse 0.5s ease';
            }, 10);
        });
    });
}

// Enhanced card interactions
function initializeCardInteractions() {
    // Feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            addGlowEffect(this);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            removeGlowEffect(this);
        });
    });
    
    // Emergency cards
    const emergencyCards = document.querySelectorAll('.emergency-card');
    emergencyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 15px 40px rgba(255, 107, 107, 0.4)';
            addPulseEffect(this);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            removePulseEffect(this);
        });
    });
}

// Add glow effect
function addGlowEffect(element) {
    element.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.2), 0 0 20px rgba(102, 126, 234, 0.1)';
}

// Remove glow effect
function removeGlowEffect(element) {
    element.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
}

// Add pulse effect
function addPulseEffect(element) {
    const icon = element.querySelector('.emergency-number, h3');
    if (icon) {
        icon.style.animation = 'pulse 1s ease-in-out infinite';
    }
}

// Remove pulse effect
function removePulseEffect(element) {
    const icon = element.querySelector('.emergency-number, h3');
    if (icon) {
        icon.style.animation = 'none';
    }
}

// Color transition effects for buttons
function initializeColorTransitions() {
    const buttons = document.querySelectorAll(
        '.search-btn, .filter-btn, .sync-btn, .clear-btn, ' +
        '.download-btn, .subscribe-btn, .refresh-btn'
    );
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Save original colors
            const originalAnimation = this.style.animation;
            
            // Apply rapid color change
            this.style.animation = 'none';
            this.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
            
            setTimeout(() => {
                this.style.background = 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)';
            }, 100);
            
            setTimeout(() => {
                this.style.background = 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)';
            }, 200);
            
            setTimeout(() => {
                this.style.background = '';
                this.style.animation = originalAnimation;
            }, 300);
        });
    });
}

// Facility item animations
function initializeFacilityAnimations() {
    const facilityItems = document.querySelectorAll('.facility-item');
    
    facilityItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
            this.style.borderLeftWidth = '8px';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
            this.style.borderLeftWidth = '4px';
        });
    });
}

// Loading animations
function showLoadingAnimation(element) {
    element.classList.add('loading');
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = '<div class="spinner"></div>';
    element.appendChild(spinner);
}

function hideLoadingAnimation(element) {
    element.classList.remove('loading');
    const spinner = element.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Notification animations
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s ease;
        max-width: 350px;
        animation: slideInRight 0.3s ease forwards;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'info': 'ℹ️',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌'
    };
    return icons[type] || icons.info;
}

// Add notification animation styles
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
    `;
    document.head.appendChild(style);
}

// Initialize all styles
addRippleStyles();
addNotificationStyles();

// Export functions for use in other files
window.MedimateAnimations = {
    showNotification,
    showLoadingAnimation,
    hideLoadingAnimation,
    createRippleEffect
};

// Enhanced modal animations
function enhanceModalAnimations() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const originalDisplay = modal.style.display;
        
        // Override modal show function
        modal.show = function() {
            this.style.display = 'flex';
            this.style.opacity = '0';
            this.style.transform = 'scale(0.9)';
            
            requestAnimationFrame(() => {
                this.style.transition = 'all 0.3s ease';
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });
        };
        
        // Override modal hide function
        modal.hide = function() {
            this.style.transition = 'all 0.3s ease';
            this.style.opacity = '0';
            this.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                this.style.display = 'none';
            }, 300);
        };
    });
}

// Call enhanced modal animations
enhanceModalAnimations();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize color transitions and facility animations
initializeColorTransitions();
initializeFacilityAnimations();