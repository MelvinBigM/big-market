
import { useState, useEffect } from "react";
import { Banner } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBannersFetch = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('banners')
        .select('*')
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
      
      setBanners(formattedBanners);
    } catch (error) {
      console.error("Erreur lors du chargement des bannières:", error);
      toast.error("Impossible de charger les bannières");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    banners,
    isLoading,
    fetchBanners
  };
};
