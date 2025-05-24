
import { supabase } from "@/integrations/supabase/client";
import { Banner } from "@/lib/types";
import { toast } from "sonner";

export const useBannersReorder = (refreshBanners: () => Promise<void>) => {
  const reorderBanners = async (result: any, banners: Banner[]) => {
    if (!result.destination) return;

    const items = Array.from(banners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mettre à jour les positions dans la base de données
    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        bgcolor: item.bgColor,
        text_color: item.text_color,
        position: index,
        active: item.active,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('banners')
        .upsert(updates);

      if (error) throw error;
      
      await refreshBanners();
      toast.success("Ordre des bannières mis à jour");
    } catch (error: any) {
      console.error("Erreur lors de la réorganisation des bannières:", error);
      toast.error("Erreur lors de la réorganisation des bannières");
    }
  };

  return {
    reorderBanners
  };
};
