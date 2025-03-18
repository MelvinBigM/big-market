
import { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface ProductAvailabilityProps {
  product: Product;
}

const ProductAvailability = ({ product }: ProductAvailabilityProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge 
              variant="default"
              className={product.in_stock 
                ? "bg-[#F2FCE2] text-green-700 hover:bg-[#F2FCE2]" 
                : "bg-red-100 text-red-700 hover:bg-red-100"}
            >
              {product.in_stock ? "En stock" : "Hors stock"}
            </Badge>
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
