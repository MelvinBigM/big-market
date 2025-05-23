
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Banner } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toaster } from "@/components/ui/sonner";

const HeroBanner = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Responsive height for different screen sizes - adjusted to fit content better
  const bannerHeight = isMobile ? "auto" : "auto";

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('active', true)
          .order('position', { ascending: true });

        if (error) throw error;
        
        // Map the database fields to our TypeScript interface
        const formattedBanners = data?.map(banner => ({
          id: banner.id,
          title: banner.title,
          description: banner.description,
          image_url: banner.image_url,
          bgColor: banner.bgcolor, // Map bgcolor to bgColor
          text_color: banner.text_color,
          position: banner.position,
          active: banner.active,
          created_at: banner.created_at,
          updated_at: banner.updated_at
        })) || [];
        
        console.log("Fetched active banners:", formattedBanners);
        setBanners(formattedBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBanners([]); // Ensure we don't fall back to default banners
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
    return <section className="w-full mt-16">
        <div className="mx-auto">
          <div className="bg-gray-100 animate-pulse w-full" style={{
          height: "200px"
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

  return (
    <>
      <Toaster />
      <section className="w-full mt-16">
        <div className="mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentBanner} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ duration: 0.5 }} 
              className="relative w-full flex justify-center items-center"
              style={{ 
                maxHeight: banners[currentBanner].image_url ? "auto" : bannerHeight
              }}
            >
              {/* Background: Either Image or Gradient */}
              {banners[currentBanner].image_url ? (
                <div 
                  className="w-full h-auto flex justify-center" 
                >
                  <img 
                    src={banners[currentBanner].image_url} 
                    alt={banners[currentBanner].title} 
                    className="object-contain max-w-full"
                    style={{ maxHeight: isMobile ? "200px" : "250px" }}
                  />
                </div>
              ) : (
                <div className={`absolute inset-0 w-full h-full ${getBannerBackground(banners[currentBanner])}`} />
              )}
              
              {/* Content overlay with text */}
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <motion.h1 
                  className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${getTextColor(banners[currentBanner])} mb-1 sm:mb-2 md:mb-4 text-shadow-lg`} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.2 }}
                >
                  {banners[currentBanner].title}
                </motion.h1>
                {banners[currentBanner].description && (
                  <motion.p 
                    className={`text-xs sm:text-sm md:text-base lg:text-lg ${getTextColor(banners[currentBanner])} max-w-2xl mx-auto text-shadow`} 
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
    </>
  );
};

export default HeroBanner;
