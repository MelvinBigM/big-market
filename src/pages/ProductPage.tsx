
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Product } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
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

  // Extract quantity for displaying in the title
  const quantityMatch = product.name.match(/x(\d+)$/);
  const quantityStr = quantityMatch ? quantityMatch[0] : "";
  const nameWithoutQuantity = product.name.replace(/x\d+$/, "").trim();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Breadcrumb */}
          <div className="mb-2 mt-4">
            <Badge variant="outline" className="text-gray-600 bg-white border-gray-200">
              {product.categories.name}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Image Section */}
            <div className="p-6 flex items-center justify-center bg-white">
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

            {/* Product Details Section */}
            <div className="p-6 flex flex-col">
              {/* Product Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {nameWithoutQuantity}
                <span className="block text-2xl">{quantityStr}</span>
              </h1>
              
              {/* Quantity display under title */}
              <div className="mb-8 text-blue-600">
                <span className="font-medium">{product.name.match(/x(\d+)$/) ? product.name.match(/x(\d+)$/)[1] : ""} par carton</span>
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

              {/* Description */}
              {product.description && (
                <div className="mt-8">
                  <h2 className="text-lg font-medium mb-2">Description</h2>
                  <p className="text-gray-600">{product.description}</p>
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
