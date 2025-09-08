if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      this.submitButton = this.querySelector('[type="submit"]');
      this.submitButtonText = this.submitButton.querySelector('span');

      if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.handleErrorMessage();

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

      const config = {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/javascript',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: new URLSearchParams(new FormData(this.form))
      };

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            this.handleErrorMessage(response.description);

            const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
            if (!soldOutMessage) return;
            this.submitButton.setAttribute('aria-disabled', false);
            this.submitButton.classList.remove('loading');
            this.querySelector('.loading-overlay__spinner').classList.add('hidden');
            return;
          } else if (!this.cart) {
            window.location = window.routes.cart_url;
            return;
          }

          this.handleErrorMessage();
          this.submitButton.setAttribute('aria-disabled', false);
          this.submitButton.classList.remove('loading');
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');
          this.cart.renderContents(response);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.submitButton.setAttribute('aria-disabled', false);
          this.submitButton.classList.remove('loading');
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');
        });
    }

    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  });
}

if (!customElements.get('variant-radios')) {
  customElements.define('variant-radios', class VariantRadios extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('change', this.onVariantChange);
    }

    onVariantChange() {
      this.updateOptions();
      this.updateMasterId();
      this.toggleAddButton(true, '', false);
      this.updatePickupAvailability();
      this.removeErrorMessage();
      this.updateVariantStatuses();

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
      this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
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

      const mediaGallery = document.getElementById(`MediaGallery-${this.dataset.section}`);
      mediaGallery.setActiveMedia(`${this.dataset.section}-${this.currentVariant.featured_media.id}`, true);

      const modalContent = document.querySelector(`#ProductModal-${this.dataset.section} .product-media-modal__content`);
      if (!modalContent) return;
      const newMediaModal = modalContent.querySelector( `[data-media-id="${this.currentVariant.featured_media.id}"]`);
      modalContent.prepend(newMediaModal);
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
        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }

    updateVariantStatuses() {
      const selectedOptionOneVariants = this.variantData.filter(variant => this.querySelector(':checked').value === variant.option1);
      const inputWrappers = [...this.querySelectorAll('.product-form__input')];
      inputWrappers.forEach((option, index) => {
        if (index === 0) return;
        const optionInputs = [...option.querySelectorAll('input[type="radio"], option')];
        const previousOptionSelected = inputWrappers[index - 1].querySelector(':checked').value;
        const availableOptionInputsValue = selectedOptionOneVariants.filter(variant => variant.available && variant[`option${ index }`] === previousOptionSelected).map(variantOption => variantOption[`option${ index + 1 }`]);
        this.setInputAvailability(optionInputs, availableOptionInputsValue);
      });
    }

    setInputAvailability(listOfOptions, listOfAvailableOptions) {
      listOfOptions.forEach(input => {
        if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
          input.innerText = input.getAttribute('value');
        } else {
          input.innerText = window.variantStrings.unavailable_with_option.replace('[value]', input.getAttribute('value'));
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
      const sectionId = this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section;

      fetch(`${this.dataset.url}?variant=${requestedVariantId}&section_id=${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`)
        .then((response) => response.text())
        .then((responseText) => {
          // The variant was sold out and removed from the DOM while the user was selecting a different variant
          if (!this.currentVariant.available) {
            return;
          }

          const html = new DOMParser().parseFromString(responseText, 'text/html')
          const destination = document.getElementById(`price-${this.dataset.section}`);
          const source = html.getElementById(`price-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`);
          const skuSource = html.getElementById(`Sku-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`);
          const skuDestination = document.getElementById(`Sku-${this.dataset.section}`);
          const inventorySource = html.getElementById(`Inventory-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`);
          const inventoryDestination = document.getElementById(`Inventory-${this.dataset.section}`);

          if (source && destination) destination.innerHTML = source.innerHTML;
          if (inventorySource && inventoryDestination) inventoryDestination.innerHTML = inventorySource.innerHTML;
          if (skuSource && skuDestination) {
            skuDestination.innerHTML = skuSource.innerHTML;
            skuDestination.classList.toggle('visibility-hidden', skuSource.classList.contains('visibility-hidden'));
          }

          const price = document.getElementById(`price-${this.dataset.section}`);

          if (price) price.classList.remove('visibility-hidden');

          if (inventoryDestination) inventoryDestination.classList.toggle('visibility-hidden', inventorySource.classList.contains('visibility-hidden'));

          const addButtonUpdated = html.getElementById(`ProductSubmitButton-${sectionId}`);
          this.toggleAddButton(addButtonUpdated ? addButtonUpdated.hasAttribute('disabled') : true, window.variantStrings.soldOut);
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
        addButtonText.textContent = window.variantStrings.addToCart;
      }

      if (!modifyClass) return;
    }

    setUnavailable() {
      const button = document.getElementById(`product-form-${this.dataset.section}`);
      const addButton = button.querySelector('[name="add"]');
      const addButtonText = button.querySelector('[name="add"] > span');
      const price = document.getElementById(`price-${this.dataset.section}`);
      if (!addButton) return;
      addButtonText.textContent = window.variantStrings.unavailable;
      if (price) price.classList.add('visibility-hidden');
    }

    getVariantData() {
      this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
      return this.variantData;
    }
  });
}

if (!customElements.get('quantity-input')) {
  customElements.define('quantity-input', class QuantityInput extends HTMLElement {
    constructor() {
      super();
      this.input = this.querySelector('input');
      this.changeEvent = new Event('change', { bubbles: true })
      this.input.addEventListener('change', this.onInputChange.bind(this));
      this.querySelectorAll('button').forEach(
        (button) => button.addEventListener('click', this.onButtonClick.bind(this))
      );
    }

    quantityUpdateUnsubscriber = undefined;

    connectedCallback() {
      this.validateQtyRules();
      this.quantityUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.quantityUpdate, this.validateQtyRules.bind(this));
    }

    disconnectedCallback() {
      if (this.quantityUpdateUnsubscriber) {
        this.quantityUpdateUnsubscriber();
      }
    }

    onInputChange(event) {
      this.validateQtyRules();
    }

    onButtonClick(event) {
      event.preventDefault();
      const previousValue = this.input.value;

      if (event.target.name === 'plus') {
        this.input.stepUp();
      } else {
        this.input.stepDown();
      }

      if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
      this.validateQtyRules();
    }

    validateQtyRules() {
      const value = parseInt(this.input.value);
      if (this.input.min) {
        const min = parseInt(this.input.min);
        const buttonMinus = this.querySelector(".quantity__button[name='minus']");
        buttonMinus.classList.toggle('disabled', value <= min);
      }
      if (this.input.max) {
        const max = parseInt(this.input.max);
        const buttonPlus = this.querySelector(".quantity__button[name='plus']");
        buttonPlus.classList.toggle('disabled', value >= max);
      }
    }
  });
}

// Polyfill pour les événements personnalisés
const PUB_SUB_EVENTS = {
  quantityUpdate: 'quantity-update',
  variantChange: 'variant-change',
  cartUpdate: 'cart-update'
};

function subscribe(eventName, callback) {
  document.addEventListener(eventName, callback);
  return () => document.removeEventListener(eventName, callback);
}

function publish(eventName, data) {
  document.dispatchEvent(new CustomEvent(eventName, { detail: data }));
}