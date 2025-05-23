
import React, { useState } from "react";
import { LucideImage, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateImageFile, REQUIRED_WIDTH, REQUIRED_HEIGHT } from "../utils/imageValidation";

interface BannerImageUploaderProps {
  imageUrl: string | null;
  onImageUploaded: (url: string) => void;
}

const BannerImageUploader: React.FC<BannerImageUploaderProps> = ({
  imageUrl,
  onImageUploaded,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setImageError(null);
    
    try {
      // Validate file
      const validFile = await validateImageFile(file, setImageError);
      if (!validFile) {
        setIsUploading(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `banner_${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      onImageUploaded(data.publicUrl);
      toast.success("Image téléchargée avec succès");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Image de fond (obligatoire)</Label>
      <div className="mt-1 flex items-center">
        <div className="h-36 w-full bg-gray-200 rounded overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Aperçu"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex justify-center items-center bg-gray-100">
              <LucideImage className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>
      
      {imageError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{imageError}</AlertDescription>
        </Alert>
      )}
      
      <div className="mt-2">
        <Label htmlFor="image" className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
          <LucideImage className="h-4 w-4 mr-2" />
          {isUploading ? 'Téléchargement...' : 'Choisir une image'}
        </Label>
        <Input
          id="image"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <p className="text-xs text-gray-500 mt-1">
          L'image doit être exactement de {REQUIRED_WIDTH}x{REQUIRED_HEIGHT} pixels
        </p>
      </div>
    </div>
  );
};

export default BannerImageUploader;
