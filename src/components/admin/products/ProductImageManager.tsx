
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface ProductImage {
  id: string;
  image_url: string;
  position: number;
}

interface ProductImageManagerProps {
  productId?: string;
  onImagesChange?: (images: ProductImage[]) => void;
}

const ProductImageManager = ({ productId, onImagesChange }: ProductImageManagerProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  // Fetch existing images for this product
  const { data: productImages = [], refetch } = useQuery({
    queryKey: ["productImages", productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const { data, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("position");

      if (error) throw error;
      return data as ProductImage[];
    },
    enabled: !!productId,
  });

  const addImage = async () => {
    if (!newImageUrl.trim()) return;
    
    if (!productId) {
      toast.error("Veuillez d'abord sauvegarder le produit");
      return;
    }

    setIsAdding(true);
    try {
      const nextPosition = productImages.length;
      
      const { error } = await supabase
        .from("product_images")
        .insert([
          {
            product_id: productId,
            image_url: newImageUrl.trim(),
            position: nextPosition,
          },
        ]);

      if (error) throw error;
      
      setNewImageUrl("");
      refetch();
      toast.success("Image ajoutée avec succès");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const removeImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from("product_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;
      
      refetch();
      toast.success("Image supprimée avec succès");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !productImages) return;

    const items = Array.from(productImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update optimistically
    queryClient.setQueryData(["productImages", productId], items);

    try {
      // Update positions in the database
      for (let i = 0; i < items.length; i++) {
        const { error } = await supabase
          .from("product_images")
          .update({ position: i })
          .eq("id", items[i].id);

        if (error) throw error;
      }
      
      toast.success("Ordre des images mis à jour");
    } catch (error: any) {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["productImages", productId] });
      toast.error("Erreur lors de la réorganisation des images");
    }
  };

  // Function to truncate URL for display
  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-4">
      <Label>Images du produit</Label>
      
      {/* Existing Images */}
      {productImages.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {productImages.map((image, index) => (
                  <Draggable key={image.id} draggableId={image.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center gap-2 p-2 border rounded ${
                          snapshot.isDragging ? 'bg-gray-50 shadow-lg' : ''
                        }`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="flex-shrink-0 cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="w-12 h-12 overflow-hidden rounded border flex-shrink-0">
                          <img 
                            src={image.image_url} 
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-sm text-gray-600 truncate min-w-0" title={image.image_url}>
                          {truncateUrl(image.image_url)}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(image.id)}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Add New Image */}
      <div className="flex gap-2">
        <Input
          placeholder="URL de la nouvelle image"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addImage()}
        />
        <Button
          type="button"
          onClick={addImage}
          disabled={isAdding || !newImageUrl.trim()}
          size="sm"
        >
          {isAdding ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!productId && (
        <p className="text-sm text-gray-500">
          Sauvegardez d'abord le produit pour pouvoir ajouter des images supplémentaires.
        </p>
      )}
    </div>
  );
};

export default ProductImageManager;
