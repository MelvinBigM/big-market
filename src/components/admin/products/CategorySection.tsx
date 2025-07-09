
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ProductListItem from "./ProductListItem";

interface CategorySectionProps {
  category: {
    id: string;
    name: string;
    products: (Product & { categories: { id: string; name: string } })[];
  };
  isCollapsed: boolean;
  onToggleCollapse: (categoryId: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStock: (product: Product) => void;
  onDragEnd: (result: any, categoryId: string) => void;
}

const CategorySection = ({
  category,
  isCollapsed,
  onToggleCollapse,
  onEdit,
  onDelete,
  onToggleStock,
  onDragEnd,
}: CategorySectionProps) => {
  return (
    <div className="border rounded-lg">
      <div className="p-4 bg-gray-50 border-b">
        <Button
          variant="ghost"
          className="w-full justify-between text-left"
          onClick={() => onToggleCollapse(category.id)}
        >
          <span className="font-semibold">
            {category.name} ({category.products.length} produits)
          </span>
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-4">
          {category.products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucun produit dans cette catégorie
            </p>
          ) : (
            <DragDropContext 
              onDragEnd={(result) => {
                console.log("CategorySection - Drag end result:", result);
                onDragEnd(result, category.id);
              }}
            >
              <Droppable droppableId={`category-${category.id}`}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {category.products.map((product, index) => (
                      <Draggable
                        key={product.id}
                        draggableId={product.id}
                        index={index}
                      >
                        {(provided) => (
                          <ProductListItem
                            product={product}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleStock={onToggleStock}
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
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
