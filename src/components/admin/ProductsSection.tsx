
import { useState } from "react";
import { Product } from "@/lib/types";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ProductDialog from "./ProductDialog";
import ProductHeader from "./products/ProductHeader";
import ProductSearch from "./products/ProductSearch";
import { useProducts } from "./products/hooks/useProducts";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";

const ProductsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { products, refetchProducts, handleDelete, toggleStock, handleDragEnd } = useProducts();

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categories.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Droppable droppableId="products">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2 mt-6"
            >
              {filteredProducts?.map((product, index) => (
                <Draggable
                  key={product.id}
                  draggableId={product.id}
                  index={index}
                >
                  {(provided) => (
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
                              <span className="font-medium">{product.price} €</span> - 
                              <span className="ml-2 text-gray-500">{product.categories.name}</span>
                              {product.description && (
                                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Toggle
                            pressed={product.in_stock}
                            onPressedChange={() => toggleStock(product)}
                            className={`${product.in_stock ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'}`}
                          >
                            <span className={`text-sm ${product.in_stock ? 'text-green-700' : 'text-red-700'}`}>
                              {product.in_stock ? 'En stock' : 'Hors stock'}
                            </span>
                          </Toggle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {filteredProducts?.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Aucun produit trouvé
                </div>
              )}
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
