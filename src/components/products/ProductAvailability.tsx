
import { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package } from "lucide-react";

interface ProductAvailabilityProps {
  product: Product;
}

const ProductAvailability = ({ product }: ProductAvailabilityProps) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-3">
            <Badge 
              variant={product.in_stock ? "default" : "secondary"}
              className={product.in_stock 
                ? "bg-primary/10 text-primary hover:bg-primary/10 text-sm px-3 py-1"
                : "bg-red-100 text-red-700 hover:bg-red-100 text-sm px-3 py-1"}
            >
              {product.in_stock ? "En stock" : "Hors stock"}
            </Badge>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>
                {product.in_stock ? "Disponible en magasin" : "Non disponible en magasin"}
              </span>
            </div>
            
            {product.in_stock && (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                <span>Livraison sous 24-48h</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductAvailability;
