
import { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface ProductAvailabilityProps {
  product: Product;
}

const ProductAvailability = ({ product }: ProductAvailabilityProps) => {
  return (
    <Card className="border border-gray-100 shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Availability indicator similar to the image */}
          <div className="py-2 px-4 bg-green-50 text-green-800 font-medium rounded-md inline-flex items-center">
            {product.in_stock ? "En stock" : "Hors stock"}
          </div>

          {/* Store availability with icon */}
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
