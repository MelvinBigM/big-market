
import { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductAvailabilityProps {
  product: Product;
}

const ProductAvailability = ({ product }: ProductAvailabilityProps) => {
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Badge 
              variant={product.in_stock ? "default" : "secondary"}
              className={cn(
                "text-sm py-1.5 px-4 flex items-center gap-2",
                product.in_stock 
                  ? "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800" 
                  : "bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
              )}
            >
              {product.in_stock ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>En stock</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Hors stock</span>
                </>
              )}
            </Badge>
          </div>

          <div className="flex justify-center items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-red-500" />
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
