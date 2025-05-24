
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

interface BackgroundRemoverProps {
  onImageProcessed: (imageUrl: string) => void;
}

const BackgroundRemover = ({ onImageProcessed }: BackgroundRemoverProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImageIfNeeded = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {
    let width = image.naturalWidth;
    let height = image.naturalHeight;

    if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
      if (width > height) {
        height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
        width = MAX_IMAGE_DIMENSION;
      } else {
        width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
        height = MAX_IMAGE_DIMENSION;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
      return true;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0);
    return false;
  };

  const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
    try {
      console.log('Starting background removal process...');
      const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
        device: 'webgpu',
      });
      
      // Convert HTMLImageElement to canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Resize image if needed and draw it to canvas
      const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
      console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
      
      // Get image data as base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Image converted to base64');
      
      // Process the image with the segmentation model
      console.log('Processing with segmentation model...');
      const result = await segmenter(imageData);
      
      console.log('Segmentation result:', result);
      
      if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
        throw new Error('Invalid segmentation result');
      }
      
      // Create a new canvas for the masked image
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = canvas.width;
      outputCanvas.height = canvas.height;
      const outputCtx = outputCanvas.getContext('2d');
      
      if (!outputCtx) throw new Error('Could not get output canvas context');
      
      // Draw original image
      outputCtx.drawImage(canvas, 0, 0);
      
      // Apply the mask
      const outputImageData = outputCtx.getImageData(
        0, 0,
        outputCanvas.width,
        outputCanvas.height
      );
      const data = outputImageData.data;
      
      // Apply inverted mask to alpha channel
      for (let i = 0; i < result[0].mask.data.length; i++) {
        // Invert the mask value (1 - value) to keep the subject instead of the background
        const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
        data[i * 4 + 3] = alpha;
      }
      
      outputCtx.putImageData(outputImageData, 0, 0);
      console.log('Mask applied successfully');
      
      // Convert canvas to blob
      return new Promise((resolve, reject) => {
        outputCanvas.toBlob(
          (blob) => {
            if (blob) {
              console.log('Successfully created final blob');
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/png',
          1.0
        );
      });
    } catch (error) {
      console.error('Error removing background:', error);
      throw error;
    }
  };

  const loadImage = (file: Blob): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Display original image
      const originalUrl = URL.createObjectURL(file);
      setOriginalImage(originalUrl);
      
      // Load and process the image
      const imageElement = await loadImage(file);
      const processedBlob = await removeBackground(imageElement);
      
      // Create URL for processed image
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImage(processedUrl);
      
      toast.success('Arrière-plan supprimé avec succès !');
    } catch (error: any) {
      console.error('Error processing image:', error);
      toast.error('Erreur lors du traitement de l\'image: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseProcessedImage = () => {
    if (processedImage) {
      onImageProcessed(processedImage);
      toast.success('Image traitée ajoutée !');
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="text-center">
        <Label className="text-sm font-medium">Suppression d'arrière-plan avec IA</Label>
        <p className="text-xs text-gray-500 mt-1">
          Uploadez une image pour supprimer automatiquement l'arrière-plan
        </p>
      </div>

      {/* File Input */}
      <div>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isProcessing}
          className="cursor-pointer"
        />
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Traitement de l'image...</span>
        </div>
      )}

      {/* Image Preview */}
      {(originalImage || processedImage) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {originalImage && (
            <div className="space-y-2">
              <Label className="text-xs">Image originale</Label>
              <div className="aspect-square overflow-hidden rounded border">
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          {processedImage && (
            <div className="space-y-2">
              <Label className="text-xs">Arrière-plan supprimé</Label>
              <div className="aspect-square overflow-hidden rounded border bg-white">
                <img 
                  src={processedImage} 
                  alt="Processed" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {processedImage && (
        <div className="flex gap-2">
          <Button
            onClick={handleUseProcessedImage}
            size="sm"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Utiliser cette image
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
          >
            Recommencer
          </Button>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;
