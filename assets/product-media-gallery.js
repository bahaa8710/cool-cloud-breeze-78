/**
 * Product Media Gallery
 * Gère la galerie d'images, vidéos et modèles 3D avec navigation et zoom
 */

class ProductMediaGallery extends HTMLElement {
  constructor() {
    super();
    this.currentSlide = 0;
    this.slides = [];
    this.thumbnails = [];
    this.init();
  }

  init() {
    this.slides = Array.from(this.querySelectorAll('.product-media-gallery__slide'));
    this.thumbnails = Array.from(this.querySelectorAll('.product-media-gallery__thumbnail'));
    
    this.bindEvents();
    this.updateActiveSlide();
    this.setupZoom();
  }

  bindEvents() {
    // Navigation
    const prevBtn = this.querySelector('[data-slider-prev]');
    const nextBtn = this.querySelector('[data-slider-next]');
    
    if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Thumbnails
    this.thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Keyboard navigation
    this.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.previousSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
      if (e.key === 'Escape') this.closeZoom();
    });
    
    // Touch/swipe support
    this.setupTouchEvents();
  }

  setupTouchEvents() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    this.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });
    
    this.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Vérifier que c'est un swipe horizontal (pas vertical)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
    });
  }

  setupZoom() {
    const zoomBtn = this.querySelector('[data-zoom-trigger]');
    const modal = this.querySelector('[data-zoom-modal]');
    const modalImage = this.querySelector('[data-zoom-image]');
    const closeBtn = this.querySelector('[data-zoom-close]');
    
    if (!zoomBtn || !modal || !modalImage) return;
    
    zoomBtn.addEventListener('click', () => {
      const currentImage = this.slides[this.currentSlide].querySelector('.product-media-gallery__image');
      if (currentImage) {
        const zoomSrc = currentImage.dataset.zoom || currentImage.src;
        modalImage.src = zoomSrc;
        modalImage.alt = currentImage.alt;
        this.openZoom();
      }
    });
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeZoom());
    }
    
    // Fermer en cliquant sur le fond
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeZoom();
    });
  }

  openZoom() {
    const modal = this.querySelector('[data-zoom-modal]');
    if (modal) {
      modal.classList.add('product-media-gallery__modal--active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeZoom() {
    const modal = this.querySelector('[data-zoom-modal]');
    if (modal) {
      modal.classList.remove('product-media-gallery__modal--active');
      document.body.style.overflow = '';
    }
  }

  goToSlide(index) {
    if (index >= 0 && index < this.slides.length) {
      this.currentSlide = index;
      this.updateActiveSlide();
    }
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  previousSlide() {
    const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.goToSlide(prevIndex);
  }

  updateActiveSlide() {
    // Mettre à jour les slides
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('product-media-gallery__slide--active', index === this.currentSlide);
    });
    
    // Mettre à jour les thumbnails
    this.thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('product-media-gallery__thumbnail--active', index === this.currentSlide);
    });
    
    // Mettre à jour les boutons de navigation
    const prevBtn = this.querySelector('[data-slider-prev]');
    const nextBtn = this.querySelector('[data-slider-next]');
    
    if (prevBtn) prevBtn.disabled = this.slides.length <= 1;
    if (nextBtn) nextBtn.disabled = this.slides.length <= 1;
  }

  // Méthode pour changer d'image depuis l'extérieur (variantes)
  setActiveMedia(mediaId) {
    const slideIndex = this.slides.findIndex(slide => 
      slide.dataset.mediaId === mediaId.toString()
    );
    
    if (slideIndex !== -1) {
      this.goToSlide(slideIndex);
    }
  }
}

// Variant Selects pour la gestion des variantes
class VariantSelects extends HTMLElement {
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

// Enregistrement des custom elements
customElements.define('product-media-gallery', ProductMediaGallery);
customElements.define('variant-selects', VariantSelects);

// Initialisation globale
document.addEventListener('DOMContentLoaded', function() {
  // Initialiser les galeries médias
  const mediaGalleries = document.querySelectorAll('product-media-gallery');
  mediaGalleries.forEach(gallery => {
    new ProductMediaGallery();
  });
  
  // Initialiser les sélecteurs de variantes
  const variantSelects = document.querySelectorAll('variant-selects');
  variantSelects.forEach(selects => {
    new VariantSelects();
  });
});