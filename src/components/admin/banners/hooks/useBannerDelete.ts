
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBannerDelete = (refreshBanners: () => Promise<void>) => {
  const deleteBanner = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette bannière ?")) return;

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Bannière supprimée");
      await refreshBanners();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Impossible de supprimer la bannière");
    }
  };

  return { deleteBanner };
};
