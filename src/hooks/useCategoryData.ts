
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category, Product } from "@/lib/types";
import { useOptimizedQuery } from "@/hooks/useOptimizedQuery";

export const useCategoryData = (categoryId?: string) => {
  const { data: category, isLoading: categoryLoading, error: categoryError } = useOptimizedQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .maybeSingle();

      if (error) throw error;
      return data as Category | null;
    },
    enabled: !!categoryId,
  });

  const { data: products, isLoading: productsLoading, error: productsError } = useOptimizedQuery({
    queryKey: ["products", "category", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryId)
        .order("position", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!categoryId,
  });

  return {
    category,
    products: products || [],
    isLoading: categoryLoading || productsLoading,
    error: categoryError || productsError,
  };
};
