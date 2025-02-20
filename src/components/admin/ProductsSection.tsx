
import { useState } from "react";
import { Product } from "@/lib/types";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ProductDialog from "./ProductDialog";
import ProductHeader from "./products/ProductHeader";
import ProductSearch from "./products/ProductSearch";
import CategorySection from "./products/CategorySection";
import { useProducts } from "./products/hooks/useProducts";
import { useCategories } from "./products/hooks/useCategories";

const ProductsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  const { products, refetchProducts, handleDelete, toggleStock } = useProducts();
  const { categories, handleDragEnd } = useCategories();

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

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-6"
            >
              {productsByCategory?.map((category, index) => (
                <Draggable
                  key={category.id}
                  draggableId={category.id}
                  index={index}
                >
                  {(provided) => (
                    <CategorySection
                      category={category}
                      isCollapsed={collapsedCategories.includes(category.id)}
                      onToggleCollapse={toggleCategory}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleStock={toggleStock}
                      provided={provided}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
