
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Product } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import PriceDisplay from "@/components/products/PriceDisplay";
import ProductAvailability from "@/components/products/ProductAvailability";

const ProductPage = () => {
  const { productId } = useParams();
  const { profile } = useAuth();

  // Fetch product information
  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq("id", productId)
        .single();

      if (error) throw error;
      return data as Product & { categories: { name: string } };
    },
  });

  // Check if user already has pending access request
  const { data: accessRequest, isLoading: isLoadingAccessRequest } = useQuery({
    queryKey: ["accessRequest", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;
      
      const { data, error } = await supabase
        .from("access_requests")
        .select("*")
        .eq("user_id", profile.id)
        .eq("status", "pending")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id && profile.role === 'nouveau',
  });

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category link at the top */}
          <div className="mb-6">
            <Badge variant="outline" className="text-gray-600 bg-white border-gray-200">
              {product.categories.name}
            </Badge>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image Section - Left */}
              <div className="p-8 flex items-center justify-center bg-white">
                {product.image_url ? (
                  <div className="aspect-square w-full max-w-md overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-square w-full max-w-md bg-gray-100 flex items-center justify-center rounded-lg">
                    <span className="text-gray-400">Pas d'image disponible</span>
                  </div>
                )}
              </div>

              {/* Product Details Section - Right */}
              <div className="p-8 flex flex-col">
                {/* Category badge above title */}
                <div className="mb-2">
                  <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none">
                    {product.categories.name}
                  </Badge>
                </div>
                
                {/* Product Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                {/* Quantity per carton information */}
                <div className="text-blue-600 mb-6">
                  {product.name.match(/x(\d+)$/) ? product.name.match(/x(\d+)$/)[1] : ""} par carton
                </div>
                
                {/* Price Display */}
                <PriceDisplay 
                  product={product} 
                  profile={profile} 
                  accessRequest={accessRequest} 
                />
                
                {/* Stock Availability */}
                <div className="mt-6">
                  <ProductAvailability product={product} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
