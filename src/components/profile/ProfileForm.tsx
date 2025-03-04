
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  formData: {
    full_name: string;
    is_company: boolean;
    phone_number: string;
    address: string;
    city: string;
    postal_code: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (checked: boolean) => void;
  handleSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ProfileForm = ({ 
  formData, 
  handleInputChange, 
  handleCheckboxChange, 
  handleSubmit,
  onCancel,
  isSubmitting = false
}: ProfileFormProps) => {
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_company" 
              checked={formData.is_company} 
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="is_company">Entreprise</Label>
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="full_name">
            {formData.is_company ? "Nom de l'entreprise" : "Nom complet"}
          </Label>
          <Input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">Téléphone</Label>
          <Input
            id="phone_number"
            name="phone_number"
            value={formData.phone_number || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Adresse</h3>
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              name="city"
              value={formData.city || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code">Code postal</Label>
            <Input
              id="postal_code"
              name="postal_code"
              value={formData.postal_code || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Enregistrement...
            </>
          ) : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
