
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import { toast } from "sonner";
import { defaultQueryConfig } from "@/hooks/useOptimizedQuery";

export const useProducts = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
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
    ...defaultQueryConfig,
  });

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !products) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update optimistically
    queryClient.setQueryData(["products"], items);

    try {
      // Mise à jour des positions en batch pour optimiser les performances
      const updates = items.map((item, index) => ({
        id: item.id,
        position: index
      }));

      // Utiliser une transaction pour les mises à jour multiples
      for (const update of updates) {
        const { error } = await supabase
          .from("products")
          .update({ position: update.position })
          .eq("id", update.id);

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
        // Optimistic update
        const previousProducts = queryClient.getQueryData(["products"]);
        queryClient.setQueryData(["products"], (old: any) => 
          old?.filter((p: Product) => p.id !== product.id)
        );

        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", product.id);

        if (error) {
          // Revert on error
          queryClient.setQueryData(["products"], previousProducts);
          throw error;
        }
        
        toast.success("Produit supprimé avec succès");
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const toggleStock = async (product: Product) => {
    try {
      // Optimistic update
      const previousProducts = queryClient.getQueryData(["products"]);
      queryClient.setQueryData(["products"], (old: any) => 
        old?.map((p: Product) => 
          p.id === product.id ? { ...p, in_stock: !p.in_stock } : p
        )
      );

      const { error } = await supabase
        .from("products")
        .update({ in_stock: !product.in_stock })
        .eq("id", product.id);

      if (error) {
        // Revert on error
        queryClient.setQueryData(["products"], previousProducts);
        throw error;
      }
      
      toast.success(`Produit marqué comme ${!product.in_stock ? 'en stock' : 'en rupture'}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    products,
    isLoading,
    error,
    handleDragEnd,
    handleDelete,
    toggleStock,
  };
};
