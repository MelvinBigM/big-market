
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <Badge 
              variant="secondary" 
              className="mb-3 bg-red-100 text-red-700 hover:bg-red-200"
            >
              {product.categories.name}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 flex items-center justify-center bg-gray-50"
            >
              {product.image_url ? (
                <div className="aspect-square w-full max-w-md overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full max-w-md bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Pas d'image disponible</span>
                </div>
              )}
            </motion.div>

            {/* Product Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-8 flex flex-col"
            >
              {/* Price Display Component */}
              <div className="mb-6 border-b border-gray-100 pb-6">
                <PriceDisplay 
                  product={product} 
                  profile={profile} 
                  accessRequest={accessRequest} 
                />
              </div>

              {/* Product Availability Component */}
              <div className="mb-6">
                <ProductAvailability product={product} />
              </div>

              {product.description && (
                <div className="mt-auto pt-4">
                  <h2 className="text-xl font-semibold mb-3 text-gray-800">Description</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
