
import React from "react";
import { Banner } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

      <div className="space-y-2">
        <Label htmlFor="text_color">Couleur du texte</Label>
        <Select
          value={banner.text_color || 'text-white'}
          onValueChange={(value) => onUpdateBanner({ text_color: value })}
        >
          <SelectTrigger id="text_color">
            <SelectValue placeholder="Choisir une couleur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text-white">Blanc</SelectItem>
            <SelectItem value="text-black">Noir</SelectItem>
            <SelectItem value="text-blue-600">Bleu</SelectItem>
            <SelectItem value="text-yellow-600">Jaune</SelectItem>
            <SelectItem value="text-green-600">Vert</SelectItem>
            <SelectItem value="text-red-600">Rouge</SelectItem>
            <SelectItem value="text-purple-600">Violet</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BannerFormFields;
