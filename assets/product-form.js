class ProductForm extends HTMLElement {
  constructor() {
    super();
    
    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cartNotification = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
    this.submitButton = this.querySelector('[type="submit"]');
    
    // Initialiser les données produit
    const productJson = document.querySelector('[data-product-json]');
    if (productJson) {
      this.product = JSON.parse(productJson.textContent);
      this.variantData = this.product.variants;
      this.currentVariant = this.product.selected_or_first_available_variant;
    }
    
    // Événements pour les variantes
    this.setupVariantListeners();
    
    console.log('🚀 ProductForm initialisé:', this.product?.title);
  }

  setupVariantListeners() {
    // Écouter les changements sur tous les inputs de variantes
    this.querySelectorAll('input[name^="options["], select[name^="options["]').forEach(input => {
      input.addEventListener('change', this.onVariantChange.bind(this));
      
      // Log pour debug
      console.log('📋 Input variante ajouté:', input.name, input.value);
    });

    // Événements spéciaux pour les boutons quantité
    this.querySelectorAll('.quantity__button').forEach(button => {
      button.addEventListener('click', this.onQuantityChange.bind(this));
    });
  }

  onVariantChange(event) {
    console.log('🔄 Changement variante détecté:', event.target.name, event.target.value);
    
    const selectedOptions = this.getSelectedOptions();
    console.log('🎯 Options sélectionnées:', selectedOptions);
    
    const variant = this.getVariantFromOptions(selectedOptions);
    console.log('🎨 Variante trouvée:', variant);
    
    if (variant) {
      this.updateVariant(variant);
    } else {
      console.error('❌ Aucune variante trouvée pour:', selectedOptions);
      this.toggleSubmitButton(false, true);
    }
  }

  getSelectedOptions() {
    const selectedOptions = [];
    
    // Récupérer les valeurs de tous les sélecteurs d'options
    for (let i = 1; i <= 3; i++) {
      const radioInput = this.querySelector(`input[data-option-position="${i}"]:checked`);
      const selectInput = this.querySelector(`select[data-option-position="${i}"]`);
      
      if (radioInput) {
        selectedOptions[i-1] = radioInput.value;
      } else if (selectInput) {
        selectedOptions[i-1] = selectInput.value;
      }
    }
    
    return selectedOptions.filter(option => option !== undefined);
  }

  getVariantFromOptions(options) {
    return this.variantData.find(variant => {
      return options.every((option, index) => {
        return variant.options[index] === option;
      });
    });
  }

  updateVariant(variant) {
    this.currentVariant = variant;
    
    console.log('✅ Mise à jour variante:', variant.title);
    
    // Mettre à jour l'input caché de l'ID
    const variantIdInput = this.form.querySelector('input[name="id"]');
    if (variantIdInput) {
      variantIdInput.value = variant.id;
      variantIdInput.disabled = false;
      console.log('🆔 ID variante mis à jour:', variant.id);
    }

    // Mettre à jour l'image du produit
    this.updateProductImage(variant);

    // Mettre à jour le prix
    this.updateProductPrice(variant);

    // Mettre à jour la disponibilité
    this.toggleSubmitButton(variant.available, false);

    // Mettre à jour l'URL
    this.updateURL(variant);

    // Déclencher un événement personnalisé
    this.dispatchEvent(new CustomEvent('variant:change', {
      detail: { variant: variant },
      bubbles: true
    }));
  }

  updateProductImage(variant) {
    if (!variant.featured_image) return;

    const productImages = document.querySelectorAll('.product__media img, .product-image img, [data-product-image], #mainProductImage');
    
    productImages.forEach(img => {
      if (img.src !== variant.featured_image.src) {
        console.log('🖼️ Mise à jour image:', variant.featured_image.src);
        img.src = variant.featured_image.src;
        img.srcset = variant.featured_image.srcset || '';
        img.alt = variant.featured_image.alt || variant.title;
      }
    });
  }

  updateProductPrice(variant) {
    const priceElements = document.querySelectorAll('.price .price__current, [data-price-current], .new-price-large');
    const comparePriceElements = document.querySelectorAll('.price .price__compare, [data-price-compare], .old-price-large');
    
    priceElements.forEach(el => {
      el.textContent = this.formatMoney(variant.price);
    });
    
    comparePriceElements.forEach(el => {
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        el.textContent = this.formatMoney(variant.compare_at_price);
        el.style.display = 'inline';
      } else {
        el.style.display = 'none';
      }
    });

    console.log('💰 Prix mis à jour:', this.formatMoney(variant.price));
  }

  toggleSubmitButton(available, unavailable) {
    const submitButton = this.submitButton;
    const buyNowButton = this.form.querySelector('button[name="buy_now"]');
    const submitText = submitButton.querySelector('span');
    
    if (available) {
      submitButton.disabled = false;
      submitButton.setAttribute('aria-disabled', 'false');
      if (buyNowButton) {
        buyNowButton.disabled = false;
      }
      if (submitText) {
        submitText.textContent = submitButton.dataset.addText || 'Ajouter au panier';
      }
    } else {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-disabled', 'true');
      if (buyNowButton) {
        buyNowButton.disabled = true;
      }
      if (submitText && !unavailable) {
        submitText.textContent = submitButton.dataset.soldOutText || 'Épuisé';
      }
    }
  }

  updateURL(variant) {
    if (!variant || !window.history.replaceState) return;
    
    const url = new URL(window.location);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url);
  }

  formatMoney(cents) {
    return (cents / 100).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    });
  }

  onQuantityChange(event) {
    event.preventDefault();
    
    const input = this.querySelector('.quantity__input');
    const previousValue = parseInt(input.value);
    const isPlus = event.currentTarget.name === 'plus';
    
    if (isPlus) {
      input.value = previousValue + 1;
    } else if (previousValue > 1) {
      input.value = previousValue - 1;
    }
  }

  onSubmitHandler(evt) {
    evt.preventDefault();
    
    if (!this.currentVariant) {
      console.error('❌ Aucune variante sélectionnée');
      return;
    }

    if (!this.currentVariant.available) {
      console.error('❌ Variante non disponible');
      return;
    }

    this.handleErrorMessage();
    
    this.submitButton.setAttribute('aria-disabled', 'true');
    this.submitButton.classList.add('loading');
    const spinner = this.querySelector('.loading__spinner');
    if (spinner) spinner.classList.remove('hidden');

    const formData = new FormData(this.form);
    
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          this.handleErrorMessage(response.description);
          return;
        }

        if (!this.cartNotification) {
          window.location = '/cart';
          return;
        }

        // Déclencher événement d'ajout au panier
        document.dispatchEvent(new CustomEvent('cart:item-added'));
      })
      .catch((e) => {
        console.error('Erreur ajout au panier:', e);
        this.handleErrorMessage('Une erreur est survenue');
      })
      .finally(() => {
        this.submitButton.classList.remove('loading');
        this.submitButton.removeAttribute('aria-disabled');
        const spinner = this.querySelector('.loading__spinner');
        if (spinner) spinner.classList.add('hidden');
      });
  }

  handleErrorMessage(errorMessage = false) {
    const errorMessageWrapper = this.querySelector('[id*="product-form-error-message"]');
    
    if (errorMessage && errorMessageWrapper) {
      const errorMessageElement = errorMessageWrapper.querySelector('.product-form__error-message');
      if (errorMessageElement) {
        errorMessageElement.textContent = errorMessage;
      }
      errorMessageWrapper.hidden = false;
    } else if (errorMessageWrapper) {
      errorMessageWrapper.hidden = true;
    }
  }
}

// Enregistrer le composant
if (!customElements.get('product-form')) {
  customElements.define('product-form', ProductForm);
}

// Initialisation pour les anciens navigateurs
document.addEventListener('DOMContentLoaded', function() {
  const productForms = document.querySelectorAll('product-form');
  productForms.forEach(form => {
    if (!form.hasAttribute('data-initialized')) {
      new ProductForm();
      form.setAttribute('data-initialized', 'true');
    }
  });
});