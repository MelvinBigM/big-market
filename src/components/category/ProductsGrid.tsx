
import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OptimizedImage from "@/components/ui/optimized-image";

interface ProductsGridProps {
  products: Product[];
  canSeePrice: boolean;
  isNewUser: boolean;
  searchQuery: string;
}

const ProductsGrid = ({
  products,
  canSeePrice,
  isNewUser,
  searchQuery,
}: ProductsGridProps) => {
  const [showAccessDialog, setShowAccessDialog] = useState(false);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {searchQuery 
            ? `Aucun produit trouvé pour "${searchQuery}"`
            : "Aucun produit disponible dans cette catégorie"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-0">
            <Link to={`/product/${product.id}`} className="block">
              <div className="aspect-square relative overflow-hidden rounded-t-lg bg-white">
                <OptimizedImage
                  src={product.image_url || "https://images.unsplash.com/photo-1618160472975-cfea543a1077?auto=format&fit=crop&q=80&w=400"}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200 p-4"
                />
                <div className="absolute top-2 right-2">
                  <div 
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      product.in_stock 
                        ? "bg-green-50 text-green-700" 
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {product.in_stock ? "En stock" : "En rupture"}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                {product.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  {canSeePrice ? (
                    <div className="text-lg font-bold text-primary">
                      {product.price.toFixed(2)} € HT
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Prix sur demande
                    </div>
                  )}
                  
                  {isNewUser && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAccessDialog(true);
                      }}
                    >
                      Voir le prix
                    </Button>
                  )}
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductsGrid;
