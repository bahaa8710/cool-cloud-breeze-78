class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange.bind(this));
    console.log('🎯 VariantSelects initialisé');
  }

  onVariantChange(event) {
    const target = event.target;
    console.log('🔄 Changement variant-selects:', target.name, target.value);
    
    // Déclencher un événement que ProductForm peut écouter
    this.dispatchEvent(new CustomEvent('variantSelects:change', {
      detail: { 
        element: target,
        value: target.value,
        name: target.name 
      },
      bubbles: true
    }));
  }
}

// Enregistrer le composant
if (!customElements.get('variant-selects')) {
  customElements.define('variant-selects', VariantSelects);
}

console.log('✅ VariantSelects défini');