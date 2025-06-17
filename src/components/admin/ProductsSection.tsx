
import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import ProductDialog from "./ProductDialog";
import ProductHeader from "./products/ProductHeader";
import AdvancedProductSearch, { SearchFilters } from "@/components/search/AdvancedProductSearch";
import CategorySection from "./products/CategorySection";
import { useProducts } from "./products/hooks/useProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProductSearch } from "@/hooks/useProductSearch";

const ProductsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  const { products, handleDelete, toggleStock, handleDragEnd } = useProducts();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { filteredProducts } = useProductSearch({
    products,
    searchQuery,
    filters: searchFilters
  });

  useEffect(() => {
    if (categories) {
      setCollapsedCategories(categories.map(cat => cat.id));
    }
  }, [categories]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const productsByCategory = categories?.map(category => ({
    ...category,
    products: filteredProducts?.filter(product => product.category_id === category.id) || []
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <ProductHeader 
        onAddProduct={() => {
          setSelectedProduct(undefined);
          setDialogOpen(true);
        }} 
      />

      <AdvancedProductSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        onFiltersChange={setSearchFilters}
      />

      <div className="space-y-4 mt-6">
        {productsByCategory?.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            isCollapsed={collapsedCategories.includes(category.id)}
            onToggleCollapse={toggleCategory}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStock={toggleStock}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      {filteredProducts?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {searchQuery || Object.keys(searchFilters).length > 0 
              ? "Aucun produit ne correspond à vos critères de recherche." 
              : "Aucun produit disponible."}
          </p>
        </div>
      )}

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default ProductsSection;
