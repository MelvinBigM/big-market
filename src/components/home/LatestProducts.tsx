
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";

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
  });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Nos Nouveautés</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {latestProducts?.map((product, index) => (
            <Link to={`/product/${product.id}`} key={product.id} className="block">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden relative hover:shadow-lg transition-shadow duration-300 h-full"
              >
                <div className="absolute top-2 right-2 z-10">
                  <span className="bg-primary text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                    Nouveau
                  </span>
                </div>
                <div className="w-full h-40">
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1618160472975-cfea543a1077?auto=format&fit=crop&q=80&w=800"}
                    alt={product.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="p-3">
                  <div className="text-xs text-gray-500 mb-1">{product.categories.name}</div>
                  <h3 className="text-sm font-semibold mb-3 truncate">{product.name}</h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;
