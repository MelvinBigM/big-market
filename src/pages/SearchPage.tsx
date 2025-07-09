
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Product } from "@/lib/types";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { profile } = useAuth();
  const navigate = useNavigate();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search-products", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) return [];

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories!inner(id, name)
        `)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .eq("in_stock", true)
        .order("name");

      if (error) throw error;
      return data as (Product & { categories: { id: string; name: string } })[];
    },
    enabled: searchQuery.length >= 2,
  });

  const canSeePrice = profile?.role === 'client' || profile?.role === 'admin';
  const isNewUser = profile?.role === 'nouveau';

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Résultats de recherche
            </h1>
            {searchQuery && (
              <p className="text-lg text-gray-600 mb-4">
                {searchResults?.length || 0} résultat(s) pour "{searchQuery}"
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Recherche en cours...</p>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
              {searchResults.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden h-[220px] sm:h-[240px] flex flex-col relative group cursor-pointer hover:border-gray-300 hover:shadow-lg transition-all duration-200" 
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="absolute top-2 right-2 z-10">
                    <span className={`inline-flex h-3 w-3 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <div className="w-full h-[110px] sm:h-[125px] bg-white flex items-center justify-center">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-contain p-2 sm:p-3" 
                      />
                    )}
                  </div>
                  <div className="p-2 sm:p-3 flex flex-col justify-between flex-grow bg-white">
                    <div className="flex-grow flex flex-col">
                      <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 text-center leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 text-center mt-1">
                        {product.categories.name}
                      </p>
                    </div>
                    
                    <div className="mt-0.5">
                      {canSeePrice ? (
                        <div className="flex items-baseline space-x-1 justify-center">
                          <span>&nbsp;&nbsp;&nbsp;</span>
                          <span className="text-sm sm:text-lg font-bold text-primary">
                            {product.price.toFixed(2)} €
                          </span>
                          <span className="text-xs text-gray-500">HT</span>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-700 text-center leading-tight">
                          {isNewUser 
                            ? "Prix visibles uniquement pour les clients validés" 
                            : "Connexion client requise pour afficher les prix"
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Aucun produit trouvé pour "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Veuillez saisir au moins 2 caractères pour effectuer une recherche.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
