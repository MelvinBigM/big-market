
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBannerToggle = (refreshBanners: () => Promise<void>) => {
  const toggleBannerActive = async (bannerId: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ 
          active,
          updated_at: new Date().toISOString()
        })
        .eq('id', bannerId);

      if (error) throw error;
      
      toast.success(active ? "Bannière activée" : "Bannière désactivée");
      await refreshBanners();
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur: " + (error.message || "Impossible de mettre à jour la bannière"));
    }
  };

  return {
    toggleBannerActive
  };
};
