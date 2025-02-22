
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { DraggableProvided } from "@hello-pangea/dnd";

interface ProductListItemProps {
  product: Product & { categories: { id: string; name: string } };
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStock: (product: Product) => void;
  provided: DraggableProvided;
}

const ProductListItem = ({ product, onEdit, onDelete, onToggleStock, provided }: ProductListItemProps) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="flex items-center border rounded-lg bg-white overflow-hidden hover:bg-gray-50 transition-colors"
    >
      <div
        {...provided.dragHandleProps}
        className="px-4 cursor-move text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      
      <div className="flex-1 flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-12 h-12 object-cover rounded"
            />
          )}
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{product.price} €</span>
              {product.description && (
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Toggle
            pressed={product.in_stock}
            onPressedChange={() => onToggleStock(product)}
            className={product.in_stock ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'}
          >
            <span className={`text-sm ${product.in_stock ? 'text-green-700' : 'text-red-700'}`}>
              {product.in_stock ? 'En stock' : 'Hors stock'}
            </span>
          </Toggle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(product)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
