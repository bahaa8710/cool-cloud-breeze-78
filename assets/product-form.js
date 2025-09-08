/**
 * Product Form - Compatible avec Dawn
 * Gère l'ajout au panier et les interactions du formulaire produit
 */

class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.form.querySelector('[name=id]').disabled = false;
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
    this.submitButton = this.querySelector('[type="submit"]');
  }

  onSubmitHandler(evt) {
    evt.preventDefault();
    if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

    this.handleErrorMessage();

    this.submitButton.setAttribute('aria-disabled', true);
    this.submitButton.classList.add('loading');
    this.querySelector('.loading__spinner').classList.remove('hidden');

    const config = {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/javascript',
      },
      body: new FormData(this.form)
    };

    if (this.cart) {
      config.sections = this.cart.getSectionsToRender().map((section) => section.id);
      config.sections_url = window.location.pathname;
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify({
        ...Object.fromEntries(new FormData(this.form)),
        sections: config.sections,
        sections_url: config.sections_url
      });
    }

    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          this.handleErrorMessage(response.description);
          
          const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
          if (!soldOutMessage) return;
          this.submitButton.setAttribute('aria-disabled', true);
          this.submitButton.querySelector('span').classList.add('hidden');
          soldOutMessage.classList.remove('hidden');
          this.error = true;
          return;
        } else if (!this.cart) {
          window.location = window.routes.cart_url;
          return;
        }

        this.error = false;
        const quickAddModal = this.closest('quick-add-modal');
        if (quickAddModal) {
          document.body.addEventListener('modalClosed', () => {
            setTimeout(() => { this.cart.renderContents(response) });
          }, { once: true });
          quickAddModal.hide(true);
        } else {
          this.cart.renderContents(response);
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        this.submitButton.classList.remove('loading');
        if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
        if (!this.error) this.submitButton.removeAttribute('aria-disabled');
        this.querySelector('.loading__spinner').classList.add('hidden');
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
}

// Quantity Input Logic
class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true });
    this.querySelectorAll('button').forEach(
      (button) => button.addEventListener('click', this.onButtonClick.bind(this))
    );
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
  }
}

// Enregistrement des custom elements
if (!customElements.get('product-form')) {
  customElements.define('product-form', ProductForm);
}
if (!customElements.get('quantity-input')) {
  customElements.define('quantity-input', QuantityInput);
}