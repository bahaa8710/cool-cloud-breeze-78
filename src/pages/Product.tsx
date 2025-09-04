
import { useState } from "react";
import ProductImage from "../components/ProductImage";
import ProductInfo from "../components/ProductInfo";
import ProductTabs from "../components/ProductTabs";

const Product = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("white");
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);

  const productImages = [
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=400&q=80"
  ];

  const handleAddToCart = () => {
    setCartCount(cartCount + quantity);
    alert(`${quantity} Zen Ring ${selectedColor} ajoutée(s) au panier !`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <ProductImage
            productImages={productImages}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />
          <ProductInfo
            selectedColor={selectedColor}
            quantity={quantity}
            onColorSelect={setSelectedColor}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      <ProductTabs />
      
      {/* Footer simple */}
      <footer className="mt-16 text-center text-gray-500 text-sm py-20 px-4 relative overflow-hidden">
        {/* Fond dégradé dramatique */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-blue via-lavender to-pastel-pink opacity-10"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="border-t border-gray-200 pt-8">
            <p>&copy; 2024 Zen Ring - Contrôle ton monde ⚡</p>
            <div className="flex justify-center gap-6 mt-4">
              <a href="#" className="hover:text-sky-blue transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-sky-blue transition-colors">CGV</a>
              <a href="#" className="hover:text-sky-blue transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Product;
