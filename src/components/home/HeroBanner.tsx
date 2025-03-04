
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Banner } from "@/lib/types";
import { banners as defaultBanners } from "@/data/bannerData";

const BANNER_HEIGHT = "500px"; // Fixed banner height

const HeroBanner = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState<Banner[]>(defaultBanners as Banner[]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .order('position', { ascending: true });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setBanners(data);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
        // Fall back to default banners if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [banners.length]);

  if (isLoading) {
    return (
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div 
            className="bg-gray-100 animate-pulse rounded-xl"
            style={{ height: BANNER_HEIGHT }}
          ></div>
        </div>
      </section>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentBanner}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-xl shadow-md border border-gray-100 overflow-hidden"
            style={{ height: BANNER_HEIGHT }}
          >
            {/* Background: Either Image or Gradient */}
            {banners[currentBanner].image_url ? (
              <div 
                className="absolute inset-0 w-full h-full bg-center bg-cover" 
                style={{ 
                  backgroundImage: `url(${banners[currentBanner].image_url})`,
                  backgroundSize: 'cover'
                }}
              />
            ) : (
              <div className={`absolute inset-0 w-full h-full ${banners[currentBanner].bgColor}`} />
            )}
            
            {/* Content overlay with semi-transparent background for better text visibility */}
            <div className="relative z-10 flex flex-col justify-center items-center h-full text-center p-12">
              <div className="bg-white bg-opacity-80 p-8 rounded-lg max-w-3xl">
                <motion.h1 
                  className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {banners[currentBanner].title}
                </motion.h1>
                {banners[currentBanner].description && (
                  <motion.p 
                    className="text-xl text-gray-700 max-w-2xl mx-auto mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {banners[currentBanner].description}
                  </motion.p>
                )}
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
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroBanner;
