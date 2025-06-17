
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Product } from "@/lib/types";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import AdvancedProductSearch, { SearchFilters } from "@/components/search/AdvancedProductSearch";
import RequestClientAccessDialog from "@/components/RequestClientAccessDialog";
import { useProductSearch } from "@/hooks/useProductSearch";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [showAccessDialog, setShowAccessDialog] = useState(false);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    setSearchParams(params);
  }, [searchQuery, setSearchParams]);

  const { data: products } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .order("position", { ascending: true })
        .order("name");

      if (error) throw error;
      return data as (Product & { categories: { id: string; name: string } })[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories-search"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const { filteredProducts } = useProductSearch({
    products,
    searchQuery,
    filters: searchFilters
  });

  const canSeePrice = profile?.role === 'client' || profile?.role === 'admin';
  const isNewUser = profile?.role === 'nouveau';

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 py-[62px]">
        <div className="max-w-[1920px] mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Recherche de produits
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Trouvez rapidement les produits que vous cherchez
            </p>
            
            <div className="max-w-4xl mx-auto">
              <AdvancedProductSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categories={categories}
                onFiltersChange={setSearchFilters}
              />
            </div>

            {filteredProducts && filteredProducts.length > 0 && (
              <p className="text-sm text-gray-600 mt-4">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {filteredProducts?.map(product => (
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
                        {isNewUser ? "Prix visibles uniquement pour les clients validés" : "Connexion client requise pour afficher les prix"}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                {searchQuery || Object.keys(searchFilters).length > 0 
                  ? "Aucun produit ne correspond à vos critères de recherche." 
                  : "Commencez votre recherche en tapant un mot-clé ci-dessus."}
              </p>
              {(searchQuery || Object.keys(searchFilters).length > 0) && (
                <p className="text-gray-500 text-sm">
                  Essayez de simplifier vos critères de recherche ou parcourez nos catégories.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <RequestClientAccessDialog open={showAccessDialog} onOpenChange={setShowAccessDialog} />
    </div>
  );
};

export default SearchPage;
