
import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import ProductDialog from "./ProductDialog";
import ProductHeader from "./products/ProductHeader";
import ProductSearch from "./products/ProductSearch";
import CategorySection from "./products/CategorySection";
import { useProducts } from "./products/hooks/useProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProductsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  const { products, refetchProducts, handleDelete, toggleStock, handleDragEnd } = useProducts();

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

  // Mettre à jour collapsedCategories quand les catégories sont chargées
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

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categories.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <ProductSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        onSuccess={refetchProducts}
      />
    </div>
  );
};

export default ProductsSection;
