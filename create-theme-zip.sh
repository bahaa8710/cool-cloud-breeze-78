#!/bin/bash

# Script pour créer un ZIP du thème Shopify prêt à l'import

echo "🚀 Création du thème Shopify..."

# Créer un dossier temporaire pour le thème
mkdir -p shopify-theme-export

# Copier les fichiers essentiels du thème
echo "📁 Copie des fichiers..."

# Assets
cp -r assets shopify-theme-export/
# Nettoyer les fichiers non nécessaires
rm -f shopify-theme-export/assets/*.ts
rm -f shopify-theme-export/assets/component-product-form.css
rm -f shopify-theme-export/assets/component-product-media-gallery.css
rm -f shopify-theme-export/assets/variant-radios.js
rm -f shopify-theme-export/assets/variant-selects.js
rm -f shopify-theme-export/assets/product-buy-now.js

# Config
cp -r config shopify-theme-export/

# Layout
cp -r layout shopify-theme-export/

# Locales
cp -r locales shopify-theme-export/

# Sections
cp -r sections shopify-theme-export/
# Garder seulement les sections essentielles
rm -f shopify-theme-export/sections/product-custom.liquid
rm -f shopify-theme-export/sections/product-main-fixed.liquid
rm -f shopify-theme-export/sections/product-simple.liquid

# Snippets
cp -r snippets shopify-theme-export/

# Templates
cp -r templates shopify-theme-export/
# Nettoyer les templates de test
rm -f shopify-theme-export/templates/product-simple.liquid
rm -f shopify-theme-export/templates/product-fixed.liquid

echo "📦 Création du fichier ZIP..."

# Créer le ZIP
cd shopify-theme-export
zip -r ../theme-shopify-fonctionnel.zip . -x "*.DS_Store" "*/.DS_Store"
cd ..

# Nettoyer
rm -rf shopify-theme-export

echo "✅ Thème créé avec succès : theme-shopify-fonctionnel.zip"
echo ""
echo "🎯 Pour importer dans Shopify :"
echo "1. Admin Shopify → Boutique en ligne → Thèmes"
echo "2. Ajouter un thème → Importer"
echo "3. Sélectionner : theme-shopify-fonctionnel.zip"
echo "4. Publier le thème"
echo ""
echo "🚀 Votre thème est prêt à l'emploi !"