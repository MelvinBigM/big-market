
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import { toast } from "sonner";

export const useProducts = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
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

  const handleDragEnd = async (result: any, categoryId: string) => {
    if (!result.destination || !products) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Ne rien faire si l'élément n'a pas bougé
    if (sourceIndex === destinationIndex) return;

    console.log("Drag end - source:", sourceIndex, "destination:", destinationIndex, "category:", categoryId);

    // Filtrer les produits de cette catégorie uniquement
    const categoryProducts = products.filter(product => product.category_id === categoryId);
    const otherProducts = products.filter(product => product.category_id !== categoryId);

    // Réorganiser les produits de cette catégorie
    const reorderedCategoryProducts = Array.from(categoryProducts);
    const [reorderedItem] = reorderedCategoryProducts.splice(sourceIndex, 1);
    reorderedCategoryProducts.splice(destinationIndex, 0, reorderedItem);

    // Recombiner tous les produits
    const allProducts = [...otherProducts, ...reorderedCategoryProducts];

    // Mise à jour optimiste
    queryClient.setQueryData(["products"], allProducts);

    try {
      // Mise à jour des positions uniquement pour les produits de cette catégorie
      const updatePromises = reorderedCategoryProducts.map((product, index) => {
        return supabase
          .from("products")
          .update({ position: index })
          .eq("id", product.id);
      });

      const results = await Promise.all(updatePromises);
      
      // Vérifier s'il y a eu des erreurs
      const hasError = results.some(result => result.error);
      
      if (hasError) {
        throw new Error("Erreur lors de la mise à jour des positions");
      }
      
      console.log("Positions mises à jour avec succès");
      toast.success("Ordre des produits mis à jour");
      
      // Invalider et refetch pour s'assurer que les données sont cohérentes
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      
    } catch (error: any) {
      console.error("Erreur lors de la réorganisation:", error);
      // Revert optimistic update on error
      await queryClient.invalidateQueries({ queryKey: ["products"] });
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
    isLoading,
    handleDragEnd,
    handleDelete,
    toggleStock,
  };
};
