import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Product } from "@/lib/types";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import RequestClientAccessDialog from "@/components/RequestClientAccessDialog";

const CategoryPage = () => {
  const {
    categoryId
  } = useParams();
  const {
    session,
    profile
  } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const {
    data: category
  } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("categories").select("*").eq("id", categoryId).single();
      if (error) throw error;
      return data;
    }
  });
  const {
    data: products
  } = useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("products").select("*").eq("category_id", categoryId).order("position", {
        ascending: true
      }).order("name");
      if (error) throw error;
      return data as Product[];
    }
  });
  const filteredProducts = products?.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description?.toLowerCase().includes(searchQuery.toLowerCase()));
  const canSeePrice = profile?.role === 'client' || profile?.role === 'admin';
  const isNewUser = profile?.role === 'nouveau';
  const handleAccessRequest = () => {
    setShowAccessDialog(true);
  };
  return <div className="min-h-screen bg-white">
      <NavBar />
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 py-[62px]">
        <div className="max-w-[1920px] mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {category?.name}
            </h1>
            {category?.description && <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                {category.description}
              </p>}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input type="search" placeholder="Rechercher un produit..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {filteredProducts?.map(product => <TooltipProvider key={product.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div 
                      initial={{
                        opacity: 0,
                        y: 20
                      }} 
                      animate={{
                        opacity: 1,
                        y: 0
                      }} 
                      className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden h-[220px] sm:h-[240px] flex flex-col relative group cursor-pointer hover:border-gray-300 hover:shadow-lg transition-all duration-200" 
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <div className="absolute top-2 right-2 z-10">
                        <span className={`inline-flex h-3 w-3 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                      <div className="w-full h-[110px] sm:h-[125px] bg-white flex items-center justify-center">
                        {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-2 sm:p-3" />}
                      </div>
                      <div className="p-2 sm:p-3 flex flex-col justify-between flex-grow bg-white">
                        <div className="flex-grow flex flex-col">
                          <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 text-center mb-1 leading-tight">
                            {product.name}
                          </h3>
                        </div>
                        
                        <div>
                          {canSeePrice ? <div className="flex items-baseline space-x-1 justify-center">
                              <span className="text-sm sm:text-lg font-bold text-primary">
                                {product.price.toFixed(2)} €
                              </span>
                              <span className="text-xs text-gray-500">HT</span>
                            </div> : <p className="text-xs text-gray-700 text-center leading-tight">
                              {isNewUser ? "Prix visibles uniquement pour les clients validés" : "Connexion client requise pour afficher les prix"}
                            </p>}
                        </div>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="p-4 max-w-xs">
                    <div className="space-y-2">
                      <p className="font-semibold">{product.name}</p>
                      {product.description && <p className="text-sm text-gray-600">{product.description}</p>}
                      <p className={`text-sm font-medium ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.in_stock ? 'En stock' : 'Hors stock'}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>)}
          </div>

          {filteredProducts?.length === 0 && <div className="text-center py-12">
              <p className="text-gray-600">
                {searchQuery ? "Aucun produit ne correspond à votre recherche." : "Aucun produit n'est disponible dans cette catégorie pour le moment."}
              </p>
            </div>}
        </div>
      </main>
      <Footer />
      <RequestClientAccessDialog open={showAccessDialog} onOpenChange={setShowAccessDialog} />
    </div>;
};
export default CategoryPage;
