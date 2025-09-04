
import { Badge } from "@/components/ui/badge";

interface ProductImageProps {
  productImages: string[];
  selectedImage: number;
  onImageSelect: (index: number) => void;
}

const ProductImage = ({ productImages, selectedImage, onImageSelect }: ProductImageProps) => {
  return (
    <div className="space-y-4">
      <div className="relative bg-white rounded-2xl p-4 shadow-lg">
        <img
          src={productImages[selectedImage]}
          alt="Zen Ring - Bague connectée Bluetooth"
          className="w-full h-96 object-cover rounded-xl"
        />
        <div className="absolute top-6 left-6 space-y-2">
          <Badge className="bg-green-500">Nouveau</Badge>
          <Badge variant="destructive">-34%</Badge>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {productImages.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(index)}
            className={`border-2 rounded-lg overflow-hidden transition-all ${
              selectedImage === index ? 'border-blue-400 scale-105' : 'border-gray-200'
            }`}
          >
            <img src={image} alt={`Vue ${index + 1}`} className="w-full h-20 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImage;
