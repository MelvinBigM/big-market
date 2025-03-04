
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Banner } from "@/lib/types";
import { banners as defaultBanners } from "@/data/bannerData";

const BANNER_HEIGHT = "250px"; // Reduced height from 350px to 250px

const HeroBanner = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState<Banner[]>(defaultBanners as Banner[]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Use any to work around type issues temporarily
        const { data, error } = await (supabase as any)
          .from('banners')
          .select('*')
          .order('position', { ascending: true });

        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log("Fetched banners:", data); // Debug log
          setBanners(data as Banner[]);
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

  // Make sure we're using the correct field name (bgcolor from database vs bgColor in our code)
  const getBannerBackground = (banner: Banner) => {
    return banner.bgColor || (banner as any).bgcolor || 'bg-gradient-to-r from-blue-50 to-indigo-50';
  };

  // Get the text color from the banner or use a default
  const getTextColor = (banner: Banner) => {
    return banner.text_color || (banner as any).text_color || 'text-white';
  };

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
              <div className={`absolute inset-0 w-full h-full ${getBannerBackground(banners[currentBanner])}`} />
            )}
            
            {/* Content overlay with text directly on banner (no white box) */}
            <div className="relative z-10 flex flex-col justify-center items-center h-full text-center p-12">
              <motion.h1 
                className={`text-4xl sm:text-5xl font-bold ${getTextColor(banners[currentBanner])} mb-6 text-shadow-lg`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {banners[currentBanner].title}
              </motion.h1>
              {banners[currentBanner].description && (
                <motion.p 
                  className={`text-xl ${getTextColor(banners[currentBanner])} max-w-2xl mx-auto text-shadow`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {banners[currentBanner].description}
                </motion.p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroBanner;
