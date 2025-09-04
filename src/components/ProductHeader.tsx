
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface ProductHeaderProps {
  cartCount: number;
}

const ProductHeader = ({ cartCount }: ProductHeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
              Zen Ring ⚡
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-700 hover:text-blue-400 transition-colors">Accueil</a>
              <a href="/product" className="text-gray-700 hover:text-blue-400 transition-colors">Produits</a>
              <a href="#" className="text-gray-700 hover:text-blue-400 transition-colors">Contact</a>
            </nav>
          </div>
          <Button className="bg-gradient-to-r from-blue-400 to-pink-400 hover:from-pink-400 hover:to-blue-400">
            <ShoppingCart className="w-4 h-4 mr-2" />
            <Badge variant="secondary" className="ml-2">{cartCount}</Badge>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ProductHeader;
