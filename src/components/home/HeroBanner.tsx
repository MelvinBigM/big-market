
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

  // Fixed height for image banners
  const bannerHeight = "250px";

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('active', true)
          .not('image_url', 'is', null) // Only get banners with images
          .order('position', { ascending: true });

        if (error) throw error;
        
        // Map the database fields to our TypeScript interface
        const formattedBanners = data?.map(banner => ({
          id: banner.id,
          title: banner.title,
          description: banner.description,
          image_url: banner.image_url,
          bgColor: banner.bgcolor,
          text_color: banner.text_color,
          position: banner.position,
          active: banner.active,
          created_at: banner.created_at,
          updated_at: banner.updated_at
        })) || [];
        
        console.log("Fetched active banners with images:", formattedBanners);
        setBanners(formattedBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBanners([]);
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
          height: bannerHeight
        }}></div>
        </div>
      </section>;
  }

  if (banners.length === 0) {
    return null;
  }

  // Get the text color from the banner or use a default
  const getTextColor = (banner: Banner) => {
    return banner.text_color || 'text-white';
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
              className="relative w-full overflow-hidden"
              style={{ height: bannerHeight }}
            >
              {/* Image banner */}
              <div className="absolute inset-0">
                <img 
                  src={banners[currentBanner].image_url!} 
                  alt={banners[currentBanner].title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content overlay with text */}
              <div className="absolute inset-0 flex flex-col justify-center items-center px-4 bg-black bg-opacity-20">
                <motion.h1 
                  className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${getTextColor(banners[currentBanner])} mb-1 sm:mb-2 md:mb-4 text-shadow-lg text-center`} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.2 }}
                >
                  {banners[currentBanner].title}
                </motion.h1>
                {banners[currentBanner].description && (
                  <motion.p 
                    className={`text-xs sm:text-sm md:text-base lg:text-lg ${getTextColor(banners[currentBanner])} max-w-2xl mx-auto text-shadow text-center`} 
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
