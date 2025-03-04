
import React, { useState } from "react";
import { Banner } from "@/lib/types";
import { Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface BannerFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedBanner: Banner | null;
  setSelectedBanner: (banner: Banner | null) => void;
  onSave: () => Promise<void>;
}

const BannerForm: React.FC<BannerFormProps> = ({
  isOpen,
  setIsOpen,
  selectedBanner,
  setSelectedBanner,
  onSave,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Le fichier doit être une image");
        return;
      }

      // Max size: 2MB
      if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 2MB");
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

      if (selectedBanner) {
        setSelectedBanner({
          ...selectedBanner,
          image_url: data.publicUrl
        });
      }

      toast.success("Image téléchargée avec succès");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedBanner || !selectedBanner.title) {
      toast.error("Le titre est obligatoire");
      return;
    }

    setIsSaving(true);
    
    try {
      await onSave();
      setIsOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to update banner properties
  const updateBanner = (updates: Partial<Banner>) => {
    if (selectedBanner) {
      setSelectedBanner({
        ...selectedBanner,
        ...updates
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{selectedBanner?.id ? 'Modifier' : 'Ajouter'} une bannière</DialogTitle>
          <DialogDescription>
            Personnalisez votre bannière qui sera affichée sur la page d'accueil.
            Dimensions recommandées: 1920x500 pixels.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={selectedBanner?.title || ''}
              onChange={(e) => updateBanner({ title: e.target.value })}
              placeholder="Titre de la bannière"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={selectedBanner?.description || ''}
              onChange={(e) => updateBanner({ description: e.target.value })}
              placeholder="Description de la bannière"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              type="number"
              min="1"
              value={selectedBanner?.position || 1}
              onChange={(e) => updateBanner({ position: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Image de fond</Label>
            <div className="mt-1 flex items-center">
              <div className="h-36 w-full bg-gray-200 rounded overflow-hidden">
                {selectedBanner?.image_url ? (
                  <img
                    src={selectedBanner.image_url}
                    alt="Aperçu"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className={`h-full w-full flex justify-center items-center ${selectedBanner?.bgColor}`}>
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <Label htmlFor="image" className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Image className="h-4 w-4 mr-2" />
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
            </div>
          </div>

          {!selectedBanner?.image_url && (
            <div className="space-y-2">
              <Label htmlFor="bgColor">Couleur de fond (si pas d'image)</Label>
              <select
                id="bgColor"
                value={selectedBanner?.bgColor || ''}
                onChange={(e) => updateBanner({ bgColor: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-4 py-2"
              >
                <option value="bg-gradient-to-r from-blue-50 to-indigo-50">Bleu</option>
                <option value="bg-gradient-to-r from-amber-50 to-yellow-50">Jaune</option>
                <option value="bg-gradient-to-r from-green-50 to-emerald-50">Vert</option>
                <option value="bg-gradient-to-r from-red-50 to-rose-50">Rouge</option>
                <option value="bg-gradient-to-r from-purple-50 to-pink-50">Violet</option>
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="text_color">Couleur du texte</Label>
            <Select
              value={selectedBanner?.text_color || 'text-white'}
              onValueChange={(value) => updateBanner({ text_color: value })}
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

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BannerForm;
