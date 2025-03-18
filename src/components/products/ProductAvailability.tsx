
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
        <div className="space-y-2">
          <div className="flex items-center">
            <div className={`px-3 py-1 rounded-md text-sm font-medium 
              ${product.in_stock 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"}`}
            >
              {product.in_stock ? "En stock" : "Hors stock"}
            </div>
          </div>

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
