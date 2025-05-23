
import React from "react";
import { Banner } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BannerImageUploader from "./BannerImageUploader";

interface BannerFormFieldsProps {
  banner: Banner | null;
  onUpdateBanner: (updates: Partial<Banner>) => void;
}

const BannerFormFields: React.FC<BannerFormFieldsProps> = ({
  banner,
  onUpdateBanner,
}) => {
  if (!banner) return null;
  
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={banner.title || ''}
          onChange={(e) => onUpdateBanner({ title: e.target.value })}
          placeholder="Titre de la bannière"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={banner.description || ''}
          onChange={(e) => onUpdateBanner({ description: e.target.value })}
          placeholder="Description de la bannière"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          type="number"
          min="1"
          value={banner.position || 1}
          onChange={(e) => onUpdateBanner({ position: parseInt(e.target.value) })}
        />
      </div>

      <BannerImageUploader 
        imageUrl={banner.image_url}
        onImageUploaded={(url) => onUpdateBanner({ image_url: url })}
      />
    </div>
  );
};

export default BannerFormFields;
