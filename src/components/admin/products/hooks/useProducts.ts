
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import { toast } from "sonner";

export const useProducts = () => {
  const queryClient = useQueryClient();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .order("position", { ascending: true })
        .order("name", { ascending: true });

      if (productsError) throw productsError;

      return products as (Product & { categories: { id: string; name: string } })[];
    },
  });

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !products) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update optimistically
    queryClient.setQueryData(["products"], items);

    try {
      // Mise à jour des positions un par un
      for (let i = 0; i < items.length; i++) {
        const { error } = await supabase
          .from("products")
          .update({ position: i })
          .eq("id", items[i].id);

        if (error) throw error;
      }
      
      toast.success("Ordre des produits mis à jour");
    } catch (error: any) {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.error("Erreur lors de la réorganisation des produits");
    }
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
      try {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", product.id);

        if (error) throw error;
        
        toast.success("Produit supprimé avec succès");
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const toggleStock = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ in_stock: !product.in_stock })
        .eq("id", product.id);

      if (error) throw error;
      
      toast.success(`Produit marqué comme ${!product.in_stock ? 'en stock' : 'en rupture'}`);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    products,
    handleDragEnd,
    handleDelete,
    toggleStock,
  };
};
