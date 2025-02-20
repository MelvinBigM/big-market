
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Product } from "@/lib/types";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { session, profile } = useAuth();

  const { data: category } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryId)
        .order("name");

      if (error) throw error;
      return data as Product[];
    },
  });

  const canSeePrice = profile?.role === 'client' || profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {category?.name}
            </h1>
            {category?.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products?.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden h-[360px] flex flex-col"
              >
                {product.image_url && (
                  <div className="h-40 overflow-hidden flex items-center justify-center bg-gray-50">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-auto object-contain max-h-40"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow text-center">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{product.description}</p>
                  )}
                  <div className="mt-auto">
                    {canSeePrice ? (
                      <div className="flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">
                          {product.price.toFixed(2)} €
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        Connectez-vous en tant que client pour voir le prix
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {products?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Aucun produit n'est disponible dans cette catégorie pour le moment.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
