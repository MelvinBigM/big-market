
import React, { useState } from "react";
import { Banner } from "@/lib/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import BannerFormFields from "./components/BannerFormFields";
import { REQUIRED_WIDTH, REQUIRED_HEIGHT } from "./utils/imageValidation";

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
  const [isSaving, setIsSaving] = useState(false);
  
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
      <DialogContent className="sm:max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {selectedBanner?.id ? 'Modifier' : 'Ajouter'} une bannière
          </DialogTitle>
          <DialogDescription className="text-sm">
            Personnalisez votre bannière qui sera affichée sur la page d'accueil.
            Dimensions requises: exactement {REQUIRED_WIDTH}x{REQUIRED_HEIGHT} pixels.
          </DialogDescription>
        </DialogHeader>

        <BannerFormFields 
          banner={selectedBanner} 
          onUpdateBanner={updateBanner}
        />

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BannerForm;
