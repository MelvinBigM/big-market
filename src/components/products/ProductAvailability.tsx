
import { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface ProductAvailabilityProps {
  product: Product;
}

const ProductAvailability = ({ product }: ProductAvailabilityProps) => {
  return (
    <Card className="border rounded-md">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center">
            <div 
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                product.in_stock 
                  ? "bg-green-50 text-green-700" 
                  : "bg-red-50 text-red-700"
              }`}
            >
              {product.in_stock ? "En stock" : "Hors stock"}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>
              {product.in_stock ? "Disponible en magasin" : "Non disponible en magasin"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductAvailability;
