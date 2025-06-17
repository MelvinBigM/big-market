
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import { defaultQueryConfig } from "@/hooks/useOptimizedQuery";

export const useCategoryData = (categoryId: string | undefined) => {
  const categoryQuery = useQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .single();
      if (error) throw error;
      return data;
    },
    ...defaultQueryConfig,
  });

  const productsQuery = useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryId)
        .order("position", { ascending: true })
        .order("name");
      if (error) throw error;
      return data as Product[];
    },
    ...defaultQueryConfig,
    enabled: !!categoryId,
  });

  return {
    category: categoryQuery.data,
    products: productsQuery.data,
    isLoading: categoryQuery.isLoading || productsQuery.isLoading,
    error: categoryQuery.error || productsQuery.error,
  };
};
