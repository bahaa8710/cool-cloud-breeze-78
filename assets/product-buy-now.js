// Gestion du bouton "Acheter maintenant" - Fonctionnalité Buy Now pour Shopify
document.addEventListener('DOMContentLoaded', function() {
  // Ajouter la gestion du Buy Now aux formulaires produit existants
  const productForms = document.querySelectorAll('product-form form[data-type="add-to-cart-form"]');
  
  productForms.forEach(form => {
    const buyNowButton = form.querySelector('button[name="buy_now"]');
    
    if (buyNowButton) {
      // Supprimer le gestionnaire par défaut si il existe
      buyNowButton.removeAttribute('formaction');
      
      // Ajouter notre gestionnaire personnalisé
      buyNowButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const variantId = form.querySelector('input[name="id"]').value;
        const quantity = form.querySelector('input[name="quantity"]')?.value || 1;
        
        if (!variantId) {
          alert('Veuillez sélectionner une variante');
          return;
        }

        // Désactiver le bouton pendant le traitement
        buyNowButton.disabled = true;
        const originalText = buyNowButton.textContent;
        buyNowButton.textContent = 'Traitement...';

        // Ajouter au panier puis rediriger vers checkout
        fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            id: parseInt(variantId),
            quantity: parseInt(quantity)
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur réseau');
          }
          return response.json();
        })
        .then(data => {
          // Succès - rediriger vers checkout
          window.location.href = '/checkout';
        })
        .catch(error => {
          console.error('Erreur Buy Now:', error);
          alert('Une erreur est survenue. Veuillez réessayer.');
          
          // Réactiver le bouton
          buyNowButton.disabled = false;
          buyNowButton.textContent = originalText;
        });
      });
    }
  });

  // Mise à jour des boutons Buy Now lors du changement de variante
  const variantSelects = document.querySelector('variant-selects');
  if (variantSelects) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-variant-id') {
          updateBuyNowButtons();
        }
      });
    });
    
    observer.observe(variantSelects, { attributes: true });
  }

  function updateBuyNowButtons() {
    const buyNowButtons = document.querySelectorAll('button[name="buy_now"]');
    const variantId = document.querySelector('input[name="id"]')?.value;
    
    buyNowButtons.forEach(button => {
      if (!variantId || variantId === '') {
        button.disabled = true;
      } else {
        // Vérifier si la variante est disponible
        const form = button.closest('form');
        const addToCartButton = form?.querySelector('button[name="add"]');
        
        if (addToCartButton && addToCartButton.disabled) {
          button.disabled = true;
        } else {
          button.disabled = false;
        }
      }
    });
  }
});