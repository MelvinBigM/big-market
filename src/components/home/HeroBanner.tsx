
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

  useEffect(() => {
    const fetchBanners = async () => {
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
    return (
      <section className="w-full mt-16">
        <div className="mx-auto">
          <div className={`bg-gray-100 animate-pulse w-full ${isMobile ? 'h-[100px]' : 'h-[250px]'}`}></div>
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
      <section className="w-full mt-16">
        <div className="mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentBanner} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.5 }} 
              className={`relative w-full overflow-hidden ${isMobile ? 'h-[100px]' : 'h-[250px]'}`}
            >
              <img 
                src={banners[currentBanner].image_url!} 
                alt={banners[currentBanner].title} 
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default HeroBanner;
