
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Search, GripVertical } from "lucide-react";
import ProductDialog from "./ProductDialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ProductsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  const { data: categories, refetch: refetchCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data: categories, error } = await supabase
        .from("categories")
        .select("*")
        .order("position");

      if (error) throw error;
      return categories as Category[];
    },
  });

  const { data: products, refetch: refetchProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .order("name");

      if (productsError) throw productsError;

      return products as (Product & { categories: { id: string; name: string } })[];
    },
  });

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !categories) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mise à jour des positions un par un pour éviter l'erreur TypeScript
    try {
      for (let i = 0; i < items.length; i++) {
        const { error } = await supabase
          .from("categories")
          .update({ position: i })
          .eq("id", items[i].id);

        if (error) throw error;
      }
      
      refetchCategories();
      toast.success("Ordre des catégories mis à jour");
    } catch (error: any) {
      toast.error("Erreur lors de la réorganisation des catégories");
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
      try {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", product.id);

        if (error) throw error;
        
        toast.success("Produit supprimé avec succès");
        refetchProducts();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const toggleStock = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ in_stock: !product.in_stock })
        .eq("id", product.id);

      if (error) throw error;
      
      toast.success(`Produit marqué comme ${!product.in_stock ? 'en stock' : 'hors stock'}`);
      refetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    }
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Produits</h2>
        <Button onClick={() => {
          setSelectedProduct(undefined);
          setDialogOpen(true);
        }}>
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

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
                          onClick={() => toggleCategory(category.id)}
                          className="flex-1 flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
                        >
                          <h3 className="font-medium text-gray-900">{category.name}</h3>
                          {collapsedCategories.includes(category.id) ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>

                      {!collapsedCategories.includes(category.id) && (
                        <div className="divide-y">
                          {category.products.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between p-4"
                            >
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
                          ))}
                          {category.products.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                              Aucun produit dans cette catégorie
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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
