/**
 * Variant Radios - Compatible avec Dawn
 * Gère les sélecteurs de variantes avec des boutons radio
 */

class VariantRadios extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
    this.updateOptions();
    this.updateMasterId();
    this.setAvailability();
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
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
      this.setAvailability();
    }
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('input[type="radio"]:checked'), (input) => input.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant) return;
    if (!this.currentVariant.featured_media) return;

    const mediaGallery = document.querySelector('product-media-gallery');
    if (mediaGallery && this.currentVariant.featured_media) {
      mediaGallery.setActiveMedia(this.currentVariant.featured_media.id);
    }
    
    // Fallback pour les images principales
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage && this.currentVariant.featured_image) {
      mainImage.src = this.currentVariant.featured_image.src;
      mainImage.alt = this.currentVariant.featured_image.alt;
    }
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, form[data-type="add-to-cart-form"]`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      if (input) {
        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event('change', { bubbles: true }));
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
    const section = this.closest('section');
    if (!section) return;

    const productForm = section.querySelector('product-form');
    if (productForm) productForm.handleErrorMessage();
  }

  renderProductInfo() {
    const requestedVariantId = this.currentVariant.id;
    const sectionId = this.dataset.section;

    fetch(`${this.dataset.url}?variant=${requestedVariantId}&section_id=${this.dataset.originalSection}`)
      .then((response) => response.text())
      .then((responseText) => {
        if (this.currentVariant.id !== requestedVariantId) return;

        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const destination = document.getElementById(`price-${sectionId}`);
        const source = html.getElementById(`price-${sectionId}`);

        if (source && destination) destination.innerHTML = source.innerHTML;

        const price = document.getElementById(`price-${sectionId}`);
        if (price) price.classList.remove('visibility-hidden');
        
        this.toggleAddButton(
          !this.currentVariant.available,
          this.currentVariant.available ? '' : window.variantStrings.soldOut
        );
      });
  }

  setAvailability() {
    this.querySelectorAll('fieldset').forEach((fieldset) => {
      const optionInputs = [...fieldset.querySelectorAll('input[type="radio"]')];
      const optionName = fieldset.querySelector('legend').textContent.trim();
      
      optionInputs.forEach((input, index) => {
        const optionValue = input.value;
        const variantOption = `option${fieldset.dataset.optionIndex || (index + 1)}`;

        const availableVariants = this.getVariantData().filter((variant) => {
          return this.options.every((selectedOption, selectedOptionIndex) => {
            if (selectedOptionIndex === index) return true;
            const variantOptionName = `option${selectedOptionIndex + 1}`;
            return variant[variantOptionName] === selectedOption;
          });
        });

        const inputWrapper = input.closest('label') || input.parentElement;
        if (availableVariants.length === 0) {
          inputWrapper.classList.add('disabled');
        } else {
          inputWrapper.classList.remove('disabled');
        }
      });
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
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = window.variantStrings.addToCart || 'Ajouter au panier';
    }
  }

  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton) return;

    addButtonText.textContent = window.variantStrings.unavailable || 'Non disponible';
    if (price) price.classList.add('visibility-hidden');
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(document.getElementById(`product-json-${this.dataset.section}`).textContent);
    return this.variantData;
  }
}

// Enregistrement du custom element
customElements.define('variant-radios', VariantRadios);

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  const variantRadios = document.querySelectorAll('variant-radios');
  variantRadios.forEach(radios => {
    new VariantRadios();
  });
});