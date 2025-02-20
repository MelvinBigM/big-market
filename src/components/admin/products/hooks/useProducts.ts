
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import { toast } from "sonner";

export const useProducts = () => {
  const { data: products, refetch: refetchProducts } = useQuery({
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
        .order("name");

      if (productsError) throw productsError;

      return products as (Product & { categories: { id: string; name: string } })[];
    },
  });

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
      try {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", product.id);

        if (error) throw error;
        
        toast.success("Produit supprimé avec succès");
        refetchProducts();
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
      
      toast.success(`Produit marqué comme ${!product.in_stock ? 'en stock' : 'hors stock'}`);
      refetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    products,
    refetchProducts,
    handleDelete,
    toggleStock,
  };
};
