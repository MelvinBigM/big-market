
import { useState, useEffect, useCallback, useMemo } from "react";
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

  const fetchBanners = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)
        .not('image_url', 'is', null)
        .order('position', { ascending: true });

      if (error) throw error;
      
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
      
      console.log("Fetched active image banners:", formattedBanners);
      setBanners(formattedBanners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  useEffect(() => {
    if (banners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 10000);
    
    return () => clearInterval(timer);
  }, [banners.length]);

  const currentBannerData = useMemo(() => {
    return banners[currentBanner];
  }, [banners, currentBanner]);

  if (isLoading) {
    return (
      <section className={`w-full ${isMobile ? 'mt-12' : 'mt-16'}`}>
        <div className={isMobile ? 'mx-0' : 'mx-auto'}>
          <div className={`bg-muted animate-pulse w-full ${isMobile ? 'h-[60px]' : 'h-[150px]'}`}></div>
        </div>
      </section>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <>
      <Toaster />
      <section className={`w-full ${isMobile ? 'mt-12' : 'mt-16'}`}>
        <div className={isMobile ? 'mx-0' : 'mx-auto'}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentBanner} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.5 }} 
              className="relative w-full overflow-hidden"
            >
              {currentBannerData && (
                <img 
                  src={currentBannerData.image_url!} 
                  alt={currentBannerData.title} 
                  className="w-full h-auto object-contain"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default HeroBanner;
