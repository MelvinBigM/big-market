
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Banner } from "@/lib/types";
import { banners as defaultBanners } from "@/data/bannerData";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroBanner = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState<Banner[]>(defaultBanners as Banner[]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Responsive height for different screen sizes
  const bannerHeight = isMobile ? "200px" : "250px";

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Use any to work around type issues temporarily
        const {
          data,
          error
        } = await (supabase as any).from('banners').select('*').order('position', {
          ascending: true
        });
        if (error) throw error;
        if (data && data.length > 0) {
          console.log("Fetched banners:", data);
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
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (isLoading) {
    return <section className="w-full -mt-4 -mb-4">
        <div className="mx-auto">
          <div className="bg-gray-100 animate-pulse w-full" style={{
          height: bannerHeight
        }}></div>
        </div>
      </section>;
  }

  if (banners.length === 0) {
    return null;
  }

  // Make sure we're using the correct field name (bgcolor from database vs bgColor in our code)
  const getBannerBackground = (banner: Banner) => {
    // Si la bannière a déjà une couleur définie, on la garde
    const storedColor = banner.bgColor || (banner as any).bgcolor;
    if (storedColor) return storedColor;

    // Sinon on utilise une couleur de notre palette uniformisée
    return 'bg-gradient-to-r from-blue-50 to-indigo-100';
  };

  // Get the text color from the banner or use a default
  const getTextColor = (banner: Banner) => {
    return banner.text_color || (banner as any).text_color || 'text-gray-800';
  };

  return <section className="w-full -mt-4 -mb-4">
      <div className="mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={currentBanner} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} transition={{
          duration: 0.5
        }} className="relative w-full" style={{
          height: bannerHeight
        }}>
            {/* Background: Either Image or Gradient */}
            {banners[currentBanner].image_url ? <div className="absolute inset-0 w-full h-full bg-center" style={{
            backgroundImage: `url(${banners[currentBanner].image_url})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }} /> : <div className={`absolute inset-0 w-full h-full ${getBannerBackground(banners[currentBanner])}`} />}
            
            {/* Content overlay with text */}
            <div className="">
              <motion.h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${getTextColor(banners[currentBanner])} mb-1 sm:mb-2 md:mb-4 text-shadow-lg`} initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.2
            }}>
                {banners[currentBanner].title}
              </motion.h1>
              {banners[currentBanner].description && <motion.p className={`text-xs sm:text-sm md:text-base lg:text-lg ${getTextColor(banners[currentBanner])} max-w-2xl mx-auto text-shadow`} initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.4
            }}>
                  {banners[currentBanner].description}
                </motion.p>}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>;
};

export default HeroBanner;
