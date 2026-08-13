/**
 * Portfolio Website - Vanilla JavaScript
 * Full-Stack Developer Portfolio
 * No dependencies, pure vanilla JS
 */

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {Number} limit - Time limit in milliseconds
 */
const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

/**
 * Debounce function to delay function calls
 * @param {Function} func - Function to debounce
 * @param {Number} delay - Delay in milliseconds
 */
const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

/**
 * Smooth scroll to element
 * @param {Element} element - Target element
 * @param {Number} duration - Animation duration
 */
const smoothScrollTo = (element, duration = 1000) => {
    const startPosition = window.pageYOffset;
    const endPosition = element.offsetTop - 80;
    const distance = endPosition - startPosition;
    let start = null;

    if (distance === 0) return;

    window.requestAnimationFrame(function scroll(currentTime) {
        if (start === null) start = currentTime;
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out-cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        window.scrollTo(0, startPosition + distance * easeProgress);

        if (elapsed < duration) {
            window.requestAnimationFrame(scroll);
        }
    });
};

// ================================
// NAVIGATION FUNCTIONALITY
// ================================

class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.navItems = document.querySelectorAll('.nav-link');
        this.lastScrollTop = 0;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateActiveLink();
    }

    setupEventListeners() {
        // Hamburger menu toggle
        this.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.closeMobileMenu();
            }
        });

        // Navigation link clicks
        this.navItems.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    this.closeMobileMenu();
                    smoothScrollTo(targetElement);
                    this.setActiveLink(link);
                }
            });
        });

        // Update active link on scroll
        window.addEventListener('scroll', throttle(() => {
            this.updateActiveLink();
            this.updateNavbarStyle();
        }, 100));

        // Keyboard navigation (Escape to close menu)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const isActive = this.hamburger.classList.contains('active');
        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.hamburger.classList.add('active');
        this.navLinks.classList.add('active');
        this.hamburger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll');
    }

    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navLinks.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    }

    updateNavbarStyle() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    setActiveLink(link) {
        this.navItems.forEach((item) => item.classList.remove('active'));
        link.classList.add('active');
    }

    updateActiveLink() {
        let currentSection = '';
        const sections = document.querySelectorAll('section[id]');

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection) {
            const activeLink = document.querySelector(`a[href="#${currentSection}"]`);
            if (activeLink) {
                this.setActiveLink(activeLink);
            }
        }
    }
}

// ================================
// TYPING ANIMATION
// ================================

class TypingAnimation {
    constructor(selector) {
        this.element = document.querySelector(selector);
        if (!this.element) return;

        this.text = this.element.textContent;
        this.element.textContent = '';
        this.index = 0;
        this.speed = 50;
        this.paused = false;

        this.init();
    }

    init() {
        // Start typing after a short delay
        setTimeout(() => this.type(), 300);
    }

    type() {
        if (this.paused) return;

        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
        this.type();
    }
}

// ================================
// SCROLL REVEAL ANIMATIONS
// ================================

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('[class*="card"], [class*="item"], h2, h3');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            this.elements.forEach((element) => {
                element.classList.add('scroll-reveal');
                observer.observe(element);
            });
        }
    }
}

// ================================
// BACK TO TOP BUTTON
// ================================

class BackToTopButton {
    constructor() {
        this.button = document.querySelector('.back-to-top');
        if (!this.button) return;

        this.init();
    }

    init() {
        window.addEventListener('scroll', throttle(() => this.updateVisibility(), 100));
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    updateVisibility() {
        if (window.scrollY > 300) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ================================
// FORM VALIDATION & SUBMISSION
// ================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;

        this.inputs = this.form.querySelectorAll('.form-input');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.inputs.forEach((input) => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.validateField(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (!value) {
            isValid = false;
            errorMessage = `${field.name} is required`;
        } else if (field.type === 'email') {
            isValid = this.validateEmail(value);
            if (!isValid) {
                errorMessage = 'Please enter a valid email address';
            }
        } else if (field.name === 'message' && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters';
        }

        this.updateFieldStatus(field, isValid, errorMessage);
        return isValid;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    updateFieldStatus(field, isValid, errorMessage) {
        if (isValid) {
            field.style.borderColor = '#6366f1';
            field.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
        } else if (field.value) {
            field.style.borderColor = '#ec4899';
            field.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
        } else {
            field.style.borderColor = '';
            field.style.boxShadow = '';
        }
    }

    validateForm() {
        let isFormValid = true;
        this.inputs.forEach((input) => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.showMessage('Please fill in all fields correctly', 'error');
            return;
        }

        this.submitForm();
    }

   async submitForm() {
    const formData = {
        name: this.form.querySelector('[name="name"]').value.trim(),
        email: this.form.querySelector('[name="email"]').value.trim(),
        subject: this.form.querySelector('[name="subject"]').value.trim(),
        message: this.form.querySelector('[name="message"]').value.trim()
    };

    console.log(formData);
    const originalText = this.submitButton.textContent;

    this.submitButton.disabled = true;
    this.submitButton.textContent = 'Sending...';

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            this.showMessage(
                "Message sent successfully! I'll get back to you soon.",
                "success"
            );

            this.form.reset();

            this.inputs.forEach((input) => {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            });

        } else {
            this.showMessage(result.message, "error");
        }

    } catch (error) {
        console.error(error);

        this.showMessage(
            "Unable to send message. Please try again later.",
            "error"
        );
    }

    this.submitButton.disabled = false;
    this.submitButton.textContent = originalText;
}

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            font-weight: 600;
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

// ================================
// LAZY LOADING IMAGES
// ================================

class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });

            this.images.forEach((img) => observer.observe(img));
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            this.images.forEach((img) => {
                img.src = img.dataset.src;
            });
        }
    }
}

// ================================
// KEYBOARD NAVIGATION
// ================================

class KeyboardNavigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.focusableElements = document.querySelectorAll('a, button, input, textarea, select');
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    handleKeyDown(e) {
        // Tab navigation
        if (e.key === 'Tab') {
            // Implement custom tab navigation if needed
        }

        // Arrow key navigation for nav links
        if (this.navLinks.length > 0 && e.target.closest('.nav-links')) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                this.focusNextLink();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.focusPreviousLink();
            }
        }
    }

    focusNextLink() {
        const currentActive = document.activeElement;
        const currentIndex = Array.from(this.navLinks).indexOf(currentActive);
        const nextIndex = (currentIndex + 1) % this.navLinks.length;
        this.navLinks[nextIndex].focus();
    }

    focusPreviousLink() {
        const currentActive = document.activeElement;
        const currentIndex = Array.from(this.navLinks).indexOf(currentActive);
        const prevIndex = currentIndex === 0 ? this.navLinks.length - 1 : currentIndex - 1;
        this.navLinks[prevIndex].focus();
    }
}

// ================================
// PERFORMANCE MONITORING
// ================================

class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                this.logMetrics();
            });
        }
    }

    logMetrics() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

        console.log(`Page Load Time: ${pageLoadTime}ms`);
        console.log(`DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.navigationStart}ms`);
        console.log(`First Paint: ${perfData.responseEnd - perfData.navigationStart}ms`);
    }
}

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio website loaded successfully!');

    // Initialize all modules
    new Navigation();
    new TypingAnimation('.typing-text');
    new ScrollReveal();
    new BackToTopButton();
    new ContactForm();
    new LazyLoader();
    new KeyboardNavigation();
    new PerformanceMonitor();

    // Add smooth scroll to any anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    smoothScrollTo(target);
                }
            }
        });
    });

    // Handle prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--duration-fast', '0.01ms');
        document.documentElement.style.setProperty('--duration-base', '0.01ms');
        document.documentElement.style.setProperty('--duration-slow', '0.01ms');
    }
});

// Handle dynamic content loading
window.addEventListener('error', (e) => {
    console.error('Error:', e.message);
});

// Service Worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('SW registered'))
        //     .catch(err => console.log('SW registration failed'));
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        TypingAnimation,
        ScrollReveal,
        BackToTopButton,
        ContactForm,
        LazyLoader,
        KeyboardNavigation,
        PerformanceMonitor,
        smoothScrollTo,
        throttle,
        debounce
    };
}
