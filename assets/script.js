// Global JavaScript for theme
document.addEventListener('DOMContentLoaded', function() {
  console.log('Theme loaded successfully');
});

// Slider component
if (!customElements.get('slider-component')) {
  customElements.define('slider-component', class SliderComponent extends HTMLElement {
    constructor() {
      super();
      this.slider = this.querySelector('[id^="Slider-"]');
      this.sliderItems = this.querySelectorAll('.slider__slide');
      this.currentPageElement = this.querySelector('.slider-counter--current');
      this.pageTotalElement = this.querySelector('.slider-counter--total');
      this.prevButton = this.querySelector('button[name="previous"]');
      this.nextButton = this.querySelector('button[name="next"]');

      if (!this.slider || this.sliderItems.length <= 1) return;

      this.initPages();
      this.slider.addEventListener('scroll', this.update.bind(this));
      this.prevButton?.addEventListener('click', this.onButtonClick.bind(this));
      this.nextButton?.addEventListener('click', this.onButtonClick.bind(this));
    }

    initPages() {
      this.sliderItemsToShow = Array.from(this.sliderItems).filter(element => element.clientWidth > 0);
      if (this.sliderItemsToShow.length < 2) return;
      this.sliderItemOffset = this.sliderItemsToShow[1].offsetLeft - this.sliderItemsToShow[0].offsetLeft;
      this.slidesPerPage = Math.floor(this.slider.clientWidth / this.sliderItemOffset);
      this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;
      this.update();
    }

    update() {
      if (!this.slider || this.sliderItems.length <= 1) return;
      this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1;

      if (this.currentPageElement && this.pageTotalElement) {
        this.currentPageElement.textContent = this.currentPage;
        this.pageTotalElement.textContent = this.totalPages;
      }

      this.dispatchEvent(new CustomEvent('slideChanged', { 
        detail: {
          currentPage: this.currentPage,
          currentElement: this.sliderItemsToShow[this.currentPage - 1]
        }
      }));
    }

    onButtonClick(event) {
      event.preventDefault();
      const step = event.currentTarget.dataset.step || 1;
      const direction = event.currentTarget.name === 'next' ? 1 : -1;
      const position = this.slider.scrollLeft + (direction * step * this.sliderItemOffset);
      this.slider.scrollTo({ left: position });
    }
  });
}

// Media gallery component
if (!customElements.get('media-gallery')) {
  customElements.define('media-gallery', class MediaGallery extends HTMLElement {
    constructor() {
      super();
      this.elements = {
        viewer: this.querySelector('[id^="GalleryViewer"]'),
        thumbnails: this.querySelector('[id^="GalleryThumbnails"]'),
      };

      this.elements.viewer?.addEventListener('slideChanged', this.onSlideChanged.bind(this));
    }

    onSlideChanged(event) {
      const thumbnail = this.elements.thumbnails?.querySelector(
        `[data-target="${event.detail.currentElement?.dataset.mediaId}"]`
      );
      this.setActiveThumbnail(thumbnail);
    }

    setActiveThumbnail(thumbnail) {
      if (!this.elements.thumbnails || !thumbnail) return;

      this.elements.thumbnails
        .querySelectorAll('button')
        .forEach((element) => element.removeAttribute('aria-current'));
      thumbnail.querySelector('button')?.setAttribute('aria-current', true);
    }
  });
}