import { useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Upload, X, GripVertical, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ProductImage {
  id: string;
  image_url: string;
  position: number;
}

interface ProductImageManagerV2Props {
  productId?: string;
  onImagesChange?: (images: ProductImage[]) => void;
}

const ProductImageManagerV2 = ({ productId, onImagesChange }: ProductImageManagerV2Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images = [], refetch } = useQuery({
    queryKey: ["product-images", productId],
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

  const handleFileSelect = async (files: FileList) => {
    if (!productId) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord sauvegarder le produit.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} n'est pas une image valide`);
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} est trop volumineux (max 5MB)`);
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${index}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        return {
          product_id: productId,
          image_url: publicUrl,
          position: images.length + index
        };
      });

      const newImages = await Promise.all(uploadPromises);

      const { error: insertError } = await supabase
        .from("product_images")
        .insert(newImages);

      if (insertError) throw insertError;

      await refetch();
      onImagesChange?.(await refetch().then(result => result.data || []));
      
      toast({
        title: "Succès",
        description: `${files.length} image(s) téléchargée(s) avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors du téléchargement",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from("product_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      await refetch();
      onImagesChange?.(await refetch().then(result => result.data || []));
      
      toast({
        title: "Succès",
        description: "Image supprimée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'image",
        variant: "destructive"
      });
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !productId) return;

    const newImages = Array.from(images);
    const [reorderedImage] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, reorderedImage);

    const updatedImages = newImages.map((img, index) => ({
      ...img,
      position: index
    }));

    try {
      const updates = updatedImages.map(img => 
        supabase
          .from("product_images")
          .update({ position: img.position })
          .eq("id", img.id)
      );

      await Promise.all(updates);
      await refetch();
      onImagesChange?.(updatedImages);
    } catch (error) {
      console.error('Erreur lors de la réorganisation:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la réorganisation des images",
        variant: "destructive"
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  if (!productId) {
    return (
      <div className="grid gap-2">
        <Label>Images additionnelles</Label>
        <div className="text-sm text-muted-foreground p-4 border rounded-md bg-muted/50">
          Veuillez d'abord sauvegarder le produit pour pouvoir ajouter des images.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Label>Images additionnelles</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Téléchargement..." : "Ajouter des images"}
        </Button>
      </div>

      {images.length === 0 ? (
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Aucune image additionnelle
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Glissez-déposez des images ici ou cliquez pour sélectionner
          </p>
          <Button type="button" variant="outline" disabled={isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            Ajouter des images
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
              >
                {images.map((image, index) => (
                  <Draggable key={image.id} draggableId={image.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative group rounded-md overflow-hidden border bg-card"
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="absolute top-2 left-2 z-10 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>
                        
                        <img
                          src={image.image_url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(image.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        
                        <div className="p-2">
                          <p className="text-xs text-muted-foreground">
                            Position {index + 1}
                          </p>
                        </div>
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

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <p className="text-xs text-muted-foreground">
        Formats supportés : JPG, PNG, GIF, WebP (max 5MB par image)
      </p>
    </div>
  );
};

export default ProductImageManagerV2;