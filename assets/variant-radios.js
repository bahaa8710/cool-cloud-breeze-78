if (!customElements.get('variant-radios')) {
  customElements.define('variant-radios', class VariantRadios extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('change', this.onVariantChange);
      console.log('🎯 VariantRadios initialisé');
    }

    onVariantChange() {
      console.log('🔄 Changement de variante détecté');
      this.updateOptions();
      this.updateMasterData();
      this.toggleAddButton(true, '', false);
      this.updatePickupAvailability();
      this.removeErrorMessage();

      if (!this.currentVariant) {
        this.toggleAddButton(true, '', true);
        this.setUnavailable();
      } else {
        this.updateMedia();
        this.updateURL();
        this.updateVariantInput();
        this.renderProductInfo();
        this.updateShareUrl();
      }
    }

    updateOptions() {
      this.options = Array.from(this.querySelectorAll('input[type="radio"]:checked'), (input) => input.value);
      console.log('📋 Options sélectionnées:', this.options);
    }

    updateMasterData() {
      this.currentVariant = this.getVariantData().find((variant) => {
        return !variant.options.map((option, index) => {
          return this.options[index] === option;
        }).includes(false);
      });
      console.log('🎨 Variante courante:', this.currentVariant);
    }

    updateMedia() {
      if (!this.currentVariant) return;
      if (!this.currentVariant.featured_image) return;

      console.log('🖼️ Mise à jour de l\'image:', this.currentVariant.featured_image.src);
      
      // Mettre à jour l'image principale
      const productImages = document.querySelectorAll('.product__media img, .product-image img, [data-product-image], #mainProductImage');
      productImages.forEach(img => {
        if (img.src !== this.currentVariant.featured_image.src) {
          img.src = this.currentVariant.featured_image.src;
          img.srcset = this.currentVariant.featured_image.srcset || '';
          img.alt = this.currentVariant.featured_image.alt || this.currentVariant.title;
        }
      });

      // Mise à jour de la galerie media si elle existe
      const mediaGallery = document.getElementById(`MediaGallery-${this.dataset.section}`);
      if (mediaGallery && mediaGallery.setActiveMedia) {
        mediaGallery.setActiveMedia(`${this.dataset.section}-${this.currentVariant.featured_image.id}`, true);
      }

      // Modal product media
      const modalContent = document.querySelector(`#ProductModal-${this.dataset.section} .product-media-modal__content`);
      if (modalContent) {
        const newMediaModal = modalContent.querySelector(`[data-media-id="${this.currentVariant.featured_image.id}"]`);
        if (newMediaModal) {
          modalContent.prepend(newMediaModal);
        }
      }
    }

    updateURL() {
      if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
      window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
    }

    updateShareUrl() {
      const shareButton = document.getElementById(`Share-${this.dataset.section}`);
      if (!shareButton || !shareButton.updateUrl) return;
      shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
    }

    updateVariantInput() {
      const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`);
      productForms.forEach((productForm) => {
        const input = productForm.querySelector('input[name="id"]');
        if (input) {
          input.value = this.currentVariant.id;
          input.disabled = false;
          input.dispatchEvent(new Event('change', { bubbles: true }));
          console.log('🆔 ID variante mis à jour:', this.currentVariant.id);
        }
      });
    }

    updatePickupAvailability() {
      const pickUpAvailability = document.querySelector('pickup-availability');
      if (!pickUpAvailability) return;

      if (this.currentVariant && this.currentVariant.available) {
        pickUpAvailability.fetchAvailability(this.currentVariant.id);
      } else {
        pickUpAvailability.removeAttribute('available');
        pickUpAvailability.innerHTML = '';
      }
    }

    removeErrorMessage() {
      const productForm = this.closest('section').querySelector('product-form');
      if (productForm) productForm.handleErrorMessage();
    }

    renderProductInfo() {
      const requestedVariantId = this.currentVariant.id;
      const sectionId = this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section;

      fetch(`${this.dataset.url}?variant=${requestedVariantId}&section_id=${sectionId}`)
        .then((response) => response.text())
        .then((responseText) => {
          if (this.currentVariant?.id !== requestedVariantId) return;

          const html = new DOMParser().parseFromString(responseText, 'text/html');
          
          // Mise à jour du prix
          const destination = document.getElementById(`price-${this.dataset.section}`);
          const source = html.getElementById(`price-${sectionId}`);
          if (source && destination) {
            destination.innerHTML = source.innerHTML;
          }

          // Mise à jour des éléments de prix individuels
          this.updatePriceElements();

          const price = document.getElementById(`price-${this.dataset.section}`);
          if (price) price.classList.remove('visibility-hidden');
          
          this.toggleAddButton(!this.currentVariant.available, this.currentVariant.available ? '' : 'Épuisé');
        })
        .catch((e) => {
          console.error('Erreur lors de la mise à jour des informations produit:', e);
        });
    }

    updatePriceElements() {
      if (!this.currentVariant) return;

      // Mise à jour des prix avec les sélecteurs spécifiques de votre thème
      const priceElements = document.querySelectorAll('.new-price-large, .price__current, [data-price-current]');
      const comparePriceElements = document.querySelectorAll('.old-price-large, .price__compare, [data-price-compare]');
      
      priceElements.forEach(el => {
        el.textContent = this.formatMoney(this.currentVariant.price);
      });
      
      comparePriceElements.forEach(el => {
        if (this.currentVariant.compare_at_price && this.currentVariant.compare_at_price > this.currentVariant.price) {
          el.textContent = this.formatMoney(this.currentVariant.compare_at_price);
          el.style.display = 'inline';
        } else {
          el.style.display = 'none';
        }
      });

      console.log('💰 Prix mis à jour:', this.formatMoney(this.currentVariant.price));
    }

    formatMoney(cents) {
      return (cents / 100).toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      });
    }

    toggleAddButton(disable = true, text, modifyClass = true) {
      const productForm = document.getElementById(`product-form-${this.dataset.section}`);
      if (!productForm) return;

      const addButton = productForm.querySelector('[name="add"]');
      const addButtonText = productForm.querySelector('[name="add"] > span');
      
      if (!addButton) return;

      if (disable) {
        addButton.setAttribute('disabled', 'disabled');
        addButton.setAttribute('aria-disabled', 'true');
        if (text && addButtonText) addButtonText.textContent = text;
      } else {
        addButton.removeAttribute('disabled');
        addButton.removeAttribute('aria-disabled');
        if (addButtonText) addButtonText.textContent = 'Ajouter au panier';
      }
    }

    setUnavailable() {
      const button = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('[name="add"]');
      if (!button) return;
      
      const buttonText = button.querySelector('span');
      if (buttonText) {
        buttonText.textContent = 'Non disponible';
      }
      
      const price = document.getElementById(`price-${this.dataset.section}`);
      if (price) price.classList.add('visibility-hidden');
    }

    getVariantData() {
      this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
      return this.variantData;
    }
  });
}

console.log('✅ VariantRadios défini');