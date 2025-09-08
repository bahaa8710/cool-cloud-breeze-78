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

// Enregistrement du custom element
customElements.define('product-media-gallery', ProductMediaGallery);

// Initialisation globale
document.addEventListener('DOMContentLoaded', function() {
  // Initialiser les galeries médias
  const mediaGalleries = document.querySelectorAll('product-media-gallery');
  mediaGalleries.forEach(gallery => {
    new ProductMediaGallery();
  });
});