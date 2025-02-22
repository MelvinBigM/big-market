import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import { Link } from "react-router-dom";

const Index = () => {
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
    <div className="min-h-screen bg-white">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            >
              Bienvenue chez BIG IMEX
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Votre destination pour des produits alimentaires et des boissons de qualité.
              Découvrez notre large sélection de produits soigneusement sélectionnés.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nouveaux Produits</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {latestProducts?.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden relative"
              >
                <div className="absolute top-2 right-2 z-10">
                  <span className="bg-primary text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                    New
                  </span>
                </div>
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1618160472975-cfea543a1077?auto=format&fit=crop&q=80&w=800"}
                    alt={product.name}
                    className="object-cover w-full h-32"
                  />
                </div>
                <div className="p-3">
                  <div className="text-xs text-gray-500 mb-1">{product.categories.name}</div>
                  <h3 className="text-sm font-semibold mb-1 truncate">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-primary">{product.price} €</span>
                    <Link to={`/category/${product.category_id}`}>
                      <Button variant="default" size="sm">
                        Voir
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
              <p className="text-gray-600 mb-4">
                BIG IMEX s'engage à fournir des produits de qualité
                à nos clients. Notre mission est de rendre accessible une large gamme de
                produits alimentaires et de boissons tout en maintenant des standards élevés
                de qualité et de service.
              </p>
              <p className="text-gray-600 mb-6">
                Nous travaillons en étroite collaboration avec nos fournisseurs pour
                sélectionner les meilleurs produits et vous offrir une expérience d'achat
                exceptionnelle.
              </p>
              <Button variant="default">En savoir plus</Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-96"
            >
              <img
                src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800"
                alt="Notre magasin"
                className="rounded-lg object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
