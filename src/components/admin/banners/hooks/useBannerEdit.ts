
import { useState } from "react";
import { Banner } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBannerEdit = (refreshBanners: () => Promise<void>) => {
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = (banner?: Banner) => {
    if (banner) {
      setSelectedBanner(banner);
    } else {
      setSelectedBanner({
        id: '',
        title: '',
        description: '',
        image_url: null,
        bgColor: '',
        text_color: '',
        position: 0, // This will be updated with the correct position
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    setIsDialogOpen(true);
  };

  const saveBanner = async () => {
    if (!selectedBanner) return;

    if (!selectedBanner.image_url) {
      toast.error("Une image est obligatoire pour créer une bannière");
      return;
    }

    try {
      const updatedBanner = {
        ...selectedBanner,
        updated_at: new Date().toISOString()
      };

      // Prepare banner object for database
      const bannerToSave = {
        title: updatedBanner.title,
        description: updatedBanner.description,
        image_url: updatedBanner.image_url,
        bgcolor: '', // Empty since we don't use custom colors anymore
        text_color: '', // Empty since we don't use custom colors anymore
        position: updatedBanner.position,
        active: updatedBanner.active,
        updated_at: updatedBanner.updated_at
      };

      if (selectedBanner.id) {
        // Update existing banner
        const { error } = await supabase
          .from('banners')
          .update(bannerToSave)
          .eq('id', selectedBanner.id);

        if (error) throw error;
        toast.success("Bannière mise à jour");
      } else {
        // Create new banner - get current count for position
        const { data: existingBanners } = await supabase
          .from('banners')
          .select('*');
          
        // Set position to last+1 if creating new banner
        const position = (existingBanners?.length || 0) + 1;
        
        // Create new banner
        const { error } = await supabase
          .from('banners')
          .insert({
            ...bannerToSave,
            position,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
        toast.success("Bannière créée");
      }

      await refreshBanners();
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error("Erreur: " + (error.message || "Impossible d'enregistrer la bannière"));
    }
  };

  return {
    selectedBanner,
    setSelectedBanner,
    isDialogOpen,
    setIsDialogOpen,
    saveBanner,
    openDialog
  };
};
