
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { AccessRequest, Product } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import RequestClientAccessDialog from "@/components/RequestClientAccessDialog";

const ProductPage = () => {
  const { productId } = useParams();
  const { profile } = useAuth();
  const [showAccessDialog, setShowAccessDialog] = useState(false);

  // Récupérer les informations du produit
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

  // Vérifier si l'utilisateur a déjà une demande d'accès en attente
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
      return data as AccessRequest | null;
    },
    enabled: !!profile?.id && profile.role === 'nouveau',
  });

  const canSeePrice = profile?.role === 'client' || profile?.role === 'admin';
  const isNewUser = profile?.role === 'nouveau';
  const hasPendingRequest = !!accessRequest;

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              {product.image_url ? (
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Pas d'image disponible</span>
                </div>
              )}
            </motion.div>

            {/* Product Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <Badge variant="secondary" className="mb-2">
                  {product.categories.name}
                </Badge>
                <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
              </div>

              {canSeePrice ? (
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-baseline">
                    <span className="text-3xl font-bold text-primary">
                      {product.price.toFixed(2)} €
                    </span>
                    <span className="text-sm text-gray-500 ml-1">HT</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm">
                  {isNewUser ? (
                    hasPendingRequest ? (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
                        <p className="text-amber-800 font-medium">
                          Votre demande d'accès est en cours d'examen. 
                          Vous pourrez voir les prix une fois qu'un administrateur l'aura approuvée.
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-700 mb-2">
                        Pour voir les prix : <button
                          onClick={() => setShowAccessDialog(true)}
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          demander l'accès client
                        </button>
                      </p>
                    )
                  ) : (
                    <p className="text-gray-700 italic">
                      Connectez-vous en tant que client pour voir le prix
                    </p>
                  )}
                </div>
              )}

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

              {product.description && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
      <RequestClientAccessDialog 
        open={showAccessDialog} 
        onOpenChange={setShowAccessDialog}
      />
    </div>
  );
};

export default ProductPage;
