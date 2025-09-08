/**
 * Product Buy Now Button
 * Gère le bouton "Acheter maintenant" pour le checkout direct
 */

class ProductBuyNow extends HTMLElement {
  constructor() {
    super();
    this.bindEvents();
  }

  bindEvents() {
    const buyNowButton = this.querySelector('[name="buy_now"]');
    if (buyNowButton) {
      buyNowButton.addEventListener('click', this.onBuyNowClick.bind(this));
    }
  }

  onBuyNowClick(event) {
    event.preventDefault();
    
    const form = this.closest('form');
    if (!form) return;

    const submitButton = this.querySelector('[name="buy_now"]');
    if (submitButton.getAttribute('aria-disabled') === 'true') return;

    this.handleErrorMessage();

    submitButton.setAttribute('aria-disabled', true);
    submitButton.classList.add('loading');

    // Créer un formulaire temporaire pour le checkout direct
    const tempForm = document.createElement('form');
    tempForm.method = 'POST';
    tempForm.action = '/cart/add';
    tempForm.style.display = 'none';

    // Copier les données du formulaire principal
    const formData = new FormData(form);
    for (let [key, value] of formData.entries()) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      tempForm.appendChild(input);
    }

    // Ajouter le paramètre pour le checkout direct
    const checkoutInput = document.createElement('input');
    checkoutInput.type = 'hidden';
    checkoutInput.name = 'return_to';
    checkoutInput.value = '/checkout';
    tempForm.appendChild(checkoutInput);

    document.body.appendChild(tempForm);

    // Soumettre le formulaire
    fetch('/cart/add', {
      method: 'POST',
      body: new FormData(tempForm),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/javascript'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        // Erreur lors de l'ajout au panier
        this.handleErrorMessage(data.description || 'Erreur lors de l\'ajout au panier');
        return;
      }
      
      // Rediriger vers le checkout
      window.location.href = '/checkout';
    })
    .catch(error => {
      console.error('Erreur lors du checkout:', error);
      this.handleErrorMessage('Erreur lors du checkout');
    })
    .finally(() => {
      submitButton.classList.remove('loading');
      submitButton.removeAttribute('aria-disabled');
      document.body.removeChild(tempForm);
    });
  }

  handleErrorMessage(errorMessage = false) {
    const errorMessageWrapper = this.querySelector('.product-form__error-message-wrapper');
    if (!errorMessageWrapper) return;
    
    const errorMessageElement = errorMessageWrapper.querySelector('.product-form__error-message');
    if (!errorMessageElement) return;

    errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

    if (errorMessage) {
      errorMessageElement.textContent = errorMessage;
    }
  }
}

// Enregistrement du custom element
customElements.define('product-buy-now', ProductBuyNow);

// Initialisation globale pour les boutons Buy Now
document.addEventListener('DOMContentLoaded', function() {
  // Gérer les boutons Buy Now existants
  const buyNowButtons = document.querySelectorAll('[name="buy_now"]');
  buyNowButtons.forEach(button => {
    if (!button.closest('product-buy-now')) {
      // Créer un wrapper si nécessaire
      const wrapper = document.createElement('product-buy-now');
      button.parentNode.insertBefore(wrapper, button);
      wrapper.appendChild(button);
    }
  });
  
  // Initialiser les éléments Buy Now
  const buyNowElements = document.querySelectorAll('product-buy-now');
  buyNowElements.forEach(element => {
    new ProductBuyNow();
  });
});