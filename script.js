// ===== CUSTOM PRODUCT SECTION FUNCTIONS =====

// Custom image change for configurable product section
function changeImageCustom(index, sectionId) {
    const mainImage = document.getElementById('mainProductImageCustom');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Use the section-specific images array
    const imagesArray = window['productImagesCustom' + sectionId] || [];
    
    if (mainImage && index >= 0 && index < imagesArray.length) {
        mainImage.src = imagesArray[index];
        
        // Update active thumbnail
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
}

// Custom quantity control for configurable product section
function changeQuantityCustom(delta, sectionId) {
    const quantityInput = document.getElementById('QuantityCustom-' + sectionId);
    const newQuantity = parseInt(quantityInput.value) + delta;
    
    if (newQuantity >= 1 && newQuantity <= 10) {
        quantityInput.value = newQuantity;
    }
}

// ===== ORIGINAL FUNCTIONS (LEGACY SUPPORT) =====
const productImages = [
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=400&q=80"
];

// Global state
let quantity = 1;
let cartCount = 0;

// Quantity control functions
function changeQuantity(delta) {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
        quantity = newQuantity;
        const quantityElement = document.getElementById('quantity');
        if (quantityElement) {
            quantityElement.textContent = quantity;
        }
    }
}

// Add to cart function
function addToCart() {
    cartCount += quantity;
    
    // Show success message
    const message = `${quantity} Zen Ring ajoutée(s) au panier !`;
    
    if (typeof alert !== 'undefined') {
        alert(message);
    } else {
        // Fallback for environments without alert
        console.log(message);
    }
    
    // Reset quantity
    quantity = 1;
    const quantityElement = document.getElementById('quantity');
    if (quantityElement) {
        quantityElement.textContent = quantity;
    }
}

// Tab functionality for product page
function showTab(tabName) {
    // Hide all tab panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab pane
    const selectedPane = document.getElementById(tabName);
    if (selectedPane) {
        selectedPane.classList.add('active');
    }
    
    // Add active class to clicked button
    const clickedButton = event?.target;
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

// Countdown timer function
function updateCountdown() {
    const timer = document.getElementById('countdown-timer');
    if (!timer) return;
    
    // Get current time
    const now = new Date().getTime();
    
    // Set target time (24 hours from now for demo)
    const target = now + (24 * 60 * 60 * 1000);
    
    // Calculate remaining time
    const distance = target - now;
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Format with leading zeros
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    timer.textContent = formattedTime;
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation on scroll (for better UX)
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    const animatedElements = document.querySelectorAll('.benefit-card, .testimonial-card, .secondary-benefit');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Form validation (if forms are added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM LOADED - Initializing color sync system');
    
    // DIAGNOSTIC: List all form inputs to understand the page structure
    console.log('=== DIAGNOSTIC: ALL FORM INPUTS ===');
    const allInputs = document.querySelectorAll('input, select');
    allInputs.forEach((input, i) => {
        console.log(`Input ${i}:`, {
            type: input.type,
            name: input.name,
            value: input.value,
            id: input.id,
            className: input.className
        });
    });
    
    // Initialize countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize custom product sections if they exist
    const customProductSections = document.querySelectorAll('[id*="AddToCartFormCustom-"]');
    customProductSections.forEach(form => {
        const sectionId = form.id.replace('AddToCartFormCustom-', '');
        console.log('Initializing custom product section:', sectionId);
    });
    
    // Initialize product page specific functionality
    if (document.querySelector('.product-page')) {
        console.log('📄 Product page detected - Setting up event listeners');
        
        // Set up quantity controls
        const qtyButtons = document.querySelectorAll('.qty-btn');
        qtyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const delta = btn.textContent === '+' ? 1 : -1;
                changeQuantity(delta);
            });
        });
        
        // Set up thumbnail clicks
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                changeImage(index);
            });
        });
        
        // Set up tab clicks
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = btn.textContent.toLowerCase().split(' ')[0];
                const tabMap = {
                    'description': 'description',
                    'caractéristiques': 'specifications',
                    'avis': 'reviews',
                    'livraison': 'shipping'
                };
                showTab(tabMap[tabName] || 'description');
            });
        });
        
        // Set up add to cart button
        const buyButton = document.querySelector('.btn-buy');
        if (buyButton) {
            buyButton.addEventListener('click', addToCart);
        }
    }
    
    // Set up CTA buttons on homepage
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(btn => {
        if (btn.textContent.includes('Je veux ma Zen Ring')) {
            btn.addEventListener('click', () => {
                // Check if we're on homepage or product page
                if (window.location.pathname.includes('product')) {
                    addToCart();
                } else {
                    window.location.href = 'product.html';
                }
            });
        }
    });
    
    // Add loading states for better UX
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add a subtle loading effect
            this.style.opacity = '0.8';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 150);
        });
    });
    
    // Add hover effects for cards
    const cards = document.querySelectorAll('.benefit-card, .testimonial-card, .secondary-benefit, .tab-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02) translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
});

// Export functions for use in HTML onclick handlers
window.scrollToSection = scrollToSection;
window.changeImage = changeImage;
window.changeQuantity = changeQuantity;
window.addToCart = addToCart;
window.showTab = showTab;

// Export new custom functions
window.changeImageCustom = changeImageCustom;
window.changeQuantityCustom = changeQuantityCustom;

// Add some utility functions for Shopify conversion
window.ZenRingUtils = {
    // Function to get current product state
    getProductState: function() {
        return {
            quantity: quantity,
            cartCount: cartCount
        };
    },
    
    // Function to set product state (useful for Shopify)
    setProductState: function(state) {
        if (state.quantity) quantity = state.quantity;
        if (state.cartCount) cartCount = state.cartCount;
        
        // Update UI
        const quantityElement = document.getElementById('quantity');
        if (quantityElement) {
            quantityElement.textContent = quantity;
        }
    },
    
    // Function to format price (useful for Shopify)
    formatPrice: function(price, currency = '€') {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency === '€' ? 'EUR' : currency
        }).format(price);
    },
    
    // Function to track events (ready for analytics)
    trackEvent: function(eventName, properties = {}) {
        console.log('Event tracked:', eventName, properties);
        
        // This can be extended to work with Google Analytics, Facebook Pixel, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, properties);
        }
    }
};