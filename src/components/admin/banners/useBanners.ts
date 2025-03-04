
import { useState, useEffect } from "react";
import { Banner } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)
        .from('banners')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setBanners(data as Banner[] || []);
    } catch (error) {
      console.error("Erreur lors du chargement des bannières:", error);
      toast.error("Impossible de charger les bannières");
    } finally {
      setIsLoading(false);
    }
  };

  const saveBanner = async () => {
    if (!selectedBanner) return;

    console.log("Saving banner:", selectedBanner);

    try {
      const updatedBanner = {
        ...selectedBanner,
        updated_at: new Date().toISOString()
      };

      // Make sure we're working with a proper banner object
      const bannerToSave = {
        title: updatedBanner.title,
        description: updatedBanner.description,
        image_url: updatedBanner.image_url,
        bgcolor: updatedBanner.bgColor, // Note: column name is bgcolor, not bgColor
        text_color: updatedBanner.text_color,
        position: updatedBanner.position,
        updated_at: updatedBanner.updated_at
      };

      if (selectedBanner.id) {
        // Update existing banner
        const { error, data } = await (supabase as any)
          .from('banners')
          .update(bannerToSave)
          .eq('id', selectedBanner.id)
          .select();

        if (error) throw error;
        console.log("Updated banner:", data);
        toast.success("Bannière mise à jour");
      } else {
        // Create new banner
        const { error, data } = await (supabase as any)
          .from('banners')
          .insert({
            ...bannerToSave,
            created_at: new Date().toISOString()
          })
          .select();

        if (error) throw error;
        console.log("Created banner:", data);
        toast.success("Bannière créée");
      }

      await fetchBanners();
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement:", error);
      throw error;
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette bannière ?")) return;

    try {
      const { error } = await (supabase as any)
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Bannière supprimée");
      await fetchBanners();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Impossible de supprimer la bannière");
    }
  };

  const openDialog = (banner?: Banner) => {
    if (banner) {
      setSelectedBanner(banner);
    } else {
      setSelectedBanner({
        id: '',
        title: '',
        description: '',
        image_url: null,
        bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        text_color: 'text-white',
        position: banners.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    setIsDialogOpen(true);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return {
    banners,
    isLoading,
    selectedBanner,
    setSelectedBanner,
    isDialogOpen,
    setIsDialogOpen,
    fetchBanners,
    saveBanner,
    deleteBanner,
    openDialog
  };
};
