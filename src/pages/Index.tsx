import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, ExternalLink, Clock } from "lucide-react";

const banners = [
  {
    title: "Bienvenue chez BIG IMEX",
    description: "Votre destination pour des produits alimentaires et des boissons de qualité. Découvrez notre large sélection de produits soigneusement sélectionnés.",
    bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50"
  },
  {
    title: "Découvrez nos Produits",
    description: "Une sélection premium de produits soigneusement choisis pour vous. Nous nous engageons à vous offrir uniquement le meilleur.",
    bgColor: "bg-gradient-to-r from-amber-50 to-yellow-50"
  },
  {
    title: "Qualité Garantie",
    description: "Nous nous engageons à vous offrir les meilleurs produits du marché. La qualité est au cœur de nos préoccupations.",
    bgColor: "bg-gradient-to-r from-green-50 to-emerald-50"
  }
];

const Index = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

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

  const handleOpenGoogleMaps = () => {
    window.open("https://maps.app.goo.gl/JPccmraZVscgLL5u7", "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      {/* Hero Section with Rotating Banners */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentBanner}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`text-center p-12 rounded-xl shadow-md ${banners[currentBanner].bgColor} border border-gray-100`}
            >
              <motion.h1 
                className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {banners[currentBanner].title}
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {banners[currentBanner].description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/categories">
                  <Button size="lg" className="font-medium">
                    Découvrir nos produits
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Nos Nouveautés</h2>
            <Link to="/categories">
              <Button variant="outline">Voir tous les produits</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {latestProducts?.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden relative hover:shadow-lg transition-shadow duration-300"
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
                  <div className="flex justify-center">
                    <Link to={`/product/${product.id}`}>
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

      {/* Location & Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Retrouvez-nous</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card className="overflow-hidden shadow-md border-none">
                <CardContent className="p-0">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2891.5429189232896!2d6.937453375869258!3d43.55261895887715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12ce8c1320fbf0a5%3A0xe901e493c9a1b4d8!2s42%20Chem.%20de%20l&#39;Escadrille%2C%2006210%20Mandelieu-la-Napoule!5e0!3m2!1sfr!2sfr!4v1718458531594!5m2!1sfr!2sfr" 
                    width="100%" 
                    height="450" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps - BIG IMEX location"
                    className="rounded-lg"
                  ></iframe>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-semibold">Nos coordonnées</h3>
              <div className="space-y-6">
                <div 
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={handleOpenGoogleMaps}
                >
                  <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium flex items-center">
                      Adresse <ExternalLink className="h-4 w-4 ml-2 text-gray-400" />
                    </p>
                    <p className="text-gray-600">42 Chemin de l'escadrille</p>
                    <p className="text-gray-600">06210 Mandelieu</p>
                    <p className="text-gray-600">FRANCE</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-gray-600">+(4) 93 90 90 92</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">contact@bigimex.fr</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Link to="/contact">
                  <Button variant="default" size="lg" className="w-full">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Opening Hours Section - Full Width */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <div className="flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-2xl font-semibold">Horaires d'ouverture</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-lg mb-2">Lundi - Vendredi</p>
                <p className="text-gray-600 text-xl">8h00 - 16h00</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-lg mb-2">Samedi</p>
                <p className="text-gray-600 text-xl">Sur rendez-vous</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-lg mb-2">Dimanche</p>
                <p className="text-gray-600 text-xl">Fermé</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
