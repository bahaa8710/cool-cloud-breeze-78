// Zen Ring Shopify Theme JavaScript

// Global state
let selectedColor = 'white';
let quantity = 1;
let cartCount = 0;

// Utility functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Product image gallery functions
function changeImage(index) {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && thumbnails.length > index) {
        const newSrc = thumbnails[index].querySelector('img').src;
        mainImage.src = newSrc;
        
        // Update active thumbnail
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
}

// Color selection function (for static version)
function selectColor(color) {
    selectedColor = color;
    const colorButtons = document.querySelectorAll('.color-btn');
    
    colorButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === color);
    });
}

// Quantity control functions
function changeQuantity(delta, sectionId = '') {
    const quantityInput = document.getElementById('Quantity-' + sectionId) || document.getElementById('quantity');
    
    if (quantityInput) {
        if (quantityInput.type === 'number') {
            const newQuantity = parseInt(quantityInput.value) + delta;
            if (newQuantity >= 1 && newQuantity <= 10) {
                quantityInput.value = newQuantity;
                quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        } else {
            // For span elements
            const newQuantity = quantity + delta;
            if (newQuantity >= 1 && newQuantity <= 10) {
                quantity = newQuantity;
                quantityInput.textContent = quantity;
            }
        }
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
    if (clickedButton && clickedButton.classList.contains('tab-btn')) {
        clickedButton.classList.add('active');
    }
}

// Countdown timer function - Reset daily at midnight
function updateCountdown() {
    const timer = document.getElementById('countdown-timer');
    if (!timer) return;
    
    // Get current time
    const now = new Date();
    
    // Get today's midnight + 24 hours (tomorrow midnight)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // Calculate remaining time until tomorrow midnight
    const distance = tomorrow.getTime() - now.getTime();
    
    // If distance is negative or very small, reset to 24 hours
    if (distance <= 0) {
        tomorrow.setDate(tomorrow.getDate() + 1);
        distance = tomorrow.getTime() - now.getTime();
    }
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(distance / (1000 * 60 * 60));
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

// Cart functionality
class CartAPI {
    static async addItem(variantId, quantity = 1, properties = {}) {
        try {
            const response = await fetch(window.routes.cart_add_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: variantId,
                    quantity: quantity,
                    properties: properties
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.updateCartCount();
            return data;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw error;
        }
    }

    static async getCart() {
        try {
            const response = await fetch('/cart.js');
            const cart = await response.json();
            return cart;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    }

    static async updateCartCount() {
        try {
            const cart = await this.getCart();
            const cartBubble = document.querySelector('.cart-count-bubble span[aria-hidden="true"]');
            if (cartBubble) {
                cartBubble.textContent = cart.item_count;
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }

    static async changeItemQuantity(line, quantity) {
        try {
            const response = await fetch('/cart/change.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    line: line,
                    quantity: quantity
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const cart = await response.json();
            this.updateCartCount();
            return cart;
        } catch (error) {
            console.error('Error changing item quantity:', error);
            throw error;
        }
    }
}

// Form validation (if forms are added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show loading state
function showLoading(element) {
    if (element) {
        element.style.opacity = '0.6';
        element.style.pointerEvents = 'none';
    }
}

// Hide loading state
function hideLoading(element) {
    if (element) {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize product page specific functionality
    if (document.querySelector('.product-section')) {
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
                e.preventDefault();
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
    }
    
    // Set up form submissions for ADD TO CART buttons only (not dynamic checkout)
    const productForms = document.querySelectorAll('form[action*="/cart/add"]');
    productForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            // Only prevent default for the "Add to Cart" button, not dynamic checkout
            const submitButton = e.submitter || form.querySelector('button[type="submit"]:not(.shopify-payment-button *)');
            
            if (!submitButton || !submitButton.classList.contains('btn-add-to-cart')) {
                // Let dynamic checkout buttons work normally
                return true;
            }
            
            e.preventDefault();
            
            const formData = new FormData(form);
            const variantId = formData.get('id');
            const quantity = parseInt(formData.get('quantity')) || 1;
            
            // Get properties
            const properties = {};
            for (let [key, value] of formData.entries()) {
                if (key.startsWith('properties[')) {
                    const propName = key.replace('properties[', '').replace(']', '');
                    properties[propName] = value;
                }
            }
            
            const originalText = submitButton.textContent;
            
            try {
                showLoading(submitButton);
                submitButton.textContent = 'Ajout en cours...';
                
                await CartAPI.addItem(variantId, quantity, properties);
                
                // Show success message
                submitButton.textContent = 'Ajouté au panier ✓';
                submitButton.style.background = '#10b981';
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = '';
                    hideLoading(submitButton);
                }, 2000);
                
            } catch (error) {
                console.error('Error adding to cart:', error);
                submitButton.textContent = 'Erreur - Réessayer';
                submitButton.style.background = '#dc2626';
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = '';
                    hideLoading(submitButton);
                }, 2000);
            }
        });
    });

    // Ensure dynamic checkout buttons are not blocked
    document.addEventListener('click', function(e) {
        // Don't interfere with dynamic checkout buttons
        if (e.target.closest('.shopify-payment-button') || 
            e.target.closest('[data-testid]') ||
            e.target.closest('iframe')) {
            e.stopPropagation();
            return true;
        }
    }, true);
    
    // Add loading states for better UX
    const buttons = document.querySelectorAll('button:not([type="submit"])');
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
    const cards = document.querySelectorAll('.benefit-card, .testimonial-card, .secondary-benefit, .tab-card, .product-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02) translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });

    // Initialize cart functionality
    CartAPI.updateCartCount();
});

// Handle cart drawer (if implemented)
class CartDrawer extends HTMLElement {
    constructor() {
        super();
        
        this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
        this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
        this.setHeaderCartIconAccessibility();
    }

    setHeaderCartIconAccessibility() {
        const cartLink = document.querySelector('#cart-icon-bubble');
        cartLink.setAttribute('role', 'button');
        cartLink.setAttribute('aria-haspopup', 'dialog');
        cartLink.addEventListener('click', (event) => {
            event.preventDefault();
            this.open(cartLink)
        });
        cartLink.addEventListener('keydown', (event) => {
            if (event.code.toUpperCase() === 'SPACE') {
                event.preventDefault();
                this.open(cartLink);
            }
        });
    }

    open(triggeredBy) {
        if (triggeredBy) this.setActiveElement(triggeredBy);
        const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
        if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
        
        // Prevent page from scrolling when drawer is open
        setTimeout(() => {
            this.classList.add('animate', 'active');
        });

        this.addEventListener('transitionend', () => {
            const containerToTrapFocusOn = this.classList.contains('is-empty') ? this.querySelector('.drawer__inner-empty') : document.getElementById('CartDrawer');
            const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
            trapFocus(containerToTrapFocusOn, focusElement);
        }, { once: true });

        document.body.classList.add('overflow-hidden');
    }

    close() {
        this.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
        removeTrapFocus(this.activeElement);
    }

    setSummaryAccessibility(cartDrawerNote) {
        cartDrawerNote.setAttribute('role', 'button');
        cartDrawerNote.setAttribute('aria-expanded', 'false');

        if(cartDrawerNote.nextElementSibling.getAttribute('id')) {
            cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
        }

        cartDrawerNote.addEventListener('click', (event) => {
            event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
        });

        cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
    }

    renderContents(parsedState) {
        this.querySelector('.drawer__inner').classList.contains('is-empty') && this.querySelector('.drawer__inner').classList.remove('is-empty');
        this.productId = parsedState.id;
        this.getSectionsToRender().forEach((section => {
            const sectionElement = section.selector ? document.querySelector(section.selector) : document.getElementById(section.id);
            sectionElement && sectionElement.replaceWith(this.getSectionInnerHTML(parsedState.sections[section.section], section.selector));
        }));

        setTimeout(() => {
            this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
            this.open();
        });
    }

    getSectionInnerHTML(html, selector = '.shopify-section') {
        return new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector(selector).innerHTML;
    }

    getSectionsToRender() {
        return [
            {
                id: 'cart-drawer',
                section: 'cart-drawer',
                selector: '#CartDrawer'
            },
            {
                id: 'cart-icon-bubble',
                section: 'cart-icon-bubble',
                selector: '.shopify-section'
            }
        ];
    }

    getSectionDOM(html, selector = '.shopify-section') {
        return new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector(selector);
    }

    setActiveElement(element) {
        this.activeElement = element;
    }
}

customElements.define('cart-drawer', CartDrawer);

// Global functions for Shopify compatibility
window.scrollToSection = scrollToSection;
window.changeImage = changeImage;
window.selectColor = selectColor;
window.changeQuantity = changeQuantity;
window.showTab = showTab;

// Utility functions for Shopify theme
window.ZenRingTheme = {
    // Function to get current product state
    getProductState: function() {
        return {
            selectedColor: selectedColor,
            quantity: quantity,
            cartCount: cartCount
        };
    },
    
    // Function to set product state
    setProductState: function(state) {
        if (state.selectedColor) selectedColor = state.selectedColor;
        if (state.quantity) quantity = state.quantity;
        if (state.cartCount) cartCount = state.cartCount;
        
        // Update UI
        const quantityElement = document.getElementById('quantity');
        if (quantityElement) {
            quantityElement.textContent = quantity;
        }
        
        // Update color selection
        if (state.selectedColor) {
            selectColor(state.selectedColor);
        }
    },
    
    // Function to format price
    formatPrice: function(price, currency = 'EUR') {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency
        }).format(price / 100);
    },
    
    // Function to track events (ready for analytics)
    trackEvent: function(eventName, properties = {}) {
        console.log('Event tracked:', eventName, properties);
        
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, properties);
        }
        
        // Enhanced Ecommerce for GA4
        if (eventName === 'add_to_cart' && typeof gtag !== 'undefined') {
            gtag('event', 'add_to_cart', {
                currency: 'EUR',
                value: properties.value || 0,
                items: properties.items || []
            });
        }
    },

    // Cart utilities
    cart: CartAPI
};

// Focus trap utility (for accessibility)
function trapFocus(container, elementToFocus = container) {
    var elements = getFocusableElements(container);
    var first = elements[0];
    var last = elements[elements.length - 1];

    removeTrapFocus();

    container.setAttribute('tabindex', '-1');
    elementToFocus.focus();

    function handleTab(event) {
        if (event.code.toUpperCase() !== 'TAB') return;

        if (elements.length === 1) {
            event.preventDefault();
            return;
        }

        if (event.target === last && !event.shiftKey) {
            event.preventDefault();
            first.focus();
        }

        if (event.target === first && event.shiftKey) {
            event.preventDefault();
            last.focus();
        }
    }

    document.addEventListener('keydown', handleTab);
}

function getFocusableElements(container) {
    return Array.from(
        container.querySelectorAll(
            "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
        )
    );
}

function removeTrapFocus(elementToFocus = null) {
    document.removeEventListener('keydown', handleTab);

    if (elementToFocus) elementToFocus.focus();
}

// Escape key handler
function onKeyUpEscape(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    const openDetailsElement = event.target.closest('details[open]');
    if (!openDetailsElement) return;

    const summaryElement = openDetailsElement.querySelector('summary');
    openDetailsElement.removeAttribute('open');
    summaryElement.setAttribute('aria-expanded', false);
    summaryElement.focus();
}

// Initialize Shopify dynamic checkout after content loads
function initializeDynamicCheckout() {
    // Make sure Shopify's payment button scripts are loaded
    if (window.Shopify && window.Shopify.PaymentButton) {
        window.Shopify.PaymentButton.init();
    }
    
    // Remove any JavaScript that might interfere with payment buttons
    const paymentButtons = document.querySelectorAll('.shopify-payment-button');
    paymentButtons.forEach(button => {
        // Ensure buttons are not blocked by any overlay or other elements
        button.style.pointerEvents = 'auto';
        button.style.zIndex = '10';
        button.style.position = 'relative';
    });
    
    // Ensure dynamic checkout forms are processed by Shopify
    setTimeout(() => {
        const dynamicForms = document.querySelectorAll('.dynamic-checkout-form');
        dynamicForms.forEach(form => {
            if (window.Shopify && window.Shopify.PaymentButton) {
                window.Shopify.PaymentButton.init();
            }
        });
    }, 100);
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDynamicCheckout();
});

// Also call it after any AJAX updates
document.addEventListener('shopify:section:load', function() {
    initializeDynamicCheckout();
});

// Debounce utility
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}