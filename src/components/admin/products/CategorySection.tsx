
import { Category, Product } from "@/lib/types";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import ProductListItem from "./ProductListItem";
import { DraggableProvided } from "@hello-pangea/dnd";

interface CategorySectionProps {
  category: Category & { products: (Product & { categories: { id: string; name: string } })[] };
  isCollapsed: boolean;
  onToggleCollapse: (categoryId: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStock: (product: Product) => void;
  provided: DraggableProvided;
}

const CategorySection = ({
  category,
  isCollapsed,
  onToggleCollapse,
  onEdit,
  onDelete,
  onToggleStock,
  provided
}: CategorySectionProps) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="border rounded-lg overflow-hidden"
    >
      <div className="flex items-center bg-gray-50">
        <div
          {...provided.dragHandleProps}
          className="px-4 cursor-move text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        <button
          onClick={() => onToggleCollapse(category.id)}
          className="flex-1 flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
        >
          <h3 className="font-medium text-gray-900">{category.name}</h3>
          {isCollapsed ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="divide-y">
          {category.products.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStock={onToggleStock}
            />
          ))}
          {category.products.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              Aucun produit dans cette catégorie
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
