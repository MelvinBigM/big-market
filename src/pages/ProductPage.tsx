
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Product } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ProductPage = () => {
  const { productId } = useParams();
  const { profile } = useAuth();

  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .eq("id", productId)
        .single();

      if (error) throw error;
      return data as Product & { categories: { name: string } };
    },
  });

  const canSeePrice = profile?.role === 'client' || profile?.role === 'admin';
  const priceHT = product?.price || 0;
  const priceTTC = priceHT * 1.2; // TVA 20%

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-600">Chargement...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Pas d'image disponible</span>
                </div>
              )}
            </div>

            {/* Informations */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-lg text-gray-600 mt-2">{product.categories.name}</p>
              </div>

              {canSeePrice ? (
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {priceHT.toFixed(2)} € HT
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Soit {priceTTC.toFixed(2)} € TTC
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Connectez-vous en tant que client pour voir le prix
                </p>
              )}

              <div className="flex items-center space-x-4">
                <Badge 
                  variant={product.in_stock ? "default" : "destructive"}
                  className="text-sm"
                >
                  {product.in_stock ? "En stock" : "Hors stock"}
                </Badge>
                {product.units_per_pack > 1 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {product.units_per_pack} unités par pack
                  </Badge>
                )}
              </div>

              {product.description && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
