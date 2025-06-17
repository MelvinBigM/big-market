
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import OptimizedImage from "@/components/ui/optimized-image";
import { defaultQueryConfig } from "@/hooks/useOptimizedQuery";

interface ProductImage {
  id: string;
  image_url: string;
  position: number;
}

interface ProductImageCarouselProps {
  productId: string;
  fallbackImageUrl?: string;
  productName: string;
}

const ProductImageCarousel = ({ productId, fallbackImageUrl, productName }: ProductImageCarouselProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product images avec cache optimisé
  const { data: productImages } = useQuery({
    queryKey: ["productImages", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("position");

      if (error) throw error;
      return data as ProductImage[];
    },
    ...defaultQueryConfig,
  });

  // Use product images if available, otherwise fallback to the main image
  const images = productImages && productImages.length > 0 
    ? productImages 
    : (fallbackImageUrl ? [{ id: 'fallback', image_url: fallbackImageUrl, position: 0 }] : []);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center max-w-sm mx-auto">
        <span className="text-gray-400">Pas d'image disponible</span>
      </div>
    );
  }

  // Ensure selectedImageIndex is valid
  const validIndex = selectedImageIndex < images.length ? selectedImageIndex : 0;
  const selectedImage = images[validIndex];

  // Additional safety check
  if (!selectedImage) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center max-w-sm mx-auto">
        <span className="text-gray-400">Pas d'image disponible</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="aspect-square overflow-hidden rounded-lg max-w-sm mx-auto">
        <OptimizedImage
          src={selectedImage.image_url}
          alt={`${productName} - Image ${validIndex + 1}`}
          className="w-full h-full object-contain"
          fallback="https://images.unsplash.com/photo-1618160472975-cfea543a1077?auto=format&fit=crop&q=80&w=800"
        />
      </div>

      {/* Thumbnail Carousel - Only show if more than one image */}
      {images.length > 1 && (
        <div className="flex justify-center">
          <div className="max-w-lg">
            <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                {images.map((image, index) => (
                  <CarouselItem key={image.id} className="basis-auto pl-4">
                    <button
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-16 h-16 overflow-hidden rounded-md border-2 transition-all duration-200 flex-shrink-0 hover:scale-105 ${
                        validIndex === index 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <OptimizedImage
                        src={image.image_url}
                        alt={`${productName} - Miniature ${index + 1}`}
                        className="w-full h-full object-cover"
                        fallback="https://images.unsplash.com/photo-1618160472975-cfea543a1077?auto=format&fit=crop&q=80&w=200"
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
