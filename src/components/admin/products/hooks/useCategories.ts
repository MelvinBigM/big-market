
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/lib/types";
import { toast } from "sonner";

export const useCategories = () => {
  const { data: categories, refetch: refetchCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data: categories, error } = await supabase
        .from("categories")
        .select("*")
        .order("position");

      if (error) throw error;
      return categories as Category[];
    },
  });

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !categories) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      for (let i = 0; i < items.length; i++) {
        const { error } = await supabase
          .from("categories")
          .update({ position: i })
          .eq("id", items[i].id);

        if (error) throw error;
      }
      
      refetchCategories();
      toast.success("Ordre des catégories mis à jour");
    } catch (error: any) {
      toast.error("Erreur lors de la réorganisation des catégories");
    }
  };

  return {
    categories,
    refetchCategories,
    handleDragEnd,
  };
};
