
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Product } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Pencil, Package } from "lucide-react";
import PriceDisplay from "@/components/products/PriceDisplay";
import ProductAvailability from "@/components/products/ProductAvailability";
import ProductDialog from "@/components/admin/ProductDialog";
import ProductImageCarousel from "@/components/products/ProductImageCarousel";
import { toast } from "sonner";

const ProductPage = () => {
  const { productId } = useParams();
  const { profile } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Fetch product information
  const { data: product, refetch } = useQuery({
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

  // Toggle product stock status
  const toggleStock = async () => {
    if (!product) return;
    
    try {
      const { error } = await supabase
        .from("products")
        .update({ in_stock: !product.in_stock })
        .eq("id", product.id);

      if (error) throw error;
      
      toast.success(`Produit marqué comme ${!product.in_stock ? 'en stock' : 'en rupture'}`);
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!product) return null;

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section - Left Side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg border shadow-sm p-8"
            >
              <ProductImageCarousel 
                productId={product.id}
                fallbackImageUrl={product.image_url || undefined}
                productName={product.name}
              />
            </motion.div>

            {/* Product Details Section - Right Side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              </div>
              
              {/* Significant space between product name and price */}
              <div className="my-12"></div>

              {/* Price Display Component */}
              <PriceDisplay 
                product={product} 
                profile={profile} 
                accessRequest={accessRequest} 
              />

              {/* Product Availability Component */}
              <ProductAvailability product={product} />

              {product.description && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              {/* Admin Buttons Section - Moved below description */}
              {isAdmin && (
                <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    variant={product.in_stock ? "secondary" : "destructive"}
                    size="sm"
                    onClick={toggleStock}
                    className="flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    {product.in_stock ? "Marquer en rupture" : "Marquer en stock"}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Admin Product Edit Dialog */}
      {isAdmin && product && (
        <ProductDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          product={product}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default ProductPage;
