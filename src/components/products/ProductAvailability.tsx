
import { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface ProductAvailabilityProps {
  product: Product;
}

const ProductAvailability = ({ product }: ProductAvailabilityProps) => {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Stock status indicator */}
          <div className="flex items-center">
            <div className={`font-medium 
              ${product.in_stock 
                ? "text-green-700" 
                : "text-red-700"}`}
            >
              {product.in_stock ? "En stock" : "Hors stock"}
            </div>
          </div>

          {/* Store availability */}
          {product.in_stock && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Disponible en magasin</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductAvailability;
