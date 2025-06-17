
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import OptimizedImage from "@/components/ui/optimized-image";
import { defaultQueryConfig } from "@/hooks/useOptimizedQuery";
import { motion } from "framer-motion";

const LatestProducts = () => {
  const { data: latestProducts } = useQuery({
    queryKey: ["latest-products"],
    queryFn: async () => {
      const { data: products, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return products as (Product & { categories: { id: string; name: string } })[];
    },
    ...defaultQueryConfig,
  });

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">
            Nos Nouveautés
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {latestProducts?.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/product/${product.id}`} className="block group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden relative group-hover:shadow-xl transition-all duration-300 h-full border border-gray-100 transform hover:scale-105">
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-gradient-to-r from-primary to-red-400 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                      Nouveau
                    </span>
                  </div>
                  <div className="w-full h-32 sm:h-40 overflow-hidden">
                    <OptimizedImage
                      src={product.image_url || "https://images.unsplash.com/photo-1618160472975-cfea543a1077?auto=format&fit=crop&q=80&w=800"}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                      fallback="https://images.unsplash.com/photo-1618160472975-cfea543a1077?auto=format&fit=crop&q=80&w=400"
                    />
                  </div>
                  <div className="p-2 sm:p-4 bg-gradient-to-b from-white to-gray-50">
                    <div className="text-xs font-medium text-primary mb-1">{product.categories.name}</div>
                    <h3 className="text-xs sm:text-sm font-semibold mb-1 truncate group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="w-8 h-0.5 bg-primary mt-2 transition-all duration-300 group-hover:w-full opacity-70"></div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;
