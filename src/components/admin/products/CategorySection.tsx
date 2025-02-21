
import { Category, Product } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import ProductListItem from "./ProductListItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface CategorySectionProps {
  category: Category & { products: (Product & { categories: { id: string; name: string } })[] };
  isCollapsed: boolean;
  onToggleCollapse: (categoryId: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStock: (product: Product) => void;
  onDragEnd: (result: any) => void;
}

const CategorySection = ({
  category,
  isCollapsed,
  onToggleCollapse,
  onEdit,
  onDelete,
  onToggleStock,
  onDragEnd
}: CategorySectionProps) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => onToggleCollapse(category.id)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-medium text-gray-900">{category.name}</h3>
        {isCollapsed ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {!isCollapsed && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={`category-${category.id}`}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2 p-4"
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
                {category.products.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    Aucun produit dans cette catégorie
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default CategorySection;
